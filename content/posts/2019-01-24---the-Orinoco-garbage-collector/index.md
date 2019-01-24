---
title: "「翻译」Orinoco: V8的新垃圾回收器"
date: "2019-01-24T14:03:48.637Z"
template: "post"
draft: false
slug: "/posts/the-orinoco-garbage-collector/"
category: "V8"
tags:
  - "V8"
  - "garbage collector"
  - "翻译"
description: "过去这些年 V8 的垃圾回收器发生了很多的变化，从 `stop-the-world` 回收器变成了一个更加并行和增量式回退机制的垃圾回收器。"
---

> `注：` 相比起阅读这一篇文章你更加喜欢观看本次演讲的话，那么请直接观看下面的视频；如果你更喜欢阅读，请直接跳过视频。

<div style="text-align: center">
  <iframe width="100%" height="360px" frameborder=0 src="http://v.qq.com/iframe/player.html?vid=x0831lbmez2&tiny=0&auto=0" allowfullscreen=""></iframe>
</div>

###### `译者注：`本文部分内容根据原作者的演讲有部分增加。

过去这些年 V8 的垃圾回收器发生了很多的变化，从一个 `stop-the-world` 垃圾回收器变成了一个更加并行和增量式回退机制的垃圾回收器。

为什么 JavaScript 引擎需要垃圾回收器？因为 JavaScript 大部分都是垃圾。大部分都是垃圾？！一看到这里大多数前端小伙伴估计又不开心了，难道这么多年我都是在写垃圾么？不慌，此垃圾并非彼垃圾，那么为什么要说  JavaScript 都是垃圾？
- 每次你 new 一个对象的时候都会被分配内存（ps: 程序员小哥哥没有对象只能 new 了）
- 我们所有人的电脑也好手机也好并没有无限内存
- v8 会为你自动回收垃圾

![梦想中的垃圾回收器](./images/dc817f23f6d0.gif)
> 梦想中的垃圾回收器

![现实中的垃圾回收器](./images/garbage-truck-throws-trash.gif)
> 现实中的垃圾回收器

不论什么垃圾回收器都有一些定期需要去做的任务：
- 标记活动对象和非活动对象
- 回收或者重用被非活动对象占据的内存
- 合并或者整理内存（可选的） 