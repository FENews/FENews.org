---
title: "「译」为什么 'XX' 不是一个 Hooks API?"
date: "2019-01-30"
template: "post"
draft: false
slug: "/posts/why-x-is-not-a-hook/"
category: "React"
tags:
  - "React"
  - "React Hooks"
  - "翻译"
description: "我们可以这样做，但并不是意味着我们应该这样做。"
---


自从 [React Hooks](https://reactjs.org/hooks) 发布 alpha 版本以来, 就有很多人开始讨论一些问题，比如: “为什么有些 API 不是一个 Hook?”。

比如下面这些就是一些 Hooks API：

* [`useState()`](https://reactjs.org/docs/hooks-reference.html#usestate) 可以用来声明 `state` 变量。
* [`useEffect()`](https://reactjs.org/docs/hooks-reference.html#useeffect) 可以用来声明 `side effects`。
* [`useContext()`](https://reactjs.org/docs/hooks-reference.html#usecontext) 可以用来读取 `context`。

但是有些 API 就不是 hooks，比如 `React.memo()` 和 `<Context.Provider>`。一般大家提出来的关于 Hooks API 的提案基本上是*不可组合（noncompositional）*和*反模块化（antimodular）*的，这篇文章会帮助你理解为什么。

**注：这篇文章是一篇深入探讨的文章，阅读对象应该是对 React API 的讨论是非常感兴趣的，而不是为了考虑使用 React 来提升效率的！**

我们想让 React 的 API 保持以下非常重要的两点:

1. **组合:** 对于 Hooks API来说，可以[自定义 Hooks](https://reactjs.org/docs/hooks-custom.html) 是让我们感到非常兴奋的。 我们期望大家都可以来构建自己的Hooks API， 并且我们需要确保不同人写的 Hooks API [不会造成冲突](https://overreacted.io/why-do-hooks-rely-on-call-order/#flaw-4-the-diamond-problem)。 (我们是不是已经被随意的组合组件而不用担心相互造成影响给惯坏了？)

2. **调试:** 我们希望随着应用规模的不断增长 [bug 是很容易发现的](https://overreacted.io/the-bug-o-notation/)的。React最棒的一个特性就是如果某些内容被错误的渲染了，你可以轻松的定位到对应组件中的 prop 或者 state 导致了这个问题。

结合这两点来看，我们就可以知道哪些可以或者*不可以*成为一个 Hook。我们可以用一些例子来说明：

##  一个 Hook：`useState()`

### 组合

多个自定义的 Hooks 调用 `useState()`，而不会造成冲突：

```js
function useMyCustomHook1() {
  const [value, setValue] = useState(0);
  // What happens here, stays here.
}

function useMyCustomHook2() {
  const [value, setValue] = useState(0);
  // What happens here, stays here.
}

function MyComponent() {
  useMyCustomHook1();
  useMyCustomHook2();
  // ...
}
```

添加一个不在条件判断里的 `useState()` ， 调用这个 API 是很安全的。你不需要了解在一个组件里面声明了新的 state 变量被其他 Hooks 使用了。也不会因为更新了其他状态导致 state 变量被影响。

**结论:** ✅ `useState()` 不会对其他自定义的 Hooks 造成影响。 

### 调试

Hooks 是非常有用的，你可以在 Hooks *之间*传递值：

```js{4,12,14}
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  // ...
  return width;
}

function useTheme(isMobile) {
  // ...
}

function Comment() {
  const width = useWindowWidth();
  const isMobile = width < MOBILE_VIEWPORT;
  const theme = useTheme(isMobile);
  return (
    <section className={theme.comment}>
      {/* ... */}
    </section>
  );
}
```

但是如过我们的代码出错了，我们怎么调试？

假设我们从 `theme.comment` 里拿出来的一个 css class 是错误的, 那我们怎么调试这个问题？我们可以在组件里设置一个断点或者输出一些日志。

也许我们可以发现 `theme` 是错误的，但是 `width` 和 `isMobile`是正确的。这就告诉我们问题是发生在 `useTheme()` 里面。也有可能 `width` 不对，那么相应的问题就出在 `useWindowWidth()` 里。

**一看最顶部的对应 Hooks 里的中间值就知道问题发生在哪里了。** 我们不需要查看组件里所有的 Hooks 的实现。

我们直接查看有问题的那个实现，重复这个步骤就可以确定问题具体问题发生在什么地方。

如果自定义 Hooks 的嵌套层级增加了，那么这个就变的更加重要。想象一下，我们有三层嵌套的自定义 Hook，每层使用了三个不同的自定 Hooks。 定位**3个有问题的地方**和定位 **3 + 3×3 + 3×3×3 = 39个有问题地方**，二者之间的成本[差别](https://overreacted.io/the-bug-o-notation/)是非常大的。幸运的是，`useState()` 不会对其他 Hooks 或者组件造成莫名其妙的影响。雁过留痕，一个 Hooks 返回的错误值，和普通的变量是没有任何区别的。🐛

**结论:** ✅ `useState()` 不会隐藏我们代码中的因果关系。我们可以一步步的定位到对应的bug。


## 不是一个 Hook: `useBailout()`

作为一种优化, 组件使用 Hooks 可以避免重新渲染。

另一种方式是我们可以使用 [`React.memo()`](https://reactjs.org/blog/2018/10/23/react-v-16-6.html#reactmemo) 包裹整个组件。 为了避免重新渲染，`React.memo()` 会用本次即将渲染的 props 和最后一次渲染的 props 通过 `shallowly equal` 去做比较， 这个和 `PureComponent` 是类似的。

`React.memo()` 接收一个组件作为参数并返回一个组件：

```js{4}
function Button(props) {
  // ...
}
export default React.memo(Button);
```

**但是 `useBailout()` 为什么不仅仅是一个钩子**

不论你将其称之为 `useShouldComponentUpdate()`， `usePure()`， `useSkipRender()` 或者 `useBailout()`， 这个提案(proposal)看起来就和下面这个是一样的：

```js
function Button({ color }) {
  // ⚠️ 非真实API
  useBailout(prevColor => prevColor !== color, color);

  return (
    <button className={'button-' + color}>  
      OK
    </button>
  )
}
```

也有一些其他不同的提案（比如：[`usePure()`](https://github.com/reactjs/rfcs/pull/30#issuecomment-371337630)），但是一般来说，这个提案也有同样的问题。

### 组合

让我们尝试将 `useBailout()` 在两个自定义的 Hooks 中使用：

```js{4,5,19,20}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ⚠️ 非真实API
  useBailout(prevIsOnline => prevIsOnline !== isOnline, isOnline);

  useEffect(() => {
    const handleStatusChange = status => setIsOnline(status.isOnline);
    ChatAPI.subscribe(friendID, handleStatusChange);
    return () => ChatAPI.unsubscribe(friendID, handleStatusChange);
  });

  return isOnline;
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  // ⚠️ 非真实API
  useBailout(prevWidth => prevWidth !== width, width);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return width;
}
```

如果现在在同一个组件中使用这两个自定义的 Hooks 会发生什么？


```js{2,3}
function ChatThread({ friendID, isTyping }) {
  const width = useWindowWidth();
  const isOnline = useFriendStatus(friendID);
  return (
    <ChatLayout width={width}>
      <FriendStatus isOnline={isOnline} />
      {isTyping && 'Typing...'}
    </ChatLayout>
  );
}
```

什么时候重新渲染?

如果每一个 `useBailout()` 都有权限去跳过更新，那么 `useWindowWidth()` 里面的更新就会被 `useFriendStatus()` 给阻塞，反之亦然。 **这些 Hooks 会相互影响。**

然而，如果允许`useBailout()` 在一个组件里去阻止更新的话，那么我们的 `ChatThread` 组件里的 `isTyping` 属性发生变化时也无法去更新这个组件。

更糟糕的是，如果我们使用这种语义，**任何新添加到 `ChatThread` 里的 Hooks 如果没有*同样*调用 `useBailout()`，那么这些 Hooks 也同样会被阻断**。不然 `useBailout()` 也没有办法在 `useWindowWidth()` 和 `useFriendStatus()` 阻止更新时 “投上反对票（vote against）”。

**结论:** 🔴 `useBailout()` 违反了组合原则。添加 `useBailout()` 到一个 Hook 里面就会影响其他 Hooks 的状态更新。我希望 API 是[健壮的(antifragile)](https://overreacted.io/optimized-for-change/), 但是 `useBailout()` 的行为是完完全全相反的。

### 调试

像 `useBailout()` 的这样的 hook 会对调试造成什么影响？

我们使用同样的列子:

```js
function ChatThread({ friendID, isTyping }) {
  const width = useWindowWidth();
  const isOnline = useFriendStatus(friendID);
  return (
    <ChatLayout width={width}>
      <FriendStatus isOnline={isOnline} />
      {isTyping && 'Typing...'}
    </ChatLayout>
  );
}
```

假设有些上层组件的属性发生了变化，但是 `Typing...` label 没有按照我们预期显示出来。这时候我们怎么调试呢？

**通常，你会很自信的回答这个问题，我们只需要去看*上层组件*。** 如果 `ChatThread` 没有获得 `isTyping` 的新值。我们可以打开渲染 `<ChatThread isTyping={myVar} />` 的组件，然后去检查 `myVar` 等等。在同级组件中，我们可能在 `shouldComponentUpdate()` 中发现被阻止了，或者 `isTyping` 的值没有正确的传递过去。检查在这个链中的每一个组件通常也能轻松的定位到问题的根源。

如果 `useBailout()` Hook 是一个真实的 API。在你深度地检查 `ChatThread` 和所有组件*中使用到的每一个自定义 Hook* 之前，你永远不知道跳过更新的原因。由于每一个父组件*同样*可以使用自定义 Hooks，这个[情况（scales）](https://overreacted.io/the-bug-o-notation/)就变的更加复杂了。

这就像一个抽屉柜里有一堆小抽屉，你需要在其中一个找到一把小螺丝刀一样。你永远不知道这个“坑”到底有多深。

**结论:** 🔴 `useBailout()` Hook 不仅仅破坏可组合性, 为了找到有 bug 的阻止更新代码，大大的增加了调试步骤和认知负荷 —— 在某些情况下，这是指数级别的。

我们讨论了一个真正存在的 Hook - `useState()`，和另一个看上去是 Hook，但是实际上*不*是一个 Hook - `useBailout()` 的例子，我们通过一些组合和调试列子比较了一下，并讨论了为什么其中一个是有效的，另一个是无效的。

虽然没有 “Hook 版本” 的 `memo()` 和 `shouldComponentUpdate()`，但是React确实提供了一个叫 [`useMemo()`](https://reactjs.org/docs/hooks-reference.html#usememo) 的 API. 虽然有相同的用途，但是 `useMemo()` 本身的语义是不一样的，不会遇到上面所说的问题。

`useBailout()` 只是一个不会像 Hook 一样工作的例子。但是也还有一些其他的 Hooks API —— 比如，`useProvider()`, `useCatch()`, 和 `useSuspense()`。

现在明白为什么了吗?

*(低头嘀咕: 组合... 调试...)*

原文地址：[https://overreacted.io/why-isnt-x-a-hook/](https://overreacted.io/why-isnt-x-a-hook/)

![请关注我们的公众号](/media/qrcode.jpg)
>请关注我们的公众号