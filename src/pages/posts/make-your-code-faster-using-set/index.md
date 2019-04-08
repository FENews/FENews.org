---
title: "使用 JavaScript Set 提升你代码的性能"
date: "2019-03-14"
template: "post"
draft: false
category: "JavaScript"
translators: ["leyayun"]
tags:
  - "JavaScript"
  - "Set"
  - "翻译"
description: ""
---
我确信仍然有很多开发者在工作中一直仅仅使用 number、string、object、array 和 boolean 这些基础的全局对象。

它们确实能够满足你大多数的使用场景。但是如果你想使你的代码运行的更快和具有更好扩展性，这些基础类型就满足不了你的需求了。

这篇文章，我们将讨论如何通过 JavaScript 的 Set 使你的代码更快，特别是使它具有扩展性。数组和 Set 的功能存在大量交叉。但是使用 Set 可以带来数组所不具备的运行时优势。接下来，我们将探索这是如何实现的。

## Set 有什么不同之处？
最根本的区别是数组是一个索引集合。 这意味着数组中的数据值按索引排序。

```js
const arr = [A, B, C, D];
console.log(arr.indexOf(A)); // Result: 0
console.log(arr.indexOf(C)); // Result: 2
```

相比之下，Set 是键控集合。它使用键对数据进行排序，而不是索引。Set 集合的元素可以按照插入顺序进行迭代，而且它不包含任何重复的数据。换句话说，所有 Set 集合中的每一元素都必须不同。


## 它的主要好处是什么？

在直接比较中，Set 相对数组有一些优势，特别是它具有更快的运行时间：

1. **查找元素：** 在数组中使用 `indexOf()` 或 `includes()` 检查元素是否存在比较慢。
   
2. **删除元素：** 在 Set 中，你可以通过值删除一个元素。等价于在数组中，基于索引的 `splice()` 功能。正如前面的观点，依赖索引查找比较慢。
   
3. **插入元素：** 在 Set 中添加元素比在数组中通过 `push()`、`unshift()` 或其他同类操作要快。
   
4. **去重：** Set 对象仅能存储不同的值。如果你想避免存储重复的值，这会比数组具有更大的优势。在数组中你需要一些额外的代码来做去重。

记住：关于 Set 更全面的方法介绍，请阅读 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Methods)

## 时间复杂度对比
数组中用于搜索元素的方法具有 O(N) 的线性时间复杂度。换句话说，运行时间随着数据大小而增长。相对而言，Set 搜索、删除和插入元素的方法时间复杂度都为 O(1)，这意味着数据的大小几乎不影响这些方法的运行时间。

## Set 到底快了多少？
虽然运行时间可能会有很大差异，具体取决于所使用的系统、所提供数据的大小以及其他变量。但我希望我的测试结果能够让你真实地了解Set 的速度。我将分享三个简单的测试和我得到的结果。

### 测试准备
在进行测试前，我们先创建一个数组和一个 Set 集合，它们都包含一百万个元素。为了简单，我将使用 0 到 999999 。

```js
let arr = [], set = new Set(), n = 1000000;
for (let i = 0; i < n; i++) {
  arr.push(i);
  set.add(i);
}
```

### 测试 1: 搜索元素

首先，我们搜索一个已知存在的数字 `123123`。

```js
console.time('Array'); 
result = checkArr(arr, 123123); 
console.timeEnd('Array');
console.time('Set'); 
result = checkSet(set, 123123); 
console.timeEnd('Set');
```

1. Array: 0.173ms
   Set: 0.023ms
2. Set 比数组快了 7.54 倍。

### 测试 2: 添加元素

现在我们为每个集合添加一个元素

```js
console.time('Array'); 
arr.push(n);
console.timeEnd('Array');
console.time('Set'); 
set.add(n);
console.timeEnd('Set');
```

1. Array: 0.018ms
   Set: 0.003ms
2. Set 比数组快了 6.73 倍。

### 测试 3: 删除元素

最后，让我们从每个集合移除一个元素。因为没有内置的数组方法可以使用，所以我们创建一个 helper 函数来保持整洁：

```js
const deleteFromArr = (arr, item) => {
  let index = arr.indexOf(item);
  return index !== -1 && arr.splice(index, 1);
};
```

