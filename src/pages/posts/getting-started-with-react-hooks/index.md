---
title: "「译」React Hooks(2019)入门教程"
date: "2019-03-25"
template: "post"
draft: false
category: "React"
translators: ["lizhentao"]
tags:
  - "React"
  - "翻译"
description: "带你一步步深入React Hooks(new in 16.8)，并教你如何用useState和useEffect定制自己的Hook函数"
---

![1](./images/2.png)

### 本教程将带你学习
- 如何使用React Hooks
- 如何定制自己的Hook

### 起步准备
要继续学习本教程，你应该基本了解：
- ES6（箭头函数，解构，类）
- React

### 项目安装
请确保已经配置好React开发环境，并且是最新版本的Node.js，再执行：
```js 
  npx create-react-app exploring-hooks
```

### setState起步

首先让我们快速回顾一下React。

React是一个用于构建用户界面的库，其优点之一是React本身会强制开发人员使用严格数据流。还记得jQuery吗？使用jQuery几乎不可能清晰地构建项目，更不用说如何定义UI中的数据流，并且很难跟踪哪些功能正在改变哪个UI。

这同样适用于JavaScript：通过大量的练习和实践，有可能找到一种更好的项目结构（参考模块模式），不过还是要靠运气在各函数之间追踪状态和交互（参考Redux）。

React在某种程度上缓解了这些问题：通过强制执行清晰的 structure（container和function组件）和严格数据流（组件对 state和props的change做出即时响应），会比以前更容易创建合理的UI逻辑。

React的核心思想是，一个UI组件响应一个state变化。到目前为止，表达这种数据流的基本形式是ES6 Class。看下面的示例：

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
从上面的代码中可以看出，当单击按钮时，组件内部状态会被setState改变，按钮会响应state变化并更新文本。

不使用构造函数的话，可以得到更简洁的版本：
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

上面的代码风格不错，但现在使用React Hooks可以更简洁的表达内部状态变化 -> 不使用ES6 class来实现响应式UI。

### 不使用setState更新React中的state
现在不再需要setState和classes了，那我们要如何管理React中的内部状态？

嗯....最重要的React Hook登场了：useState。useState是React暴露的一个函数，你可以在代码顶部把它import进来：
```js 
import React, { useState } from "react";
```

通过在代码中导入useState，你透出了在React组件中保存某种状态的意图。 更重要的是，React组件不再是ES6 class，它是一个纯粹而简单的JavaScript函数，是不是很吸引人～

导入useState后，可以得到一个包含两个变量的数组：
```js 
const [buttonText, setButtonText] = useState("Click me, please");
```

上面的语法其实就是ES6解构（destructuring），变量名可以随意，不过最好还是有意义点。

传递给useState的参数是数据初始值，然后useState会返回给你：
 - state值
 - state更新函数

上面的例子，使用React Hooks改造的话会变成：
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

要在onClick处理程序中调用setButtonText状态更新程序，可以使用箭头函数。 但如果你更喜欢使用常规函数，可以：

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

老实说，除了特殊需求外，我更喜欢常规函数而不是箭头函数。另一方面，程序员写的代码是给其他程序员看的，可读性很必要。

好了，这就是React Hooks！本可以在这里结束这篇文章的，不过我还是挺想向你展示下如何使用Hooks获取数据～～

前往下一节！

### 还记得componentDidMount（render props）么？
在React中获取数据！ 你还记得使用componentDidMount的旧时代吗？ 你可以在componentDidMount中fetch(url)获取数据然后收工。 下面是从API获取数组并渲染成一个List的例子：

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
你可以在componentDidMount中使用async/await，不过会有一些警告。 我项目中大多数异步逻辑都在React组件之外。到现在为止上面的代码还有一些缺陷。

渲染列表是固定的，但使用render prop，我们可以轻松地将children作为函数传递。 重构后的component如下所示：

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

你可以通过从外部传递的render prop来使用该组件：

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

即使是这种模式（比mixins和HOC更好些）也有其缺点。这应该是（我猜测的）React开发团队提出Hooks原因：为React中的封装和逻辑复用提供更好的开发体验。

其实我是个没耐心的人，我想用Hooks尝试的第一件事就是获取数据。但是我怎么用Hooks来获取数据呢？组件是否仍然使用render prop模式？

让我们看看下一节！

### 使用useEffect获取数据
我认为使用React Hooks获取数据不应该与useState有太多不同。快速浏览官方文档后我发现：useEffect可能是正确的工具。

文档：“useEffect与React类中的componentDidMount，componentDidUpdate和componentWillUnmount具有相同的用途，但统一为单个API”

很棒，不是吗？掌握了这些知识后，我使用useEffect重构了第一版Dataloader。Dataloader组件成了一个函数，并在useEffect中调用fetch。而且，我可以使用setData（从useState中提取的更新函数）代替this.setState

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
然后我运行了应用， 这是我在console中看到的：
![3.png](./images/3.png)

显然是我的问题，不过我已经意识到发生了什么：

“useEffect与componentDidMount，componentDidUpdate和componentWillUnmount具有相同的用途”

