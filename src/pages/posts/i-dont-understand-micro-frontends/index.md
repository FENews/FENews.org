---
title: "我不太理解微前端" 
date: "2019-11-09"
template: "post"
draft: false
category: "FE Eng"
translators: ["xueqingxiao"]
authors: ["lucamezzalira"]
tags:
  - "FE Eng"
  - "Micro Frontend"
  - "翻译"
description: "译者：“我也不太理解微前端（逃”"
---

### I don’t understand micro-frontends.

### 我不太理解微前端。

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What they are supposed to look like / What they actually look like <a href="https://t.co/GLzEf0CTgb">pic.twitter.com/GLzEf0CTgb</a></p>&mdash; Laura Coalla (@laurazenc) <a href="https://twitter.com/laurazenc/status/1132557544763940864?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

> Brilliant micro-frontends joke 🤣😂

> 特别逗的微前端笑话 🤣😂

Yesterday, after coming back from the walk with my dogs, I have seen a few notifications on Twitter where people tagged me asking to share my thoughts on the thread started by Dan Abramov regarding micro-frontends:

昨天我溜完狗回来，看到几条推特的推送，有人艾特了我，对于 Dan Abramov 关于微前端的推文，想让我分享一下我的看法：

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I don’t understand micro-frontends.</p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/1132493678730252288?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