这儿是测试代码:

```js
console.time('Array'); 
deleteFromArr(arr, n);
console.timeEnd('Array');
console.time('Set'); 
set.delete(n);
console.timeEnd('Set');
```

1. Array: 1.122ms
   Set: 0.015ms
2. 在这个测试中，Set 比数组快了 74.13 倍。

总之，使用 Set 来代替数组我们可以看到显著的运行时间提升。现在让我们看一些集合可能有用的实际例子。

## 场景 1: 数组去重

如果你想快速的从数组中移除重复的值，你可以将它转化成 Set。这是目前最简洁的筛选不同值的方法：

```js
const duplicateCollection = ['A', 'B', 'B', 'C', 'D', 'B', 'C'];
// 如果你想将数组转化成 Set
let uniqueCollection = new Set(duplicateCollection);
console.log(uniqueCollection) // 结果: Set(4) {"A", "B", "C", "D"}
// 如果你仍然想保持使用数组存储数据
let uniqueCollection = [...new Set(duplicateCollection)];
console.log(uniqueCollection) // 结果: ["A", "B", "C", "D"]
```

## 场景 2: Google 面试题
在我的另外一篇文章中，我曾讨论过 Google 的一道面试题解决方法。面试要求使用 C++，但是如果在 JavaScript 中，Set 会成为最终的解决方案。

如果你想看更深的解决方案，可以[阅读之前的文章](https://medium.com/@bretcameron/4-ways-to-solve-a-google-interview-question-in-javascript-12e6eec87576)。这里是快速总结的解决方案。

### 问题
给定一个无序整数数组和一个值 `sum`，如果存在其中两个元素的之和等于 `sum`，返回 `true`。否则，返回 `false`。

So, if we were given the array [3, 5, 1, 4] and the value 9 , our function should return true , because 4 + 5 = 9 .

所以，如果我们给定一个数组 `[3, 5, 1, 4]` 和一个值 `9`，我们的函数需要返回 `true`，因为 `4 + 5 = 9`。

### 解决方案
解决这个问题一个好的方法是迭代整个数组，并将迭代到的元素的匹配值的添加到 Set 集合。

让我们将这种思路用到上面的例子中。当我们遇到 `3` 时，将 `6` 添加到 Set 集合中，因为我们知道我们要找的是和为 `9` 的另外一个元素。然后，每次我们迭代到数组中的一个新的元素，我们检查和它匹配的值是否在 Set 中。当我们迭代到 `5` 的时候，我们将将添加 `4` 到我们的 Set 集合中。接着，我们最终迭代到 `4`，我们将发现它的匹配值已经在我们的 Set 中，因此我们返回 `true`。

代码如下：

```js
const findSum = (arr, val) => {
  let searchValues = new Set();
  searchValues.add(val - arr[0]);
  for (let i = 1, length = arr.length; i < length; i++) {
    let searchVal = val - arr[i];
    if (searchValues.has(arr[i])) {
      return true;
    } else {
      searchValues.add(searchVal);
    }
  };
  return false;
};
```

这儿是更简洁的版本:

```js
const findSum = (arr, sum) =>
  arr.some((set => n => set.has(n) || !set.add(sum - n))(new Set));
```

Because `Set.prototype.has()` has a time complexity of just O(1), using a Set to store compliments rather than an array helps give our overall solution a linear run-time of O(N).

因为 `Set.prototype.has()` 的时间复杂度仅为 O(1) ，所以使用 `Set` 存储匹配值而不是数组，帮助我们整体解决方案达到线性运行时间 O(N)。

If we were instead dependent on `Array.prototype.indexOf()` or `Array.prototype.includes()` , both of which have a time complexity of O(N), overall run-time would be O(N²). Much slower!

如果我们依赖于 `Array.prototype.indexOf()` 或 `Array.prototype.includes()`，这两个方法的时间复杂度都为 O(N)，那么整体运行时间的时间复杂度为 O(N²)。慢太多了！

如果你之前没有深入了解过 JavaScript Set，希望我已经解释清除了它是多么有用！

原文：https://medium.com/@bretcameron/how-to-make-your-code-faster-using-javascript-sets-b432457a4a77