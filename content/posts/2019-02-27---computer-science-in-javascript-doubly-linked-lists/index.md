---
title: "JavaScript 中的计算机科学：双向链表"
date: "2019-02-27"
template: "post"
draft: false
slug: "/posts/computer-science-in-javascript-doubly-linked-lists/"
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

在我之前的文章中，讨论了在 JavaScript 中创建单链表（如果您还未读过之前那篇文章，我建议您先去阅读它）。单个链表由节点组成，每个节点都有一个指向列表中后一个节点的指针。单链表操作通常需要遍历整个链表，因此一般性能较差。提高性能的方法之一是在链表中每个节点上添加指向前一个节点的指针。每个节点有分别指向前一个节点和后一个节点的指针的链表称为双向链表。

### 双向链表的设计

与单向链表一样，双向链表也是由一系列节点组成。每一个节点包含数据域、指向后一个节点的指针以及指向前一个节点的指针。这里看一个在 JavaScript 中简单的表现：

```js
class DoublyLinkedListNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.previous = null;
    }
}
```

在 DoublyLinkedListNode 类中，data 属性包含链表项应存储的值，后一个属性是指向列表中后一项的指针，而前一个属性是指向列表中前一项的指针。后一个和前一个指针都以null开头，因为在实例化类时未知后一个和前一个节点。然后，您可以使用 DoublyLinkedListNode 类创建双向链表，如下所示：

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

同样与单向链表一样，双向链表中的第一个节点称之为头节点，通过标记前一个指针和后一个指针来确定第二个和第三个节点。下面这张图展示了生成的数据结构。

![双向链表数据结构](./images/Doubly-linked-list.png)

您可以按照每个节点上的后一个指针，以与单向链表相同的方式遍历双向链表，例如：

```js
let current = head;

while (current !== null) {
    console.log(current.data);
    current = current.next;
}
```

双向链表通常也跟踪链表中最后一个节点，这个节点被称作尾节点。尾节点更便于新节点的插入以及实现链表从后向前查询。为此，从尾节点开始直到没有更多的节点。以下代码将打印出反向遍历双向链表的每一个值：

```js
let current = tail;

while (current !== null) {
    console.log(current.data);
    current = current.previous;
}
```

双向链表相较于单向链表的优势在于可以前后转换从两个方向遍历。

### DoublyLinkedList 类

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

The DoublyLinkedList class represents a doubly linked list and will contain methods for interacting with the data it contains. There are two symbol properties, head and tail, to track the first and last nodes in the list, respectively. As with the singly linked list, the head and tail are not intended to be accessed from outside the class.

DoublyLinkedList 类表示双向链表，并包含与数据进行交互的方法。属性 `head` 和 `tail` 分别用于跟踪列表中的第一个和最后一个节点。与单链表一样，`head` 和 `tail` 不推荐在类外访问。

### 添加新数据到列表中

将元素添加到双向链表和添加到单向链表非常相似。在这两种数据结构中，您必须先找到列表中的最后一个节点，然后在其后面添加一个新节点。在单向链表中，您必须遍历整个列表以查找最后一个节点，而在双向链表中， 直接使用 `this[tail]` 属性跟踪最后一个节点。这是 DoublyLinkedList 类的 `add()` 方法：

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

双向链表的 `add()` 方法接受一个参数，即要插入列表的数据。如果列表为空（`this[head]` 和 `[tail]` 都为 null），则将新节点分配给 `this[head]`。如果列表不为空，则在当前 `this[tail]` 节点之后添加新节点。最后一步是将 `this[tail]` 设置为 `newNode `，因为在空列表和非空列表中，新节点始终是最后一个节点。

这里注意，在空列表的情况下，`this[head]` 和 `this[tail]` 为同一节点。因为单节点列表中的单个节点既是该列表中的第一个节点，也是最后一个节点。跟踪列表尾节点非常重要，这样必要时可以反向遍历列表。

双向链表 `add()` 方法的复杂性是O(1)。对于空列表和非空列表，该操作不需要任何遍历，因此较仅跟踪列表头节点的单向链表的 `add()` 就不那么复杂。

### 从列表中检索数据

双向链表的 `get()` 方法与单链表的 `get()` 方法完全相同。两种情况下，您必须从 `this[head]` 开始遍历列表，跟踪已查的节点直到找到相应的节点：

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

