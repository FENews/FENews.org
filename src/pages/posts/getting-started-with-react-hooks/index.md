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
description: "定制你自己的React Hook"
---
## React Hooks初学者教程：React Hooks入门（2019）

在这个React钩子教程中，您将学习如何使用React钩子，它们是什么，以及我们为什么这样做。
![1](./images/2.png)

我在这里，为您编写React钩子教程。 我决定等到钩子最终被释放然后放弃这篇文章。 我们将一起学习React钩子，看看如何用ES6类实现相同的逻辑。

目录:
 -  React Hooks初学者教程：你将学到什么
 -  React Hooks入门教程：要求
 -  React Hooks入门教程：设置项目
 -  React Hooks初学者教程：开头有setState
 -  React Hooks初学者教程：更新React中的状态...没有setState
 -  React Hooks初学者教程：开头有componentDidMount（和渲染道具）
 -  React Hooks初学者教程：使用useEffect获取数据
 -  React Hooks初学者教程：我可以使用带有React钩子的渲染道具吗？
 -  React Hooks入门教程：你的第一个自定义React钩子
 -  React Hooks初学者教程：我可以使用async / await和useEffect吗？
 -  React Hooks初学者教程：结束
 -  React Hooks入门教程：学习React钩子的资源
 -  React Hooks入门教程：附录



### React Hooks初学者教程：你将学到什么
在下面的教程中，您将学习：

如何使用React钩子
如何在React类组件中实现相同的逻辑


### React Hooks初学者教程：要求
要继续学习本教程，您应该基本了解：

ES6（箭头函数，解构，类）
应对


### React Hooks初学者教程：设置项目
如果您想要按照示例进行操作，请确保配置React开发环境。 跑：

```js 
  npx create-react-app exploring-hooks
```
你很高兴去！

（你应该有一个最新版本的Node.js来运行npx）。


### React Hooks初学者教程：开头有setState

我不会在这里做得太深，我假设你已经在你的项目中使用了React，但让我快速回顾一下。

React是一个用于构建用户界面的库，其优点之一是库本身会向开发人员强加严格的数据流。你还记得jQuery吗？使用jQuery，几乎不可能清楚地构建项目，更不用说定义数据应如何在UI中流动。很难跟踪哪些功能正在改变哪个UI。

这同样适用于普通的JavaScript：即使有了自我解释和实践，也有可能提出一个结构良好的项目（考虑模块模式），好运跟踪状态和功能之间的相互作用（可以做到但是很难没有外部帮助，请参阅Redux）。

React在某种程度上缓解了这些问题：通过强制执行清晰的结构（容器和功能组件）和严格的数据流（组件对状态和道具更改做出反应），现在比以前更容易创建合理的UI逻辑。

因此，React中的理论是，一个UI可以“响应”以响应状态变化。到目前为止，表达这种流程的基本形式是ES6课程。考虑以下示例，从React.Component扩展的ES6类，具有内部状态：


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
从上面的代码中可以看出，当单击按钮时，组件的内部状态会被setState变异。 文本的按钮轮流响应此更改并获取更新的文本。

通过删除构造函数并利用ECMAScript类字段提议，可以表达更简洁的组件版本：

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

所以，在开始时有setState（仍然会是）。 但保持冷静。 上面的风格非常好，React的ES6课程不会很快消失。

但现在使用React钩子可以表示流内部状态变化 - > UI反应而不使用ES6类。

跟我进入下一节......

### React Hooks初学者教程：更新React中的状态...没有setState
那么现在我们有什么选择来管理React中的内部状态，因为不再需要setState和类了？

输入第一个也是最重要的React钩子：useState。 useState是react包暴露的函数。 您将在文件顶部导入该功能：

```js 
import React, { useState } from "react";
```

通过在代码中导入useState，您发出了在React组件中保存某种状态的意图。 更重要的是，React组件不再是ES6类。 它可以是一个纯粹而简单的JavaScript函数。 这是这个钩子故事中最吸引人的事情。


导入useState后，您将选择一个包含两个变量的数组，这些变量不在useState中，代码应该放在您的React组件中：

