---
title: "setState如何知道该做什么？"
date: "2019-02-26"
template: "post"
draft: false
category: "React"
translators: ["lzbSun"]
tags:
  - "React"
  - "React setState"
  - "翻译"
description: "setState如何知道该做什么？"
---

当你在组件里调用了 `setState` , 你觉得接下来会发生什么？

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ clicked: true });
  }
  render() {
    if (this.state.clicked) {
      return <h1>Thanks</h1>;
    }
    return (
      <button onClick={this.handleClick}>
        Click me!
      </button>
    );
  }
}

ReactDOM.render(<Button />, document.getElementById('container'));
```

React 根据 state 改变后的 `{ clicked: true }` 状态来更新 DOM 然后返回 `<h1>Thanks</h1>`。

看起来很简单，是吧。但是，到底是 React 去做了逻辑还是 React DOM ?

更新 DOM 结节听起来像是 React DOM 应该去做的。但是我们调用的是 `this.setState()`，并没有从 React DOM 中调用什么东西。还有就是 `React.Component` 基类是在 React 内部定义的。

那么 `React.Component` 中的 `setState()` 到底是怎么更新 DOM 的？


声明：就像其他博客上的大多数文章一样，你实际上并不需要了解其中的原理。这个文章其实是为那些喜欢了解背后原理的人而写的。完全选读！

---

我可能觉得 `React.Component` 类中包含 DOM 更新的逻辑。

如果是这样情况的话，那么为什么 `this.setState()` 也可以运行在其他的环境呢？比如说，从 `React.Component` 继承的组件运行在 React Native 环境中这种情况下。在这种情况下调用 `this.setState()` 跟我们上面的做的一样，但是 React Native 是运行在 Android 和 IOS 原生环境中的，而不是 DOM 环境。

你可能对 React Test 或者 Shadllow Render 熟悉一些。这两种测试策略都允许你渲染组件，也可以在它们内部调用 `this.setState()` 。 但是它们都不工作在 DOM 环境中。

如果你用过例如 [React ART](https://github.com/facebook/react/tree/master/packages/react-art) 这样的渲染器（renderer），你可能也知道可以在一个页面里用多个渲染器（renderer）。（比如说，ART 组件可以运行在 React DOM 树中）基于这种情况，那么也就意味着全局的标识或变量这种方案是不可能的。

因此 **React Component 是一种委托。委托特定的平台去处理 state 的状态更新**。在我们了解它是怎么做的之前，首先让我们来深入探讨下 React 是如果做分包的，和为什么它要这么做。

---

有一种常见的误解认为 React 渲染引擎包含在 `react` 这个包中。其实不是这样的。

实际上，自从 [React 0.14](https://reactjs.org/blog/2015/07/03/react-v0.14-beta-1.html#two-packages)分包后，`react` 包有意地只暴露了定义组件的API。 React渲染引擎的大部分实现都在 `renderer` 中。


`react-dom`、`react-dom/server`、 `react-native`、`react-test-renderer`、`react-art` 这是一些 `renderer` 的例子（[你可以编写你的 `renderer`](https://github.com/facebook/react/blob/master/packages/react-reconciler/README.md#practical-examples)）

这就是为什么 `react` 包那么重要而不用关心你的目标平台是什么。它的所有导出，例如 `React.Component`、`React.createElement`、`React.Children`还有[Hooks](https://reactjs.org/docs/hooks-intro.html)，都是独立于目标平台的。不管你是运行在 React DOM、React DOM Server、或者 React Native 中，你的组件都将以相同的方式导入，使用。

相比之下，渲染器（renderer）包公开了特定于平台的 API，比如说 `ReactDOM.render()` 它允许一个 React 的结构挂载到一个 DOM 节点中。每个渲染器（renderer）都提供了类似上面的 API。理想情况下，大部分的组件不需要从渲染器（renderer）中导入任何东西。这使得它们更加轻量。

**大部分人都认为 React 渲染引擎的实现在每个特定的渲染器（renderer）中**。
每个渲染器（renderer）中都包含有相同的代码 -- 我们把它叫做协调器（reconciler）。在构建阶段我们为了更好的性能，将协调器（reconciler）和渲染器（renderer）代码打包到一个高度优化的 bundle 包里。（复制代码通常情况下对包的大小的控制不太友好，但是大多数 React 的开发者同时只需要用一种渲染器（renderer），比如说 `react-dom`。）

这里要说明的是，`react` 包只是提供给了我们用 React 功能的方法，其实不知道任何关于它们怎么实现的细节。渲染器（renderer）包（`react-dom`，`react-native`，等等）提供了实现 React 功能的具体实现还有一些特定平台的逻辑。其中的一些代码是共享的（协调器（reconciler）），那些都是特有平台的具体实现。

---

那么我们现在知道为什么 react react-dom 包需要都更新到最新的版本了。我们举个栗子，当 React16.3 添加了 Context API， React 包提供了 `React.createContext()` 这个方法。

但是 `React.createContext()` 事实上就没有实现 Context API 这个新功能。那么 React DOM 和 React DOM Server 的实现就会不一样，比如说 `CreateContext()` 返回一些普通的对象。

```javascript
// A bit simplified
function createContext(defaultValue) {
  let context = {
    _currentValue: defaultValue,
    Provider: null,
    Consumer: null
  };
  context.Provider = {
    $$typeof: Symbol.for('react.provider'),
    _context: context
  };
  context.Consumer = {
    $$typeof: Symbol.for('react.context'),
    _context: context,
  };
  return context;
}
```
当你在代码中使用 `<MyContext.Provider>` 或者 `<MyContext.Consumer>` 的时候，这个时候取决于我们的渲染器（renderer） 怎么去渲染它们。 React DOM 是一种监听方法，React DOM Server 可能是另一种不同的做法。

**那么如果你把 `react` 更新到16.3+但是没有相应的更新 `react-dom`，那么你就会用了一个没有实现 `Provider` 和 `Consumer` 类型的 渲染器（renderer）** 这就是老版本的 `react-dom` 会报 *fail saying these types are invalid* 这个错误的原因。

在 React Native 中也会有上面同样的警告。但是不同于 React DOM，React 的发布版本不会立刻就对应到一个 React Native 的版本。React Native 有独立的发布计划表。更新的渲染器（renderer）代码将会在几周后单独同步更新到 React Native 的项目中。这就是为什么一些新功能在 React Native 和 React DOM 可用的时间点不同的原因。

---

好的，我们已经知道了 `react` 包中没有包含我们感兴趣的内容，因为这些实现都在像 `react-dom`，`react-native` 这样的渲染器（renderer）中。但是这依然没有回答我们上面的问题。`React.Component` 中的 `setState()` 到底是怎么跟响应的渲染器（renderer）通信的？

**答案就是每个渲染器（renderer）都在创建的类里面设置了一个特殊字段**。这个字段就是 `updater`。它不是你要来设置的 -- 它是 React DOM，React DOM Server 或者 React Native 在创建对象的实例后设置的。

```javascript
// Inside React DOM
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMUpdater;

