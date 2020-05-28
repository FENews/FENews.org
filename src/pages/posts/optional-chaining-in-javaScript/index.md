---
title: "JavaScript 中的可选链运算符"
date: "2020-05-28"
template: "post"
draft: false
category: "JavaScript"
translators: ["may"]
tags:
  - "JavaScript"
  - "翻译"
description: "可选链运算符 ?. 可以按照操作符之前的属性是否有效，链式读取对象的属性或者使整个对象链返回 undefined"
---

![image](images/optional-chaining-javascript.jpg)

在 ES2020 之前，如果要访问 JavaScript 中对象的嵌套属性，则必须在每个级别检查是否为 null 或 undefined，否则最终将会抛出 TypeError。

为了避免出现 TypeError，我们将不得不创建临时变量或执行一系列增量 && 调用，这看起来很丑陋，并且同时占用了空间和时间。

例如：

```js
const obj = {
  prop: {
    a: "value"
 }
}

// before ES2020 - no checks
obj.foo.a  // TypeError: Cannot read property 'a' of undefined

// before ES2020 - incremental nested checks
obj.foo && obj.foo.b   // undefined
```

在ES2020中，通过可选链运算符 `?.` ，现在我们就可以内联进行这些检查了。

### 可选链运算符的基本用法

可选链运算符的语法很简单，只需在下一个访问 `.` 之前添加一个 `?` 即可。

引用我们之前的示例，这是使用可选链运算符之后的操作：

```js
const obj = {
  prop: {
    a: "value"
 }
}

// Optional Chaining
obj.foo?.a      // undefined
```

如你所见，如果表达式返回 null 或 undefined，则可选链运算符的左侧将始终返回 undefined。

### 原理

