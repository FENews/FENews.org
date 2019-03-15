# JavaScript - Generator-Yield/Next & Async-Await

## Generator (ES6)

Functions that can return multiple values at different time interval, as per the user demands and can manage its internal state are generator functions. A function becomes a GeneratorFunction if it uses the function* syntax.

> 可以根据用户需求以不同的时间间隔返回多个值，并且可以管理其内部状态的函，如果函数使用 Function* 语法，则该函数称为 generator 函数。


They are different from the normal function in the sense that normal function run to completion in a single execution where as generator function can be paused and resumed, so they do run to completion but the trigger remain in our hand. They allow better execution control for asynchronous functionality but that does not mean they cannot be used as synchronous functionality.

与普通函数不同，普通函数是单次执行完成运行，而 generator 函数运行过程中能够暂停和恢复，它们能运行完成，但是触发器掌握在我们手中。这使得对异步函数有更好的执行控制，但并不意味它们不能用作同步函数。


Note: When generator function are executed it returns a new Generator object.

> 注意：执行 generator 函数时会返回一个新的 Generator 对象。


The pause and resume are done using yield&next. So lets look at what are they and what they do.

generator 函数的暂停和恢复分别通过 yield & next 实现。让我们来看一下它们究竟是什么以及能做什么。

## Yield / Next

The yield keyword pauses generator function execution and the value of the expression following the yield keyword is returned to the generator's caller. It can be thought of as a generator-based version of the return keyword.

yield 关键字暂停 generator 函数执行，它后面的表达式的值作为 generator 的返回值。它也可以被认为是基于 generator 的return 关键字。


The yield keyword actually returns an IteratorResult object with two properties, value and done. (Don’t know what are iterators and iterables then read here).

