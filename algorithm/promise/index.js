const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        reject(new TypeError('Cannot resolve promise with itself'));
    }
    // 根据规范，如果x不是对象或者函数，以x fulfill x
    if (!x || typeof x !== 'object' && typeof x !== 'function') {
        resolve(x);
    }
    else {
        let used = false;
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (used) {
                        return;
                    }
                    used = true;
                    resolvePromise(promise, y, resolve, reject);
                }, r => {
                    if (used) {
                        return;
                    }
                    used = true;
                    reject(r);
                })
            }
            else {
                if (used) {
                    return;
                }
                used = true;
                resolve(x);
            }
        }
        catch (e) {
            if (used) {
                return;
            }
            used = true;
            reject(e);
        }
    
    }
}

class MyPromise {
    status = PENDING; // 默认为pending
    onFulfilled = []; // 当状态变为fulfilled时执行的回调函数
    onRejected = []; // 当状态变为rejected时执行的回调函数
    value = undefined; // fulfilled时的value
    reason = undefined; // rejected时的reason
    constructor(executor) {
        // 这里可能需要注意this指向问题
        const resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value;
                this.status = FULFILLED;
                this.onFulfilled.forEach(fn => fn(value));
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejected.forEach(fn => fn(reason));
            }
        }
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        // 按照规范约定，onFulfilled和onRejected必须是函数，否则会被忽略
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason;};
        let self = this;
        let thenPromise = new MyPromise((resolve, reject) => {
            if (self.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value);
                        resolvePromise(thenPromise, x, resolve, reject);
                    } catch(e) {
                        // 根据规范，如果 onFulfilled 执行时抛出异常e, thenPromise需要被reject
                        reject(e);
                    }
                }, 0);
            }
            else if (self.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(self.reason);
                        resolvePromise(thenPromise, x, resolve, reject);
                    } catch(e) {
                        // 根据规范，如果 onRejected 执行时抛出异常e, thenPromise需要被reject
                        reject(e);
                    }
                }, 0);
            }
            else if (self.status === PENDING) {
                self.onFulfilled.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(self.value);
                            resolvePromise(thenPromise, x, resolve, reject);
                        } catch(e) {
                            reject(e);
                        }
                    }, 0);
                });
                self.onRejected.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(self.reason);
                            resolvePromise(thenPromise, x, resolve, reject);
                        } catch(e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        return thenPromise;
    }
    static resolve(params) {
        // 已经是promise实例直接返回
        if (params instanceof MyPromise) {
            return params;
        }
        return new MyPromise((resolve, reject) => {
            // 空参数或者不是thenable，直接resolve
            if (!params || !params.then || typeof params.then !== 'function') {
                resolve(params);
            }
            else {
                setTimeout(() => {
                    params.then(resolve, reject);
                }, 0)
            }
        })
    }
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }
    // 用于指定出错时的回调，是特殊的then方法，catch之后，可以继续 .then
    catch(onRejected) {
        // 第一个参数传null，相当于写 value => value
        return this.then(null, onRejected)
    }
    // 不管成功还是失败，都会走到finally中,并且finally之后，还可以继续then。并且会将值原封不动的传递给后面的then.
    // finally之后是不是收不到finally返回值的
    finally(callback) {
        return this.then(value => {
            return Promise.resolve(callback()).then(() => value);
        }, reason => {
            // 这里直接promise.reject是否可行？
            return Promise.resolve(callback()).then(() => {
                throw reason;
            });
        });
    }
    static all(promises) {
        return new MyPromise((resolve, reject) => {
            let index = 0;
            let result = [];
            if (promises.length === 0) {
                resolve([]);
            }
            else {
                const processValue = (i, data) => {
                    result[i] = data;
                    if (++index === promises.length) {
                        resolve(result);
                    }
                }
                for (let i = 0; i < promises.length; i++) {
                    MyPromise.resolve(promises[i]).then(data => {
                        processValue(i, data);
                    }, err => {
                        reject(err);
                        return;
                    })
                }
            }
        });
    }
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            if (promises.length === 0) {
                return;
            }
            for (let i = 0; i < promises.length; i++) {
                MyPromise.resolve(promises[i]).then((data) => {
                    resolve(data);
                    return;
                }, (err) => {
                    reject(err);
                    return;
                });
            }
        });
    }
}

// 测试 MyPromise.resolve
let p = MyPromise.resolve(20);
p.then((data) => {
    console.log(data);
});


let p2 = MyPromise.resolve({
    then: function(resolve, reject) {
        resolve(30);
    }
});

p2.then((data)=> {
    console.log(data)
});

let p3 = MyPromise.resolve(new MyPromise((resolve, reject) => {
    resolve(400)
}));
p3.then((data) => {
    console.log(data)
});

// 测试 MyPromise.reject
let r = MyPromise.reject('test reject');

r.then(null, reason => {
    console.log(reason);
});

// 测试 MyPromise.finally
r.finally(() => {
    console.log('finally');
    return Promise.reject('finally2');
}).then(res => {
    console.log('res', res)
}, reason => {
    console.log('reason', reason)
});

// 测试 MyPromise.all
let promise1 = MyPromise.resolve(3);
var promise2 = 42;
var promise3 = new MyPromise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});

MyPromise.all([promise1, promise2, promise3]).then(function(values) {
  console.log(values); //[3, 42, 'foo']
},(err)=>{
    console.log(err)
});

var p4 = MyPromise.all([]); // will be immediately resolved
var p5 = MyPromise.all([1337, "hi"]); // non-promise values will be ignored, but the evaluation will be done asynchronously
console.log('p4', p4);
console.log('p5', p5);
setTimeout(function(){
    console.log('the stack is now empty');
    // console.log(p4);
});

// 测试 MyPromise.race
MyPromise.race([
    new MyPromise((resolve, reject) => { setTimeout(() => { resolve(100) }, 1000) }),
    undefined,
    new MyPromise((resolve, reject) => { setTimeout(() => { reject(100) }, 100) })
]).then((data) => {
    console.log('success ', data);
}, (err) => {
    console.log('err ',err);
});

MyPromise.race([
    new MyPromise((resolve, reject) => { setTimeout(() => { resolve(100) }, 1000) }),
    new MyPromise((resolve, reject) => { setTimeout(() => { resolve(200) }, 200) }),
    new MyPromise((resolve, reject) => { setTimeout(() => { reject(100) }, 100) })
]).then((data) => {
    console.log(data);
}, (err) => {
    console.log(err);
});

module.exports = MyPromise;

MyPromise.defer = MyPromise.deferred = function () {
    let dfd = {};
    dfd.promise = new MyPromise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}