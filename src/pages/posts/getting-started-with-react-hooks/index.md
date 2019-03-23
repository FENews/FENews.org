---
title: "「译」Getting Started With React Hooks"
date: "2019-03-15"
template: "post"
draft: false
category: "React"
translators: ["lizhentao"]
tags:
  - "React"
  - "翻译"
description: "React Hooks(new) in React 16.8"
---
## React Hooks入门教程：React Hooks入门（2019）

本React Hooks教程，将带你学习如何使用React Hooks（new）。
![1](./images/2.png)

目录:
 -  React Hooks入门教程：你将学到什么
 -  React Hooks入门教程：起步准备
 -  React Hooks入门教程：项目安装
 -  React Hooks入门教程：setState起步
 -  React Hooks入门教程：不使用setState更新React State
 -  React Hooks入门教程：componentDidMount起步
 -  React Hooks入门教程：使用useEffect获取数据
 -  React Hooks入门教程：可以使用带有React Hooks的渲染道具吗？
 -  React Hooks入门教程：定制你的React Hook
 -  React Hooks入门教程：async useEffect？
 -  React Hooks入门教程：结尾
 -  React Hooks入门教程：React Hooks的资源
 -  React Hooks入门教程：附录



### React Hooks入门教程：你将学到什么?
 - 如何使用React Hooks
 - 如何在React Class Components中实现相同的逻辑


### React Hooks入门教程：起步准备
要继续学习本教程，您应该基本了解：

- ES6（箭头函数，解构，类）
- React


### React Hooks入门教程：项目安装
请确保已经配置好React开发环境，再执行：
```js 
  npx create-react-app exploring-hooks
```
注：使用最新版本的Node.js


### React Hooks入门教程：setState起步

首先让我们快速回顾一下React。

React是一个用于构建用户界面的库，其优点之一是库本身会向开发人员强加严格的数据流。还记得jQuery吗？使用jQuery，几乎不可能清晰地构建项目，更不用说如何定义UI中的数据流动，并且很难跟踪哪些功能正在改变哪个UI。

这同样适用于JavaScript：即使有了self-disclipine和practice，也有可能提出一个项目结构（模块模式），靠运气在fuctions之间追踪状态和功能（请参阅Redux）。

React在某种程度上缓解了这些问题：通过强制执行清晰的structure（container和function组件）和严格数据流（组件对state和props更改做出即时变更），比以前开发更容易创建合理的UI逻辑。

因此，React中的思想是，一个UI可以“响应”状态变化。到目前为止，表达这种流程的基本形式是ES6 class。考虑以下示例，从React.Component扩展的ES6类，具有内部状态：


```js
import React, { Component } from "react";
export default class Button extends Component {
  constructor() {
    super();
    this.state = { buttonText: "Click me, please" };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState(() => {
      return { buttonText: "Thanks, been clicked!" };
    });
  }
  render() {
    const { buttonText } = this.state;
    return <button onClick={this.handleClick}>{buttonText}</button>;
  }
}
```
从上面的代码中可以看出，当单击按钮时，组件的内部状态会被setState改变。 文本的按钮轮流响应此更改并获取更新的文本。

删除构造函数并利用ECMAScript Class，可以得到更简洁的版本：

```js
import React, { Component } from "react";
export default class Button extends Component {
  state = { buttonText: "Click me, please" };
  handleClick = () => {
    this.setState(() => {
      return { buttonText: "Thanks, been clicked!" };
    });
  };
  render() {
    const { buttonText } = this.state;
    return <button onClick={this.handleClick}>{buttonText}</button>;
  }
}
```

<!-- So，起步时有setState（以后也是），但不要急，上面的风格非常好，React中的ES6 Classes不会很快消失。 -->

上面的代码风格不错，但现在使用React Hooks就可以表示内部状态变化 -> 不使用ES6类来实现UI响应。

跟我进入下一节......

### React Hooks入门教程：不使用setState更新React中的state
那么现在我们要如何管理React中的内部状态，现在不再需要setState和类了？

第一个也是最重要的React Hooks：useState，useState是React暴露的函数，可以在代码顶部import：

```js 
import React, { useState } from "react";
```

