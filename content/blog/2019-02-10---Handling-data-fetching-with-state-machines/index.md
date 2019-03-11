---
title: "「译」使用状态机管理获取的数据"
date: "2019-02-20"
template: "post"
draft: false
slug: "/posts/Handling-data-fetching-with-state-machines/"
category: "React"
tags:
  - "React"
  - "React State"
  - "翻译"
description: "使用状态机管理获取的数据"
---

![poster](./poster.jpeg)
这可能是一台非常古老的状态机。`Chester Alvarez` 拍摄 `Unsplash`


当我看到有人在 Twitter 上发布他们带有激情的项目时，我心里有点嫉妒他们。 ✨ 
这些项目通常都包含很多花俏的技术，GraphQL，超一流的互动动画或者令人惊叹的性能。在我的日常工作中，我不处理任何这样的问题。我处理获取数据的问题。

### 真实项目中的现状

当我在一个容器组件里获取数据时（比如说，一个个人用户资料页面），我知道该怎么去做。我已经做过成千上万次了。我写了一个组件，初始化了 state 里的三个值一般都叫做 `data`，`error` 和 `loading`。当组件 `mounts` 的时候我去获取数据，然后根据一些渲染条件完成一些样板数据，以便根据不用的 `state` 渲染不同的东西。 

就像这样：
```javascript
class SomePage extends React.Component {
    state = {
        isPending: false,
        error: null,
        result: null,
    };
    async componentDidMount() {
        this.setState({
            isPending: true,
            error: null,
            result: null
        });
        try {
            const res = await fetch('/api/some-data');
            const data = await res.json();
            this.setState({
                error: null,
                result: data
            });
        } catch (e) {
            this.setState({
                error: e,
                result: null
            });
        }
        this.setState({
            isPending: false
        });
    }
    render() {
        // Renders the appropriate thing based on all of that state
    }
}
```
这里有很多的 `state`，而且他们看起来长的都一样。每次都是这样很烦。每当我写这个时候，我肯定会忘记重置某种特定情况下的 `state` 的一些值。

### 状态机

让我们创建一个状态机，让我们的工作变得轻松点。

每一个数据获取的组件都可能处于四个 `state` 其实中的一个—它可能处在空闲（`idle`）的状态，`pending` 状态，成功（`successful`）的状态或者是错误（`erroneous`）的状态。从空闲的状态到 `pending` 的状态，从 `pending` 的状态到成功或者错误的状态。当这个时候，你可以根据需要将 `state` 的状态重置。