componentDidUpdate！ componentDidUpdate是一个生命周期方法，每当组件获得新的props或state发生变化时就会运行。

这就是诀窍，如果你像我一样调用useEffect，你会看到无限循环。 要解决这个“bug”，你需要传递一个空数组作为useEffect的第二个参数：

```js 
  useEffect(() => {
    fetch("http://localhost:3001/links/")
      .then(response => response.json())
      .then(data => setData(data));
  }, []); // << 超级重要的数据
```

我希望这些信息能被足够重视，而不是在文末写上使用useEffect Hook。 但即使有这些信息，我也不建议你使用Hooks来重写所有React组件。 未来可能还会有更多的变化，就像Ryan Florence说的：

```
Ryan Florence
@ryanflorence

  Hooks不是React数据加载的终局。
  
  数据加载可能是app中最常见的效果。
  
  不要急于迁移到Hooks，除非你确认他已经非常稳定了。

  Own your churn.

— Ryan Florence (@ryanflorence) February 12, 2019
```

无论如何，useEffect替换了componentDidMount，componentDidUpdate和componentWillUnmount，我认为这对于专业开发人员和React的新手来说都是一件好事。

### 我可以使用带有React Hooks的render props吗？
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
你将通过从外部提供render prop来使用组件，就像我们在前面的示例中所做的那样。

但同样，这种重构没有意义，因为React Hooks的诞生是有原因的：在组件之间共享逻辑。

### 定制你的React Hooks
我们可以将我们的逻辑封装在React Hooks中，然后在我们感觉需要时导入该 Hooks，而不是HOCs和render props。 在示例中，我们可以创建用于获取数据的自定义Hook。

按照React文档规范，自定义Hooks是一个以“use”开头的JavaScript函数。那，让我们马上定制一个‘useFetch’ hook：

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

下面是使用自定义useFetch的例子：
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

这就是Hooks如此吸引人的原因：我们有了一个标准的、干净的方式来封装和共享逻辑。

注：我没有处理上面代码中fetch error的情况，自己动手处理试试吧！

### 我可以在useEffect中使用async/await吗？

当使用useEffect时，我想在Hooks里尝试async/await。让我们再看一眼自定义Hook：

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
对于使用async/await重构，可能做的最自然的事是：

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

对么？ 然后我打开控制台，React正在疯狂报错：
![1](./images/1.png)

“警告：effect函数除了函数之外不能返回任何内容。”然后还完整解释我做错了什么，该怎么改。 嗯...很好！

事实证明你不能用useEffect返回一个Promise。JavaScript异步函数总是返回一个promise，而useEffect只能返回另一个函数。 也就是说，如果你要在useEffect中使用setInterval定时器，你应该返回一个函数（闭包）来清除setIntervel。

那么，我们可以像这样重写我们的异步逻辑：
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
OK，自定义Hook又可以用了。

### 结束
Hooks是React的一个不错的扩充，他于2018年10月作为RFC诞生，很快就进入了React 16.8。可以将React Hooks理解为存活在React组件之外的封装状态。

React Hooks使render props和HOC显得过时，并为逻辑复用提供了更好的开发体验。使用React Hooks，你可以在React组件之间复用常见的逻辑片段。

React还附带了很多预定义的Hooks。其中最重要的是useState和useEffect。 
useState可以使用React组件中的状态，而无需借助ES6 classes。
useEffect替代了componentDidMount，componentDidUpdate和componentWillUnmount并提供了统一的API。
其他Hooks，建议阅读官方文档了解更多信息。

很容易预见React的发展方向：未来将会有三种组件形式
 - 函数组件
 - 类组件
 - 带Hook的函数组件

我可以看到Hooks带来的诸多便利，也挺满意它们提供的API。还有，令人惊讶的是不管React如何演变，社区似乎总能找到聪明的解决方法。


### React Hooks学习资源
- React官方文档是学习Hooks的第一步

- [Build a CRUD App in React with Hooks](https://www.taniarascia.com/crud-app-in-react-with-hooks/)

- Redux：如果你还没学过，那么抓紧去看下。


### 附录
有时可能不需要React来构建UI。当不确定该项目会发展成什么样子时，我会创建一个不依赖任何JS库的原型项目，在这类项目中，我通常用模块化方式来组织代码。

即使是使用原生JavaScript来组织代码，也是每个JavaScript开发人员最重要的财富和能力。为了更多地了解JavaScript中的模块化方式，建议阅读 
 - 《Mastering the module pattern》（Todd Motto）
 - 《JavaScript design patterns》（Addy Osmani）

另一方面，追踪UI中的状态变化确实很难，为了应对这种情况，诞生了很多解决方案，大多数也都消亡了。我很喜欢Redux，即使在原生JavaScript使用也挺不错。

谢谢阅读！下次见！
### 总结

🐦[在推特上关注原作者gagliardi_vale！
](https://twitter.com/gagliardi_vale)

<!-- ⭐[在GitHub上关注原作者！
](https://github.com/leonardomso) -->

原文地址：[https://www.valentinog.com/blog/hooks/](https://www.valentinog.com/blog/hooks/)
