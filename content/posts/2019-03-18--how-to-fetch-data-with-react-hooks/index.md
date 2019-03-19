
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

这个 App 组件显示一些信息（ hits Hacker News 文章）。state 和 更新 state 的函数是从 `useState` 中来的，它负责管理 App 组件获取的数据的本地状态。