If you are following me, you know I’m very passionate about micro-frontends and I’m working with them for a while, I’m also keeping an open mind analysing different approaches and understanding their PROs and CONs.
If you don’t follow me and you are curious about the topic from a technical point of view just check my [Medium page](https://medium.com/@lucamezzalira), otherwise, there are many other resources on micro-frontends, just searching on Medium or using your favourite search engine.
I won’t be able to cover all the topics discussed in the Twitter’s thread but let’s start from the beginning and see if I can help to add a bit of context (you are going to hear this word more and more during this article😁) to the micro-frontends topic.

如果你们有关注过我的话，想必也知道我是非常热衷于微前端的，并且使用微前端也有一段时间了，当然我也保持一个开放的心态，去分析了解不同方法的优点和缺点。
如果你们没有关注我，并且对相关话题和技术观点有兴趣的话可以看看我的 [Medium](https://medium.com/@lucamezzalira)，当然也有很多关于微前端的其他资源，你可以在 Medium 或者搜索引擎上搜一下。
我不准备讨论所有推特上的相关话题，不管怎么样，让我们从头开始看看能否帮助大家了解一下微前端这个话题相关的上下文（你会在这篇文章会看到很多“上下文”这个词😁）。

### Disclaimer

First of all and foremost, I’m not writing this post for blaming or attacking anyone or even for starting a social flame, I respect any point of view, sometimes I share the same point of view of other people and sometimes not, this behaviour brings on the table innovation and new ideas so I’m totally up for it.

### 声明

首先必须要声明的一点是，我写这篇文章不是为了喷任何人，也不是为了引战，我尊重所有的观点，有时候我赞同别人的观点，有时候我也会反对别人的观点，讨论会产生革新的想法，所以我尽力。

Considering a few people mentioned my name in this is tweet started by Dan, I’d like to share my thoughts because I truly believe we can have a genuine discussion about micro-frontends with great benefits for everyone covering common questions that I receive weekly on socials, my personal email, after my presentations and so on.

考虑到 Dan 一开始发推的时候就有人艾特我，我相信我们就微前端这个话题可以进行一次真正的讨论，并且对大家都能有所收益，所以我准备分享一下自己的想法，这里可能会涵盖到我收到的邮件，社交网站上的常见问题，和我演讲后的内容等等。

Other people got in touch with me regarding the aforementioned tweet: I didn’t reply straight to the tweet because discussing an interesting topic like this one in 280 characters is really limiting and prone to be misunderstood or omitting some important details.

有写人在推上艾特我，我没有直接回复，因为讨论这么有趣的一个话题 在 280 字限制的推文里有很多限制，而且可能会造成一些误解或者漏掉一些细节。

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I would be interested to hear from <a href="https://twitter.com/lucamezzalira?ref_src=twsrc%5Etfw">@lucamezzalira</a></p>&mdash; Natalie Marleny (@NatalieMarleny) <a href="https://twitter.com/NatalieMarleny/status/1132564638317580288?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### Why micro-frontends instead of a good component model?

### 为什么要用微前端去代替就目前而言比较好的组件模型？

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Definitely something for <a href="https://twitter.com/lucamezzalira?ref_src=twsrc%5Etfw">@lucamezzalira</a> :)</p>&mdash; Azzawi (@MahmoudAlazzawi) <a href="https://twitter.com/MahmoudAlazzawi/status/1132566537301311488?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Components are definitely valid solutions, many companies are using them every day with great success, but are not the silver bullet for everything; the project, the team, the business, but more in general, the context has to fit otherwise we try to fit a square into a circle and we don’t always get what is expected.

组件是特别好的解决方案，很多公司用组件也取得不错的效果，但是对于项目，项目组和业务来说没有银弹，一般来说，上下文必须是合适的，不然就好比尝试将一个正方形变成一个圆，并不是每次都能得到期望的结果。

Exploring new possibilities, challenging our beliefs and “standard way of doing things” move our industry forward consolidating existing standards or introducing new ones.

探索新的可能性，或者挑战现有的信念和“做事的标准”，有助于向我们行业的标砖添砖加瓦或者引入新的标准。

Let’s start with this, ```Micro-frontends are not trying to replace components```, it’s a possibility we have that doesn’t fit in all the projects like components are not the answer for everything.

让我们从```微前端不是为了去代替组件```这个点开始，微前端有可能不适合所有项目，就像组件不能解决所有的问题一样。

```Use the right tool for the right job, that should be our goal. Remember that developing software is empirical, not scientific.```

```软件开发更多的是经验性的（empirical）而不是科学性的，用正确的工具去做正确的事，这是我们的目标。```

I’ve seen large organizations with terrible codebases and practices having a successful product and I saw also the complete opposite, we cannot look only to one side of the coin.

我见过大型公司的有很成功的产品，但是代码库及其糟糕，相反也见过代码库非常漂亮但是产品却不怎么成功。就好比硬币有两面，我们不能只看一面。

So far I tried micro-frontends only at scale (roughly 200 people — frontend and backend engineers — working on the same project), in conjunction with microservices and team ownership are working pretty well compared to the previous model we had in my company.

目前为止，我只在规模这个纬度去实践过微前端（大概200人左右的前后端工程在同一个项目上协作），将微服务和团队所有权（team ownership）相结合，和之前的研发模式相比取得了不错的效果。

Are they working in smaller projects? Ideally, but I’d like to try them first.
On paper, everything looks fine, it’s getting into the details where you realise the limitations and find new challenges. If you have any experience I’d love to hear from you!

微前端是不是同样适用于小项目？理想情况下，答案是肯定的。但是我们可以先尝试验证下。从理论上来说是没有任何问题的，但是如果你深入实践就会发现一些局限性和问题。你如果有相关的经验，欢迎告诉我。

Regarding micro-frontends, there are different flavours, for instance, we can use iframes for composing a final view, or instead use [Edge Side Include or Client Side Include](https://gustafnk.github.io/microservice-websites/), even use a pre-rendering strategy like [Open Components](https://opencomponents.github.io/) or like [Interface Framework](https://jobs.zalando.com/tech/blog/front-end-micro-services/) and cache the results at CDNs level. 

关于微前端有很多方式去实现，比如，我们可以通过 iframe 组合成最终的界面，或者可以使用ESI（[Edge Side Include](https://gustafnk.github.io/microservice-websites/#edge-side-includes)）和CSI（[Edge Side Include](https://gustafnk.github.io/microservice-websites/#client-side-includes)）注入，甚至使用诸如 [Open Components](https://opencomponents.github.io/) 或 [Interface Framework](https://jobs.zalando.com/tech/blog/front-end-micro-services/) 之类的预渲染策略，并将结果缓存在CDN。

Another approach is [using an orchestrator](https://medium.com/dazn-tech/orchestrating-micro-frontends-a5d2674cbf33) that is serving SPAs, single HTML pages or SSR applications, the orchestrator can be on the edge, on the origin or client side, an example of orchestrator could be [Single-SPA](https://single-spa.js.org/).
Those methodologies suggest that we have 2 main approaches to identify a micro-frontend size:

  - part of the user interface that could correspond to a component but not necessary mapped 1 to 1 with a component
  - an entire business domain that could correspond to a SPA, a single HTML page or a SSR application

Each of them have their PROs and CONs, I personally prefer the latter one but it’s not bulletproof either, it’s important to understand the limitations of each approach and if those limitations could impact the final project outcome.

Micro-frontends are definitely a technique that impacts your organization, providing decoupling between teams, avoiding too much centralisation and empowering the teams on taking [local decisions](https://medium.com/dazn-tech/identifying-micro-frontends-in-our-applications-4b4995f39257).

This doesn’t mean those teams are not capable to agree on a strategy to pursue or an API contract for instance, micro-frontends enable a team to take a path that can follow without the need to coordinate with other teams each single technical decision that could affect the codebase, allowing them to fail fast, build and deploy independently, following some boundaries defined by the organization (languages supported by the company, best practices and so on).

I personally worked in different organizations where new joiners provided good insights on how to change a “core library” but often for politics or because the change would not be provided with an immediate benefit, those suggestions were parked waiting for their turn inside the backlog.
Decentralising decisions to a team is probably one of the best things a company can do because this team lives and breathes with the product team and the business experts, talking the same language every single day, they are on top of the game, centralising instead lose the context and provides some constraints that sometimes are unnecessary.
When a company is capable to provide some technical boundaries to follow inside a specific business domain, a team can express itself in the best way possible, maybe making some mistakes but recovering very fast because the scope of work to change is smaller than a full application.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Stack and release per team are the most important reasons I think. Which on large projects might enable everybody to keep evolving independently, similar to how micro services do that for the backend; reduce the need for coordination</p>&mdash; Michel Weststrate (@mweststrate) <a href="https://twitter.com/mweststrate/status/1132552759344021510?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### Understanding the context

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">This gets me to think of what games would feel like if every level designer put a different game engine into it because they couldn’t find agreement with designers of other levels.</p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/1132503556777488384?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Dan is right in his example but is not looking to the context where the conversation was, he’s trying to generalise a solution that has to work for everything and every one, this is not the case.

The context of any decision is probably the most important thing for understanding a technical implementation made by an individual contributor, a team or an organization.

In the last decade, I have seen many projects written in similar ways, same architecture, similar patterns… but with different outcomes and different challenges faced during the journey, as I said before, software development is empirical, not scientific.

Nowadays there is a better understanding of which approaches we could use for delivering a project successfully, we don’t use anymore a framework or an architecture that fit them all, we are trying to use the right tool for the right job.

If a project should use heavily shared components and the project is successful it’s absolutely fine, probably the final outcome of the project, the environment, the actors involved and the process established for delivering the project make a shared components library a suitable solution.

At the same time, other contexts may require different approaches, thinking outside of the box because traditional methods are not providing predictable results.

The context is the key, understanding the business, the environment where we operate, the result we are aiming for are all linked to our context.

Therefore having a components library that abstracts the functionalities of hundreds if not thousands of components is perfectly fine like having multiple SPAs where the code is duplicated instead of being wrapped in a library or many of them.

The context forces us taking decisions that sometimes are not what other people expect, we have learnt many rules/guidelines in the past like DRY (Don’t Repeat Yourself) or DIE (Duplication is Evil), those are perfectly applicable but are not a dogma that we need to respect no matter what because sometimes there are good reasons why we are doing that.

Don’t get me wrong I’m not advocating that duplicating tons of code is a best practice but sometimes is a necessary evil for moving forward faster.
Code duplication could make our teams more autonomous because they are not sharing code that could become more complex due to abstraction and they are not dependent by external teams.
As always, we need to be thoughtful on duplicating code, the context allows us to make a decision if abstracting code over duplicating is sensible or not.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">“Duplication is far cheaper than the wrong abstraction.” <a href="https://twitter.com/sandimetz?ref_src=twsrc%5Etfw">@sandimetz</a> <a href="https://twitter.com/rbonales?ref_src=twsrc%5Etfw">@rbonales</a> <a href="http://t.co/zAmc9pvNS4">pic.twitter.com/zAmc9pvNS4</a></p>&mdash; bryce (@BonzoESC) <a href="https://twitter.com/BonzoESC/status/442003113910603776?ref_src=twsrc%5Etfw">March 7, 2014</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Often abstractions are way more expensive than code duplication and if you apply the wrong ones at scale we can generate complex code that leads to a lot of frustration that translates to worse behaviours like ignoring the centralised approach in favour of a more minimal and “fit for purpose” approach implemented by a team inside its own codebase with the result of less control of the overall solution.
So YES, let’s avoid code duplication but be balanced in your decisions because you would be surprised how certain things could improve if you address them in the right part of your application.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Someone told me the other day that <a href="https://twitter.com/lucamezzalira?ref_src=twsrc%5Etfw">@lucamezzalira</a> encourages developers to duplicate code in order to increase development speed. Well, I have 2 words for him: DRY (Don&#39;t Repeat Yourself) and DIE (Duplication Is Evil)</p>&mdash; Chris Lowe (@chrislowe_tech) <a href="https://twitter.com/chrislowe_tech/status/1132712575404314624?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 


<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Yep I pretty much know them, out of context they sound really weird suggestions, unfortunately the context makes a lot of difference for any decision someone takes</p>&mdash; Luca Mezzalira (@lucamezzalira) <a href="https://twitter.com/lucamezzalira/status/1132728694907310081?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### Multiple tech stacks

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Micro-frontends: &quot;Each (front-end) team should be able to choose and upgrade their stack without having to coordinate with other teams.&quot;. This is a recipe for disaster. Watch: &quot;What I Wish I Had Known Before Scaling Uber to 1000 Services&quot; <a href="https://t.co/NPRKJgUdHw">https://t.co/NPRKJgUdHw</a></p>&mdash; Federico Cargnelutti (@fedecarg) <a href="https://twitter.com/fedecarg/status/1132942196808794113?ref_src=twsrc%5Etfw">May 27, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

I fully agree with Federico here, being able to choose whatever technology we want could be a recipe for disaster… what if we use only the best part of it?
Micro-frontends are not imposing different technology stacks, the fact they enable this approach doesn’t mean we need to follow it.
Like in the microservices world, we don’t end up with 20 different languages in the same system because each of them is opinionated and brings their own vision inside the system, maintaining different ecosystem is very expensive and potentially confusing without providing too many benefits.
But a trade-off could help out, having a limited list of languages or frameworks we can pick from can really help.
Suddenly we are not tightly coupled with one stack only, we can refactor legacy projects supporting the previous stack and a new one that slowly but steadily kicks into production environment without the need of a big bang releases (see (strangler pattern)[https://martinfowler.com/bliki/StranglerFigApplication.html]), we can use different version of the same library or framework in production without affecting the entire application, we can try new frameworks or approaches seeing real performances in action, we can hire the best people from multiple communities and many other advantages.
When we have the capability of using multiple stacks, having some guidelines really help to have great benefits out of it, disadvantages or disasters become the reality only when there is chaos and not a common goal.

### Watch out the bundle size

I have great esteem for Dan Shappir, I attended his workshop in San Jose during Fluent Conference last year.
He provided tons of good insights on how to optimise our web applications, absolutely a master on performance optimisation.
I think the comment Dan shared here it really depends (again) on the context, working with micro-frontends and slicing the application in multiple SPAs for instance, would allow downloading only part of the application, splitting the libraries from the application codebase allow us to increase the TTL on the CDN serving the vendor file having quick roundtrips if needed for the users, also browsers enhance their caching strategies serving files directly from the disks instead of performing multiple roundtrips.
Last but not least, service workers could mitigate this problem with a caching strategy for the dependencies if it’s sensible for the use case.
Now, it’s inevitable that if we do a bad job bundling our dependencies this impact the load time, but it’s not impacting micro-frontends only, it could impact SPAs as well.
Potentially with micro-frontends, you can also share dependencies (take a look at Single SPA) or you can not, in the latter case the reason could be how your application is used, for instance, if we understand the users’ behaviours in our application, we can “slice” the application in a way that our users are consuming a “journey” inside a micro-frontend and start a new one inside another one.
What we could discover then is that our users come to our platform performing one journey at the time and in this case they are going to download only the dependencies and the code needed in that micro-frontends and not all the dependencies used inside the entire application.
It’s also true, it could be the user navigates randomly in our application and therefore he’s going to download multiple times some dependencies but in that case, it’s up to the teams relieving his journey and improving the performances for providing a better experience.

```(Pareto principle)[https://en.wikipedia.org/wiki/Pareto_principle] (or 80/20 rule) states: “… for many events, roughly 80% of the effects come from 20% of the causes”.```

API management with micro-frontends could be challenging but not less than working with other architectures, in our case we are moving from a services dictionary where we list all the APIs available to a list dedicated for each micro-frontend, it requires a bit of more work but it optimises payload shared between server and client showing only the APIs interested to that micro-frontend.
Obviously, is not always possible to have APIs related only to one micro-frontend and in this case, we need to have external dependencies and communication between teams, but it’s very limited compared to a day to day work.
What I want to stress here that micro-frontends are not perfect either but a good combination of practices could allow our projects to be delivered with high standards: the right tool for the right job, remember?

### In Summary

I truly believe that using the right tool for the right job is essential nowadays, monolith, microservices, components, libraries, micro-frontends are tools and techniques for expressing ourselves, our intentions that are just one side of “the solution” (the technical side), the other is obviously the business impact generated using those techniques and tools.
Micro-frontends can really help an organization to move faster, innovate inside a business domain and isolate the failures, at the same time I’m not against of any form or shape of monolith application, I’m not (totally) against centralisation, despite often I saw libraries of any sort optimise way too upfront without really following where the business was going, adding a level of pointless abstraction that slowed down the developers productivity instead of accelerating it.
Often centralisation causes team frustrations because external dependencies are difficult to be resolved considering a team cannot affect too much the work of another one.
I know there are ways to mitigate this problem with inner sourcing, I cannot provide many insights on this approach, but from the few talks I saw and the chat I had with some engineers that are using inner sourcing in their companies, it could be definitely a good approach for having a shared responsibility on different codebases, if you have experience with it, feel free to comment this post.

```Taking balanced decisions is the secret ingredient for success.```

Last but not least, bear in mind that the context is the key to understand a decision.
Architects are often writing the ADRs ((Architecture Decision Record)[https://github.com/joelparkerhenderson/architecture_decision_record#suggestions-for-writing-good-adrs]), those are documents that are helping anyone in the company to understand why a decision was made describing the context, the options available, the chosen one and finally the consequences generated by this decision.
Too often I saw people judging other companies or colleagues decisions without understanding the context where that decision was made, in reality, the context is even more important of the decision itself, because despite it could sound horrible or totally inappropriate, in reality, could have been the best (or only) option for that specific context.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">What a senior developer taught me was &quot;The difference between a senior developer and a non-senior is that the senior developer knows the guidelines and standards and what will cause issues along the way and what not. And knows when to ignore them&quot;.</p>&mdash; Crius (@theCrius) <a href="https://twitter.com/theCrius/status/1132730166856359941?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

As usual, I’m open to discussion and I’m sure people will disagree with some of the points shared in this post, but that’s all point of sharing our experiences and beliefs! 🤓

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">1) I&#39;ve been using Single-spa in production for a few years now and I really like it. It&#39;s been extremely useful to chunk our code for team ownership and organization. Different teams own an entire area of the macro-application and they can choose what they want to use.</p>&mdash; Justin McMurdie (@JustinMcMurdie) <a href="https://twitter.com/JustinMcMurdie/status/1132508976090820609?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">2) Anywhere from frameworks to patterns. We&#39;ve experimented with flow, typescript, redux, no redux, and a number of other tools within react. The idea is that the best patterns bubble up and spread across teams.</p>&mdash; Justin McMurdie (@JustinMcMurdie) <a href="https://twitter.com/JustinMcMurdie/status/1132509678510862336?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">3) another advantage has been the ability to migrate our large spa from one framework to another in chunks without introducing a tool like ng-react. Micro-apps can be rewritten in a fairly short amount of time. Ideally with features being highly cohesive and loosely coupled.</p>&mdash; Justin McMurdie (@JustinMcMurdie) <a href="https://twitter.com/JustinMcMurdie/status/1132511015751389184?ref_src=twsrc%5Etfw">May 26, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 




原文地址：[https://medium.com/@lucamezzalira/i-dont-understand-micro-frontends-88f7304799a9](https://medium.com/@lucamezzalira/i-dont-understand-micro-frontends-88f7304799a9)
