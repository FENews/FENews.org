---
title: "JavaScript - Generator-Yield/Next & Async-Await"
date: "2019-03-16"
template: "post"
draft: false
category: "JavaScript"
translators: ["hearingguo"]
tags:
  - "JavaScript"
  - "ES6"
  - "翻译"
description: "可以根据用户需求以不同的时间间隔返回多个值，并且可以管理其内部状态的函，如果函数使用 Function* 语法，则该函数称为 generator 函数。"
---

![Photo by Deepak Gupta on Medium](./images/0_yONeU8vuaq8eIyTD.jpeg)

---

## Generator (ES6)

> generator 函数是一个可以根据用户需求在不同时间间隔返回多个值，并能管理其内部状态的函数。如果一个函数使用 `Function*` 语法，则该函数就变成了一个 generator 函数。

与普通函数不同，普通函数在单次执行中完成运行，而 generator 函数运行过程中可以被暂停和恢复。它们能运行完成，但是触发器在我们手中。这使得对异步函数有更好的执行控制，但也并不意味它们不能用作同步函数。

> 注意：执行 generator 函数时会返回一个新的 Generator 对象。

generator 函数的暂停和恢复分别通过 `yield` & `next` 实现。让我们来看一下它们是什么以及能做什么。

## Yield / Next

> `yield` 关键字暂停 generator 函数执行，并且它后面表达式的值将返回给 generator 调用者。它也可以被理解成基于 generator 版本的 `return` 关键字。

`yield` 关键字实际上返回一个具有 `value` 和 `done` 两个属性的 `IteratorResult` 对象。（如果你不明白 iterators 和 iterables，[请点击这里](https://codeburst.io/javascript-es6-iterables-and-iterators-de18b54f4d4)）。

> 一旦暂停 `yield` 表达式，generator 代码执行将保持暂停状态，直到调用 generator 的 `next()`。每次 `next()` 被调用，generator 都将恢复执行并返回 [iterator](https://codeburst.io/javascript-es6-iterables-and-iterators-de18b54f4d4) 结果。

嗯...理论就先到这里吧，让我们看一个例子：

```js
function* UUIDGenerator() {
  let d, r;
  while(true) {
    yield 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      r = (new Date().getTime() + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
  }
};
```

UUIDGenerator 是一个 generator 函数，它使用当前时间和一个随机数计算 UUID，并在每次执行完成之后返回一个新的 UUID。

要运行上面的函数，我们需要创建一个能调用 `next()` 的 generator 对象：

```js
const UUID = UUIDGenerator();
// UUID is our generator object
UUID.next();
// return {value: 'e35834ae-8694-4e16-8352-6d2368b3ccbf', done: false}
```

每次 `UUID.next()` 都将返回一个新的 UUID 值，done 始终为 false， 因为我们处于一个无限循环中。

> 注意：我们在无限循环中暂停是非常酷的，而且在 generator 函数中任何“停止点”，不仅可以为外部函数生成值，还可以从外部函数接收值。

有很多 generator 的实现，很多库都有大量的使用，比如 [co](https://github.com/tj/co)，[koa](https://koajs.com/)，[redux-saga](https://github.com/redux-saga/redux-saga)。

---

## Async/Await (ES7)

![Photo by Deepak Gupta on Medium](./images/0_LAkE4GiZATgtseM5.jpeg)

依照惯例，当一个异步操作返回由 `Promise` 处理的数据时，回调会被传递并调用。

> Async/Await 是一种特殊的语法，以更舒适的方式使用 promise，这种方式非常容易理解和使用。

**Async** 关键字用于定义异步函数，该函数返回一个 [`AsyncFunction`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) 对象。

**Await** 关键字用于暂停异步函数执行，直到 `Promise` 完成（resolved 或者 rejected），并在之后继续执行异步函数。当恢复时，`await` 表达式的值等于已执行的 `Promise` 的值。

### **关键点:**

- *Await 只能在异步函数中使用。*

- *带有 async 关键字的函数总是返回一个 promise。*

- *同一个函数中多个 await 语句始终按顺序执行。*

- *如果 promise 被 resolve，则 await 会返回 promise 结果。但是如果被 reject，它就会像 throw 语句一样抛出错误。*

- *异步函数不能同时等待多个 promise。*

- *如果在 await 之后多次使用 await，并且后一条语句不依赖于前一条语句，则可能会出现性能问题。*

到目前为止一切顺利，现在让我们看一个简单的例子：

```js
async function asyncFunction() {

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("i am resolved!"), 1000)
  });

  const result = await promise;
  // wait till the promise resolves (*)

  console.log(result); // "i am resolved!"
}

asyncFunction();
```

在 `await promise` 这一行，`asyncFunction` 执行被“暂停”，并在 promise 完成时恢复，`result` 为它的返回结果。代码执行结果：在一秒钟后输出 “`i am resolved!`”。

## Generator 与 Async-await  比较

- Generator 函数/yield 和 Async 函数/await 都可以用来编写“等待”的异步代码，这意味着代码形似同步，实际却是异步的。

- Generator 函数按照 **yield** 顺序执行，即一个 yield 表达式通过它的迭代器执行一次（`next` 方法）。而 Async 函数则是按照 **await** 顺序执行。

- Async/await 可以更容易地实现 Generators 的特定用例。

- Generator 的返回值始终是 **{ value: X, done: Boolean }**。而 Async 函数返回值是一个 X 或抛出错误的 **promise**。

- Async 函数可以分解为 Generator 和 promise 来实现。

---

如果您想要添加到我的电子邮件列表中，请考虑 [在此处输入您的电子邮件](https://docs.google.com/forms/d/e/1FAIpQLSd51BJWwtMbZlJQwJQ2n59Q6T7aOKqvubzqqPh9eNtuEgXBjg/viewform?usp=send_form)，并**在 [medium](https://medium.com/@ideepak.jsd) 上关注我以阅读更多有关 javascript 的文章，并在 [github](https://github.com/dg92) 上查看我的代码**。如果有什么疑问或者指正，请在下面评论。

**您可能还喜欢我的这些文章：**

* [Nodejs app structure](https://codeburst.io/fractal-a-nodejs-app-structure-for-infinite-scale-d74dda57ee11)

* [Javascript data structure with map, reduce, filter](https://codeburst.io/write-beautiful-javascript-with-%CE%BB-fp-es6-350cd64ab5bf)

* [Javascript- Currying VS Partial Application](https://codeburst.io/javascript-currying-vs-partial-application-4db5b2442be8)

* [Javascript ES6 — Iterables and Iterators](https://codeburst.io/javascript-es6-iterables-and-iterators-de18b54f4d4)

* [Javascript performance test — for vs for each vs (map, reduce, filter, find)](https://codeburst.io/write-beautiful-javascript-with-%CE%BB-fp-es6-350cd64ab5bf).

* [Javascript — Proxy](https://codeburst.io/why-to-use-javascript-proxy-5cdc69d943e3)

如果你喜欢这篇文章，请鼓掌。友情提示：您可以拍50次！此外，请记得推荐和分享，以帮助其他人找到它！

谢谢！