yield 关键字实际上返回具有 value 和 done 两个属性的 IteratorResult 对象。（如果你不明白 iterators 和 iterables，[请点击这里](https://codeburst.io/javascript-es6-iterables-and-iterators-de18b54f4d4)）。

Once paused on a yield expression, the generator's code execution remains paused until the generator's next() method is called. Each time the generator's next() method is called, the generator resumes execution and return the iterator result.

一旦在 yield 表达式处暂停，generator 代码执行将保持暂停状态，直到调用 generator 的 next()。每次 next() 被调用，generator 都将恢复执行并返回 iterator 结果。

pheww..enough of theory, lets see an example

pheww ..理论上，让我们看一个例子：

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

Here, UUIDGenerator is an generator function which calculate the UUID using current time an a random number and return us a new UUID every time its executed.

这里，UUIDGenerator 是一个 generator 函数，它使用当前时间和一个随机数计算 UUID ，并在每次执行完成之后返回一个新的 UUID。

To run above function we need to create a generator object on which we can call next()

要运行上面的函数，我们需要创建一个能够调用 next() 的 generator 对象：

```js
const UUID = UUIDGenerator();
// UUID is our generator object
UUID.next();
// return {value: 'e35834ae-8694-4e16-8352-6d2368b3ccbf', done: false}
```

UUID.next() this will return you the new UUID on each UUID.next() under value key and done will always be false as we are in infinite loop.

每次 UUID.next() 都将返回一个新的 UUID 值，而且由于无限循环，done 始终为 false。

Note: We pause above the infinite loop, which is kind of cool and at any “stopping points” in a generator function, not only can they yield values to an external function, but they also can receive values from outside.

> 注意：无限循环中能暂停是很酷的，而且在 generator 函数中任何“停止处”不仅可以为外部函数生成值，也可以从外部函数获取值。

There are lot of practical implementation of generators as one above and lot of library that heavily use it, co , koa and redux-saga are some examples.

有很多 generators 的实现，很多库都有大量的使用，比如 co，koa，redux-saga。

## Async/Await (ES7)

Traditionally, callbacks were passed and invoked when an asynchronous operation returned with data which are handled using Promise.

依照惯例，当一个异步操作返回由 Promise 处理的数据时，回调会被传递并调用。

Async/Await is special syntax to work with promises in a more comfort fashion which is surprisingly easy to understand and use.

Async / Await 是一种特殊的语法，以更舒适的方式使用 promises，这种方式非常容易理解和使用。

Async keyword is used to define an asynchronous function, which returns a AsyncFunction object.

Async 关键字用于定义异步函数，该函数返回一个 AsyncFunction 对象。

Await keyword is used to pause async function execution until a Promise is fulfilled, that is resolved or rejected, and to resume execution of the async function after fulfillments. When resumed, the value of the await expression is that of the fulfilled Promise.

Await 关键字用于暂停异步函数执行，直到 Promise 完成（resolved 或者 rejected），并在之后继续执行异步函数。当恢复时，await 表达式的值等于 Promise 的值。

Key points:
1. Await can only be used inside an async function.
1. Functions with the async keyword will always return a promise.
2. Multiple awaits will always run in sequential order under a same function.
3. If a promise resolves normally, then await promise returns the result. But in case of a rejection it throws the error, just if there were a throw statement at that line.
4. Async function cannot wait for multiple promises at the same time.
5. Performance issues can occur if using await after await as many times one statement doesn’t depend on the previous one.

**关键点:**

- Await 只能在异步函数中使用。
- 带有 async 关键字的函数总是返回一个 promise。
- 同一个函数中多个 await 语句始终按顺序执行。
- 如果 promise 被 resolve，则 await 会返回 promise 结果。但是如果被 reject，它就会像 throw 语句一样抛出错误。
- 异步函数不能同时等待多个 promise。
- 如果在 await 之后多次使用 await，并且后一条语句不依赖于前一条语句，则可能会出现性能问题。

So far so good, now lets see a simple example :

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

The asyncFunction execution “pauses” at the line await promise and resumes when the promise settles, with result becoming its result. So the code above shows “i am resolved!” in one second.

在 await promise 这一行，asyncFunction 执行被“暂停”，并在 promise 完成时恢复，result 为它的返回结果。代码执行后：在一秒钟后输出 “i am resolved!”。

## Generator 和 Async-await 比较

1. Generator functions/yield and Async functions/await can both be used to write asynchronous code that “waits”, which means code that looks as if it was synchronous, even though it really is asynchronous.
2. Generator function are executed yield by yield i.e one yield-expression at a time by its iterator (the next method) where as Async-await, they are executed sequential await by await.
3. Async/await makes it easier to implement a particular use case of Generators.
4. The return value of Generator is always {value: X, done: Boolean} where as for Async function it will always be a promise that will either resolve to the value X or throw an error.
5. Async function can be decomposed into Generator and promise implementation which are good to know stuff.

- Generator 函数/yield 和 Async 函数/await 都可以用来编写“等待”的异步代码，这意味着代码形似同步，实际却是异步的。

- Generator 函数按照 yield 顺序执行，即一个 yield 表达式通过它的迭代器执行一次（next 方法）。而 Async 函数则是按照 await 顺序执行。

- Async / await可以更容易地实现Generators的特定用例。

- Generator 的返回值格式是 {value: X, done: Boolean}。而 Async 函数返回值是一个 X 或抛出错误的 promise。

- Async 函数可以分解为 Generator 和 promise 来实现。

Please consider entering your email here if you’d like to be added to my email list and follow me on medium to read more article on javascript and on github to see my crazy code. If anything is not clear or you want to point out something, please comment down below.

如果您想要添加到我的电子邮件列表中，请考虑 在此处输入您的电子邮件，并在 medium 上关注我以阅读更多有关 javascript 的文章，并在 github 上查看我的代码。如果有什么疑问或者指正，请在下面评论。

**您可能还喜欢我的这些文章：**

* Nodejs app structure
* Javascript data structure with map, reduce, filter
* Javascript- Currying VS Partial Application
* Javascript ES6 — Iterables and Iterators
* Javascript performance test — for vs for each vs (map, reduce, filter, find).
* Javascript — Proxy

If you liked the article, please clap your heart out. Tip — You can clap 50 times! Also, recommend and share to help others find it!
THANK YOU!

如果你喜欢这篇文章，请鼓掌。提示：你可以拍50次！此外，请记得推荐和分享，以帮助其他人找到它！
谢谢！