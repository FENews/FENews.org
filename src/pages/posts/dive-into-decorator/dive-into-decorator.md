---
title: "深入浅出 Javascript Decorators 和 AOP 编程"
date: "2019-04-17"
template: "post"
draft: false
category: "V8"
authors: ["rainjay"]
tags:
  - "JavaScript"
description: "编程的世界有许多套路，可以让我们的程序设计更加优雅。"
---

编程的世界有许多套路，可以让我们的程序设计更加优雅。

## Monkey patch

形象比喻一下，假如你的代码里有一个猴子对象，猴子走路，呲牙和叫等都跟你预期中的猴子行为一致。但是突然有一天你需要这个猴子会像鸭子一样叫，该怎么办？

映射到前端代码，最先能想到的就是你正常的业务代码，突然有一天产品经理告诉你需要加30个埋点，而且这些埋点的逻辑还很多，你不想这些非业务逻辑代码出现在业务代码中，该怎么办？

这里我先讲一个笑话：

> 为了测试美国、日本、中国三地警察的实力，联合国将三只兔子放在三个森林中，看三地警察谁先找出兔子。任务：找出兔子。美国和日本警察都兴师动众地在森林里找，结果都是到了晚上无功而返。最后是中国警察，先是玩了一天王者荣耀，黄昏时一个拿着一根警棍进入森林，没五分钟，听到森林里传来一阵动物的惨叫，中国警察抽着烟有说有笑的出来，后面拖着一只鼻青脸肿的熊，熊奄奄一息的用兔子的叫声说：“不要再打了，我就是兔子！”

我们在写代码的时候经常采用和这个笑话一样的套路。你代码里的一只熊，哪天被动态改了一个属性后就可能变成像熊一样走且像兔子一样跳的熊兔了。

JavaScript 这种动态语言天生有在运行时对属性进行动态替换或修改的能力，这就叫做猴子补丁。比如数组缺少一个有用的方法，你自己就可以增加它。

```js
Array.prototype.split = function(i) {
  return [ this.slice(0, i), this.slice(i) ]
}
```

你也可以修改原有属性，扩展功能。比如一个常见的需求：为了追求前端项目的稳定性，我们往往需要对运行时的代码进行监控并向服务器上报异常信息。浏览器中 Javascript 的运行时包含两种：

1. 浏览器加载并执行 JavaScript 代码。
2. 各种方式触发的回调执行，比如 `addEventListener`, `setTimeout`, `ajax/fetch`, `Promise` 等 WebAPI 触发或你自己实现的 EventEmitter 触发。
> 关于 JavaScript 运行时可以参考 loupe , It is amazing!

1 是 JavaScirpt 脚本里存在语法错误，比较容易被发现。问题基本都出在 2 中，我们可以通过 `window.onerror` 来获取错误信息，但这些错误信息不一定能够满足需求，所以会有人这样操作：

```js
var _setTimeout = window.setTimeout
window.setTimeout = function(cb, timeout) {
  var args = Array.prototype.slice.call(arguments, 2)
  return _setTimeout(function() {
    try {
      cb(...args)
    } catch (error) {
      // 对 error 进行加工后上报给服务器
      reportError(e)
      throw error
    }
  }, timeout)
}
```

更改后的 setTimeout 对于使用者来说并没有任何区别，但我们已经悄悄地扩展了 setTimeout 的功能。在JavaScript 的世界里 Decorator 和 AOP 编程都是基于这种可以动态修改原有属性的能力实现的。

## Higher Order Function

高阶函数接受一个或多个函数，并返回一个函数。我们经常用到的高阶函数有：once, debounce, memoize, fluent等，下面通过 fluent 来说明

```js
function fluent(fn) {
  return function(...args) {
    fn.apply(this, args)
    return this
  }
}

function Person() {}

Person.prototype.setName = fluent(function(first, last) {
  this.first = first
  this.last = last
})

Person.prototype.sayName = fluent(function() {
  console.log(this.first, this.last)
})

var person = new Person()

person
  .setName('Jone', 'Doe')
  .sayName()
  .setName('John', 'Doe')
  .sayName()
```

高阶函数和我们在上面 Monkey patch 中修改 `window.setTimout` 思路是一样的，或者说这就是我们标准非侵入地动态扩展属性的方法：在执行原有代码的基础上再扩展所需要的功能。上面提到的埋点问题，就可以通过这种方式做到悄悄地埋点，而不会影响任何主业务代码。

