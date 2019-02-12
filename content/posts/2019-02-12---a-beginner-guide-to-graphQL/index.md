---
title: "「译」GraphQL入门指南"
date: "2019-02-12"
template: "post"
draft: false
slug: "/posts/a-beginner-guide-to-graphQL/"
category: "GraphQL"
tags:
  - "GraphQL"
  - "翻译"
description: "GraphQL是Facebook开发的一种开源查询语言。它为我们提供了一种更有效的方法来设计、创建和使用我们的API，可以说它是REST的替代品"
---

![graphQL](./images/01.jpeg)

现如今最常讨论的技术之一便是API，但是很多人并不知道什么是API，简单的来说，API代表应用程序编程接口（Application Programming Interface）。顾名思义，就是为开发者、用户、消费者提供数据交互的接口。

你可以将API视为调酒师，你向调酒师请求一杯酒，然后他为你调出你想要的酒。这看似非常简单，但是为什么会存在问题呢？

现代网络发展以来，构建API并不像听起来那么难，但是学习和理解API却不是一件简单的事。很多开发者会使用API来构建某些内容，或者仅仅是使用数据。因此，API应该尽可能简洁，直观。经过精心设计的API会非常易于学习和使用，同时也会很直观，所以在开始设计API时一定要记住这点。

一直以来我们都在使用REST来构建API，随之也带来了一些问题。使用REST来设计构建API时，你将会面临以下问题：

* 你需要访问很多资源路径
* 不易于开发者学习和理解API
* 存在信息过度或不足的问题

为了解决这些问题，Facebook创建了GraphQL。现如今，我认为GraphQL是构建API的最佳方式，本文将会告诉你为什么我们现在需要学习GraphQL。

通过这篇文章，你将学习到GraphQL的工作原理，同时我将向你展示如何使用GraphQL创建设计良好、高效以及功能强大的API。

在这之前你可能已经听过GraphQL，因为有很多人和很多公司已经在使用GraphQL。GraphQL是开源的，因此它的社区已经变得非常强大。

那么现在，是时候开始在实践中学习GraphQL是如何工作的了，以及感受它的魔力啦~

### 什么是GraphQL？