```js 
const [buttonText, setButtonText] = useState("Click me, please");
```

这种语法困惑吗？ 这是ES6解构。 上面的名字可以是你想要的任何东西，对React来说无关紧要。 无论如何，我建议根据州的目的使用描述性和有意义的变量名。

传递给useState的参数是实际的起始状态，即可以更改的数据。 useState为您返回两个绑定：
    - 国家的实际价值
    - 所述状态的状态更新程序功能

所以前面的例子，一个带有钩子的按钮组件变成：

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

要在onClick处理程序中调用setButtonText状态更新程序，可以使用内联箭头函数。 但如果您更喜欢使用常规功能，您可以：

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
老实说，除了我有特殊要求外，我更喜欢常规功能而不是箭头功能。 可读性提高了很多。 此外，当我编写代码时，我总是认为下一个开发人员将保留代码。 我的代码应该是可读的。

React hooks，就是这样！ 我可以在这里结束这篇文章，但不是在向您展示如何使用钩子获取数据之前。

前往下一节！

### React Hooks初学者教程：开头有componentDidMount（和渲染道具）
在React中获取数据！ 你还记得componentDidMount的旧时代吗？ 你可以在componentDidMount中点击提取（url）并将其称为一天。 以下是如何从API获取数据数据以呈现一个漂亮的列表：

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
您甚至可以在componentDidMount中使用async / await，但有一些注意事项。 但是我项目中的大多数异步逻辑都存在于React组件之外。 上面的代码还有一些缺点。

渲染列表是固定的，但使用渲染道具，我们可以轻松地将子项作为函数传递。 重构的组件如下所示：

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

并且您将通过从外部提供渲染道具来使用该组件：

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

即便是这种模式（为混合物和HOC提供更好的替代品而诞生）也有其缺点。这就是（我猜）导致React工程师提出钩子的确切原因：为React中的封装和重用逻辑提供更好的人机工程学。

像我一样不耐烦，我想用钩子尝试的第一件事就是数据获取。但是我应该用什么钩子来获取数据呢？组件是否仍然使用渲染道具模式？

让我们看看下一节！

### React Hooks初学者教程：使用useEffect获取数据
我认为使用React钩子获取数据不应该与useState看起来如此不同。快速浏览文档给了我一个提示：useEffect可能是正确的工具。

我读到：“useEffect与React类中的componentDidMount，componentDidUpdate和componentWillUnmount具有相同的用途，但统一为单个API”

答对了！太棒了，不是吗？掌握了这些知识后，我重构了第一版Dataloader以使用useEffect。组件成为一个函数，并在useEffect中调用fetch。而且，我可以使用setData（从useState中提取的任意函数）代替调用this.setState：

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
在这一点上，我想“可能出现什么问题？”然后我推出了应用程序。 这是我在控制台中看到的：
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
  }, []); // << super important array
```

我希望这些信息能够获得应有的可见性，而不是在本页末尾：使用效果钩。 但即使有这些信息，我也不会建议重写所有React组件以使用钩子来获取。 Ryan Florence建议，在不久的将来，很多事情仍然会发生变化：

```
Ryan Florence
@ryanflorence

  钩子不是React数据加载的最终目标。
  
  数据加载可能是应用程序中最常见的效果。
  
  不要急于迁移到数据钩子，除非你可以在数据悬念稳定时再次迁移。

  Own your churn.

