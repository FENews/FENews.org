---
title: "aysnc 函数和 promise 性能优化"
date: "2019-02-27"
template: "post"
draft: false
slug: "/posts/faster-async"
category: "V8"
tags:
  - "V8"
  - "async"
  - "promise"
  - "翻译"
description: ""
---

JavaScript 的异步处理一直被认为不够快。更糟糕的是，调试实时的 JavaScript 应用程序，特别是 Node.js 服务器，并非易事，特别是涉及到异步编程时。幸运的是，这个现象正在被改变。这篇文章将介绍我们是如何在 V8 （有一些其他的 JavaScript 引擎也一样） 中优化 `async` 函数和 promise 的，还有我们如何提升 `async` 代码的调试体验。

⚠️ 相对于阅读文章，如果你更喜欢看演讲视频的话，可以直接观看下面的视频。否则，请跳过视频并继续阅读。

<!-- 视频 -->

## 异步编程的新方法
### 从回调到 promise 再到 async 函数

在 promise 成为 JavaScript 的一部分之前，基于回调的 API 是很常用的异步代码，特别是在 Node.js 中。这里有个栗子：

``` javascript
function handler(done) {
  validateParams((error) => {
    if (error) return done(error);
    dbQuery((error, dbResults) => {
      if (error) return done(error);
      serviceCall(dbResults, (error, serviceResults) => {
        console.log(result);
        done(error, serviceResults);
      });
    });
  });
}
```
 
 这种使用深层 callback 嵌套的方式被称作“回调地狱”，因为它降低了代码的可阅读性和可维护性。

 幸运的是，现在 promise 已经成为了 JavaScript 语言的一部分。上面的代码有了更加优雅和可维护性的写法：

 ```javascript
 function handler() {
  return validateParams()
    .then(dbQuery)
    .then(serviceCall)
    .then(result => {
      console.log(result);
      return result;
    });
}
 ```

再后来，JavaScript 支持了 `async` 函数。上面的异步代码，现在可以写的像同步代码一样了：

```javascript
async function handler() {
  await validateParams();
  const dbResults = await dbQuery();
  const results = await serviceCall(dbResults);
  console.log(results);
  return results;
}
```

使用了 `async` 函数之后，代码变得更加简洁，代码的控制流程和数据流更加容易理解，尽管代码仍然是异步执行。（谨记，JavaScript 执行仍然发生在单线程中，这意味着 `async` 函数并不会创建自己的物理线程。）

### 从事件监听的回调到异步迭代（async iteration）

[ReadableStreams](https://nodejs.org/api/stream.html#stream_readable_streams) 是另一个在 Node.js 中常见的异步编程范例。栗子如下：

```javascript
const http = require('http');

http.createServer((req, res) => {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    res.write(body);
    res.end();
  });
}).listen(1337);
```

这段代码有点难理解：传入的数据只能在回调内以 chunk 的形式被处理，而且流的结束信号只能在回调内接收到。这很容易产生 bug ， 如果你没有意识到函数的立即结束并在回调内处理。

幸运的是，在 ES2018 中有一个很酷的叫做[异步迭代](http://2ality.com/2016/10/asynchronous-iteration.html)的新特性可以简化这段代码：

```javascript
const http = require('http');

http.createServer(async (req, res) => {
  try {
    let body = '';
    req.setEncoding('utf8');
    for await (const chunk of req) {
      body += chunk;
    }
    res.write(body);
    res.end();
  } catch {
    res.statusCode = 500;
    res.end();
  }
}).listen(1337);
```

我们现在可以把所有的处理异步请求的逻辑放到一个单独的 `async` 函数中，而不是分散在 ***data*** 和 ***end*** 两个不同回调函数中，并使用 `for await...of` 循环来异步迭代 chunk 。我们也可以使用 `try-catch` 语句快避免 `unhandledRejection` 问题。

你已经可以在生产环境使用这些新特性了！***Node.js 8（V8 v6.8/Chrome 68）*** 开始支持 `async` 函数，异步迭代和生成器在 ***Node.js 10 (v8 6.8/Chrome 68)*** 开始支持！

## async 函数性能提升



原文地址：[https://v8.dev/blog/fast-async](https://v8.dev/blog/fast-async))