---
title: "V8 中对页面抖动的优化（Jank Busters）—— 第一部分"
date: "2019-01-30"
template: "post"
draft: false
slug: "/posts/jank-busters-part-one/"
category: "V8"
tags:
  - "V8"
  - "GC"
  - "翻译"
description: "了解一个事物的历史，有助于让我们了解事物的本质。"
---

Jank, or in other words visible stutters, can be noticed when Chrome fails to render a frame within 16.66ms (disrupting 60 frames per second motion). As of today most of the V8 garbage collection work is performed on the main rendering thread, c.f. Figure 1, often resulting in jank when too many objects need to be maintained. Eliminating jank has always been a high priority for the V8 team [ 1, 2, 3]. In this blog post we will discuss a few optimizations that were implemented between M41 and M46 which significantly reduce garbage collectione lists and instead detect detached buffers by inserting checks before every load and%ing="0" cellspacing="0">  Figure 1: Garbage collection performed on the main thread. 

![Figure 1: Garbage collection performed on the main thread](./images/gc-main-thread.png)
> Figure 1: Garbage collection performed on the main thread

当 Chrome 无法在 16.66ms 内渲染完一帧（破坏了每一秒渲染60帧）时，就会发生页面抖动（Jank），换句话说就是肉眼可见的断断续续。截止现在（译者注：2015年12月30号）V8 垃圾回收的大部分工作是在渲染线程（主线程）执行的，请参看图一，通常有很多对象需要维护的时候就会发生页面抖动。消除页面抖动一直是 V8 团队的重中之重([1](https://blog.chromium.org/2011/11/game-changer-for-interactive.html),[2](https://www.youtube.com/watch?v=3vPOlGRH6zk),[3](https://v8.dev/blog/free-garbage-collection))。在本文中我们会讨论 M41 到 M46 之间所做的一些优化。这些优化显著的减少了垃圾回收导致的主线程挂起，从而带来了更好的用户体验。

![图一：垃圾回收工作在主线程执行](./images/gc-main-thread.png)
> 图一：垃圾回收工作在主线程执行

A major source of jank during garbage collection is processing various bookkeeping data structures. Many of these data structures enable optimizations that are unrelated to garbage collection. Two examples are the list of all ArrayBuffers, and each ArrayBuffer’s list of views. These lists allow for an efficient implementation of the DetachArrayBuffer operation without imposing any performance hit on access to an ArrayBuffer view. In situations, however, where a web page creates millions of ArrayBuffers, (e.g., WebGL-based games), updating those lists during garbage collection causes significant jank. In M46, we removed these lists and instead detect detached buffers by inserting checks before every load and store to ArrayBuffers. This amortizes the cost of walking the big bookkeeping list during GC by spreading it throughout program execution resulting in less jank. Although the per-access checks can theoretically slow down the throughput of programs that heavily use ArrayBuffers, in practice V8's optimizing compiler can often remove redundant checks and hoist remaining checks out of loops, resulting in a much smoother execution profile with little or no overall performance penalty.

垃圾收集过程中页面抖动的主要原因是处理各种簿记（bookkeeping）数据结构。许多这些数据结构启用了和垃圾回收无关的优化。两个例子是所有 ArrayBuffer 的 列表，和每个 ArrayBuffer 的视图列表。但是在有些不情况下页面会创建数百万个 ArrayBuffer， 比如基于 WebGL 的游戏，在垃圾回收期间更新这些 ArrayBuffer 的列表会导致严重的抖动。在 M46 中，我们删除这些列表，并通过插入检查来检测分离缓冲区（detached buffers），在垃圾回收的时候，这种方式分摊了处理大量簿记（bookkeeping）数据结构列表的成本，在程序执行过程中分散处理可以减少抖动。虽然理论上来说每次访问检查会降低大量使用 ArrayBuffer 的程序的吞吐量，事实上 V8 的优化编译器通常可以删除多余的检查，并将剩余的检查从循环中提升出来，结果是更加平滑的执行 profile， 只有一点点或者没有整体上的性能损失。

Another source of jank is the bookkeeping associated with tracking the lifetimes of objects shared between Chrome and V8. Although the Chrome and V8 memory heaps are distinct, they must be synchronized for certain objects, like DOM nodes, that are implemented in Chrome's C++ code but accessible from JavaScript. V8 creates an opaque data type called a handle that allows Chrome to manipulate a V8 heap object without knowing any of the details of the implementation. The object's lifetime is bound to the handle: as long as Chrome keeps the handle around, V8's garbage collector won't throw away the object. V8 creates an internal data structure called a global reference for each handle it passes back out to Chrome through the V8 API, and these global references are what tell V8’s garbage collector that the object is still alive. For WebGL games, Chrome may create millions of such handles, and V8, in turn, needs to create the corresponding global references to manage their lifecycle. Processing these huge amounts of global references in the main garbage collection pause is observable as jank. Fortunately, objects communicated to WebGL are often just passed along and never actually modified, enabling simple static escape analysis. In essence, for WebGL functions that are known to usually take small arrays as parameters the underlying data is copied on the stack, making a global reference obsolete. The result of such a mixed approach is a reduction of pause time by up to 50% for rendering-heavy WebGL games. The result of such a mixed approach is a reduction of pause time by up to 50% for rendering-heavy WebGL games.

抖动的另一个原因是追踪 Chrome 和 V8 之间的共享对象的生命周期相关联的簿记（bookkeeping）。虽然 Chrome 和 V8 的内存堆是不同的，但是 Chrome 和 V8 必须针对某些内存进行同步，比如 DOM 节点，虽然在 Chrome 的 C++ 代码中实现，但是可以在 JavaScript 中访问。V8 创建了一个名为句柄的不透明数据类型，允许 Chrome 在不知道任何实现细节的情况下操作 V8 的堆对象。对象的生命周期和句柄绑定：只要 Chrome 保留了句柄，V8 的垃圾回收器就不会回收该对象。V8 为每一个通过 V8 的 API 传递回的 Chrome 句柄，创建了一个名为全局引用的内部数据结构，这些全局引用会告诉V8的垃圾回收器这个对象是一个活动对象。对于基于 WebGL 的游戏来说，V8 换创建数百万个此类句柄，而 V8 又需要创建相应的全局引用来管理其生命周期。在主垃圾回收暂停中处理这些数量巨大的全局引用可以看到很明显的抖动。幸运的是，传递给 WebGL 的对象通常只是传递并不会被实际的修改，从而实现简单的静态[逃逸分析](https://en.wikipedia.org/wiki/Escape_analysis)（static escape analysis）。本质上，

Most of V8’s garbage collection is performed on the main rendering thread. Moving garbage collection operations to concurrent threads reduces the waiting time for the garbage collector and further reduces jank. This is an inherently complicated task since the main JavaScript application and the garbage collector may simultaneous observe and modify the same objects. Until now, concurrency was limited to sweeping the old generation of the regular object JS heap. Recently, we also implemented concurrent sweeping of the code and map space of the V8 heap. Additionally, we implemented concurrent unmapping of unused pages to reduce the work that has to be performed on the main thread, c.f. Figure 2.

![Figure 2: Some garbage collection operations performed on the concurrent garbage collection threads.](./images/gc-concurrent-threads.png)
> Figure 2: Some garbage collection operations performed on the concurrent garbage collection threads.

The impact of the discussed optimizations is clearly visible in WebGL-based games, for example Turbolenz’s Oort Online demo. The following video compares Chrome 41 to Chrome 46:

We are currently in the process of making more garbage collection components incremental, concurrent, and parallel, to shrink garbage collection pause times on the main thread even further. Stay tuned as we have some interesting patches in the pipeline.