— Ryan Florence (@ryanflorence) February 12, 2019
```

无论如何，useEffect替换了componentDidMount，componentDidUpdate和componentWillUnmount，我认为这对于专家开发人员和React的新手来说都是一件好事。

### React Hooks初学者教程：我可以使用带有React钩子的渲染道具吗？
当然！ 但这样做没有意义。 我们的DataLoader组件变为：

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

但同样，这种重构没有意义，因为React钩子的诞生是有原因的：在组件之间共享逻辑，我们将在下一节中看到一个例子。

### React Hooks初学者教程：你的第一个自定义React钩子
我们可以将我们的逻辑封装在React钩子中，然后在我们感觉需要时导入该钩子，而不是HOC和渲染道具。 在我们的示例中，我们可以创建用于获取数据的自定义挂钩。

根据React文档，自定义钩子是一个JavaScript函数，其名称以“use”开头。 比说起来容易。 让我们创建一个useFetch挂钩：

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

这就是你如何使用自定义钩子：
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

这就是使钩子如此吸引人的原因：最后我们有一个很好的，标准化的，干净的方式来封装和共享逻辑。

注意：我没有考虑上面代码中的获取错误，做你的作业！

### React Hooks初学者教程：我可以在useEffect中使用async / await吗？

当玩useEffect时我想在钩子里尝试async / await。 让我们看看我们的自定义挂钩片刻：

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

### React Hooks初学者教程：结束
React hooks是库的一个很好的补充。他们于2018年10月作为RFC出生，很快就赶上了React 16.8。将React钩子想象为生活在React组件之外的封装状态。

React钩子使渲染道具和HOC几乎过时，并为共享逻辑提供了更好的人体工程学。使用React钩子，您可以在React组件之间重用常见的逻辑片段。

React附带一堆预定义的钩子。最重要的是useState和useEffect。 useState可以在React组件中使用本地状态，而无需使用ES6类。

useEffect替换了提供统一API的componentDidMount，componentDidUpdate和componentWillUnmount。还有很多其他的钩子，我建议阅读官方文档以了解更多信息。

很容易预见React的发展方向：功能组件遍布各处！但即便如此，我们还是有三种方法可以在React中表达组件：
   - 功能组件
   - 类组件
   - 带挂钩的功能组件

我可以在钩子中看到很多方便，我对它们提供的API感到满意。令人惊讶的是React如何发展，社区似乎总能找到解决问题的聪明方法。


### React Hooks初学者教程：学习React钩子的资源
有很多资源可以学习React钩子，不可否认有些比这篇文章更好。所以这是我的建议。

React文档是学习钩子的第一站：Hooks简介是对钩子如何以及为什么在这里的高级概述。钩子一目了然更深入，这是深入了解钩子的起点。

Tania Rascia在React with Hooks中使用Build a CRUD App对钩子进行了很好的介绍。说到更高级的用例Matt Hamlin是一个很好的写入useReducer，另一个React挂钩用于管理状态变化。

有趣的是，你使用useReducer的方式类似于很多Redux reducer。这证明了Redux在React社区中的影响力（自从Dan Abramov落后于Redux和React之后，这不应该是一个惊喜）。我强烈建议你学习Redux，如果你还没有完成，那么在学习useReducer之前它会有很多帮助。


### React Hooks初学者教程：附录
在文章的开头我说：“使用jQuery，几乎不可能清楚地构建项目，更不用说定义数据应如何在UI中流动”。

和：

“这同样适用于普通的JavaScript：即使有了自我解释和实践，也有可能提出一个结构良好的项目，祝你好运跟踪应用程序的状态。”

但是您可能不需要React来构建用户界面。有时我使用vanilla JavaScript构建项目，在这里，我做得很好。当我不确定该项目将采用什么形状时，我用来创建一个没有任何JavaScript库的简单原型。

在这些项目中，我依靠模块模式来组织代码。

能够正确组织和记录您的代码，即使使用vanilla JavaScript也是每个JavaScript开发人员的宝贵资产。为了更多地了解JavaScript中的模块模式，我建议阅读由Todd Motto掌握模块模式和Addy Osmani的JavaScript设计模式。

另一方面，跟踪UI中的状态变化确实很难。对于这种工作，许多图书馆已经诞生并死亡。我最喜欢的是Redux，甚至可以使用vanilla JavaScript。

谢谢阅读！下次见！
### 总结

🐦[在推特上关注原作者！
](https://twitter.com/gagliardi_vale)

<!-- ⭐[在GitHub上关注原作者！
](https://github.com/leonardomso) -->

原文地址：[https://www.valentinog.com/blog/hooks/](https://www.valentinog.com/blog/hooks/)