## Decorator pattern

Decorator模式：动态将职责附加到对象上。如果要扩展功能，装饰者提供了比继承更具弹性的代替方案。装饰者模式遵循了两个设计原则：

> 1. Favor composition over inheritance
> 1. The Open-Closed Principle: Classes should be open for extension, but closed for modification

装饰者模式的要点:

1. 装饰者和被装饰对象有相同的超类型。
1. 可以用一个或多个装饰者包装一个对象。
1. 装饰者可以在被装饰者所委托的行为之前或之后，加上自己的行为，以达到特定的目的。
1. 对象可以在任何时候被装饰，所以可以在运行时动态的，不限量的用你喜欢的装饰者来装饰对象。
1. 装饰模式的用意是保持接口并增加对象的职责。

下面看一个例子来说明：

```js
// What we're going to decorate
function MacBook() {
  this.cost = function () { return 997 }
  this.screenSize = function () { return 13.3 }
}

/* Decorator 1 */
function Memory(macbook) {
  var v = macbook.cost()
  macbook.cost = function() {
    return v + 75
  }
}
 /* Decorator 2 */
function Engraving( macbook ) {
   var v = macbook.cost()
   macbook.cost = function() {
     return  v + 200
  }
}

/* Decorator 3 */
function Insurance( macbook ) {
   var v = macbook.cost()
   macbook.cost = function() {
     return  v + 250
  }
}

var mb = new MacBook()
Memory(mb)
Engraving(mb)
Insurance(mb)
console.log(mb.cost()) //1522
console.log(mb.screenSize()) //13.3
```

在这个例子中：

1. MacBook 对象以及所有的 decorator 返回的对象都拥有共同的 cost 方法。
1. 上面例子中一共有三个 decorator, 如果有需要，可以继续增添任意数量的 Decorator 。
1. 每个 decorator 都会在执行所被委托的 cost 方法之后，加上自己的行为。
1. 我们最终并没有修改原有的 MacBook 的行为，基础 MacBook 的 cost 方法依旧会正常执行，添加内存、加雕刻并上了保险后我们每 decorate 一次就会增添对应的 cost 。

调用过程如下：

![调用图]()

> Decorator 模式和通过高阶函数里动态修改原有属性本质是一样的，都是在执行了被委托的行为的基础上加了自己的行为。高级函数被委托的行为是传入的函数，Decorator 被委托的行为是被包装对象里相同名字的函数。

在我们日常开发过程中，Decorator 模式常见的使用场景有：logging, Add Burying Point, Apply Formatting, Apply Permission Checks, Form validating, Block Overriding of methods, Timing Functions, Rate-Limiting 和任何你不想放在核心业务代码中的行为。

## JavaScript Decorators

JavaScript Decorators 和高阶函数并没有什么区别，只是提供了一种更优雅的方式，举个例子：

```js
@log()
class Example {
  @time('tag')
  @readonly
  doSomething() {}
}
```

上面的例子中有两种类型的 Decorator: Class decorators 和 Class property decorators, 其中：

- `@log` 是 Class decorator, 可以记录每一次对 Example 类的 access 。
- `@time` 是 Class property decorator, 可以记录 doSomething 方法执行需要的时间并打上一个唯一的 tag 。
- `@readonly` 是 Class property decorator, 用来将 doSomething 设置为只读属性。

你只需要将以 `@` 为前缀的符号置于被装饰的代码之前即可。这些 decorator 方法在运行时有能力按照需求动态修改原有属性，不会侵入核心代码，且可读性非常高，非常优雅！下面是这些 decorator 的实现：

```js
function log(Class) {
  return (...args) => {
    console.log(args)
    return new Class(...args)
  }
}

function time(target, name, descriptor) {
  const fn = descriptor.value
  if (typeof fn === 'function') {
    descriptor.value = function(...args) {
      console.log(`Time begin: ${new Date()}`)
      var result = fn.apply(this, args)
      console.log(`Time end: ${new Date()}`)
      return result
    }
  }
  return descriptor
}

// time with unique tag
function time(tag) {
  return function (target, name, descriptor) {
    const fn = descriptor.value
    if (typeof fn === 'function') {
      descriptor.value = function(...args) {
        console.log(`${tag} time begin: ${new Date()}`)
        var result = fn.apply(this, args)
        console.log(`${tag} time end: ${new Date()}`)
        return result
      }
    }
    return descriptor
  }
}

function readonly(target, name, descriptor) {
  descriptor.writable = false
  return descriptor
}
```

