---
title: "ES6 箭头函数适用场景"
date: "2019-03-24"
template: "post"
draft: false
category: "JavaScript"
translators: ["hearingguo"]
tags:
  - "JavaScript"
  - "ES6"
  - "翻译"
description: "箭头函数（也称作“胖箭头函数”）无疑是 ES6 最流行的特性之一。他们引入了一种编写具体函数的新方式。"
---

![Photo by Cynthia Lee on Medium](./images/1_GRUP3Ml4piJhZQ8EOHkFDA.jpeg)

箭头函数（也称作“胖箭头函数”）无疑是 ES6 最流行的特性之一。他们引入了一种编写具体函数的新方式。

ES5 语法示例：

```js
function timesTwo(params) {
  return params * 2
}
timesTwo(4);  // 8
```

而 ES6 箭头函数示例：

```js
var timesTwo = params => params * 2
timesTwo(4);  // 8
```

后者看起来简洁很多！我们可以省略花括号而直接隐式的返回结果（但是只是在没有块体的情况下）。

理解箭头函数与常规 ES5 函数的不同表现很重要。

## 变化

![variations](./images/1_7mBpxeXkeSb-719jjHvgXA.jpeg)Variety is the spice of life

值得注意的是，箭头函数中可用的语法形式很多。例举一些常见的：

### **1. 无参数**

如果函数没有参数，那么在 `=>` 前放一个空括号即可。

```js
() => 42
```

实际上，你甚至不需要括号！

```js
_ => 42
```

### **2. 单参数**

单参数情况，括号是可选的：

```js
x => 42 || (x) => 42
```

### **3. 多参数**

多参数情况，括号是必须的：

```js
(x, y) => 42
```

### **4. 声明（与表达式对应）**

在最基本的表现形式中，函数表达式生成值，而函数声明执行操作。

箭头函数中，声明需要花括号包裹并且需要写 return。

下面是一个带有 if 语句的箭头函数栗子：

```js
var feedTheCat = (cat) => {
  if (cat === 'hungry') {
    return 'Feed the cat';
  } else {
    return 'Do not feed the cat';
  }
}
```

### **5、“块主体”**

如果函数在块主体中，那么必须使用显式的 `return` 语句：

```js
var addValues = (x, y) => {
  return x + y
}
```

### **6、对象字面量**

如果函数返回一个对象字面量，那么它需要用括号包裹，强制解释器执行内部代码，然后返回。

```js
x =>({ y: x })
```

## 匿名

![syntactically anonymous](./images/1__4a_Zan4-WX7vh7G0XQZjw.jpeg)

箭头函数都是匿名的，那么意味着箭头函数都没有名称。

### **匿名会带来一些问题：**

**1、很难调试**
当程序出错时，无法追踪匿名的函数或者具体出错行数。

**2、不能自我调用**
如果函数需要在任何地方进行自我调用，比如，递归、事件绑定再解绑，这些情况就不能使用箭头函数。

## 主要优点：无需绑定 ‘this’

![Photo by davide ragusa on Unsplash](./images/0_H1ltbktHxMkmFDdK.jpeg)

在经典函数表达式中，`this` 关键字根据函数被调用的上下文绑定到不同的值。但是箭头函数需要通过语法绑定，这意味着箭头函数内部会使用包含函数代码的外部 `this`。

来看一个关于 setTimeout ES5 写法的栗子：

```js
// ES5
var obj = {
  id: 42,
  counter: function counter() {
    setTimeout(function() {
      console.log(this.id);
    }.bind(this), 1000);
  }
};
````

在上面 ES5 的例子中，`.bind(this)` 将上下文的 `this` 传递给函数内部。否则，默认为 undefined。

```js
// ES6
var obj = {
  id: 42,
  counter: function counter() {
    setTimeout(() => {
      console.log(this.id);
    }, 1000);
  }
};
```

ES6 箭头函数不能绑定 `this` 关键字，所以向上查找，然后使用已经定义 `this` 的作用域。

## 不适用场景

对箭头函数有一定的了解之后，希望你能理解它们为何不能完全替代普通函数。

这里列出一些不适用它们的场景：

1、Object methods

### **1、对象中的方法**

当调用 `cat.jumps` 时，`lives` 并没有递减。因为 `this` 没有绑定值，而继承父级作用域。

```js
var cat = {
  lives: 9,
  jumps: () => {
    this.lives--;
  }
}
```

### **2、带有动态上下文的回调函数**

如果上下文是动态的，那么这时箭头函数就不是一个正确的选择了。看一个事件捕获的例子：

```js
var button = document.getElementById('press');
button.addEventListener('click', () => {
  this.classList.toggle('on');
});
```

点击按钮，将会报 `TypeError` 的错误。因为 `this` 并没有绑定到 `button`，而是父级作用域。

### **3、当箭头函数影响到代码的可读性时**

之前提到的很多语法值得尝试的。普通函数我们可以知道预期返回。但是对于箭头函数却很难从代码上解读接结果。

## 适用场景

在任何需要绑定 `this` 至当前上下文，而不是函数本身时，箭头函数十分适用。

尽管箭头函数是匿名的，我依然喜欢在 `map` 和 `reduce` 中使用，它使得代码可读性更高，我认为，优点胜于缺点。

感谢阅读我的文章，如果你喜欢请鼓掌，并阅读我的其他文章，如
 [How I built my Pomodoro Clock app, and the lessons I leHow I built my Pomodoro Clock app, arned along the way](https://medium.freecodecamp.org/how-i-built-my-pomodoro-clock-app-and-the-lessons-i-learned-along-the-way-51288983f5ee), and [Let’s demystify JavaScript’s ‘new’ keyword](https://medium.freecodecamp.org/demystifying-javascripts-new-keyword-874df126184c).

原文地址：[https://medium.freecodecamp.org/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26](https://medium.freecodecamp.org/when-and-why-you-should-use-es6-arrow-functions-and-when-you-shouldnt-3d851d7f0b26)