那么，可选链运算符实际上发生了什么？我使用 [Babel REPL](https://babeljs.io/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=FAYw9gdgzgLgBGARgKzgXjgbwL7CcgOgDMwwB-AgQyA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2%2Cstage-3%2Cenv&prettier=false&targets=&version=7.9.6&externalPlugins=) 检查了转换后的代码。

让我们来弄清楚引擎下到底发生了什么。

使用此输入：

```js
const obj = {}
obj.foo?.a
```

我们会得到以下输出：

```js
var _obj$foo;

const obj = {};
(_obj$foo = obj.foo) === null || _obj$foo === void 0 ? void 0 : _obj$foo.a;
```

让我们用 undefined 替换 void 0 位，并清理变量名。然后，我们获得了更具可读性的代码段。

Babel 创建一个指向对象键的临时变量，将其与 null 和 undefined 进行比较，如果所有这些测试均通过，则最终返回结果值。

```js
var foo;

const obj = {};
(foo = obj.foo) === null || foo === undefined ? undefined : foo.a;
```

以下是可选链运算符的其他用例：

### 方法和数组

可选链运算符适用于方法和数组以及静态属性，语法几乎相同。只要记住地方`.`之前使用`?`，但在调用数组或函数之前，语法如下所示：`obj.foo?.()` 或 `obj.array?.[x]`

下面是一个例子：

```js
const obj = {
  list: [1,2,3],
  func: () => console.log('Hi'),
}

// before ES2020 - no checks
obj.bar[1]  // TypeError: Cannot read property '1' of undefined
obj.baz()   // TypeError: obj.baz is not a function

// before ES2020 - incremental nested checks
obj.bar && obj.bar[1]  // undefined
obj.baz && obj.baz()   // undefined

// Optional Chaining
obj.bar?.[1]  // undefined
obj.baz?.()   // undefined
```

### 有关顶级访问权限的重要说明

使用可选链运算符时必须知道**顶级对象必须存在**，这一点很重要！也就是说，在我们之前的案例中，obj 本身必须实际存在，然后才能在可选链中向前看。

例如，下面的代码将引发错误。请注意，在我们的上下文中不存在 doesnNotExist。因此，即使使用可选链运算符，我们也会出现错误。

```js
doesnNotExist?.property // ReferenceError: doesnNotExist is not defined
```

现在，如果实际实例化了该变量，则即使当前为 null，undefined 或类型错误（例如数字等），也算是合法的。请参考以下示例：

```js
const a = null;
a?.property  // undefined

// As long as the first item is not undefined or null we're in good shape
const d = 24;
d.wut?.();   // undefined

```

最后，如果父级为 null 或 undefined，则需要第二个可选链来防止类型错误，请参考以下示例：

```js
// function call
const b = null;
b.func?.()       // TypeError: Cannot read property 'func' of null
// Notice the ?. after b
// If we add an additional optional chain we can safegaurd against b being null
b?.func?.()      // undefined

// array use
// Same thing, we can safegaurd against b being undefined using the first ?.
const c = undefined;
c.array?.[100]   // TypeError: Cannot read property 'array' of undefined
c?.array?.[100]  // undefined

```

根据上述逻辑，我的建议是：当你在顶层对象上调用方法或数组时总是添加一个额外的`?`。总而言之：

```js
// good idea
topLevel?.func?.()
topLevel?.arr?.[1]

// potentially could throw an error if topLevel is null or undefined
topLevel.func?.()
topLevel.arr?.[1]
```

### 短链

假设你的查询没有返回 undefined，但是你想检测其他代码。你可以在同一表达式中完成所有操作，这是一个短链的例子：

```js
const data = {
 list: [1,2,3]
}

// Short Circuiting
data.list?.reverse()       // [3, 2, 1]
data.items?.reverse()      // undefined
```

### 长链

很棒的是，你可以嵌套长链的可选链，非常适合深层嵌套的对象。在这种情况下，嵌套可选链运算符如下所示：

```js
obj?.parent?.child?.name // undefined
```

### 堆码

你可以根据需要堆叠和链接任意数量的可选链。

```js
one?.two?.[2].three?.(3)?.four
```

### 不支持的操作

不要去尝试对所有事物进行可选链接！是的，虽然很酷，但并不是所有在 ECMA 下的东西都可以选择链接在一起。基本上，只需记住 3 种受支持的操作：属性访问器，数组和函数调用。

以下是可选链接中不支持的操作列表：

```js
// Delete
delete a.?b   // ReferenceError: Can't find variable: a

// Constructor
new a?.()     // SyntaxError: Cannot call constructor in an optional chain.

// Template literals
a?.`string`   // SyntaxError: Cannot use tagged templates in an optional chain.

// Property assignment
a?.b = c      // SyntaxError: Left side of assignment is not a reference.

// Imports, Exports, Super, etc. etc.

```

### 可选链运算符在实际中的示例

那么，可选链运算符在实际中有什么帮助呢？

尽管这些都是琐碎的示例，但在 JavaScript 中这种情况经常发生，在 Web 浏览器的情况下甚至更多：表单值，DOM 对象属性，API 结果，对象方法，列表等等。访问嵌套属性时，我们必须始终加以保护。

这是一个更真实的例子：假设你的 API 正在返回客户数据。数据可能存在或可能不存在，并且可能包含或可能不包含 orders 数组，但是如果你要在列表中呈现这些项目。
 
在可选链运算符出现之前，你可能会执行以下操作：

```js
if (customer && customer.orders) {
 customer.orders.map(order => printOrder(order))
}
```

现在，你可以在进行其他工作之前，先检查 API 响应返回的对象。

```js
customer?.orders?.map(order => printOrder(order))
```

你可以使用可选链运算符来检查 DOM 元素或 React 组件的存在，然后再访问它们的属性或调用它们的方法。

例如，假设你想在 React 组件中的 prop 上运行回调方法，但不能保证会提供它。现在，只需要在调用回调方法之前加上 `?.` 即可。

```js
props.onClick?.()
```

这是另一个琐碎的例子：假设你要向窗口对象添加事件侦听器，但你不能保证窗口对象是否存在，也许你正在执行服务器端渲染，并且可能在节点中。

```js
window?.addEventlistener.('click', () => {});
```

假设你要在某些元素上设置属性，但不确定它们是否存在，只需使用可选链运算符。

```js
document?.querySelector('[data-foo]')?.setAttribute('disabled', 'true');
```

或者，也许你正在尝试访问所有浏览器尚不支持的实验性 API。假设你要使用 replaceAll 数组方法，该方法目前仅在 Safari 中受支持，使用可选链接可以避免错误。

```js
"pool".replaceAll?.("o", "e") // undefined  or  peel
```

### 开始在项目中使用可选链运算符

大多数现代浏览器已支持可选链接，为了安全并向后兼容，请使用转换器。如果你使用的是 Babel，请安装 OC 插件...

```js
npm install @babel/plugin-proposal-optional-chaining
```

并将其添加到你的 `.babelrc` 文件中：

```js
{
  "plugins": [
    "@babel/plugin-proposal-optional-chaining",
 ]
}
```

### 阅读有关可选链运算符的更多信息

由于可选链现在处于第 4 阶段，因此可以在 [ECMAScript](https://tc39.es/proposal-optional-chaining/) 上查看其文档。另外，请查看有关可选链运算符的最终 [TC39提案](https://github.com/tc39/proposal-optional-chaining) 和 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) 上有关可选链运算符的文档，以了解更多详细信息。

原文链接：[https://seifi.org/javascript/optional-chaining-in-javascript.html](https://seifi.org/javascript/optional-chaining-in-javascript.html)
