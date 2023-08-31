# PromiseA+规范

## 术语
- Promise
  - Promise是一个拥有`.then`方法的对象或者函数，其行为符合本规范
- thenable
  - 是一个定义了`.then`方法的对象或者函数
- 值（value）
  - promise的终值，可以是任何JavaScript的合法值（包括undefined, thenable和Promise）
- 异常（exception）
  - 是使用throw语句抛出的值
- 拒因（reason）
  - 表示一个Promise拒绝的原因

## 状态
一个Promise的状态必须处于Pending、Fulfille、Rejected之一。
- Pending
  - 可以变成fulfilled或者rejected
- fulfilled
  - 不能变成其它状态
  - 必须有一个不可变的value值
- rejected
  - 不能变成其它状态
  - 必须有一个不可变的reason

## .then方法

peomise必须提供一个then方法，来访问最终的结果，promise的then方法接受两个参数
```js
promise.then(onFulfilled, onRejected);
```
- 参数可选
  - onFulfilled和onRejected都是可选参数
  - onFulfilled和onRejected必须是函数类型，否则将会被忽略
- onFulfilled和onRejected特性
  - onFulfilled必须在promise状态变成`fulfilled`时被调用(peomise执行结束前不得调用)，参数是promise的value，只能被调用一次
  - onRejected必须在promise状态变成`rejected`是被调用(peomise执行结束前不得调用)，参数是promise的reason，只能被调用一次
- 调用时机
  - onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用。(大意是在微任务队列执行)
- 调用要求
  - onFulfilled和onRejected都必须被作为函数被调用
- 多次调用
  - then方法可以被同一个promise调用多次
  - 如果promise变成fulfilled，所有的onFulfilled回调需要按照then的顺序执行
  - 如果promise变成了rejected，所有的onRejected回调都需要按照then的顺序执行
- 返回值
  - then方法必须返回一个promise对象
  
    ```js
    promise2 = promise1.then(onFulfilled, onRejected)
    ```
  - onFulfilled 或 onRejected 执行的结果为x,调用 resolvePromise，即下面的`[[Resolve]](Promise2, x)`
  - 如果 onFulfilled 或者 onRejected 执行时抛出异常e,promise2需要被reject
  - 如果 onFulfilled 不是一个函数且最终fulfilled，promise2 以promise1的值fulfilled
  - 如果 onRejected 不是一个函数且promise1最终rejected，promise2 以promise1的reason rejected

## 解决过程

promise解决过程是一个抽象的操作，其需输入一个promise和一个值，表示为`[[Resolve]](Promise2, x)`，如果 x 有 then 方法且看上去像一个 Promise ，解决程序即尝试使 Promise 接受 x 的状态；否则其用 x 的值来执行 Promise 。这种 thenable 的特性使得 Promise 的实现更具有通用性：只要其暴露出一个遵循 Promise/A+ 协议的 then 方法即可；这同时也使遵循 Promise/A+ 规范的实现可以与那些不太规范但可用的实现能良好共存。运行`[[Resolve]](Promise, x)`需遵循以下步骤：

- x与promise相等
  - 以TypeError为reason reject promise
- x为promise
  - 如果 x 处于pending，promise 需保持为pending直至 x 被fulfill或reject
  - 如果 x 处于fulfilled，用相同的value执行promise
  - 如果 x 处于rejected，用相同的reason拒绝Promise
- x是一个object或者function
  - let then = x.then
  - 如果取x.then时抛出异常，则以该reason reject promise
  - 如果then是函数，`then.call(x, resolvePromiseFn, rejectPromise)`，即以x作为this调用then
    - resolvePromiseFn 的 入参是 y, 执行 resolvePromise(promise2, y, resolve, reject);
    - rejectPromise 的 入参是 r, reject promise with r.
    - 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
    - 如果调用then方法出了异常
      - 如果 resolvePromise 或 rejectPromise 已经被调用，那么忽略
      - 否则，reject promise with e as the reason
  - 如果 then 不是一个function. fulfill promise with x.
- 如果x不是object或者function
  - 以x为参数执行promise

## 其它方法

## 参考资料

- [Promise 原理解析与源码实现（遵循 Promise/A+ 规范）](https://github.com/silinchen/promise#promise-%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90%E4%B8%8E%E6%BA%90%E7%A0%81%E5%AE%9E%E7%8E%B0%E9%81%B5%E5%BE%AA-promisea-%E8%A7%84%E8%8C%83)
- [Promise.prototype.then()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)