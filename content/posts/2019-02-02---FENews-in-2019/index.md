---
title: 关于 FENews 在 2019 的规划
date: "2019-02-04"
template: "post"
draft: false
slug: "/posts/the-future-of-frontend-in-2019"
category: "其他"
tags:
  - "React"
  - "Typescript"
  - "Flutter"
  - "GraphQL"
  - "WebAssembly"
description: "FENews 成立的初衷是一起学习交流，并把我们的学习过程和经验分享给大家。我们会定期原创或翻译前端相关的技术文章，未来我们可能由于自己理解的原因或者什么其他原因而犯错，希望大家能够纠正我们。如果你对我们感兴趣或想加入我们欢迎随时联系。"
---

## 关于我们

在此新春来领之际，首先祝大家春节快乐（手动笔芯 ❤️）！从 2019 年 1 月 19 日 FENews 的第一条微信公众号消息的发出到 1 月 23 日的串店撸串，短短几天的时间，我们就吸引了一批志同道合有激情的优秀的小伙伴加入我们（截止发稿时间我们已经是一个 13 人的团队啦）。我们并不是完全是由什么资深大牛组成，我们是一个成长中的团队，我们是由一群热爱技术、有技术追求的年轻小伙伴组成。**FENews** 成立的初衷是一起学习交流，并把我们的学习过程和经验分享给大家。我们会定期原创或翻译前端相关的技术文章，未来我们可能由于自己理解的原因或者什么其他原因而犯错，希望大家能够纠正我们。如果你对我们感兴趣或想加入我们欢迎随时联系。

![FENews 团队首发阵容](images/fenews-team.jpg)

<div style="text-align: center; font-size: 12px">
  FENews 首发阵容（由于地点和时间的原因有三位小伙伴不在图中）
</div>

## 2019 年规划

前端经过近几年的快速发展，各种框架和工具不断完善，前端的生产力得到了极大的提升。同时，像 Electron、Flutter 和 React Native 等 Native 端融合技术的发展，前端的职能边界也不断被拓宽。**FENews** 会持续关注前端技术的发展方向，下面我会简单介绍下 2019 年我们会重点关注的一些技术主题，未来可能会根据实际发展情况而有所调整。

### React / Vue / Angular

### Webpack / Parcel / Rollup

### TypeScript

### Flutter / React Native

#### Flutter

Flutter 是 Google 推出并开源的移动应用开发框架，并且支持 Google 下一代操作系统 Fuchsia，主打跨平台、高保真、高性能。开发者可以通过 Dart 语言开发 App，一套代码同时运行在 iOS 和 Android 平台。 Flutter 提供了丰富的组件、接口，开发者可以很快地为 Flutter 添加 native 扩展。同时 Flutter 还使用 Native 引擎渲染视图，这无疑能为用户提供良好的体验。

此外 Flutter 跨全平台不止是 Android 和 iOS 目标剑指所有主流平台 UI 开发、PC 桌面以及 包括正在搞的 [Hummingbird](https://medium.com/flutter-io/hummingbird-building-flutter-for-the-web-e687c2a023a8) 来实现 web 的支持。

#### React Native

React Native 是 Facebook 在 F8 大会开源的 JavaScript 框架,在 2015 年 9 月 15 日发布，可以让广大开发者使用 JavaScript 和 React 开发跨平台的移动应用。开发者可以灵活的使用 HTML 和 CSS 布局，使用 React 语法构建组件，实现 Android，iOS 两端代码的复用,核心设计理念: 既拥有 Native 的用户体验，又保留 React 的开发效率。

#### 对比

- 速度与性能：React Native 用 JavaScript 调用对应系统渲染器进行渲染展示，中间就有 JavaScript 解析到调用 Native 过程的许多中间环节，Flutter 是将 Dart 代码 AOT 编译为本地代码，其次，Flutter 使用自己的渲染引擎来绘制 UI，布局数据等由 Dart 语言直接控制，所以在布局过程中不需要像 React Native 那样要在 JavaScript 和 Native 之间通信，速度和性能上一般 Flutter 是要优于 React Native 的。

- 生态周边：Dart 生态相比移动端/前端生态远小的多，React Native 经过多年发展，其现在的社区规模或者是生态完善性都是 Flutter 近期根本无法追赶上的。

- 开发体验：React 的开发体验远比 Dart 要好，更多前端开发者更容易上手，虽然 Flutter 参照了需要 React 的设计思想，DSX 也类似 JSX, 但是如果你看过官方的例子应该看到 DSX 的代码代码很容易一层套一层，类似于回调炼狱，此外用 Flutter 你需要学习一门新语言 Dart。

### GraphQL

GraphQL 是 Facebook 于 2012 年在内部开发的数据查询语言，在 2015 年开源，旨在提供 RESTful 架构体系的替代方案。

GraphQL 的官方定义是一种用于 API 的查询语言，GraphQL 既是一种用于 API 的查询语言也是一个满足你数据查询的运行时。 GraphQL 对你的 API 中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且没有任何冗余，也让 API 更容易地随着时间推移而演进，还能用于构建强大的开发者工具。

目前在国外有众多大厂在使用 GraphQL ，FB 自家肯定在使用，此外熟知的 github、twitter、airbnb 都有比较成熟的 GraphQL 实践。国内大厂阿里、百度、携程有在使用，阿里的 egg.js 框架也有相应的 GraphQL 插件，携程最近还发表了[从前后端分离到 GraphQL，携程如何用 Node 实现？](https://mp.weixin.qq.com/s/lFKZRtigONGuSHDL4ww9FA)

虽然 GraphQL 越来越受到更多开发者的关注，但是却没有彻底火起来，因为需要前后端一起铺开啊，此外要使用 GraphQL 对数据源进行管理，相当于要对整个服务端进行一次换血，对大体量的企业服务来说真是伤筋动骨。另一方面，实践太少，相关生产级别的分享少之又少，现在社区的中流砥柱 [Apollo](https://github.com/apollographql) 贡献了 GraphQL 前后端技术栈的各种实现，却没有中文站点。而团队在 Medium 上的博客，Youtube 上 Conference 的 Talk，都是翻译极少的。我们 FENews 立个 flag，今年会对 Apollo/GraphQL 的周边进行翻译分享，敬请期待。

### Rust / WebAssembly

Rust 是由 Mozilla 主导开发的通用、编译型编程语言。它是为大型互联网客户端和服务端而设计的，发行于 2010 年， 算是一门比较年轻的编程语言。沃特 ? 那它与前端到底又啥关系呢？

### Deno