通过在代码中导入useState，您发出了在React组件中保存某种状态的意图。 更重要的是，React组件不再是ES6 class。 它可以是一个纯粹而简单的JavaScript函数。 这是 Hooks 最吸引人的部分。

导入useState后，您可以得到一个包含两个变量的数组：
```js 
const [buttonText, setButtonText] = useState("Click me, please");
```

对这种语法感到困惑吗？ 这其实是ES6解构（destructuring）。 上面的变量名可以随意， 不过还是建议你起一个有描述性意义的变量名。

传递给useState的参数是实际的起始状态，即可以更改的数据。 useState为您返回：
   - state的真实值
   - state的update function

所以前面的例子，一个带有 Hooks的按钮组件变成：

```js
import React, { useState } from "react";
export default function Button() {
  const [buttonText, setButtonText] = useState("Click me, please");
  return (
    <button onClick={() => setButtonText("Thanks, been clicked!")}>
      {buttonText}
    </button>
  );
}
```

要在onClick处理程序中调用setButtonText状态更新程序，可以使用箭头函数。 但如果您更喜欢使用常规fuction，您可以：

```js
import React, { useState } from "react";
export default function Button() {
  const [buttonText, setButtonText] = useState("Click me, please");
  function handleClick() {
    return setButtonText("Thanks, been clicked!");
  }
  return <button onClick={handleClick}>{buttonText}</button>;
}
```
老实说，除了特殊需求外，我更喜欢常规函数而不是箭头函数，一方面可读性比较高。 另一方面，代码应该为下一个开发人员所用、必须是可读的。

React hooks！我本可以在这里结束这篇文章的，不过我还是想向您展示如何使用Hooks获取数据。

前往下一节！

### React Hooks入门教程：文章开头有componentDidMount和render props
在React中获取数据！ 你还记得componentDidMount的旧时代吗？ 你可以在componentDidMount中fetch（url）然后收工。 以下是如何从API获取array数据以呈现一个列表：

```js
import React, { Component } from "react";
export default class DataLoader extends Component {
  state = { data: [] };
  componentDidMount() {
    fetch("http://localhost:3001/links/")
      .then(response => response.json())
      .then(data =>
        this.setState(() => {
          return { data };
        })
      );
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.data.map(el => (
            <li key={el.id}>{el.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}
```
你可以在componentDidMount中使用async/await，补货会有一些警告。 我的项目中大多数异步逻辑都存在于React组件之外。 上面的代码还有一些缺点。

渲染列表是固定的，但使用渲染道具，我们可以轻松地将子项作为函数传递。 重构后的component如下所示：

```js
import React, { Component } from "react";
export default class DataLoader extends Component {
  state = { data: [] };
  componentDidMount() {
    fetch("http://localhost:3001/links/")
      .then(response => response.json())
      .then(data =>
        this.setState(() => {
          return { data };
        })
      );
  }
  render() {
    return this.props.render(this.state.data);
  }
}
```

您将通过从外部传递的render props来使用该组件：

```js
<DataLoader
  render={data => {
    return (
      <div>
        <ul>
          {data.map(el => (
            <li key={el.id}>{el.title}</li>
          ))}
        </ul>
      </div>
    );
  }}
/>
```

即这种模式（提供mixins和HOC之外更好的选择）也有其缺点。这就是（我猜）导致React工程师提出 Hooks的确切原因：为React中的封装和重用逻辑提供更好的人机工程学。

像我一样没有耐心的人，我想用Hooks尝试的第一件事就是数据获取。但是我应该用什么 Hooks来获取数据呢？组件是否仍然使用渲染道具模式？

让我们看看下一节！

### React Hooks入门教程：使用useEffect获取数据
我认为使用React Hooks获取数据不应该与useState看起来如此不同。快速浏览文档后我有了一个灵感：useEffect可能是正确的工具。

我读到：“useEffect与React类中的componentDidMount，componentDidUpdate和componentWillUnmount具有相同的用途，但统一为单个API”

Bingo！太棒了，不是吗？掌握了这些知识后，我重构了第一版Dataloader以使用useEffect。组件成为一个函数，并在useEffect中调用fetch。而且，我可以使用setData（从useState中提取的任意函数）代替调用this.setState：

