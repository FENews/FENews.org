---
title: "如何使用 React Hooks 获取数据？"
date: "2019-03-31"
template: "post"
draft: false
category: "JavaScript"
translators: ["$Jason X"]
tags:
  - "JavaScript"
  - "ES6"
  - "翻译"
description: "通过这篇文章你将学会，如何正确使用 React Hooks"
---

# 如何使用 React Hooks 获取数据？

在这个教程中，我将使用 `state`、`effect` 向你们展示*如何使用 `React Hooks` 获取数据*。我们将用广为人知的 [Hacker News API](https://hn.algolia.com/api) 从科技领域获取热门文章。你也将实现用来获取数据的自定义 `hooks` ，它可以在你的应用中的任何地方重复使用，或者作为一个 `npm package` 发布到 `npm` 上。

如果你对这个 `React` 的新特性一无所知，请查看 [介绍 `React Hooks`](https://www.robinwieruch.de/react-hooks/)。
如果你想查看完整的项目，看看在 `React` 中如何使用 `Hooks` 获取数据，请查看这个 [仓库](https://github.com/the-road-to-learn-react/react-hooks-introduction)。

**注意**：在将来，React Hooks 不适用于在 React 中获取数据。相反，Suspense 新特性将负责它。以下的演示是了解 React 中有关 state 和 effect hooks 更多信息的好方法。

* * *
  
## 用 React Hooks 获取数据

如果你不熟悉在 React 中获取数据的话，你可以查看我的 [在 React 中获取大量数据](https://www.robinwieruch.de/react-fetching-data/)1。它将引导你使用 React 类组件获取数据，如何使用 React props component 和 高阶组件 实现复用，以及如何处理错误信息、加载 spinner。这篇文章里，我将用 React Hooks 在函数组件里向你展示上面的所有功能。

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

这个最后一个问题。在这个实例中，我们将会 async/await 通过第三方的 API 来获取数据。根据文档，使用 async 声明的方法都将返回一个隐式的 Promise 。

> async 函数声明定义了一个异步函数，它返回一个 AsyncFunction 对象。异步函数是一个通过事件循环异步操作的函数，使用隐式 Promise 返回其结果。

然后，一个 effect hook 应该不返回任何东西或者返回一个干净的方法。这就是为什么你可能看到如下的提示在你的 chrome log：**07:41:22.910 index.js:1452 Warning: useEffect function must return a cleanup function or nothing. Promises and useEffect(async () => …) are not supported, but you can call an async function inside an effect.. **。

这个就是为什么不允许在 `useEffect` 中直接使用 async 的原因。我们可以通过在 effect 函数中使用 async 来解决这个问题。

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

简而言之，这些就是用 React Hooks 获取数据。但是你如果对错误处理，loading，如何触发从表单中获取数据以及如何实现一个可复用的数据获取 hook 感兴趣的话，请继续阅读。

* * *

## 如何以编程方式/手动方式触发 hook？

鹅妹子嘤，我们在组件 mounts 的时候获取数据获取。但是如果用 input 输入字段来告诉 API 我们感兴趣的主题呢？“ Redux ”被用来作为默认查询，但是关于“ React ”的主题呢？让我们实现一个 Input 元素来使得其他人能够获取除 “Redux” 之外的文章。那么，我们来为 input 元素定义一个新的 state。

```javascript
import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

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
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default App;
```

这会儿，这个两个 state 是相对独立的，但是你想要把这两者结合起来仅用于查询 input 元素中指定的文章。通过一下更改，组件在 mounts 的时候就根据 input 元素中的查询关键字取查询文章。

```javascript
...

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${query}`,
      );

      setData(result.data);
    };

    fetchData();
  }, []);

  return (
    ...
  );
}

export default App;
```

但是我们还缺失了一件事情：当我们尝试在 input 元素中输入的关键字的时候，并没有获取新的数据。这是因为你为 effect 的第二个参数传入了一个空数组。effect 不依赖任何变量，因此它只会在组件 mounts 的时候触发。但是现在， effect 依赖于 query 的改变，一旦 query 做了更改，数据获取将会重新执行。

```javascript
...

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${query}`,
      );

      setData(result.data);
    };

    fetchData();
  }, [query]);

  return (
    ...
  );
}

export default App;
```

