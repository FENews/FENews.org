
# 如何使用 React Hooks 获取数据？

在这个教程中，我将使用 `state`、`effect` 向你们展示*如何使用 `React Hooks` 获取数据*。我们将用广为人知的 [Hacker News API](https://hn.algolia.com/api) 从科技领域获取热门文章。你也将实现用来获取数据的自定义 `hooks` ，它可以在你的应用中的任何地方重复使用，或者作为一个 `Node package` 发布到 `npm` 上。

如果你对这个 `React` 的新特性一无所知，请查看 [介绍 `React Hooks`](https://www.robinwieruch.de/react-hooks/)。
如果你想查看完整的项目，看看在 `React` 中如何使用 `Hooks` 获取数据，请查看这个 [仓库](https://github.com/the-road-to-learn-react/react-hooks-introduction)。

**注意**：在将来，React Hooks 不适用与在 React 中获取数据。相反，Suspense 新特性将负责它。一下的演示是了解 React 中有关 state 和 effect hooks 更多信息的好方法。

* * *
  
## 用 React Hooks 获取数据

如果你不熟悉在 React 中获取数据的话，你可以查看我的 [在 React 中获取大量数据](https://www.robinwieruch.de/react-fetching-data/)。它将引导你使用 React 类组件获取数据，如何使用 React props component 和 高阶组件 实现复用，以及如何处理错误信息、加载 spinner。这篇文章里，我将用 React Hooks 在函数组件里向你展示上面的所有功能。

```javascript
import React, { useState } from 'react';

function App() {
  const [data, setData] = useState({ hits: [] });

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
```

这个 App 组件显示一些信息（ hits Hacker News 文章）。state 和 更新 state 的函数是从 `useState` 中来的，它负责管理 App 组件获取的数据的本地状态。初始状态的 state 是一个空的对象列表。目前还没有任何人为这个 state 设置任何值。

我们将会用 `axios` 来获取数据，但是你也可以用其他的获取数据的库或者浏览器原生的 `fetch` API 这个取决于你。如果你还没有装 `axios` 你可以仅用一条命令行来安装它 `npm install axios`。然后来实现用 effect hook 获取数据。

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(async () => {
    const result = await axios(
      'http://hn.algolia.com/api/v1/search?query=redux',
    );

    setData(result.data);
  });

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
```

名为 useEffect 的 effect hook 被用来通过 axios 获取数据，并使用 state hook 的更新方法为组件更新本地数据状态。

然后，当你运行这个应用，你应该会发现进入了一个讨厌的循环里。当我们的组件 mounts 的时候这个 effect hook 会运行，但是同样的当我们组件更新的时候，它也是运行的。因为我们设置了获取完数据的时候，设置 stage，组件更新的时候同样 effect 也是执行的。它一遍一遍的获取数据。这个是一个要去避免的 BUG 。**我们仅仅是需要在组件 mounts 的时间获取数据**。这个也是为什么你可以提供一个空的数组作为 effect hook 的第二个参数，来避免在组件更新的时候运行它，并且仅仅是在组件 mounting 的时候运行。

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(async () => {
    const result = await axios(
      'http://hn.algolia.com/api/v1/search?query=redux',
    );

    setData(result.data);
  }, []);

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
```

第二个参数可以用于定义 hook 依赖的所有变量（在此数组中分配）。如果其中一个更新，这个 hook 重新执行。如果数组为空，则在更新组件的时候这个 hook 不运行，因为它根本没有监控任何变量。

这个最后一个问题。在这个实例中，我们将会 async/await 通过第三方的 API 来获取数据。根据文档，每个使用 async 批注的方法都将返回一个隐式的 Promise 。

> async 函数声明定义了一个异步函数，它返回一个 AsyncFunction 对象。异步函数是一个通过事件循环异步操作的函数，使用隐式 Promise 返回其结果。

然后，一个 effect hook 应该不返回任何东西或者返回一个干净的方法。这就是为什么你可能看到如下的提示在你的 chrome log：**07:41:22.910 index.js:1452 Warning: useEffect function must return a cleanup function or nothing. Promises and useEffect(async () => …) are not supported, but you can call an async function inside an effect.. **。

这个就是为什么不允许在 `useEffect` 中直接使用 async 的原因。让我们为它实现一个解决方法，通过在 effect hook 中使用 async 方法。

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'http://hn.algolia.com/api/v1/search?query=redux',
      );

      setData(result.data);
    };

    fetchData();
  }, []);

  return (
    <ul>
      {data.hits.map(item => (
        <li key={item.objectID}>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  );
}

export default App;
```

简而言之，这些就是用 React Hooks 获取数据。但是你如果对错误处理，加载指示符，如何触发从表单中获取数据以及如何实现一个可复用的数据获取 hook 感兴趣的话，请继续阅读。

* * *

## 如何以编程方式/手动方式触发 hook？

鹅妹子嘤，我们在组件 mounts 的时候获取数据获取。但是如果用 input 输入字段来告诉 API 我们感兴趣的主题呢？“ Redux ”被用来作为默认查询，但是关于“ React ”的主题呢？