```js
import React, { useState, useEffect } from "react";
export default function DataLoader() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/links/")
      .then(response => response.json())
      .then(data => setData(data));
  });
  return (
    <div>
      <ul>
        {data.map(el => (
          <li key={el.id}>{el.title}</li>
        ))}
      </ul>
    </div>
  );
}
```
在这一点上，我想“可能会出现什么问题？”然后我运行了应用。 这是我在console中看到的：
![3.png](./images/3.png)
这显然是我的错，因为我已经知道发生了什么：

“useEffect与componentDidMount，componentDidUpdate和componentWillUnmount具有相同的用途”

componentDidUpdate！ componentDidUpdate是一个生命周期方法，每当组件获得新的道具或状态发生变化时运行。

这就是诀窍。 如果你像我一样调用useEffect，你会看到无限循环。 要解决这个“bug”，你需要传递一个空数组作为useEffect的第二个参数：

```js 
  useEffect(() => {
    fetch("http://localhost:3001/links/")
      .then(response => response.json())
      .then(data => setData(data));
  }, []); // << 超级重要的数据
```

我希望这些信息能够获得应有的可见性，而不是在本页末尾：使用效果钩。 但即使有这些信息，我也不会建议重写所有React组件以使用 Hooks来获取。 Ryan Florence建议，在不久的将来，很多事情仍然会发生变化：

```
Ryan Florence
@ryanflorence

  Hooks不是React数据加载的终局。
  
  数据加载可能是app中最常见的效果。
  
  不要急于迁移到Hooks，除非你确认他已经稳定了。

  Own your churn.

— Ryan Florence (@ryanflorence) February 12, 2019
```

无论如何，useEffect替换了componentDidMount，componentDidUpdate和componentWillUnmount，我认为这对于专业开发人员和React的新手来说都是一件好事。

### React Hooks入门教程：我可以使用带有React Hooks的render props吗？
当然可以！ 但这样做没有意义。 我们的DataLoader组件如下：

```js
import React, { useState, useEffect } from "react";
export default function DataLoader(props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/links/")
      .then(response => response.json())
      .then(data => setData(data));
  }, []); // << super important array
  return props.render(data)
}
```
并且您将通过从外部提供渲染道具来消耗组件，就像我们在前面的示例中所做的那样。

但同样，这种重构没有意义，因为React Hooks的诞生是有原因的：在组件之间共享逻辑，我们将在下一节中看到一个例子。

### React Hooks入门教程：你的第一个自定义React Hooks
我们可以将我们的逻辑封装在React Hooks中，然后在我们感觉需要时导入该 Hooks，而不是HOC和渲染道具。 在我们的示例中，我们可以创建用于获取数据的自定义挂钩。

根据React文档，自定义 Hooks是一个JavaScript函数，其名称以“use”开头。 比说起来容易。 让我们创建一个useFetch挂钩：

```js
// useFetch.js
import { useState, useEffect } from "react";
export default function useFetch(url) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data));
  }, []);
  return data;
}
```