// Inside React DOM Server
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactDOMServerUpdater;

// Inside React Native
const inst = new YourComponent();
inst.props = props;
inst.updater = ReactNativeUpdater;
```
可以查看 [`React Component` 中 `setState` 的实现](https://github.com/facebook/react/blob/ce43a8cd07c355647922480977b46713bd51883e/packages/react/src/ReactBaseClasses.js#L58-L67) 它们做的就是代理到渲染器（renderer）中，让它去处理。

```javascript
// A bit simplified
setState(partialState, callback) {
  // Use the `updater` field to talk back to the renderer!
  this.updater.enqueueSetState(this, partialState, callback);
}
```

React DOM Server [可能会忽略 State 的更新，然后警告你](https://github.com/facebook/react/blob/ce43a8cd07c355647922480977b46713bd51883e/packages/react-dom/src/server/ReactPartialRenderer.js#L442-L448)
而 React DOM 和 React Native 会让协调器（reconciler）[处理](https://github.com/facebook/react/blob/ce43a8cd07c355647922480977b46713bd51883e/packages/react-reconciler/src/ReactFiberClassComponent.js#L190-L207)。

那么这就是为什么 `this.setState()` 可以更新 DOM 即使它定义在 React 包中。它去读取 React DOM 设置的 `this.update` 字段，让 React DOM 安排并处理更新。

---

现在我们知道在在类中 `setState()` 是怎么处理的，那么问题来了，Hooks 是怎么处理的呢？

当开发者第一次看到 [Hook API提案](https://reactjs.org/docs/hooks-intro.html)，他们总是在想： `useState` 是怎么知道该干什么的？我们假设它比基于 `React.Component` 的 `setState()` 更加神奇。

但是正如我们今天所看到的，基于类的 `setState()` 实现是一种错觉。除了将调用转发给当前渲染器（renderer）之外，它不会执行任何操作。`useState` Hook [做了同样的事情](https://github.com/facebook/react/blob/ce43a8cd07c355647922480977b46713bd51883e/packages/react/src/ReactHooks.js#L55-L56)。

**Hooks 使用 “dispatcher” 对象，而不是 `updater` 字段**。当你调用 `React.useState()`，`React.useEffect()`，或者其他内置 Hooks 的时候，它们通通转发给当前的 dispatcher。

```javascript
// In React (simplified a bit)
const React = {
  // Real property is hidden a bit deeper, see if you can find it!
  __currentDispatcher: null,

  useState(initialState) {
    return React.__currentDispatcher.useState(initialState);
  },

  useEffect(initialState) {
    return React.__currentDispatcher.useEffect(initialState);
  },
  // ...
};
```
一些特殊的渲染器（renderer）是在渲染你的组件前设置 dispatcher 的。

```javascript
// In React DOM
const prevDispatcher = React.__currentDispatcher;
React.__currentDispatcher = ReactDOMDispatcher;
let result;
try {
  result = YourComponent(props);
} finally {
  // Restore it back
  React.__currentDispatcher = prevDispatcher;
}
```

比如说，React DOM Server 的实现在[这里](https://github.com/facebook/react/blob/ce43a8cd07c355647922480977b46713bd51883e/packages/react-dom/src/server/ReactPartialRendererHooks.js#L340-L354)，React DOM 和 React Native 的共同实现协调器（reconciler）在[这里](https://github.com/facebook/react/blob/ce43a8cd07c355647922480977b46713bd51883e/packages/react-reconciler/src/ReactFiberHooks.js)。

这就是为什么像 `react-dom` 这样的渲染器（renderer）需要访问你调用 Hooks 的时候的 react 包。否则，你的组件将不能访问到 dispatcher ！当你在同一组件树中有多个 [React副本](https://github.com/facebook/react/issues/13991) 时，这可能不 work。这总是导致了一些模糊的错误，因此 Hooks 会强迫你解决包重复问题。

你可以在技术上覆盖 dispatcher 已获取高级工具功能，但是我们不鼓励这么做（其实 `__currentDispatcher` 属性不是真实的属性名称， 你可以在 React 项目中找到真实的名字）。举个栗子，React DevTools 将使用 [特殊的提案 - built dispatcher](https://github.com/facebook/react/blob/ce43a8cd07c355647922480977b46713bd51883e/packages/react-debug-tools/src/ReactDebugHooks.js#L203-L214) 通过捕获 JavaScript 堆栈树来观察 Hooks。

这也意味着 Hooks 本身并不依赖于 React。如果将来有更多的库，想要重用相同的原始 Hooks, 理论上 dispatcher 可以单独封装到一个包里并导出一个。在实际开发中，我们要避免过早的抽象直到我们真正需要抽象的时候。

`updater` 字段 和 `__currentDispatcher` 对象都是通用编程原则的形式叫做 *依赖注入*。在这两种情况下，渲染器（renderer）将诸如 setState 之类的功能的实现“注入”到通用的 React包 中，以使组件更具声明性。

当你用 React 的时候根本不用去想它是怎么工作的。我们希望 React 用户花更多时间考虑他们的应用程序代码，而不是考虑依赖注入这样的抽象概念。但是如果你想知道 `this.setState()` 或者 `useState()` 这些东西的工作原理，我希望这篇文章能到帮到你。


原文地址：*https://overreacted.io/how-does-setstate-know-what-to-do/*