## Class property decorators

Property decorators 应用于 class 中一个成员，无论成员是 properties, methods, getters 还是 setters。这种 decorator 函数有三个参数：

- target - 被 decorate 成员所在的类。
- name – 被 decorate 成员的名字。
- descriptor - 被 decorate 成员的 descriptor, 这里的 descriptor 其实就是传给 `Object.defineProperty` 的那个 descriptor

可以修改 descriptor 意味着我们有能力修改一个属性的一切，然后将修改后的 descriptor 返回即可。 readonly 通过将 descriptor 的 writable 设为 false 从而将属性设置为只读。 time 将原有的行为 (descriptor.value) 包在自己的函数里执行，并在执行前后记录了时间，从而悄悄地扩展了原有函数的功能，且不影响原有函数的正常使用。

## Class decorators

Class decorators 的参数只有一个，就是当前被装饰的类，返回一个新的构造函数来替换原来的类。Class decorators 用的并不是很多，上文中的 `@log` 使用的效果如下：

```js
@log
class Example {
  constructor(name, age) {
  }
}

const e = new Example('Graham', 34);
// [ 'Graham', 34 ]
console.log(e);
// Example {}
```

下面我们用 decorator 来改写高阶函数中的 fluent

```js
// @decorator
function decorate(target, name, descriptor) {
  var fn = descriptor.value
  if (typeof fn === 'function') {
    var fn = descriptor.value
    descriptor.value = function(...args) {
      fn.apply(this, args)
      return this
    }
  }
  return descriptor
}

class Person {
  @decorate
  setName(first, last) {
    this.first = first
    this.last = last
  }

  @decorate
  sayName() {
    console.log(this.first, this.last)
  }
}

var person = new Person()
person
  .setName('Jone', 'Doe')
  .sayName()
  .setName('John', 'Doe')
  .sayName()
```

> 补充一点，如果有多个 decorators 按照从上到下的顺序同时作用的话，实际执行过程也是按照从上到下顺序执行的。

## AOP

AOP(Aspect-Oriented Programming)：面向切面的编程，是对面向对象编程（OOP）的补充。面向对象是纵向编程，继承、封装和多态，而面向切面编程通过提供另外一种思考程序结构的途径来补充面向对象的不足。在OOP中模块化的关键单元是类（class），而在AOP中模块化的单元则是切面，切面能对关注点进行模块化扩展

通俗地讲，就是上文中我们做的事情都属于切面的横向扩展。一次表单提交，有正常的业务提交过程，但我们想在这个提交过程的横向加一个表单验证。或者一个正常的业务中，我们希望横向添加一些埋点功能，同时再横向添加运行时错误信息收集的功能，同时还能够验证一下是否有操作权限等，这些都是面向切面编程

面向切面编程是 Separation of concerns, Favor composition over inheritance 和 The Open-Closed Principle 等设计原则的良好实践，是我们在编写代码的过程经常要用到的一种开发技术。如果你遇到了需要从外部增加一些行为，进而合并或修改既有行为，或者把业务逻辑代码和处理琐碎事务的代码分离开，以便能够分离复杂度等的业务场景，请一定要用好这种编程设计思想

现在，你可以使用 JavaScript Decorators 来更优雅地实践AOP编程，还有什么理由不行动起来呢？

最后，用 JavaScript Decorators 实现一个我们开发经常要用到的表单验证过程，真实的业务场景会比这里复杂许多，但这些代码用来解释并加深你对 AOP 编程的理解已经足够了。

```js
var validateRules = {
  expectNumber(value) {
    return Object.prototype.toString.call(value) === '[object Number]'
  },
  maxLength(value) {
    return value <= 30
  }
}

function validate(value) {
  return Object.keys(validateRules)
    .every(key => validateRules[key](value))
}

function enableValidate(target, name, descriptor) {
  const fn = descriptor.value
  if (typeof fn === 'function') {
    descriptor.value = function(value) {
      return validate(value)
        ? fn.apply(this, [value])
        : console.error('Form validate failed!')
    }
  }
  return descriptor
}

class Form {
  @enableValidate
  send(value) {
    console.log('This is send action', value)
  }
}

var form = new Form()
form.send(44) // "Form validate failed!"
form.send('12') // "Form validate failed!"
form.send(12)  // "This is send action" 12
```

