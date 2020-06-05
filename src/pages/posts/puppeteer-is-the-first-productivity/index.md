---
title: "puppeteer 是第一生产力"
date: "2020-06-05"
template: "post"
draft: false
category: ""
translators: ["zanzan"]
tags:
  - "puppeteer"
description: "使用 puppeteer 自动化挂号"
---


由于某九院挂号艰难，定了每周六早上7点半的闹钟，怎么也抢不到号，实在是太难了。迫于无奈，手动不行，只能靠自动了，毕竟技术才是第一生产力。

puppeteer 了解一下，这是 Google Chrome 团队官方的无界面（Headless）Chrome 工具。它可以模拟人的行为，操控 chrome 浏览器，做一些网页自动化测试、爬虫、前端监控、生成PDF文件等。

```js
npm i puppeteer-core  // 不用额外安装 Chromium，用本地安装的 Chrome 就能跑
```

上天🙏，明天一定要抢到，要是再抢不到我就。。。。我就哭

好了，👇上代码
```js
//server.js
const puppeteer = require('puppeteer');
const cookie = require('./cookie')

async function run() {
  const browser = await puppeteer.launch({
    executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', //chrome 浏览器本地位置
    headless: false, // 打开有界面模式
    devtools: true, //打开 chrome 开发者控制台
    defaultViewport: {
      width: 1000,
      height: 800
    }
  });
  const page = (await browser.pages())[0]  // 注意
  /*
  无验证码的网站 用账号密码登陆
  await page.goto('https://www.guahao.com/user/login?target=%2F');
  await page.type('#loginId', '***');    
  await page.type('#password', 'HE2UYFKWpuJaqbE');
  await page.click('.gbb.gbt-green');
  await page.waitForNavigation({
      waitUntil: 'load'
  });  //等待页面加载出来，等同于window.onload
  */
 
  /*
  此处我采用了 cookie 自动登陆，避免每次填账号密码，可能会出现的图形验证码
  cookie 值是从已登陆过的网站里手动取的，保存到本地文件 cookie.js 中
  */
  const arr=Object.entries(cookie).map(([key,value])=>({name:key,value,url:'https://www.guahao.com'}))
  await page.setCookie(...arr);
  page.goto('https://www.guahao.com/expert/882843e0-8845-4cec-96b4-25b8956e6be9000?hospDeptId=138181401367203000&hospitalId=0ba4a4af-6a09-47ef-8bc6-6ecd1a7d3bb4000')

  await page.waitForNavigation({
      waitUntil: 'load'
  })
  const fn=async()=>{
    await page.click('.expert-guahao .valid .item.dept .contain a:nth-of-type(2)');
    await page.waitForSelector('.J_SchedulesItem.schedules-item').then(() => console.log('button加载了'));
  
    const canClick=await (await page.$eval('.J_SchedulesItem.schedules-item:nth-of-type(2)', el => el.className)).includes('cannot')
    if(canClick){
      await page.reload()
      await fn()
      return
    }
    try {
      await page.waitFor(1000);
  
      await page.tap('.J_SchedulesItem.schedules-item:nth-of-type(2)')
      await page.click('.J_SchedulesItem.schedules-item:nth-of-type(2)')
      // await page.waitForNavigation({
      //     waitUntil: 'load'
      // })
  
      await page.waitForSelector('a.gb.gb-grey1.J_NoDisease')
      await page.tap('a.gb.gb-grey1.J_NoDisease')
      await page.click('input.J_Agreement')
      await page.click('#J_Booking')
  
    }catch(e){
      console.error(e)
    }
  }
  fn()
  
}

run();
```

踩坑指南：
- `await browser.pages()` 会额外打开一个空白标签，要用 `(await browser.pages())[0]`
- `page.click` 或者 `page.tap` 点击某元素失效的时候注意，使用 `page.waitFor`、`page.waitForSelector` 等待一会儿
- `page.$eval` 取元素属性值
- `page.evaluate` 操作、修改 dom 元素，打印出的 `console.log` 在浏览器控制台里

项目链接：[https://github.com/zxy7/pptr](https://github.com/zxy7/pptr)

参考：
1. [https://crxdoc-zh.appspot.com/extensions/tabs](https://crxdoc-zh.appspot.com/extensions/tabs)
1. [https://support.google.com/chrome/a/answer/2714278?hl=zh-Hans](https://support.google.com/chrome/a/answer/2714278?hl=zh-Hans)