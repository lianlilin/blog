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
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (e) {
            this.reject(e);
        }
    }
    // 这里可能需要注意this指向问题
    resolve(value) {
        if (this.status === PENDING) {
            this.value = value;
            this.status = FULFILLED;
            this.onFulfilled.forEach(fn => fn(value));
        }
    }
    reject(reason) {
        if (this.status === PENDING) {
            this.status = REJECTED;
            this.reason = reason;
            this.onRejected.forEach(fn => fn(reason));
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
}



module.exports = MyPromise;

MyPromise.defer = MyPromise.deferred = function () {
    let dfd = {};
    dfd.promise = new MyPromise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}