重申一下，对于单向链表，`get()` 方法的复杂性范围从移除第一个节点时的O(1)（不需要遍历）到移除最后一个节点时的O(n)（需要遍历整个列表）。

### 从双向链表中删除数据

从双向链表中删除数据的算法与单链表基本相同：首先遍历数据结构以找到需要删除的节点（与 `get()` 相同的算法），然后将其从列表中删除。与单向链表中使用的算法唯一明显的不同是：

   1、在循环中不需要追踪后一个节点去查找前一个节点，因为前一个节点始终可以通过 `current.previous` 使用。
  
   2、您需要监听列表中最后一个节点的是否更改，以确保 `this[tail]` 正确。

此外，双向链表 `remove()` 方法非常类似于单向链表：

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

当 index 为 0 时，表示正在删除第一个节点，`this[head]` 设置为 `this[head].next`，与单个链接列表相同。当你需要更新其他指针时，这时差异就会出现。列表中如果只有一个节点，则需要将 `this[tail]` 设置为 null 以有效的删除该节点；如果有多个节点，则需要将 `this[head].previous` 设置为 null。请记住，列表新的 head 是删除节点前列表中的第二个节点，所有它的前一个指针指向的是刚刚被删除的节点。

在循环之后，您需要确保删除节点之前的节点的下一个指针和删除节点之后的节点的前一个指针。当然，如果要删除的节点是最后一个节点，那么您需要更新 `this[tail]` 指针。

### 创建反向迭代器

您可以使用来自单向链表的相同的 `values()` 和 `Symbol.iterator` 方法在 JavaScript 中创建可迭代的双向链表。同时，在双向链表中，您还可以创建一个反向迭代器，它从 tail 开始向 head 生成数据。以下是一个 `reverse()` 方法的例子：

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

The reverse() generator method follows the same algorithm as the values() generator method in the singly linked list with the exception that current starts equal to this[tail] and the current.previous is followed until the there are no more nodes. Creating a reverse iterator is helpful for discovering bugs in the implementation as well as avoiding rearranging nodes just to access the data in a different order.

Other methods
Most other methods that don’t involve addition or removal of nodes follow the same algorithms as those in a singly linked list.

Using the class
Once complete, you can use the linked list implementation like this:

reverse（）生成器方法遵循与单链接列表中的values（）生成器方法相同的算法，除了当前开始等于此[tail]并且遵循current.previous直到没有更多节点。创建反向迭代器有助于发现实现中的错误，并避免重新排列节点只是为了以不同的顺序访问数据。

其他方法
大多数不涉及添加或删除节点的其他方法遵循与单链表中相同的算法。

使用课程
完成后，您可以使用链接列表实现，如下所示：

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

The full source code is available on GitHub at my Computer Science in JavaScript project.

完整的源代码可以在我的计算机科学JavaScript项目的GitHub上找到。

### 总结：
Doubly linked lists are similar to singly linked lists in that each node has a next pointer to the next node in the list. Each node also has a previous pointer to the previous node in the list, allowing you to move both backwards and forwards in the list easily. Doubly linked lists typically track both the first and last node in the list, and that makes adding a node into the list a O(1) operation instead of O(n) in a singly linked list.

双链表与单链表类似，每个节点都有一个指向列表中下一个节点的下一个指针。每个节点还有一个指向列表中上一个节点的前一个指针，允许您轻松地在列表中向后和向前移动。双向链表通常跟踪列表中的第一个和最后一个节点，并且这使得在单个链接列表中将节点添加到列表中是O（1）操作而不是O（n）

However, the complexity of other doubly linked list operations is the same as with a singly linked list because you always end up traversing most of the list. As such, doubly linked lists don’t offer any real advantage over the built-in JavaScript Array class for storing a collection of unrelated data (though related data, such as sibling DOM nodes in the browser) might be useful to represent in some kind of linked list.

但是，其他双向链表操作的复杂性与单链表相同，因为您总是最终遍历列表的大部分内容。因此，双链表没有提供任何真正的优势，比内置的JavaScript Array类存储一组不相关的数据（虽然相关数据，如浏览器中的兄弟DOM节点）可能有助于表示某种类型链表。

原文地址：[https://humanwhocodes.com/blog/2019/02/computer-science-in-javascript-doubly-linked-lists/](https://humanwhocodes.com/blog/2019/02/computer-science-in-javascript-doubly-linked-lists/)
