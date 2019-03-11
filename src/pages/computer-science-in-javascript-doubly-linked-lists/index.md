---
title: "JavaScript 中的计算机科学：双向链表"
date: "2019-02-28"
template: "post"
draft: false
category: "JavaScript"
tags:
  - "计算机科学"
  - "数据结构"
  - "JavaScript"
  - "链表"
  - "编程"
  - "翻译"
description: "在 Javascript 中实现双向链表。"
---

在我之前的一篇 [文章](https://humanwhocodes.com/blog/2019/01/computer-science-in-javascript-linked-list/) 中，讨论了在 JavaScript 中创建单向链表（如果您还未读过之前那篇文章，我建议您先去阅读一下）。单向链表由节点组成，每个节点都有一个指向列表中后一个节点的指针。单向链表的操作通常需要遍历整个列表，所以性能一般较差。而在链表中每个节点上添加指向前一个节点的指针可以提高其性能。每个节点有分别指向前一个节点和后一个节点的指针的链表就称为双向链表。

### 双向链表的设计

与单向链表一样，双向链表也是由一系列节点组成。每一个节点包含数据域、指向后一个节点的指针以及指向前一个节点的指针。这里看一个在 JavaScript 中简单应用的例子：

```js
class DoublyLinkedListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.previous = null;
    }
}
```

在 `DoublyLinkedListNode` 类中，属性 `data` 包含链表项存储的值，属性 `next` 是指向列表中后一项的指针，而属性 `previous` 是指向列表中前一项的指针。`next` 和 `previous` 指针初始都为 `null` ，因为在类实例化时后一个节点和前一个节点都还未知。您可以像下面这样使用 `DoublyLinkedListNode` 类创建双向链表：

```js
// create the first node
const head = new DoublyLinkedListNode(12);

// add a second node
const secondNode = new DoublyLinkedListNode(99);
head.next = secondNode;
secondNode.previous = head;

// add a third node
const thirdNode = new DoublyLinkedListNode(37);
secondNode.next = thirdNode;
thirdNode.previous = secondNode;

const tail = thirdNode;

```

同样与单向链表一样，双向链表中的第一个节点称为头节点，然后分别给后面的第二个和第三个节点设置 `next` 和 `previous` 。这样就生成了如下图所示的数据结构：

![双向链表数据结构](./images/Doubly-linked-list.png)

您可以访问每个节点上的 `next` ，以与单向链表相同的方式遍历双向链表，例如：

```js
let current = head;

while (current !== null) {
    console.log(current.data);
    current = current.next;
}
```

双向链表通常也跟踪列表中最后一个节点，这个节点被称作尾节点。尾节点更便于新节点的插入以及从尾节点开始访问 `previous` 来实现链表逆向查找。执行下面的代码，控制台依次输出双向链表反向遍历之后的每一个值：

```js
let current = tail;

while (current !== null) {
    console.log(current.data);
    current = current.previous;
}
```

双向链表相较于单向链表的一个优势在于可以双向遍历列表。

## DoublyLinkedList 类

与单链表一样，双向链表中节点的操作最好封装在一个类中。这里有一个简单的例子：

```js
const head = Symbol("head");
const tail = Symbol("tail");

class DoublyLinkedList {
    constructor() {
        this[head] = null;
        this[tail] = null;
    }
}
```

双向链表 `DoublyLinkedList` 类包含与链表中数据进行交互的方法。属性 `head` 和 `tail` 分别用于定位列表中的第一个和最后一个节点。与单链表一样，`head` 和 `tail` 不推荐在类外访问。

### 双向链表中数据的添加

将元素添加到双向链表和添加到单向链表非常类似。在这两种数据结构中，都需要先找到列表中最后一个节点，然后在其后面添加一个新节点。在单向链表中，必须要遍历整个列表以定位最后一个节点，而在双向链表中，直接使用 `this[tail]` 定位最后一个节点。以下是 `DoublyLinkedList` 类的 `add()` 方法：

```js
class DoublyLinkedList {

    constructor() {
        this[head] = null;
        this[tail] = null;
    }

    add(data) {

        // create the new node and place the data in it
        const newNode = new DoublyLinkedListNode(data);

        // special case: no nodes in the list yet
        if (this[head] === null) {
            this[head] = newNode;
        } else {

            // link the current tail and new tail
            this[tail].next = newNode;
            newNode.previous = this[tail];
        }

        // reassign the tail to be the new node
        this[tail] = newNode;
    }

}
```

双向链表的 `add()` 方法接受一个参数，即要插入列表的数据。如果列表为空（`this[head]` 和 `[tail]` 都为 `null`），则将新节点赋值给 `this[head]`。如果列表不为空，则在 `this[tail]` 节点之后添加新节点。最后一步设置 `this[tail]` 为 `newNode`，因为在空列表和非空列表中，新节点都是最后一个节点。

需要注意的是，在空列表的情况下，`this[head]` 和 `this[tail]` 为同一节点。因为在只有一个节点的列表中，该节点既是列表的第一个节点，也是最后一个节点。定位列表尾节点非常重要，这样必要时可以反向遍历列表。

双向链表 `add()` 方法的复杂性是O(1)。对于空列表和非空列表，该操作都不需要任何遍历，因此它比单向链表的 `add()` 简单很多。

### 双向链表中数据的查找

双向链表的 `get()` 方法与单链表的 `get()` 方法完全相同。两种情况下，都必须从 `this[head]` 开始遍历列表定位目标节点：

```js
class DoublyLinkedList {

    // other methods hidden for clarity

    get(index) {

        // ensure `index` is a positive value
        if (index > -1) {

            // the pointer to use for traversal
            let current = this[head];

            // used to keep track of where in the list you are
            let i = 0;

            // traverse the list until you reach either the end or the index
            while ((current !== null) && (i < index)) {
                current = current.next;
                i++;
            }

            // return the data if `current` isn't null
            return current !== null ? current.data : undefined;
        } else {
            return undefined;
        }
    }

}
```

强调一下，对于单向链表，`get()` 方法的复杂性范围从排除第一个节点时的O(1)（无需遍历列表）到排除最后一个节点时的O(n)（需遍历整个列表）。

### 双向链表中数据的删除

从双向链表中删除数据与单链表基本相同：首先遍历列表找到需要删除的节点（与 `get()` 相同），然后将其从列表中删除。它与单向链表的不同点：

   1、在循环中不需要先定位后一个节点去查找前一个节点，前一个节点可以通过 `current.previous` 获取。
  
   2、需要监听列表中最后一个节点是否变化，以确保 `this[tail]` 正确。

因此，双向链表 `remove()` 方法与单向链表看起来非常类似：

```js
class DoublyLinkedList {

    // other methods hidden for clarity

    remove(index) {

        // special cases: no nodes in the list or `index` is negative
        if ((this[head] === null) || (index < 0)) {
            throw new RangeError(`Index ${index} does not exist in the list.`);
        }

        // special case: removing the first node
        if (index === 0) {

            // store the data from the current head
            const data = this[head].data;

            // just replace the head with the next node in the list
            this[head] = this[head].next;

            // special case: there was only one node, so also reset `this[tail]`
            if (this[head] === null) {
                this[tail] = null;
            } else {
                this[head].previous = null;
            }

            // return the data at the previous head of the list
            return data;
        }

        // pointer use to traverse the list
        let current = this[head];

        // used to track how deep into the list you are
        let i = 0;

        // same loop as in `get()`
        while ((current !== null) && (i < index)) {

            // traverse to the next node
            current = current.next;

            // increment the count
            i++;
        }

        // if node was found, remove it
        if (current !== null) {

            // skip over the node to remove
            current.previous.next = current.next;

            // special case: this is the last node so reset `this[tail]`.
            if (this[tail] === current) {
                this[tail] = current.previous;
            } else {
                current.next.previous = current.previous;
            }

            // return the value that was just removed from the list
            return current.data;
        }

        // if node wasn't found, throw an error
        throw new RangeError(`Index ${index} does not exist in the list.`);
    }

}
```

当 index 为 0 时，意味着第一个节点将要被删除，与单向链表一样把 `this[head]` 设置为 `this[head].next`。当你需要更新其他指针时，这时差异就会出现。列表中如果只有一个节点，则需要将 `this[tail]` 设置为 null 以确保删除该节点；如果有多个节点，则将 `this[head].previous` 设置为 null。注意，列表新的 head 是删除节点前列表中的第二个节点，所以它的 `previous` 指向刚刚被删除的节点。

在循环之后，您需要确保被删除节点的前一个节点的 `next` 指针和后一个节点的 `previous` 指针。当然，如果要删除的节点是最后一个节点，那么您需要更新 `this[tail]` 指针。

### 创建反向迭代器

您可以使用与单向链表中相同的 `values()` 和 `Symbol.iterator` 方法在 JavaScript 中创建可迭代的双向链表。同时，在双向链表中，您还可以创建一个反向迭代器，它从 tail 开始向 head 生成数据。以下是一个 `reverse()` 生成器方法的例子：

```js
class DoublyLinkedList {

    // other methods hidden for clarity

    *reverse(){

        // start by looking at the tail
        let current = this[tail];

        // follow the previous links to the head
        while (current !== null) {
            yield current.data;
            current = current.previous;
        }
    }
}
```

双向链表 `reverse()` 生成器方法遵循与单链接列表中的 `values()` 生成器方法相同的算法，除了 `current` 从 `this[tail]` 开始以 `current.previous` 查询直到没有更多节点。创建反向迭代器有助于发现问题和避免为了以不同的顺序访问数据而重新排列节点。

### 其他方法

大多数不涉及添加或删除节点的其他方法与单向链表相同。

### 使用类

您可以使用类实现链表，如下所示：

```js
const list = new DoublyLinkedList();
list.add("red");
list.add("orange");
list.add("yellow");

// get the second item in the list
console.log(list.get(1));       // "orange"

// print out all items in reverse
for (const color of list.reverse()) {
    console.log(color);
}

// remove the second item in the list
console.log(list.remove(1));    // "orange"

// get the new first item in the list
console.log(list.get(1));       // "yellow"

// convert to an array
const array1 = [...list.values()];
const array2 = [...list];
const array3 = [...list.reverse()];
```

完整的源代码可以在我 GitHub 上的项目 [Computer Science in JavaScript](https://github.com/humanwhocodes/computer-science-in-javascript) 找到。

## 总结：

双向链表中每个节点包含一个跟单向链表一样指向后一个节点的 `next` 指针。还包含一个指向前一个节点的 `previous` 指针便于逆向查找。双向链表中添加一个节点的复杂度从O(n)简化到O(1)。

但是，双向链表其他操作的复杂性与单链表相同，基本都需要遍历列表中很多节点。因此，在存储一些毫无关联的数据（即使是有关联的数据，比如浏览器中的 DOM 节点）上，双向链表并不比内置的 JavaScript `Array` 储存性能好。这些数据可能用另外一种列表形式存储性能更好。

原文地址：[https://humanwhocodes.com/blog/2019/02/computer-science-in-javascript-doubly-linked-lists/](https://humanwhocodes.com/blog/2019/02/computer-science-in-javascript-doubly-linked-lists/)