这就是你如何使用自定义 Hooks：
```js
import React from "react";
import useFetch from "./useFetch";
export default function DataLoader(props) {
  const data = useFetch("http://localhost:3001/links/");
  return (
    <div>
      <ul>
        {data.map(el => (
          <li key={el.id}>{el.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

这就是Hooks如此吸引人的原因：最后我们有一个很好的，标准化的，干净的方式来封装和共享逻辑。

注意：我没有考虑上面代码中的获取错误，做你的作业！

### React Hooks入门教程：我可以在useEffect中使用async / await吗？

当玩useEffect时我想在 Hooks里尝试async / await。 让我们看看我们的自定义挂钩片刻：

```js
// useFetch.js
import { useState, useEffect } from "react";
export default function useFetch(url) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data));
  }, []);
  return data;
}
```
对于重构异步/等待你可能做的最自然的事情可能是：

```js
// useFetch.js
import { useState, useEffect } from "react";
export default function useFetch(url) {
  const [data, setData] = useState([]);
  useEffect(async () => {
    const response = await fetch(url);
    const data = await response.json();
    setData(data);
  }, []);
  return data;
}
```

有道理吗？ 然后我打开控制台，React正在尖叫着我：
![1](./images/1.png)

“警告：除了用于清理的功能之外，效果功能不能返回任何内容。”然后完整解释我做错了什么。 多好！

事实证明你不能从useEffect返回一个Promise。 JavaScript异步函数总是返回一个promise，而useEffect应该只返回另一个函数，用于清理效果。 也就是说，如果你要在useEffect中启动setInterval，你将返回一个函数（我们有一个闭包）来清除间隔。

因此，为了使React满意，我们可以像这样重写我们的异步逻辑：

```js
// useFetch.js
import { useState, useEffect } from "react";
export default function useFetch(url) {
  const [data, setData] = useState([]);
  async function getData() {
    const response = await fetch(url);
    const data = await response.json();
    setData(data);
  }
  useEffect(() => {
    getData();
  }, []);
  return data;
}
```
并且您的自定义挂钩将再次运行。

### React Hooks入门教程：结束
React hooks是库的一个很好的补充。他们于2018年10月作为RFC出生，很快就赶上了React 16.8。将React Hooks想象为生活在React组件之外的封装状态。

React Hooks使渲染道具和HOC几乎过时，并为共享逻辑提供了更好的人体工程学。使用React Hooks，您可以在React组件之间重用常见的逻辑片段。

React附带一堆预定义的 Hooks。最重要的是useState和useEffect。 useState可以在React组件中使用本地状态，而无需使用ES6类。

useEffect替换了提供统一API的componentDidMount，componentDidUpdate和componentWillUnmount。还有很多其他的 Hooks，我建议阅读官方文档以了解更多信息。

很容易预见React的发展方向：功能组件遍布各处！但即便如此，我们还是有三种方法可以在React中表达组件：
   - fuction components
   - 类组件
   - 带挂钩的功能组件

我可以在 Hooks中看到很多方便，我对它们提供的API感到满意。令人惊讶的是React如何发展，社区似乎总能找到解决问题的聪明方法。


### React Hooks入门教程：React Hooks学习资源
React官方文档是学习Hooks的第一站：Hooks简介是对Hooks如何以及为什么在这里的高级概述。 Hooks一目了然更深入，这是深入了解 Hooks的起点。

Tania Rascia在React with Hooks中使用Build a CRUD App对 Hooks进行了很好的介绍。说到更高级的用例Matt Hamlin是一个很好的写入useReducer，另一个React挂钩用于管理状态变化。

有趣的是，你使用useReducer的方式类似于很多Redux reducer。这证明了Redux在React社区中的影响力（自从Dan Abramov落后于Redux和React之后，这不应该是一个惊喜）。我强烈建议你学习Redux，如果你还没有完成，那么在学习useReducer之前它会有很多帮助。


### React Hooks入门教程：附录
在文章的开头我说：“使用jQuery，几乎不可能清楚地构建项目，更不用说定义数据应如何在UI中流动”。

and

“这同样适用于JavaScript：即使有了self-disclipine和最佳实践，也需要靠运气在fuctions之间追踪状态和功能”

有时可能不需要React来构建用户界面。当我不确定该项目应该往什么方向做的时候，我会创建一个不依赖任何JS库的原型项目。

在这些项目中，我依靠module来组织代码。

能够正确组织和记录您的代码，即使使用vanilla JavaScript也是每个JavaScript开发人员的宝贵资产。为了更多地了解JavaScript中的模块模式，我建议阅读由Todd Motto掌握模块模式和Addy Osmani的JavaScript设计模式。

另一方面，跟踪UI中的状态变化确实很难。对于这种工作，许多图书馆已经诞生并死亡。我最喜欢的是Redux，甚至可以使用vanilla JavaScript。

谢谢阅读！下次见！
### 总结

🐦[在推特上关注原作者！
](https://twitter.com/gagliardi_vale)

<!-- ⭐[在GitHub上关注原作者！
](https://github.com/leonardomso) -->

原文地址：[https://www.valentinog.com/blog/hooks/](https://www.valentinog.com/blog/hooks/)
