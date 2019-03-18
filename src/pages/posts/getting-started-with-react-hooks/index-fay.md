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
description: "sdf"
---
## React Hooks初学者教程：React Hooks入门（2019）

在本React Hooks教程中，您将学习如何使用React Hooks，它们是什么，以及我们为什么要这样做。
![1](./images/2.png)

我在这里，为您编写一个React Hooks教程。我决定等到钩子最终释放后再放下这根柱子。我们一起学习React Hooks，看看ES6类如何实现相同的逻辑。

享受阅读！

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



### 初学者反应钩教程：你将学到什么

在以下教程中，您将学习：

如何使用反应钩
如何在React类组件中实现相同的逻辑

### 初学者反应钩教程：要求
要遵循本教程，您应该对以下内容有基本了解：

ES6（箭头函数、析构函数、类）
React

### 初学者反应挂钩教程：设置项目
如果您想遵循这些示例，请确保配置一个反应式开发环境。运行：

```js 
  npx create-react-app exploring-hooks
```
你真是太好了！

（您应该有一个最新版本的node.js来运行npx）。

###初学者的React Hooks教程：开始时有setState

我不会太深入，我假设你已经在你的项目中使用了react，但是让我快速回顾一下。

React是一个用于构建用户界面的库，其好处之一是库本身向开发人员施加了严格的数据流。你还记得jquery吗？使用jquery，几乎不可能清晰地构建项目，更不用说定义数据应该如何在UI中流动。很难跟踪哪个函数正在更改哪个用户界面。

这同样适用于普通的javascript：即使有了自免责和实践，也有可能想出一个结构良好的项目（考虑模块模式）、好运跟踪状态和函数之间的交互（可以做到，但没有外部帮助很难做到，请参阅redux）。

通过react，这些问题得到了一定程度的缓解：通过强制实施清晰的结构（容器和功能组件）和严格的数据流（组件对状态和属性更改作出反应），现在比以前更容易创建合理的UI逻辑。
因此，react中的理论是，一个UI可以“响应”状态变化。到目前为止，表达这个流的基本形式是ES6类。考虑下面的示例，从react.component扩展的ES6类具有内部状态：


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

从上面的代码中可以看到，单击按钮时，组件的内部状态会被setState改变。文本的按钮依次响应此更改并获取更新的文本。

可以通过移除构造函数并利用ecmaScript类字段建议来表示组件的更简洁的版本：

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

所以，在开始的时候就有了setstate（它仍然是）。但要保持冷静。上面的样式非常好，React中的ES6类不会很快消失。

但现在使用react hooks，可以不使用ES6类来表示流内部状态更改->ui reaction。

跟着我进入下一部分…

###React Hooks初学者教程：更新React中的状态…不使用setState
那么，既然setstate和类不再是一个需要，那么在react中管理内部状态有什么选择呢？

输入第一个也是最重要的react hook:usestate。usestate是由react包公开的函数。您将在文件顶部导入该函数，如下所示：

```js 
import React, { useState } from "react";
```

通过在代码中导入usestate，您就发出了在react组件中保持某种状态的信号。更重要的是，反应组件不再是ES6类。它可以是一个纯粹而简单的javascript函数。这是这个钩子故事中最吸引人的部分。

导入usestate后，您将从usestate中选择一个包含两个变量的数组，代码应进入react组件：

```js 
const [buttonText, setButtonText] = useState("Click me, please");
```
被这种句法搞糊涂了？这是ES6破坏。上面的名字可以是你想要的任何东西，这与反应无关。无论如何，我建议根据州的目的使用描述性和有意义的变量名。

传递给usestate的参数是实际的开始状态，这些数据将受到更改。usestate为您返回两个绑定：
  - 状态的实际值
  - 所述状态的状态更新程序函数

所以前面的例子，一个带有钩子的按钮组件变成了：

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

要在onclick处理程序内调用setbuttonText状态更新程序，可以使用内联箭头函数。但是，如果您喜欢使用常规函数，可以执行以下操作：

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

老实说，我喜欢常规函数而不是箭头函数，除非我有特定的要求。可读性提高了很多。另外，当我编写代码时，我总是想到下一个能够维护该代码的开发人员。我的代码应该是可读的。

反应挂钩，就这样！我可以在这里结束这篇文章，但在展示如何使用钩子获取数据之前不能。

到下一节去！

###初学者的React Hooks教程：开始时有componentdidmount（和render props）
数据获取响应！你还记得以前组件安装的日子吗？您将在componentdidmount中拍打fetch（url）并将其命名为一天。以下是如何从API获取数据数组以呈现一个好的列表：

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

甚至可以在componentdidmount中使用async/await，但要注意一些问题。但是，我的项目中的大多数异步逻辑都位于反应组件之外。上面的代码还有几个缺点。

渲染列表是固定的，但使用渲染属性，我们可以轻松地将子级作为函数传递。重构的组件如下所示：
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

您可以通过从外部提供渲染道具来使用组件：
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
即使是这种模式（天生是为了提供更好的混音器和hocs的替代品）也有其缺点。这就是（我猜）导致React工程师想出钩子的确切原因：为React中的封装和重用逻辑提供更好的人体工程学。
尽管我很不耐烦，但我想尝试钩子的第一件事就是获取数据。但我应该用什么钩子来获取数据？组件是否仍使用渲染属性模式？
让我们来看看下一节！

### React Hooks初学者教程：使用useEffect获取数据
我认为使用React钩子获取数据不应该与useState看起来如此不同。 快速浏览文档给了我一个提示：useEffect可能是正确的工具。

我读到：“useEffect与React类中的componentDidMount，componentDidUpdate和componentWillUnmount具有相同的用途，但统一为单个API”

答对了！ 太棒了，不是吗？ 掌握了这些知识后，我重构了第一版Dataloader以使用useEffect。 组件成为一个函数，并在useEffect中调用fetch。 而且，我可以使用setData（从useState中提取的任意函数）代替调用this.setState：

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

  Hooks are not the endgame for React data loading.
  
  Data loading is probably the most common effect in an app.
  
  Don't be in a big hurry to migrate to hooks for data unless you're okay migrating again when suspense for data is stable.

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