这个看起来有点像状态机。我必须承认我对状态机的理论知识了解的有限，但是 [Mark Shead](https://medium.freecodecamp.org/state-machines-basics-of-computer-science-d42855debc66)（https://medium.freecodecamp.org/state-machines-basics-of-computer-science-d42855debc66） 的这篇文章给了我很大的帮助。如果你像我一样，我建议你花几分钟时间略读一下这篇文章。

那么让我们开始构建我们的状态机吧。下面是一个简单的例子。

```javascript
class ApiStateMachine {
    state = {
        current: 'idle',
    };
    next(input) {
        let nextState;
        switch (this.state.current) {
            case 'idle':
                nextState = 'pending';
                break;
            case 'pending':
                nextState = input ? 'success' : 'error';
                break;
            default:
                nextState = 'idle';
        }
        this.state.current = nextState;
    }
```

就像你看到的这样，这里其实没有做过多的事情。你基于 `ApiStateMachine` 创建了某个 实例，当你想用是状态机改变 `state` 的状态的时候调用 `next()` 方法。这个方法需要提供一个 `input` 的参数，用来表明成功与否。

> *重点是 state 有一种状态，而且必须只有一种状态—它不能是 `pending` 状态还包含一个错误的状态，或者是空闲状态还包含一个正确的值。你永远都不会忘记 `state` 中的状态值了。*

### 我能在 React 中用吗？

答案是 `Yes`。要把它写的更 `React` 化，我们把它放入到一个高阶组件里：

```javascript
const withApiState = TargetComponent => class extends React.Component {
        state = {
            current: 'idle',
        };
        next = (input) => {
            let nextState;
            switch (this.state.current) {
                case 'idle':
                    nextState = 'pending';
                    break;
                case 'pending':
                    nextState = input ? 'success' : 'error';
                    break;
                default:
                    nextState = 'idle';
            }
            this.setState({
                current: nextState
            });
        }
        render() {
            return ( <
                TargetComponent {
                    ...this.props
                }
                apiState = {
                    {
                        ...this.state,
                        next: this.next
                    }
                }
                />
            );
        }
```

这个高阶组件接受一个组件，然后返回一个新的组件，这个返回的新组件提供状态机的所有的 `state` 和改变 `state` 的方法 `next`。

用这种方法，我们可以重构我们大部分获取数据的组件：

```javascript
class SomePage extends React.Component {
    async componentDidMount() {
        const {
            apiState
        } = this.props;
        apiState.next();
        try {
            const res = await fetch('/api/some-data');
            const data = await res.json();
            apiState.next(true);
        } catch (e) {
            apiState.next(false);
        }
    }
    render() {
        // Renders the appropriate thing based on props!
    }
}

const SomeBetterPage = withApiState(SomePage);
```

### 改进 API

现在代码看起来非常的干净，简洁！我唯一不满意的地方就是这个 `next` 方法。从表面上不容易看来它是怎么工作的。

我们可以暴露 .pending()， .success()，.error 方法，还有一个 .idle() 方法，而不是一个不可描述的 .next() 方法。虽然上面的想法没有实现，但是如果我们无序调用它们的话，我们的高阶组件（HOC）也可以确保警告我们--这样可以确保状态机特征对我们有用。

最重要的是，我们仍然隐藏了可重用 `HOC` 中所有状态处理的复杂性。这是 `API` 状态机的最终简洁版本：

```javascript
const withApiState = TargetComponent =>
    class extends React.Component {
        state = {
            current: "idle"
        };

        apiState = {
            pending: () => this.setState({
                current: "pending"
            }),
            success: () => this.setState({
                current: "success"
            }),
            error: () => this.setState({
                current: "error"
            }),
            idle: () => this.setState({
                current: "idle"
            }),
            isPending: () => this.state.current === "pending",
            isSuccess: () => this.state.current === "success",
            isError: () => this.state.current === "error",
            isIdle: () => this.state.current === "idle"
        };

        render() {
            return <TargetComponent {
                ...this.props
            }
            apiState = {
                this.apiState
            }
            />;
        }
    };
```

你可以这样使用它：

```javascript
class SomePage extends React.Component {
  async componentDidMount() {
    const { apiState } = this.props;
    apiState.pending();
    try {
      const res = await fetch('/api/some-data');
      const data = await res.json();
      apiState.success();
    } catch (e) {
      apiState.error();
    }
  }
  render() {
    // Renders the appropriate thing based on props!
  }
}

const SomeBetterPage = withApiState(SomePage);
```
读起来很6，不是吗？我也是这么认为的。

下面的链接有个简单的应用，你可以试试。
https://codesandbox.io/s/rj5yoq23lq?from-embed

### 我可以做的更多吗？

当然，我们可以做很多很酷的事情来改进这种天真的实现，包括添加类型，`dev-only` 的警告以及可能稍微更精细的 `API`。如果你愿意的话，你也可以让它为你处理错误信息，或者甚至是真实的数据获取。

关于高阶组件--还有 `React` 组件 的比较酷的事情是组合使用。因此，比起写一个什么都做的组件而言，你可以编写几个较小的实用程序，把它们组合起来使用，来做任何给定情况下，你需要它们执行的操作。

这里是我实现的一个叫 `withData` 的处理实际的数据获取和异步获取内容的高阶组件。现在，我们实际的页面组件可以是无状态的，并且数据获取的逻辑是可共享的。

https://codesandbox.io/s/x72q63v4rq?from-embed

这里，`withData` 高阶组件使用 `withApiState` 高阶组件来处理一般用例，同时让 `withApiState` 也可以为自己重用。

### 总结
将像通过 API 获取数据这种可以重用的逻辑分离出来可以省去你很多麻烦。如果你创建一个高阶组件来处理所有的诸如此类的事情, 你可以在一个地方解决一次，并在任何地方重复使用它。

*原文地址： https://blog.usejournal.com/handling-data-fetching-with-state-machines-4e25b6366d9*