一旦你更改了 input 的值，数据就会重新获取。但是这样带来了另一个问题：你在 input 元素中的每一个更改都会触发 effect 重新取获取数据。那么如何做一个按钮来触发请求，来手动控制 hook 的触发呢？

```javascript
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${query}`,
      );

      setData(result.data);
    };

    fetchData();
  }, [query]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button type="button" onClick={() => setSearch(query)}>
        Search
      </button>

      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
```

让 effect 依赖 search 的更改而不是每一次敲击更改的 query state。用户点击这个按钮后，将设置新的 search state，并手动触发 effect hook。

```javascript
...

function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');
  const [search, setSearch] = useState('redux');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `http://hn.algolia.com/api/v1/search?query=${search}`,
      );

      setData(result.data);
    };

    fetchData();
  }, [search]);

  return (
    ...
  );
}

export default App;
```

此外，初始化的 search state 设置为和 query state 相同的状态，是因为组件 mounts 的时候要获取一次数据。但是 search state 和 query state 有相似的值是令人疑惑的。我们为什么不设置一个实际的 URL 来替换 search state 呢？

```javascript
function App() {
  const [data, setData] = useState({ hits: [] });
  const [query, setQuery] = useState('redux');
  const [url, setUrl] = useState(
    'http://hn.algolia.com/api/v1/search?query=redux',
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(url);

      setData(result.data);
    };

    fetchData();
  }, [url]);

  return (
    <Fragment>
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <button
        type="button"
        onClick={() =>
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`)
        }
      >
        Search
      </button>

      <ul>
        {data.hits.map(item => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </Fragment>
  );
}
```

## 自定义数据获取 hook

为了提取一个自定义 hook 用于数据获取，把所有属于数据获取的东西都移动到这个自定义 hook 方法中，除了包括输入字段的查询条件，还包括 Loading ，错误处理。并确保返回你用在应用组件中必须的变量。

```javascript
const useHackerNewsApi = () => {
  const [data, setData] = useState({ hits: [] });
  const [url, setUrl] = useState(
    'http://hn.algolia.com/api/v1/search?query=redux',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  const doFetch = () => {
    setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`);
  };

  return { data, isLoading, isError, doFetch };
}
```

那么现在你新的 hook 就可以用在你的应用中了。

```javascript
function App() {
  const [query, setQuery] = useState('redux');
  const { data, isLoading, isError, doFetch } = useHackerNewsApi();

  return (
    <Fragment>
      ...
    </Fragment>
  );
}
```

下一步，为 `doFetch` 传入 URL state 参数

```javascript
const useHackerNewsApi = () => {
  ...

  useEffect(
    ...
  );

  const doFetch = url => {
    setUrl(url);
  };

  return { data, isLoading, isError, doFetch };
};

function App() {
  const [query, setQuery] = useState('redux');
  const { data, isLoading, isError, doFetch } = useHackerNewsApi();

  return (
    <Fragment>
      <form
        onSubmit={event => {
          doFetch(
            `http://hn.algolia.com/api/v1/search?query=${query}`,
          );

          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      ...
    </Fragment>
  );
}
```

初始化 state 也是可以通用的。将它简单的传递给自定义的 hook。

```javascript
import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';

const useDataApi = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const result = await axios(url);

        setData(result.data);
      } catch (error) {
        setIsError(true);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [url]);

  const doFetch = url => {
    setUrl(url);
  };

  return { data, isLoading, isError, doFetch };
};

function App() {
  const [query, setQuery] = useState('redux');
  const { data, isLoading, isError, doFetch } = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=redux',
    { hits: [] },
  );

  return (
    <Fragment>
      <form
        onSubmit={event => {
          doFetch(
            `http://hn.algolia.com/api/v1/search?query=${query}`,
          );

          event.preventDefault();
        }}
      >
        <input
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {data.hits.map(item => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  );
}

export default App;
```

以上就是用自定义 hook 获取数据。hook 本身对 API 没有任何了解。它从外部获取所有的参数，并仅管理必要的状态，例如数据，loading，错误状态。它作为一个自定义 hook 组件用于执行和获取数据。

参考链接：
1： <https://www.robinwieruch.de/react-fetching-data/>
