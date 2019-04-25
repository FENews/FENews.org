---
title: "Flutter 引擎架构"
date: "2019-04-26"
category: "Flutter"
authors: ['hixie']
translators: ["xueqingxiao"]
tags:
  - "Flutter"
  - "Architecture"
  - "翻译"
description: "Flutter 结合了一个 Dart 框架和一个高性能的引擎。"
---

Flutter 结合了一个 [Dart 框架](https://github.com/flutter/flutter)和一个高性能的[引擎](https://github.com/flutter/engine)。

Flutter 引擎是一个用于运行高品质移动应用的可移植运行时。它实现了 Flutter 的核心库，动画和图形，文件和网络的 I/O，支持可访问性（accessibility），插件架构，以及用于开发，编译和运行 Flutter 应用程序的 Dart 运行时和开发工具。

## 架构概览

Flutter 引擎采用的核心技术有：Skia 是一个 2D 的图形渲染库，Dart，一个具有垃圾回收和面向对象语言的虚拟机，并将它们托管在一个壳（shell）中。不同的平台有不同的壳，比如，我们有 [Android](https://github.com/flutter/engine/tree/master/shell/platform/android) 和 [iOS](https://github.com/flutter/engine/tree/master/shell/platform/darwin) 的 壳（shell）。我们同样提供了嵌入式 API，这些 API 可以把 Flutter 的引擎作为一个库嵌入到其他环境（见[《自定义 Flutter 引擎嵌入环境》](https://github.com/flutter/flutter/wiki/Custom-Flutter-Engine-Embedders)）。

壳实现了特定平台的代码，比如：和 IME（屏幕上的键盘）通信，和系统的应用生命周期事件。

Dart 虚拟机实现了基础的 Dart 核心库，另外还有一个叫 `dart:ui` 的库，这个库提供了对 Skia 和壳底层的访问接口。壳可以绕过引擎，通过平台通道（Platform Channels）直接与 Dart 代码直通信。

![flutter_overview](./images/flutter_overview.png)

## 线程

### 概览

Flutter 引擎不会自己创建或者管理自身的线程。相反，嵌入环境（embedder）负责给 Flutter 引擎 创建和管理线程（以及消息循环）。嵌入环境将自己管理的线程作为 task runner 提供给Flutter 引擎。除了嵌入环境管理的线程，Dart 虚拟机也有自己的线程池。不论是 Flutter 引擎还是嵌入环境都无法访问 Dart 虚拟机线程池中的线程。

###  Task Runner 配置

Flutter 引擎需要嵌入环境给4个 task runner 提供引用。Flutter 引擎并不关心这些引用是不是属于同一个 task runner，或者同一个线程是否在为多个 task runner 服务。为了获得最好性能，嵌入环境应该给每一个 task runner 创建一个专用的线程。虽然 Flutter 引擎并不关心线程在为哪一个 task runner 服务，但是 Flutter 引擎确实期望线程配置在 Flutter 引擎的整个生命周期内保持稳定。嵌入环境应该只在一个线程上执行对应 task runner 的任务（直到 Flutter 引擎被销毁）。

主要的 task runner 有：

- Platform Task Runner
- UI Task Runner
- GPU Task Runner
- IO Task Runner

### Platform Task Runner

嵌入环境线程的 task runner, 可以认为是主线程的 task runner。这个通常是 Android 的主线程 或者在 Apple 平台上的 Foundation 引用的线程。

分配给 task runner 对应线程的不论什么优先级的任务，这些任务的分配都是由嵌入环境来决定的。Flutter 引擎没有给这个线程赋予任何特殊的意义。事实上，可以使用基于不同线程的 Platform Task Runner 来启动多个 Flutter 引擎。这就是 Fuchsia 操作系统中 Flutter Content Handler 的工作原理。在每一个 Flutter 应用实例创建的过程中就会对应的创建一个 Flutter 引擎的实例，相应的也会为每一个 Flutter 引擎的实例创建对应的平台线程。

不论以什么方式和 Flutter 引擎交互，都必须在平台的线程上进行。在其他线程上和引擎交互在未优化版本中会跳过断言，并且这在发布版本中是线程不安全的。Flutter 引擎中许多组件都是线程不安全的。一旦 Flutter 引擎设置好并开始运行，只要对 Flutter 引擎的嵌入 API 都是在平台线程上进行访问的，嵌入环境就不需要发布任务到任何 task runner 去配置 Flutter 引擎。

除了作为嵌入环境启动之后与 Flutter 引擎进行交互的线程之外，task runner 还要执行正在等待的平台消息。这是非常方便的，因为访问 Platform 上的大多数 API 只有在 Platform 的主线程上是安全的。插件就不需要把自己的调用重新穿入（rethread）到主线程上。如果插件管理自己的工作线程，那么插件就要负责将响应队列返回给平台线程，然后才能把响应提交给引擎上的 Dart 代码去处理。始终在平台线程上与引擎交互的规则在这里得到保证。

### UI Task Runner

UI task runner 是引擎在根隔离（root isolate ）上执行所有 Dart 代码的地方。根隔离是一种特殊的隔离，具有 Flutter 功能所必须的绑定。 根隔离运行应用的主 Dart 代码。引擎在根隔离上设定绑定以及调度和提交帧。对于 Flutter 必须渲染的每个帧会做以下操作：
  - 根隔离（root isolate）必须告诉引擎需要渲染的每一帧。
  - 引擎会询问平台是不是在下一个 vsync 的时候通知 UI Task runner。
  - 平台会等待下一个 vsync
  - 在 vsync 中, 引擎会唤醒 Dart 代码并[执行以下操作](https://docs.flutter.io/flutter/widgets/WidgetsBinding/drawFrame.html)：
    - 更新动画插值器（interpolators）。
    - 在布局阶段重建应用程序中的 widget。
    - 布局新实例化的 widgets 并立即绘制图层树并提交给引擎，并没有实际的渲染到屏幕上（rasterized）；这里只构造出在渲染阶段所需要渲染的描述。
    - 构造或者更新包含语义信息的的 widgets 节点树，这将会用来更新特定平台的可访问（accessibility）组件。

除了为引擎构建最终要渲染的每一帧之外，根隔离还要执行平台上插件消息的所有响应，定时器（timers），微任务（microtask）和异步 I/O （socket，文件句柄（handles）等）。

由 UI 线程构造的图层树决定了引擎最终在屏幕上渲染什么，图层树是屏幕上所有内容的真实来源。因此在在 UI 线程上做耗时的操作将导致 Flutter 应用的卡顿（几毫秒足以导致错过下一帧！）。耗时操作一般是执行 Dart 代码导致的，因为引擎不会在 UI task runner 上调度任何 native 代码的任务。因此，UI task runner（线程）通常被称为 Dart 线程。嵌入器可以发布任务到这个 task runner 上。这有可能导致 Flutter 应用的卡顿，建议不要执行这样的操作，而是应该给这样的操作分配特定的线程。

如果在 Dart 代码里做耗时操作是不可避免的，建议将这样的代码移动到独立的 Dart isolate 里（比如：使用 compute 方法）。如果 Dart 代码在非根隔离上执行，那么这段代码将会在 Dart VM 管理的线程池里的线程中执行。这不会导致 Flutter 应用内的卡顿。终止根隔离也会导致在该根隔离上创建的所有隔离终止。此外，非根隔离无法调度帧，也没有 Flutter 框架依赖的绑定。因此，在次隔离上无法和 Flutter 框架进行有意义的交互，对于需要大量计算的任务请使用次隔离。

### GPU Task Runner

GPU Task Runner 执行访问设备上 GPU 的 任务。执行在 UI task runner 上的 Dart 代码创建的图层树是客户端的渲染 API 是感知不到的。也就是说，相同的图层树可以使用 OpenGL，Vulkan 或者为 Skia 配置的其它渲染库来渲染帧。GPU task runner 使用图层树构造出相对应的 GPU 指令。GPU task runner 还负责为特定帧设置所有GPU资源。这包括，与平台通信来设置帧缓冲区，管理 surface 生命周期，并确保完全准备特定帧的 texture（GPU 显存中一段连续的空间） 和缓冲区。

根据处理图层树所需的时间以及GPU完成显示帧所需的时间，GPU task runner 上的各种组件可以延迟 UI 线程上的其他帧的调度， 通常，UI和GPU任务运行程序位于不同的线程上。在这种情况下，GPU 线程可能处于向 GPU 提交帧的过程中，而 UI 线程已经在准备下一帧。流水线操作机制确保 UI 线程不会为 GPU 安排太多工作。

由于GPU task runner 的组件可能会在 UI 线程上引起帧调度延迟，因此在 GPU 线程上执行太多工作将导致 Flutter 应用程序的卡顿。通常，用户没有机会在 GPU task runner 上执行自定义任务，因为平台代码和 Dart 代码都无法访问 GPU task runner。但是，嵌入器仍然可以在此线程上安排任务。因此，建议嵌入器为每个引擎实例的 GPU task runner 提供专用线程。

### IO Task Runner

到目前为止，所有提到的 task runner 都对可以执行的操作类型有很强的限制。过长时间阻塞的 platform task runner 可能会触发平台的 watchdog，阻塞 UI 或 GPU task runner 将导致 Flutter 应用程序的卡顿。但是，GPU 线程需要执行一些非常昂贵的操作。这些昂贵的操作是在 IO task runner 上执行的。

IO task runner 的主要功能是从 asset store 读取压缩图像，并确保这些图像已准备好在 GPU task runner 上渲染。为了确保 texture 已准备好进行渲染，首先必须将其作为压缩数据（通常为PNG，JPEG等）从 asset store 读取，解压缩为 GPU 友好格式并传递给 GPU。这些操作很昂贵，如果在 GPU task runner 上执行，将导致卡顿。由于只有 GPU task runner 可以访问 GPU，因此 IO task runner 组件会设置一个特殊的上下文，该上下文与主 GPU task runner 上下文位于同一个共享组中。这在引擎设置的早期就会发生，也是 IO 任务有一个 task runner 的原因。实际上，压缩字节的读取和解压可以在线程池上进行。IO task runner 是比较特殊的，因为只能从特定线程访问上下文才是安全的操作。获取像 ui.Image 这样的资源的唯一方法是通过异步调用；允许框架与 IO task runner 通信，以便它可以异步执行所提到的所有 texture 操作。然后可以立即在帧中使用该图像，而 GPU 线程不必进行昂贵的操作。

用户代码无法通过 Dart 或原生插件访问此线程。甚至嵌入器也可以自由地在这个线程上调度相当昂贵的任务。这不会导致 Flutter 应用程序的卡顿，但可能会延迟未来对图片和其他资源的的及时的处理。即便如此，建议自定义嵌入器为 IO task runner 设置专用线程。

## 当前平台特定线程的配置

就像之前提到的，引擎支持多线程的配置，支持多线程配置的平台有：

### iOS

为每一个引擎实例的 UI，GPU 和 IO task runner 创建专用线程。在同一平台上所有的引擎实例共享平台线程和 task runner。

### Android

为每一个引擎实例的 UI，GPU 和 IO task runner 创建专用线程。在同一平台上所有的引擎实例共享平台线程和 task runner。

### Fuchsia

为每一个引擎实例的 UI，GPU 和 IO task runner 创建专用线程。

### Flutter Tester (用来给 Flutter 做测试的)

进程中单实例引擎的 UI, GPU, IO 和 平台的 task runner 使用相同的主线程。

## 文本渲染
我们的文本渲染过程如下：

- libtxt： 字体选择, bidi, 断行（line breaking）。
- HarfBuzz： 字形（glyph）选择, shaping。
- Skia： (渲染/GPU 后台), 它在Android和Fuchsia上使用FreeType进行字体渲染，在iOS上使用CoreGraphics进行字体渲染。

原文地址：[https://github.com/flutter/flutter/wiki/The-Engine-architecture](https://github.com/flutter/flutter/wiki/The-Engine-architecture)