[GraphQL](https://graphql.org/)是Facebook开发的一种开源查询语言。它为我们提供了一种更有效的方法来设计、创建和使用我们的API，可以说它是REST的替代品。

GraphQL有很多功能，例如：
* 你可以编写你想要的数据，并获取你所需要的数据，不再像我们使用REST那样过度获取信息。
* 它给我们提供单一的API资源路径, API升级不再需要区分版本。
* GraphQL是强类型的，你可以在执行之前在GraphQL类型系统中验证查询，它可以帮助我们构建更强大的API。

这是一篇关于GraphQL为什么如此强大以及为何GraphQL如今获得了大量人气的基础介绍。如果你想了解更多关于GraphQL的信息，我建议你查看[GraphQL](https://graphql.org/)官网并查看它。

### 开始

本文的主要目的不是学习如何配置GraphQL服务器，所以我们现在还没有深入研究。而本文的主要目的在于了解GraphQL在实践中的工作原理，因此我们将使用一个名为[Graphpack](https://github.com/glennreyes/graphpack)的服务器。

在开始我们的项目前，我们需要创建一个新的文件夹，你可以随意命名，我打算将它命名为graphql-server：

打开你的终端并输入：

```
mkdir graphql-server

```

现在，你需要在你的电脑上安装npm或者yarn，npm和yarn是JavaScript编程语言的包管理器，对于Node.js，默认包管理器是npm。

进入你创建的文件夹中，输入以下命令：

```
npm init -y

```

如果你使用yarn，则输入以下命令：

```
yarn init 

```

npm将会为你自动创建一个package.json文件，你安装的所有依赖和命令都会在这个文件中。

所以现在，我们将要安装我们将要使用的唯一依赖项--Graphpack

[Graphpack](https://github.com/glennreyes/graphpack)允许你创建零配置的GraphQL服务器，对于刚开始学习GraphQL的我们来说这将帮助我们学习更多内容，而不必担心复杂的服务器配置。

在你的根目录中，在终端输入以下命令：

```

npm install --save-dev graphpack

```

如果你使用yarn，则输入以下命令：

```
yarn add --dev graphpack
```

安装完graphpack之后，找到package.json文件中scripts配置项，加上下面的代码：

```js
"scripts": {
    "dev": "graphpack",
    "build": "graphpack build"
}
```

我们将创建一个名为src的文件夹，它将成为整个服务器中唯一的文件夹。

创建完名为src的文件夹之后，我们将在src文件夹下面创建3个文件。首先创建名为schema.graphql的文件夹，在这个文件夹中,写下下面的代码：

```js

type Query {
  hello: String
}

```

schema.graphql文件将是我们的整个GraphQL架构，如果你不懂这是什么，被担心，我稍后会解释。

接着在我们的src文件夹中新建第二个名为resolvers.js的文件夹，代码如下：

```js
import { users } from "./db";

const resolvers = {
  Query: {
    hello: () => "Hello World!"
  }
};

export default resolvers;
```

This resolvers.js file is going to be the way we provide the instructions for turning a GraphQL operation into data.

最后，在src文件夹下建第三个文件db.js：

```js
export let users = [
  { id: 1, name: "John Doe", email: "john@gmail.com", age: 22 },
  { id: 2, name: "Jane Doe", email: "jane@gmail.com", age: 23 }
];
```

在本教程中，我们没有使用真是的数据库。因此，db.js文件将模拟数据库，仅用于学习目的。

现在我们的src文件夹应该如下：

```
src
  |--db.js
  |--resolvers.js
  |--schema.graphql
```

现在如果你在终端运行npm run dev 或者 yarn dev，你就会在终端看到以下输出：

![终端运行结果](./images/02.png)

现在通过本地访问localhost:4000,这意味着我们已经准备好开始在GraphQL中编写我们的第一个查询，突变和订阅。本地运行以后你可以看到GraphQL Playground，这是一个功能强大的GraphQL IDE，可用于更好的开发工作流程。如果你想了解更多关于GraphQL Playground，[点击这里](https://www.prisma.io/blog/introducing-graphql-playground-f1e0a018f05d/)

### 概要
GraphQL有自己的语言类型，用于编写模式。这是一种称为模式定义语言（SDL）的人类可读模式语法。无论你使用何种技术，SDL都是相同的，你可以将其用于你想要的任何语言或框架。

这种模式语言非常有用，因为它很容易就知道你的API将具有哪些类型，你可以通过正确的方式来理解它。

### 类型（Types）
类型是GraphQL最重要的特性之一，类型是自定义的对象，代表着API的外观。举个例子：如果你正在构建一个社交媒体应用程序，那么你的API应该具有Posts, Users, Likes, Groups等类型。

类型具有字段，这些字段返回特定类型的数据。例如，我们创建一个用户类型，那么这个用户类型应该具有name, email和age字段。类型字段可以是任何类型，并始终返回一种数据类型，如Int，Float，String，Boolean，ID，对象类型列表或自定义对象类型。

现在我们开始写我们的第一个类型，在schema.graphql文件用如下代码替换已存在的Query类型：

```js

type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}

```
每个用户都将拥有一个ID，因此我们给它提供了ID类型。用户也会有一个name和eamil，所以我们给它一个String类型，而age我们给它一个Int类型，很简单吧？

那么，每行末尾的!是什么意思呢？感叹号表示字段不可为空，这意味着每个字段必须在每个查询中返回一些数据。用户User类型中唯一可以为空的字段是age。

在GraphQL中，将处理三个主要概念：

* 查询（queries）：从服务器获取数据的方式。

* 变更（mutations）：修改服务器上的数据并获取更新的数据（创建，更新，删除）的方式。

* 订阅（subscriptions）：与服务器保持实时连接的方式。

我将会向你解释所有这些概念，让我们先从查询开始吧！


### 查询（Queries）
简单的解释，GraphQL中的查询就是你获取数据的方式。GraphQL查询中最棒的事情之一就是可以获取到你所需的确切数据，不多也不少。这将对我们的API产生积极的影响--不再像使用REST API那样过度获取或提取不足的信息。

我们将在GraphQL中创建第一个类型的Query，我们所有的查询都将以此类型结束。首先，在schema.graphql编写一个名为Query的新类型：

```js

type Query {
  users: [User!]!
}

```

这很简单：users查询将返回给我们一个或多个用户的数组，这个数组不会返回null，因为我们给users加了!，这意味着users是一个不可为空的查询，它总是会返回一些数据。

但是我们也可以返回特定的用户，为此，我们将创建一个名为user的新查询。在我们的Query类型中，写入以下代码：

```js
user(id: ID!): User!

```

现在我们的Query类型应该如下所示：

```js

type Query {
  users: [User!]!
  user(id: ID!): User!
}

```

如你所看到的，使用GraphQL中的查询，我们也可以传递参数。在这个例子中，要查询特定用户，我们将传递其ID。

但是，你可能会想：GraphQL是怎么知道获取数据的具体位置的？这就是为什么我们还需要有一个resolvers.js文件，该文件告诉GraphQL它将如何以及从何处获取数据。

首先，在resolvers.js文件中导入刚刚创建的db.js，这时你的resolvers.js文件应如下所示：

```js

import { users } from "./db";

const resolvers = {
  Query: {
    hello: () => "Hello World!"
  }
};

export default resolvers;

```

我们将创建第一个查询，找到resolvers.js文件并替换其中的hello函数。现在，您的查询类型应如下所示：

```js

import { users } from "./db";

const resolvers = {
  Query: {
    user: (parent, { id }, context, info) => {
      return users.find(user => user.id === id);
    },
    users: (parent, args, context, info) => {
      return users;
    }
  }
};

export default resolvers;

```

现在，来解释一下它是如何工作的：
每个查询解析器都有四个参数。在user函数中，我们将id作为参数传递，然后返回与传递的id匹配的特定用户，就是这么的简单。

在users函数中，我们将返回已存在的users数组，它将始终给我们返回所有的用户。

现在，我们将测试我们的查询是否运行正常。访问localhost：4000并输入以下代码：

```js
query {
  users {
    id
    name
    email
    age
  }
}
```

这时候应该给我们返回所有的用户。

或者，如果要返回特定用户：

```js
query {
  user(id: 1) {
    id
    name
    email
    age
  }
}
```

接下来，我们将开始学习变更（**mutations**），这是GraphQL中最重要的功能之一。

### 变更（Mutations）

在GraphQL中，mutations是您修改服务器上的数据并获取更新数据的方式，你可以把它跟REST中的CUD（创建，更新，删除）一样思考。

我们将在GraphQL中创建我们的第一个类型变更，我们所有的变更都将以这种类型结束。因此，找到schema.graphql并编写一个名为mutation的新类型：

```js
type Mutation {
  createUser(id: ID!, name: String!, email: String!, age: Int): User!
  updateUser(id: ID!, name: String, email: String, age: Int): User!
  deleteUser(id: ID!): User!
}
```

正如你所见，我们将有三个变更：

createUser：我们应该传递ID，name，emial和age。它将会为我们创建一个新的用户。

updateUser：我们应该传递一个ID，一个新的name，email或age，它将会为我们返回一个新用户。

deleteUser：我们应该传递一个ID，它将会为我们返回一个新用户。

现在，找到resolvers.js文件并在Query对象下面，创建一个新的变更对象，如下所示：

```js
Mutation: {
    createUser: (parent, { id, name, email, age }, context, info) => {
      const newUser = { id, name, email, age };

      users.push(newUser);

      return newUser;
    },
    updateUser: (parent, { id, name, email, age }, context, info) => {
      let newUser = users.find(user => user.id === id);

      newUser.name = name;
      newUser.email = email;
      newUser.age = age;

      return newUser;
    },
    deleteUser: (parent, { id }, context, info) => {
      const userIndex = users.findIndex(user => user.id === id);

      if (userIndex === -1) throw new Error("User not found.");

      const deletedUsers = users.splice(userIndex, 1);

      return deletedUsers[0];
    }
  }
```
现在，resolvers.js文件应如下所示：

```js
import { users } from "./db";

const resolvers = {
  Query: {
    user: (parent, { id }, context, info) => {
      return users.find(user => user.id === id);
    },
    users: (parent, args, context, info) => {
      return users;
    }
  },
  Mutation: {
    createUser: (parent, { id, name, email, age }, context, info) => {
      const newUser = { id, name, email, age };

      users.push(newUser);

      return newUser;
    },
    updateUser: (parent, { id, name, email, age }, context, info) => {
      let newUser = users.find(user => user.id === id);

      newUser.name = name;
      newUser.email = email;
      newUser.age = age;

      return newUser;
    },
    deleteUser: (parent, { id }, context, info) => {
      const userIndex = users.findIndex(user => user.id === id);

      if (userIndex === -1) throw new Error("User not found.");

      const deletedUsers = users.splice(userIndex, 1);

      return deletedUsers[0];
    }
  }
};

export default resolvers;
```
现在，我们将测试我们的mutations是否正工作,运行localhost：4000并输入以下代码：

```js
mutation {
  createUser(id: 3, name: "Robert", email: "robert@gmail.com", age: 21) {
    id
    name
    email
    age
  }
}
```

它将会返回给我们一个新的用户，如果你想尝试创建新的的mutations，我建议你可以自己尝试一下！尝试删除你所创建的同一用户，以查看它是否正常工作。

最后，我们将开始学习订阅（**subscriptions**），以及学习为什么它们如此强大。

### 订阅（Subscriptions）

正如我之前所说，订阅（subscriptions）是您与服务器保持实时连接的方式。这意味着无论何时在服务器中发生事件，并且每当调用该事件时，服务器都会将相应的数据发送到客户端。

通过使用订阅，你可以保持你的应用在不同的用户之间得到最新的更改。

![image](./images/03.png)

基本的订阅应该如下：

```js
subscription {
  users {
    id
    name
    email
    age
  }
}
```
你可能会说它与查询非常相似，是的，但它们的工作方式不同。当服务器中的某些内容更新时，服务器将运行订阅中指定的GraphQL查询，并将新更新的结果发送到客户端。

我们并不打算在这篇特定的文章中使用订阅，但是如果你想了解更多关于它们的信息，请[点击此处](https://hackernoon.com/from-zero-to-graphql-subscriptions-416b9e0284f3)。

### 总结

正如你所见，GraphQL是一项非常强大的新技术。它为我们提供了构建更好的API的真正能力。这就是为什么我建议你现在就开始学习GraphQL，对我来说，它最终将取代REST。

🐦[在推特上关注原作者！
](https://twitter.com/leonardomso)

⭐[在GitHub上关注原作者！
](https://github.com/leonardomso)


原文地址：[https://medium.freecodecamp.org/a-beginners-guide-to-graphql-86f849ce1bec](https://medium.freecodecamp.org/a-beginners-guide-to-graphql-86f849ce1bec)
