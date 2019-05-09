# 用 class 写法实现一个 *Promise*

## 1.前言

> 本文分析 Promise 特性的了解，完整实现了 Promise 所有功能。没有参考原生 Promise 的写法，自己根据思路一步一步完成以及描述，每个构建模块由：1、Promise 特性描述；2、实现特性的完整思路(分析一波) 3、项目代码；4、功能测试代码 几个部分组成。大致用到的知识有： 1、变量私有化；2、订阅发布模式；3、eventloop 理解；4、Promise特性；5、class 特性；6、对象类型的判定... 算了不写了~~强行塞这么多我也是够拼的~~

> 你可以[点我看源码](https://github.com/li2568261/es6-record/tree/master/class%2Bpromise/code)

## 2.*Promise* 特征分析

- *Promise* 有三种状态： pending(执行中)、 fulfilled(成功执行)、settled(异常捕获);
- *Promise* 可以通过 new 关键字创建一个 未完成的 *Promise*;
- *Promise* 可以直接通过 *Promise*.resolve 创建一个成功完成的 *Promise* 对象;
- *Promise* 可以直接通过 *Promise*.reject 创建一个异常状态的 *Promise* 对象;
- 通过 new 关键字创建的 *Promise* 方法里如果出现错误，会被 *Promise* 的 reject 捕获;
- *Promise*.resolve / *Promise*.reject 接收 thenable 对象和 *Promise* 对象的处理方式;
- 当没有错误处理时的，全局的 *Promise* 拒绝处理;
- 串联 *Promise* 以及 *Promise* 链返回值;
- *Promise*.all *Promise*.race;

## 3.*Promise* 的实现

- ### 状态码私有化

  开始之前讨论一波 class 私有属性的实现，个人想到的方案如下：

  1.通过闭包,将变量存放在 construct 方法里；弊端，所有的其他的对象方法必须在 construct 内定义(NO)。

  2.通过在定义 *Promise* 的环境下定义一个 Map，根据当前对象索引去获取相应的私有值；弊端，因为 Map 的 key 是强引用，当定义的 *Promise* 不用时也不会被内存回收(NO)；

  3.通过在定义 *Promise* 的环境下定义一个 WeakMap，根据当前对象索引去获取相应的私有值； 优势，木有以上两种劣势（不写点什么感觉难受）；

  说了这么多那么咱们要用第三种方法吗？NO，原生 [[PromiseState]] 是一个内部属性，不暴露在 *Promise* 上，但是通过浏览器的控制台可以看到，用第三种方式模仿并不能直观的在控制台看到，所以我决定还是不要作为私有变量出现，但是把枚举特性干掉了 *假装他是私有变量* ~~心里好过一点~~ 因此你就能看到下面的代码;

```javascript
const PENDDING = 'pendding';// 等待状态
const FULFILLED = 'resolved';// 成功操作状态
const REJECTED = 'rejected';// 捕获错误状态

class MyPromise{
  
  constructor(handler){
    // 数据初始化
    this.init();
  }
  
  // 数据初始化
  init(){
    Object.defineProperties(this,{
      '[[PromiseState]]': {
        value: PENDDING,
        writable: true,
        enumerable: false
      },
      '[[PromiseValue]]': {
        value: undefined,
        writable: true,
        enumerable: false
      },
      'thenQueue':{
        value: [],
        writable: true,
        enumerable: false
      },
      'catchQueue':{
        value: [],
        writable: true,
        enumerable: false
      }
    })
  }
  // 获取当前状态
  getPromiseState (){
    return this['[[PromiseState]]'];
  }
  // 设置当前状态
  setPromiseState (state) {
    Object.defineProperty(this, '[[PromiseState]]', {
      value: state,
      writable: false
    })
  }

  // 获取当前值
  getPromiseValue (){
    return this['[[PromiseValue]]'];
  }
  // 设置当前值
  setPromiseValue (val) {
    Object.defineProperty(this, '[[PromiseValue]]', {
      value: val
    })
  }
}

```

- ### 创建一个未完成状态的*Promise*

  函数调用过程分析：

  1. 使用者通过 new 关键字传入一个方法；
  2. 方法有两个参数 ```resolve``` 和 ```reject``` 两个方法
  3. 当传入的方法调用 ```resolve``` 时，状态变为 fulfilled，有且只有接收一次 ```resolve``` 里的方法里的值作为 ```[[PromiseValue]]```，供该 *Promise* 对象下的 ```then``` 方法使用；
  4. 当传入的方法调用 ```reject``` 时，状态变为 rejected，有且只有接收一次 ```reject``` 里的方法里的值作为 ```[[PromiseValue]]```，供该 *Promise* 对象下的 ```catch``` 方法使用；

  代码思路：

  1. 首先传入的函数应该在 construct 方法里进行调用；

  2. 因具备一个存放待执行成功操作方法的队列，一个存放捕获异常方法的队列。

  3. ```resolve``` 方法下处理的问题是：

     1、判断当前状态是否是等待状态，如果不是则啥也不干，如果是走第二步

     2、修改```[[PromiseState]]```为FULFILLED;

     3、将 ```[[PromiseValue]]``` 赋值为方法传递进来的参数； 

     4、成功操作方法的队列在 eventloop 结束后<sup>①</sup>依次调用然后清空，捕获异常方法的队列清空；

  4. ```reject``` 方法基本就不赘述啦......

  5. ```then``` 方法：

     1、 判断当前状态是否为等待，是等待进行第 2 步，否则进行第 3 步；

     2、 加入成功操作方法队列；

     3、 当前eventloop 结束异步调用；

  6. ```catch``` 方法不赘述

  ps: 注①因为无法将任务插入 microtask 中，就用 eventloop结束作为替代；

```javascript
  // 事件循环最后执行
  const eventLoopEndRun = function (handler){
    setImmediate(()=>{
      handler()
    })
  }
  // ...

  class MyPromise{
  
    constructor(handler){
      // ...
      
      // 方法传递，通过 bind 保持两个方法对当前对象的引用
      handler(this.resolve.bind(this), this.reject.bind(this));
    }

    // ...

    // 清空等待队列
    clearQueue (currentState) {
      
      const doQueue = currentState === REJECTED ? this.catchQueue : this.thenQueue;
      const promiseData = this.getPromiseValue();

      doQueue.forEach(queueHandler=>queueHandler(promiseData));
      this.catchQueue = [];
      this.thenQueue = []
    }

    // 状态改变方法
    changeStateHandler (currentState, data){

      this.setPromiseState(currentState);
      this.setPromiseValue(data);
      setImmediate(()=>{this.clearQueue(currentState)});
      
      // 保持状态只能改变一次
      this.changeStateHandler = null;
      this.setPromiseState = null;
      this.setPromiseValue = null;
    }

    // 不解释
    resolve (data) {
      this.changeStateHandler && this.changeStateHandler(FULFILLED, data);
    }
    // 不解释
    reject (err) {
      this.changeStateHandler && this.changeStateHandler(REJECTED, err);
    }

    // 不解释
    then(thenHandler){
      
      const currentState = this.getPromiseState();
      const promiseData = this.getPromiseValue();

      if (currentState === FULFILLED) thenHandler(promiseData);
      else if (currentState === PENDDING) this.thenQueue.push(thenHandler);
    }

    // 不解释
    catch(catchHandler){
      
      const currentState = this.getPromiseState();
      const promiseData = this.getPromiseValue();

      if (currentState === REJECTED) catchHandler(promiseData);
      else if (currentState === PENDDING) this.catchQueue.push(catchHandler);
    }
  }

  // 测试方法


  const test1 = new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
      resolve('2s 后输出了我');
    }, 2000)
  });

  const test2 = new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
      reject('我出错啦！')
    }, 2000)
  })

  test1.then(data=>console.log(data));
  test1.catch(err=>console.log(err));
  test2.then(data=>console.log(data));
  test2.catch(err=>console.log(err));
  console.log("我是最早的");

```

- ### 创建一个完成状态的*Promise*

  通过 *Promise*.resolve() 创建一个成功操作的 *Promise* 对象； *Promise*.reject() 创建一个捕获错误的 *Promise* 对象，new 关键字传入的方法体有报错，会直接被 reject 捕获；

  分析一波：

  1. 能直接调用的方法，妥妥应该的是一个静态方法；
  2. 调用之后要生成一个新的 *Promise* 对象；
  3. 所以咱们就要分两步走 1，创建一个 *Promise* 对象，然后调用其 resolve 方法.
  4. 因为实例化的对象不能获取寄几的 static 方法
  5. 通过 try+catch 捕获 handler 异常，并通过 reject 进行抛出；

```javascript
  // ...
  // construct 方法新增一个类型，当 new 关键字进来传递的不是一个函数，咱们同样在 eventLoop 结束抛出一个错误
  if(Object.prototype.toString.call(handler) !== "[object Function]"){
    eventLoopEndRun(()=>{
      throw new Error(`MyPromise resolver ${typeof handler} is not a function`)
    })
  } else {
    // 方法传递，this指向会变，通过 bind 保持两个方法对当前对象的引用
    // 当然也可以这么玩：data=>this.resolve(data)
    try{
      handler(this.resolve.bind(this), this.reject.bind(this));
    } catch(err) {
      this.reject(err);
    }
  }

  // ...
  // 不解释
  static resolve (data) {
    return new MyPromise(resolve=>resolve(data));
  }
  // 不解释
  static reject (err) {
    return new MyPromise((resolve, reject)=>{reject(err)});
  }

  // 测试方法
  var resolvePromise =  MyPromise.resolve(111);

  resolvePromise.then(data=>console.log(data));

  var rejectPromise =  MyPromise.reject('这个错了');

  rejectPromise.catch(data=>console.log(data));

  new MyPromise();

  var errPromise = new MyPromise(()=>{throw new Error("我错了")});
  errPromise.catch(data=>console.log(data.message));
```

- ### thenable 对象 + 全局错误监听

  thenable 对象是啥？就是有个属性为 then 方法的对象，then 方法里有两个参数，resolve、reject 至于 resolve 和 reject 的作用，就不赘述啦 ~~好像还是打了很多字~~。

  全局错误监听，监听分为两种（书上的说法是）: 一个触发是当前事件循环结束前没有catch 当前错误 *Promise* --- unhandledRejection；一个触发是当前事件循环后，当 *Promise* 被拒绝，并且没有 catch 程序，就会被触发 --- rejectionHandled。经过 node 环境下测试(在 Chrome 控制台测试好像无论如何都不会被触发)感觉是 rejectionHandled 触发实在新的时间循环添加 catch 程序后才会被触发，大致流程图如下。

  ![流程图](https://raw.githubusercontent.com/li2568261/es6-record/master/class%2Bpromise/do.png)

  ```javascript
  let rejected;
  
  process.on('unhandledRejection',function(event){
    console.log('onunhandledrejection');
  })
  
  process.on('rejectionHandled',function(event){
    console.log('onrejectionhandled');
  })
  
  rejected = Promise.reject(new Error('xx'))
  
  eventLoopEndRun(()=>{
    console.log(123);
    rejected.catch(err=>{
      console.log(err.message)
    })
    rejected.catch(err=>{
      console.log(err.message)
    })
  }) 
  
  ```

  分析一波：

  1. 在 reject 阶段进行订阅 ```unhanlderReject``` 事件；
  2. catch 函数中移除当前 *Promise* 对 ```unhandledRejection``` 事件的订阅，执行传入 catch 前发布当前 *Promise* 的 ```rejectionHandled``` 事件。
  3. 当前事件循环结束，我们需要优先对 ```unhanlderReject``` 事件进行发布，所以我们需要调整eventLoopEndRun 函数；当*Promise*没有 catch 程序,且没有全局没有 ```unhanlderReject``` 监听，我们就要抛出相应的错误。
  4. 我们需要自定义这个 订阅发布者，然后能通过当前 *Promise* 使得事件触发绑定相应的回调。
  5. 这个发布订阅者具有备的功能有： 1、新增监听回调；2、订阅和取消订阅；3、相应的事件发布后，将对应 map 中 *Promise* 修改状态。

于是乎代码如下：

```javascript
  // PromiseSubscribePublish.js
  const UNHANDLEDREJECTION = 'UNHANDLEDREJECTION'; // 当前事件循环，无 catch 函数状态；
  const REJECTIONHANDLED = 'REJECTIONHANDLED'; // 事件循环后，无 catch 函数状态；

  class PromiseSubscribePublish{

    constructor(){
      this.subscribeUnhandler = new Map();
      this.subscribeHandler = new Map();
      this.errFuc = {}
    }

    // 监听事件绑定
    bindLisener (type, cb){
      console.log(type.toUpperCase(), UNHANDLEDREJECTION)
      if(type.toUpperCase() !== UNHANDLEDREJECTION && type.toUpperCase() !== REJECTIONHANDLED) throw Error('type toUpperCase must be UNHANDLEDREJECTION or REJECTIONHANDLED');
      if(Object.prototype.toString.call(cb) !== "[object Function]") throw Error('callback is not function');
      this.errFuc[type.toUpperCase()] = cb;
    }

    subscribe(promise, err){
      // 订阅一波，以当前 Promise 为 key，err 为参数,加入 unhandler map 中
      this.subscribeUnhandler.set(promise, err)
    }

    quitSubscribe(promise){
      this.subscribeUnhandler.delete(promise);
    }

    publish (type, promise) {
      
      let changgeStateFuc; // 定义当前状态变换操作
      const errFuc = this.errFuc[type]; // 当前绑定的监听函数


      
      if(type === UNHANDLEDREJECTION){
        // 没有订阅事件的 promise 则啥也不干
        if (!this.subscribeUnhandler.size) return;
        // 根据当前事件类型，选择处理函数
        changgeStateFuc = (err, promise)=>{
          this.subscribeHandler.set(promise);
          this.subscribeUnhandler.delete(promise, err);
        }
        // 不论如何当前时间循环下的等待队列状态全部需要变更
        if(errFuc){
          this.subscribeUnhandler.forEach((err, promise)=>{
            errFuc(err, promise)
            changgeStateFuc(err, promise)
          })
        } else {
          this.subscribeUnhandler.forEach((err, promise)=>{
            changgeStateFuc(err, promise)
          })
          console.error('Uncaught (in promise)', err);
        }

      } else {
        // 如果该 promise 没有进行订阅
        if(!this.subscribeHandler.has(promise)) return;
        // 哪个 promise 发布 catch 函数，就根据当前 Promise 执行相应方法，并将其从 Handler 订阅者里删除
        
        errFuc && errFuc(promise);
        this.subscribeHandler.delete(promise);

      } 

    }
  }

  // 定义一些静态成员变量 默认不可写
  Object.defineProperties(PromiseSubscribePublish, {
    [UNHANDLEDREJECTION]:{
      value: UNHANDLEDREJECTION
    },
    [REJECTIONHANDLED]:{
      value: REJECTIONHANDLED
    }
  })

  module.exports = PromiseSubscribePublish;

  // MyPromise.js
  // ..
  const PromiseSubscribePublish = require('./PromiseSubscribePublish');

  const promiseSubscribePublish = new PromiseSubscribePublish();

  // 事件循环最后执行
  const eventLoopEndRun = (()=>{
    let unhandledPub;
    let timer;
    const queueHandler = [];
    // 激活事件循环最后执行
    const activateRun = ()=>{
      // 截流
      timer && clearTimeout(timer);
      timer = setTimeout(()=>{
        unhandledPub && unhandledPub();
        let handler = queueHandler.shift();
        while(handler){
          handler();
          handler = queueHandler.shift();
        }
      },0);
    }
    
    // 设置 unhanldedReject 优先级最高 ， 直接加入队列
    return (handler,immediate)=> {
      immediate ? unhandledPub = handler : queueHandler.push(handler);
      activateRun();
    }
  })()
  
  //...
  reject (err) {
    this.changeStateHandler && this.changeStateHandler(REJECTED, err);
    promiseSubscribePublish.subscribe(this, err);
    // 存在 reject ，事件循环结束发布 UNHANDLEDREJECTION
    eventLoopEndRun(()=>
      promiseSubscribePublish.publish(PromiseSubscribePublish.UNHANDLEDREJECTION, this),
      true
    );
  }

  //...

  static unhandledRejectionLisener(cb){
    promiseSubscribePublish.bindLisener(PromiseSubscribePublish.UNHANDLEDREJECTION ,cb)
  }

  static rejectionHandledLisener(cb){
    promiseSubscribePublish.bindLisener(PromiseSubscribePublish.REJECTIONHANDLED ,cb)
  }

  // ...
  catch(catchHandler){
    
    const currentState = this.getPromiseState();
    const promiseData = this.getPromiseValue();

    // 取消当前事件循环下 reject 状态未 catch 事件订阅;
    promiseSubscribePublish.quitSubscribe(this);
    
    if (currentState === REJECTED) {
      
      eventLoopEndRun(()=>{
        // 发布 catch 处理
        promiseSubscribePublish.publish(PromiseSubscribePublish.REJECTIONHANDLED, this);
        catchHandler(promiseData);
      });

    }
    else if (currentState === PENDDING) this.catchQueue.push(catchHandler);
  }


  // 测试代码

  MyPromise.unhandledRejectionLisener((err,promise)=>{
    console.log(err, promise);
  }) 
  MyPromise.rejectionHandledLisener((err,promise)=>{
    console.log(err, promise);
  }) 
  var myPromise = MyPromise.reject(11);
  // myPromise.catch(()=>{console.log('catch')});
  setTimeout(()=>{
    myPromise.catch(()=>{console.log('catch')});
  },1000)


```

- ### 串联 *Promise* 以及 *Promise* 链返回值

  看到链式，首先想到的是 jquery 调用。jquery 返回的是 jquery 对象本体。而 *Promise* 根据状态判断：

  - 当是操作成功状态时，调用 catch 会返回和当前 *Promise* 的 ```[[PromiseStatus]]``` 和 ```[[PromiseValues]]``` 状态相同新构建的 *Promise*；调用 then 方法时，返回和当前 *Promise* 的 ```[[PromiseStatus]]``` 相同的，```[[PromiseValues]]``` 值为 then 方法返回值的 新构建的 *Promise*；
  - 当是捕获错误状态时，调用 then 会返回和当前 *Promise* 的 ```[[PromiseStatus]]``` 和 ```[[PromiseValues]]``` 状态相同新构建的 *Promise*；调用 catch 方法时， 返回操作成功的新构建的 *Promise* ，```[[PromiseValues]]``` 值为 catch 方法返回值；
  - 当执行 catch 或 then 方法体内有报错，直接返回一个新构建捕获错误的 *Promise* ，```[[PromiseValues]]```  为那个错误；
  - 如果 *Promise* 中有一环出现错误，而链中没有 catch 方法，则抛出错误，否则把链上的所有 Promise 都从 ```unhandledRejuect``` 订阅中去除。
  - 因为 then 和 catch 回调方法是当前事件循环结束时才执行，而 catch 去除  *Promise* 链上 ```unhandledRejuect``` 订阅是当前事件循环，如果链上有方法报错，```unhandledRejuect``` 订阅会再次发生，这样会造成哪怕当前报错 *Promise* 后有 catch，也会抛出错误，因此需要给当前 *Promise* 加一个属性，以标志链后有 catch，使得其不订阅 ```unhandledRejuect``` 事件。

  分析一波：

  1. 要在实例方法中，创建另一个当前类的实例时，必须用到当前类的构造函数。当咱们的类被继承出一个派生类，咱们希望返回的是那个派生类，于是不能直接 new MyPromise 去创建,而要使用一个 Symbol.species
  2. 新建 *Promise* 和之前的 *Promise* 存在关联,所以当前 *Promise* 的状态决定新 *Promise* 状态，构建新 *Promise* 的过程中当前 *Promise* 的捕获函数不能将其订阅从 unhandledReject 中移除，所以需要一个标志位来标识 then 函数属性。
  3. *Promise* 链上如果出现 catch 函数，链上 catch 函数之前的所有 *Promise* 都将从订阅 unhandledReject Map 中移除，因此 *Promise* 需要记录链上的上一级 *Promise*；
  4. *Promise* then 或 catch 方法体内报错将构建一个捕获错误状态的 *Promise*，因此需要一个函数去捕获可能发生的错误；

```javascript
  //... MyPromise.js


  const runFucMaybeError = handler => {
    try {
      return handler();
    } catch(err) {
      return {
        iserror: FUCERROR,
        err
      };
    }
  }

  const clearLinksSubscribe = linkPrePromise=>{
    while(linkPrePromise && !linkPrePromise.hascatch){
      linkPrePromise.hascatch = true;
      promiseSubscribePublish.quitSubscribe(linkPrePromise);
      linkPrePromise = linkPrePromise.linkPrePromise;
    }
  }
  // 不解释
  then(thenHandler, quitReturn){
    
    const currentState = this.getPromiseState();
    const promiseData = this.getPromiseValue();
    let nextPromiseData;
    if (currentState === FULFILLED) eventLoopEndRun(()=>{
      nextPromiseData = runFucMaybeError(()=>thenHandler(promiseData))
    });
    else if (currentState === PENDDING) this.thenQueue.push(data=>{
      nextPromiseData = runFucMaybeError(()=>thenHandler(data))
    });

    if(!quitReturn){
      const nextPromise = new this.constructor[Symbol.species]((resolve,reject)=>{
        
        this.catch(err=>{
          reject(err);
        }, true);
        // 根据队列原则，执行肯定在当前 then 后，保证能正确拿到前一个 Promise 的返回值
        this.then(()=>{
          nextPromiseData && nextPromiseData.iserror === FUCERROR 
            ? reject(nextPromiseData.err) 
              : resolve(nextPromiseData)
        }, true)
      })
      nextPromise.linkPrePromise = this;
      return nextPromise;
    };

  }

  catch(catchHandler, quitReturn){
    
    const currentState = this.getPromiseState();
    const promiseData = this.getPromiseValue();
    let nextPromiseData;
    // 取消当前事件循环下 reject 状态未 catch 事件订阅;
    // 当是实例内部调用时,不能将当前 Promise 从 unhandledReject 队列中移除；
    // 否则顺着生成链依次将 Promise 移除；
    if(!quitReturn)clearLinksSubscribe(this)
    if (currentState === REJECTED) {
      
      eventLoopEndRun(()=>{
        // 发布 catch 处理
        promiseSubscribePublish.publish(PromiseSubscribePublish.REJECTIONHANDLED, this);
        nextPromiseData = runFucMaybeError(()=>catchHandler(promiseData));
      });

    }
    else if (currentState === PENDDING) this.catchQueue.push(data=>{
      nextPromiseData = runFucMaybeError(()=>{catchHandler(data)})
    });

    if(!quitReturn){
      
      const nextPromise = new this.constructor[Symbol.species]((resolve,reject)=>{
        // 根据队列原则，执行肯定在当前 then 后，保证能正确拿到报错的 Promise 的返回值
        this.catch(()=>{
          nextPromiseData && nextPromiseData.iserror === FUCERROR 
          ? reject(nextPromiseData.err) 
            : resolve(nextPromiseData)
        }, true);
        this.then(data=>resolve(data), true)
      })
      nextPromise.linkPrePromise = this;
      return nextPromise;
    }

  }

  // 测试代码
  const test1 = new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
      resolve('2s 后输出了我');
    }, 2000)
  });


  test1.then(data=>{
    console.log(data);
    return '你好'
  }).then(data=>{
    console.log(data);
    return '不好'
  }).then(data=>{
    console.log(data);
  });

  test1.catch(err=>console.log(err)).then(data=>{
    console.log(data);
    return 'gggg'
  }).then(data=>{
    console.log(data);
  });

  const test2 = new MyPromise((resolve,reject)=>{
    throw new Error('xx');
  })

  test2.then(data=>console.log(data)).catch(err=>console.log(err));

  test2.catch(err=>console.log(err)).then(data=>{
    console.log(data);
    return '你好'
  }).then(data=>{
    console.log(data);
    return '不好'
  }).then(data=>{
    console.log(data);
  });
  var a = MyPromise.resolve(1);
  var b = a.then(data=>{throw new Error('11')}).catch(err=>{console.log(err.message)})
```

- ### *Promise*.all + *Promise*.race;

  *Promise*.all 有如下特性: 1、接收一个具有[Symbol.iterator]函数的数据， 返回一个 *Promise*，该 *Promise* 成功操作，then 方法传入一个数组，数组数据位置和迭代器迭代返回的顺序相关联，该 *Promise* 捕获错误 catch 里的传入捕获的错误; 2、 迭代器遍历结果如果是 *Promise* , 则将其 PromiseValue 作为值，插入传入数组对应的位置，当遍历结果不是 *Promise* 直接插入数组对应位置，当遇到捕获错误，或者 *Promise* 出现错误时直接将状态转变为 rejected 状态 ，从 catch 拿到相应错误的值；总结就是有错马上抛，要不等所有数据处理完才改变状态；

  *Promise*.race 就不赘述：记住几点，传入参数要求和 .all 相同，数据处理方式是，先到先得，率先处理完的数据直接修改状态。

  在分析一波之前，调整几个之前的没有考虑到的问题：

  1. 将状态改变函数覆盖操作移至 resolve 和 reject 函数中。
  2. reject 方法体执行全都由是否能改变状态决定。
  3. reject 新增一个参数，表示不订阅 ```unhandledReject``` 事件，因为 then 方法也会生成新的 *Promise*，而 then 链前有捕获异常状态的 *Promise* 会造成重复报错，catch 无所谓,因为本身会Promise 链队列。

```javascript
  // 开头的 '-' 标示移除，'+' 表示新增
  // ... changeStateHandler 方法
  -  this.changeStateHandler = null;

  resolve (data) {
    if(this.changeStateHandler){
      this.changeStateHandler(FULFILLED, data);
      // 保持状态只能改变一次
      this.changeStateHandler = null;
    }
  }

  reject (err, noSubscribe) {
    if(this.changeStateHandler){ 
      this.changeStateHandler(REJECTED, err);
      !noSubscribe && !this.hascatch && promiseSubscribePublish.subscribe(this, err);
      // 存在 reject ，事件循环结束发布 UNHANDLEDREJECTION
      eventLoopEndRun(()=>
        promiseSubscribePublish.publish(PromiseSubscribePublish.UNHANDLEDREJECTION, this),
        true
      );
      // 保持状态只能改变一次
      this.changeStateHandler = null;
    }
  }

  // then 方法
  - this.catch(err=>{
    reject(err)
  }, true);
  
  + this.catch(err=>reject(err, true), true);
```

  接下来开始分析一波：

1. 首先咱们的判断，传入的是否具有 ```Symbol.iterator```，没有就直接抛错（*Promise* 状态会直接变为 reject，就不往下说了）；
2. 因为咱们定义的 MyPromise 所以判断类型应该是 MyPromise，如果想要通过 ```Object.prototype.toString.call``` 去判断，咱们需要给咱们的类加一个 tag
3. .all 处理完一波数据插入结果值对应的位置，判断是否数据完全处理完，如果全部处理完才改变状态。.race 处理完那个直接改变状态，忽略后面、忽略后面、忽略后面(重要的事情哔哔3次)。
4. 两边如果有传入的 *Promise* 状态出现捕获异常,返回的 *Promise* 状态即变为异常，catch 得到的值即为传入 *Promise* 异常的那个异常 ~~绕死你~~。
5. 因为是静态方法所以不能用 Symbol.species 构建实例。

```javascript
  // MyPromise.js 最后头
  MyPromise.prototype[Symbol.toStringTag] = "MyPromise";


  static all (promiseArr){
    
    
    
    // 因为是静态方法 无法获取 this 所以不能使用实例内部方法构建方式去构建新对象
    return new MyPromise((resolve,reject)=>{
      const iterator = isIterator(promiseArr);
      
      if(typeof iterator === 'string'){
        console.error(iterator);
        throw new Error(iterator);
      }

      let data = iterator.next();
      const result = [];
      let index = -1; // Promise 应存放返回数组的位置；
      let waitPromiseNum = 0; // 统计未完成的 Promise；
      
      let checkAllEnd = () => {
        return waitPromiseNum === 0;
      }

      while (data) {
        if(data.done) break;
        index ++;
        if(Object.prototype.toString.call(data.value) !== "[object MyPromise]"){
          result[index] = data.value;
        } else {

          (index=>{
            const promise = data.value; 
            waitPromiseNum++;
            promise.then(data=>{
              result[index] = data;
              waitPromiseNum--;
              // 看是否 Promise 全部完成
              if(checkAllEnd())resolve(result);
            }).catch(data=>reject(data));
          })(index)

        }
        data = iterator.next();
      }

      if(checkAllEnd())resolve(result);
    })
  }

  static race (promiseArr){
    
    // 因为是静态方法 无法获取 this 所以不能使用实例内部方法构建方式去构建新对象
    return new MyPromise((resolve,reject)=>{
      const iterator = isIterator(promiseArr);

      if(typeof iterator === 'string'){
        console.error(iterator);
        throw new Error(iterator);
      }

      let data = iterator.next();
      while (data) {
        if(data.done) break;
        if(Object.prototype.toString.call(data.value) !== "[object MyPromise]"){
          return resolve(data.value);
        } else {
          data.value
            .then(data=>resolve(data))
            .catch(data=>reject(data));
        }
        data = iterator.next();
      }

    })
  }

  // 测试方法

  MyPromise.all(
    [
      MyPromise.resolve(1),
      new MyPromise(resolve=>setTimeout(()=>resolve(2), 1000)),
      MyPromise.resolve(3)
    ]).then(data=>{console.log(data)});

  MyPromise.all([
    1,
    new MyPromise(resolve=>setTimeout(()=>resolve(2), 1000)),
    MyPromise.resolve(3)
    ]).then(data=>{console.log(data)});

  MyPromise.all([
    MyPromise.resolve(1),
    new MyPromise(resolve=>setTimeout(()=>resolve(2), 1000)),
    MyPromise.reject(3)
    ]).then(data=>{console.log(data)});


  MyPromise.race([
    MyPromise.resolve(1),
    new MyPromise(resolve=>setTimeout(()=>resolve(2), 1000)),
    MyPromise.resolve(3)
    ]).then(data=>{console.log(data)});

  MyPromise.race([
    1,
    new MyPromise(resolve=>setTimeout(()=>resolve(2), 1000)),
    MyPromise.resolve(3)
    ]).then(data=>{console.log(data)});
    
  MyPromise.race([
    MyPromise.resolve(1),
    new MyPromise(resolve=>setTimeout(()=>resolve(2), 1000)),
    MyPromise.reject(3)
    ]).then(data=>{console.log(data)});
```

## 结束

> 如果发现过程遇到什么问题，欢迎及时提出。