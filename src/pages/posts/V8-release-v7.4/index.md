---
title: "V8 发布 v7.4"
date: "2019-03-25"
template: "post"
draft: false
category: "V8"
translators: ["leyayun"]
tags:
  - "V8"
  - "翻译"
description: ""
---
Every six weeks, we create a new branch of V8 as part of our [release process](https://v8.dev/docs/release-process). Each version is branched from V8’s Git master immediately before a Chrome Beta milestone. Today we’re pleased to announce our newest branch, [V8 version 7.4](https://chromium.googlesource.com/v8/v8.git/+log/branch-heads/7.4), which is in beta until its release in coordination with Chrome 74 Stable in several weeks. V8 v7.4 is filled with all sorts of developer-facing goodies. This post provides a preview of some of the highlights in anticipation of the release.

每六周，我们创建一个新的 V8 分支做为我们发布进程的一部分。每一个版本都是在一个新的 Chrome Beta 版本之前从 V8 的 master 分支切出来。今天我们宣布发布最新的 V8 v7.4 分支，在对应的 Chrome 74 Stable 版本发布前的几周，它都将做为 Beta 版本存在。

## V8 无 JIT 模式（JIT-less V8）
V8 now supports JavaScript execution without allocating executable memory at runtime. In-depth information on this feature can be found in the [dedicated blog post](https://v8.dev/blog/jitless).

V8 现在支持执行执行 JavaScript 而无需在运行时分配可执行内存。要深入了解这个特性，可以阅读之前的文章： [V8 v7.4 支持无 JIT 模式](https://fenews.org/posts/V8-JIT-less-mode/)


## 发布 WebAssembly 多线程（WebAssembly Threads/Atomics）
WebAssembly Threads/Atomics are now enabled on non-Android operating systems. This concludes the [origin trial/preview we enabled in V8 v7.0](https://v8.dev/blog/v8-release-70#a-preview-of-webassembly-threads). A Web Fundamentals article explains [how to use WebAssembly Atomics with Emscripten](https://developers.google.com/web/updates/2018/10/wasm-threads).

This unlocks the usage of multiple cores on a user’s machine via WebAssembly, enabling new, computation-heavy use cases on the web.

WebAssembly 多线程在非 Android 系统中已经启用。包含了我们之前在 v7.0 版本中所实验/预览的功能。Web 基础知识文章里有一篇介绍[如何使用 WebAssembly Atomics](https://developers.google.com/web/updates/2018/10/wasm-threads) 的文章。

这个特性解锁了通过 WebAssembly 对用户机器的多核使用，从而在 Web 端实现新的、大量计算的使用案例。

## 性能方面
### 优化参数不匹配的调用性能
In JavaScript it’s perfectly valid to call functions with too few or too many parameters (i.e. pass fewer or more than the declared formal parameters). The former is called under-application, the latter is called over-application. In case of under-application, the remaining formal parameters get assigned undefined, while in case of over-application, the superfluous parameters are ignored.

在 JavaScript 中，使用太少或太多参数调用函数（即传递少于或多于声明的形式参数）都是有效的。 前者称为缺少投入（under-application），后者称为过度投入（over-application）。 如果缺少投入，则剩余的形式参数将被赋值为 `undefined`，而在过度投入的情况下，将忽略多余的参数。

However, JavaScript functions can still get to the actual parameters by means of the [arguments object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments), by using [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters), or even by using the non-standard [Function.prototype.arguments property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/arguments) on [sloppy mode](https://developer.mozilla.org/en-US/docs/Glossary/Sloppy_mode) functions. As a result, JavaScript engines must provide a way to get to the actual parameters. In V8 this is done via a technique called arguments adaption, which provides the actual parameters in case of under- or over-application. Unfortunately, arguments adaption comes at a performance cost, and is needed commonly in modern front-end and middleware frameworks (i.e. lots of APIs with optional parameters or variable argument lists).

然后，JavaScript 函数仍然可以通过 `arguments`、`rest parameters` 甚至在 [非严格模式](https://developer.mozilla.org/en-US/docs/Glossary/Sloppy_mode) 下非标准的 `Function.prototype.arguments` 属性获取实际传入的参数。导致 JavaScript 引擎必须提供一种方法来获取实际的参数。在 V8 中这个方法是通过**参数适配**来实现，它在缺少/过度投入时提供实际传入的参数。不幸的是，参数适配带来了性能的消耗，而且这种情况在现代的前端或中间件框架中很常见（例如：很多 API 使用可选参数或参数列表变量）。

There are scenarios where the engine knows that arguments adaption is not necessary since the actual parameters cannot be observed, namely when the callee is a strict mode function, and uses neither arguments nor rest parameters. In these cases, V8 now completely skips arguments adaption, reducing call overhead by up to 60%.

在一些场景中引擎知道参数适配是不需要的，因为实际参数是不可观察的，换句话说，当被调用者是严格模式或者被调用函数中既没有使用 `arguments` 也没有使用 `rest parameters`。这种情况下，V8 完全可以跳过参数适配，从而将函数调用性能开销降低高达 60% 。

![argument mismatch performance](images/argument-mismatch-performance.svg)
<p style="text-align: center; font-size: 12px"> 通过[微基准测试](https://gist.github.com/bmeurer/4916fc2b983acc9ee1d33f5ee1ada1d3#file-bench-call-overhead-js)得到的跳过参数适配后性能影响</p>

The graph shows that there’s no overhead anymore, even in case of an arguments mismatch (assuming that the callee cannot observe the actual arguments). For more details, see the [design document](https://bit.ly/v8-faster-calls-with-arguments-mismatch).

结果显示，即使在参数不匹配的情况下（假设被调用者没有观察实际传参），也不再有性能开销。详情请看[设计文档](https://bit.ly/v8-faster-calls-with-arguments-mismatch) 。

## 提升原生访问器性能

The Angular team [discovered](https://mhevery.github.io/perf-tests/DOM-megamorphic.html) that calling into native accessors (i.e. DOM property accessors) directly via their respective `get` functions was significantly slower in Chrome than the [monomorphic](https://en.wikipedia.org/wiki/Inline_caching#Monomorphic_inline_caching) or even the megamorphic property access. This was due to taking the slow-path in V8 for calling into DOM accessors via [Function#call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call), instead of the fast-path that was already there for property accesses.

Angular 团队发现在 Chrome 中直接通过各自的 `get` 函数调用原生访问器（例如：DOM 属性访问器）明显慢于**单态**（monomorphic）属性访问，甚至也慢于**变形态**（megamorphic）属性访问（译者注：单态和变形态指的是编译器内联缓存优化过程中调用站点的状态，可参考：[Inline caching](https://en.wikipedia.org/wiki/Inline_caching#Monomorphic_inline_caching) ）。这是因为在 V8 中使用慢速路径（slow-path）通过 `Function＃call()` 调用 DOM 访问器，而不是已经存在属性访问的快速路径（fast-path）。

![native accessor performance](images/native-accessor-performance.svg)

We managed to improve the performance of calling into native accessors, making it significantly faster than the megamorphic property access. For more background, see [V8 issue #8820](https://bugs.chromium.org/p/v8/issues/detail?id=8820).

我们设法提升了原生访问器的调用性能，使之显著快于**变型态**属性访问。想要了解更多，请阅读[V8 issue #8820](https://bugs.chromium.org/p/v8/issues/detail?id=8820)。

### 解析器性能

In Chrome, large enough scripts are “streaming”-parsed on worker threads while they are being downloaded. In this release we identified and fixed a performance issue with custom UTF-8 decoding used by the source stream, leading to an average 8% faster streaming parse.

在 Chrome 中，大量的脚本在下载完成后在工作线程中被“流式解析”（“streaming”-parsed）。这次的发布我们定位并修了在源流中使用的自定义 UTF-8 解码的性能问题，导致流式解析性能平均提升了 8% 。

We found an additional issue in V8’s preparser, which most commonly runs on a worker thread: property names were unnecessarily deduplicated. Removing this deduplication improved the streaming parser by another 10.5%. This also improves main-thread parse time of scripts that aren’t streamed, like small scripts and inline scripts.

我们在 V8 的预解析器中发现了一个额外问题，它通常在工作线程上出现：对属性名被执行了不必要的去重。移除这个去重，流式解析器的性能又提升了 10.5% 。同时也提升了未编码成二进制流的脚本在主线程中的解析时间，例如：一些小的脚本片段或内联脚本。

![phaser performance](images/parser-performance@2x.jpg)
<p style="text-align: center; font-size: 12px">上图中曲线的每次下降表示流式解析器一次性能提升</p>

## 内存
### 字节码清理（Bytecode flushing）
Bytecode compiled from JavaScript source takes up a significant chunk of V8 heap space, typically around 15%, including related meta-data. There are many functions which are only executed during initialization, or rarely used after having been compiled.

从 JavaScript 源码编译成的字节码占据了一大块 V8 的堆空间，包含相关的元数据，大约有 15% 。有很多函数都只在初始化时执行，或者在编译后很少被使用。

In order to reduce V8’s memory overhead, we have implemented support for flushing compiled bytecode from functions during garbage collection if they haven’t been executed recently. In order to enable this, we keep track of the age of a function’s bytecode, incrementing the age during garbage collections, and resetting it to zero when the function is executed. Any bytecode which crosses an aging threshold is eligible to be collected by the next garbage collection, and the function resets to lazily recompile its bytecode if it is ever executed again in the future.

为了减少 V8 的内存负担，我们实现在垃圾回收时从函数中清理已编译的字节码的支持，如果它们最近没有被执行过。为了实现这一点，我们跟踪函数字节码的年龄，在垃圾收集期间递增年龄，并在执行函数时将其重置为零。 任何超过老化阈值的字节码都符合下一次垃圾回收的条件，并且如果将来再次执行该函数，该函数将重置为懒惰地重新编译其字节码。

Our experiments with bytecode flushing show that it provides significant memory savings for users of Chrome, reducing the amount of memory in V8’s heap by between 5–15% while not regressing performance or significantly increasing the amount of CPU time spent compiling JavaScript code.

我们的字节码清理实验显示，它显著的节约了用户 Chrome 的内存，在没有降低性能或显著增加编译 JavaScript 代码的 CPU 占中时间的情况下，减少了 5% 至 15% 的 V8 堆内存占用。

![bytecode flushing](images/bytecode-flushing.svg)

### 字节码死基本块消除（Bytecode dead basic block elimination）
The Ignition bytecode compiler attempts to avoid generating code that it knows to be dead, e.g. code after a return or break statement:

**Ignition**字节码编译器试图避免生成死代码，例如：在 `return` 或 `break` 语句后面的代码。

```js
return;
deadCall(); // skipped
```

However, previously this was done opportunistically for terminating statements in a statement list, so it did not take into account other optimizations, such as shortcutting conditions that are known to be true:

然而，以前这个清理只会适时地发生在语句列表中存在终止语句，因此它没有考虑其他优化，例如：已知为值为 `true` 的条件。

```js
if (2.2) return;
deadCall(); // not skipped
```

We tried to resolve this in V8 v7.3, but still on a per-statement level, which wouldn’t work when the control flow became more involved, e.g.

我们尝试在 V8 v7.3 中解决这个问题，但仍然停留在每个语句的级别。在控制流程变得更加复杂时，它仍然无法工作。例如：

```js
do {
  if (2.2) return;
  break;
} while (true);
deadCall(); // not skipped
```


The `deadCall()` above would be at the start of a new basic block, which on a per-statement level is reachable as a target for break statements in the loop.

上面的 `deadCall()` 将位于新基本块的开头，该基本块在每个语句级别上可作为循环中 `break` 语句的可到达目标。

In V8 v7.4, we allow entire basic blocks to become dead, if no `Jump` bytecode (Ignition’s main control flow primitive) refers to them. In the above example, the break is not emitted, which means the loop has no `break` statements. So, the basic block starting with `deadCall()` has no referring jumps, and thus is also considered dead. While we don’t expect this to have a large impact on user code, it is particularly useful for simplifying various desugarings, such as generators, `for-of` and `try-catch`, and in particular removes a class of bugs where basic blocks could “resurrect” complex statements part-way through their implementation.

在 V8 v7.4 中，如果没有 `Jump` 字节码（Ignition 主控制流原语）引用它们，我们允许整个基本快变成死区。在上面栗子中，`break` 语句不会被执行，这意味着循环没有 `break` 语句。所以，以 `deadCall()` 开头的基本快没有引用跳转，因此也被认为是死区。虽然我们不期望这对用户的代码产生很大的影响，但是这对于简化各种语法糖的去糖（desugarings）特别有用，例如：生成器、`for-of` 和 `try-catch`，特别是移除了一类 bug ，通过它们的实现基本块可以部分“复活”复杂语句。

## JavaScript 语言特性
### 类的私有字段
V8 v7.2 added support for the public class fields syntax. Class fields simplify class syntax by avoiding the need for constructor functions just to define instance properties. Starting in V8 v7.4, you can mark a field as private by prepending it with a `#` prefix.

V8 v7.2 添加了公共类字段语法支持。类的字段通过避免仅仅为了实例属性而需要定义构造函数来简化类的语法。从 V8 v7.4 开始，您可以通过在前面添加一个`＃`前缀来将字段标记为私有。

```js
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#count;
  }
  increment() {
    this.#count++;
  }
}
```

Unlike public fields, private fields are not accessible outside of the class body:

不像公共字段，私有字段在类外面不能被访问：

```js
const counter = new IncreasingCounter();
counter.#count;
// → SyntaxError
counter.#count = 42;
// → SyntaxError
```

For more information, read our [WebFu article on public and private class fields](https://developers.google.com/web/updates/2018/12/class-fields).
 
更多细节，请阅读我们的[关于类的公共字段和私有字段的 Web 基础文章](https://developers.google.com/web/updates/2018/12/class-fields)。

### `Intl.Locale`

JavaScript applications generally use strings such as `'en-US'` or `'de-CH'` to identify locales. `Intl.Locale` offers a more powerful mechanism to deal with locales, and enables easily extracting locale-specific preferences such as the language, the calendar, the numbering system, the hour cycle, and so on.

JavaScript 应用通常使用 `en-US` 或 `de-CH` 等字符串来标识语言环境。`Intl.Locale` 提供了一种更强大的机制来处理语言环境，并且可以轻松提取特定于语言环境的首选项，例如：语言、日历、编号系统和小时循环等。

```js
const locale = new Intl.Locale('es-419-u-hc-h12', {
  calendar: 'gregory'
});
locale.language;
// → 'es'
locale.calendar;
// → 'gregory'
locale.hourCycle;
// → 'h12'
locale.region;
// → '419'
locale.toString();
// → 'es-419-u-ca-gregory-hc-h12'
```

## V8 API 

Please use `git log branch-heads/7.3..branch-heads/7.4 include/v8.h` to get a list of the API changes.

使用 `git log branch-heads/7.3..branch-heads/7.4 include/v8.h` 来获取 API 变化的列表。

Developers with an [active V8 checkout](https://v8.dev/docs/source-code#using-git) can use `git checkout -b 7.4 -t branch-heads/7.4` to experiment with the new features in V8 v7.4. Alternatively you can [subscribe to Chrome’s Beta channel](https://www.google.com/chrome/beta/) and try the new features out yourself soon.

开发者可以通过 `git checkout -b 7.4 -t branch-heads/7.4` 切到 V8 v7.4的活动分支体验这些新特性。或者，你可以订阅 Chrome 的 Beta 频道，并尽早尝试新功能。