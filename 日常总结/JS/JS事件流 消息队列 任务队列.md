<!--
 * @Descripttion: 
 * @Author: ganbowen
 * @Date: 2019-10-27 15:07:11
 * @LastEditors: ganbowen
 * @LastEditTime: 2019-12-10 20:30:11
 -->
同步：js语句从上向下执行依次进入js执行环境栈 执行完成 从执行环境栈出栈

异步：不阻塞主程序的执行进程，在执行到异步的js语句时 会区分添加到消息队列或者任务队列等待事件轮询 然后再执行回调
![Image text](https://raw.githubusercontent.com/ganbowengo/imgs/master/articleImg/eventLoop.png)

事件轮询、web api和消息队列不是JavaScript引擎的一部分，而是浏览器的JavaScript运行时环境或Nodejs JavaScript运行时环境的一部分(对于Nodejs)。

事件轮询：
事件轮询的工作是监听调用堆栈，并确定调用堆栈是否为空。如果调用堆栈是空的，它将检查消息队列，看看是否有任何挂起的回调等待执行。
监听JS的执行环境栈中是否为空 为空时 
先将任务队列的JS语句(回调)添加到执行环境栈中执行完成 
再将消息队列中的JS语句(回调)添加到执行环境栈中执行完成

消息队列：
定时器
消息队列还包含来自DOM事件(如单击事件和键盘事件)的回调

任务队列：
ES6引入了任务队列的概念，任务队列是 JS 中的 promise 所使用的。

消息队列和任务队列的区别在于，任务队列的优先级高于消息队列，这意味着任务队列中的promise.then将在消息队列中的回调之前执行

V8中的消息队列与事件循环： 消息队列与延迟消息队列 两种区分，同步任务都在消息队列中，微任务和异步回调都在延迟消息队列中，微任务的优先级高于异步回调，同时消息队列中的当前的任务执行完后才会触发当前的执行任务的延迟消息队列。
- [最佳讲解](https://mp.weixin.qq.com/s/cOMlH-z5noHrg6Upg6zyNw)