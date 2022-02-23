// 链式调用
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

// 根据 x 返回结果，来判断要走resolve还是reject
function resolvePromise(promise, x, resolve, reject) {

  // 核心：用 x 处理 promise 是成功还是失败
  // 需要考虑不同人写的Promise 互相兼容，所以要 按照promise 规范，保证promise 可以互相调用
  if (promise === x) {
    return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<myPromise>]'))
  }

  // x 是每次 .then的 onFulFilled / onRejected的调用结果
  // promise 是 每次 .then 调用完，return的新promise
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false  // 防止重复调用resolve和reject
    try {
      const then = x.then
      if (typeof then === 'function') { // x中的then可能不是 promise中的then方法，而是通过Object.defineProperty 定义了一个then属性
        // 此时认为 x 是一个promise，并执行x的 then 方法
        // x.then(y => {},r=> {})
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise, y, resolve, reject) // 递归解析y的值
        }, r => { // 失败时，不需要递归解析，直接向上抛出错误
          if (called) return
          called = true
          reject(r)
        })
      } else {
        // 若 {} / function 中的then不是方法，依然把x作为普通值进行处理
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // 如果x 是普通值就直接把x作为下一个.then 的resolve 参数
    resolve(x)
  }
}
class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    this.onFulFilledCallbacks = [] // 存放异步时成功的回调
    this.onRejectedCallbacks = [] // 存放异步时失败的回调

    const resolve = (value) => {
      if (this.status == PENDING) {
        this.value = value
        this.status = FULFILLED
        this.onFulFilledCallbacks.forEach(cb => cb(this.value))
      }
    }

    const reject = (reason) => {
      if (this.status == PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.onRejectedCallbacks.forEach(cb => cb(this.reason))
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulFilled, onRejected) {   // 调用then时，返回了new Promise，以此实现promise的链式调用
    // 对 onFulFilled 和 onRejected 不为函数时的默认赋值
    onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }

    // 调用then的时候会立即执行resolve/reject
    // new Promise 实例化的时候，也会立即执行new Promise 参数
    // 所以就把 里层new Promise 参数 执行器 作为外层的then的执行域
    // 外层 then onFulFilled / onReject 的执行结果，会作为下一次.then的resolve参数(无论成功还是失败，，只要没抛异常，或者没有返回错误的promise，都会走下一次的resolve方法)
    let p1 = new Promise((resolve, reject) => {

      // 外层 then 的 执行内容
      if (this.status == FULFILLED) {
        setTimeout(() => {  // onFulFilled 和 onRejected 要异步执行：第一方便拿到new Promise、第二规范规定的
          try {
            let x = onFulFilled(this.value)
            resolvePromise(p1, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }
      if (this.status == REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(p1, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }
      if (this.status === PENDING) { // 异步问题解决方案：发布订阅（先执行了点then，调用then时，没成功也没失败，就将事件先存起来）
        // 使用发布订阅
        // 先把事件存起来，当状态发生改变时，再从数组中依次调

        // 当new Promise的执行器中包含异步，此时status依旧是 PENDING， 逻辑会走到这里
        // 此时依旧需要发布订阅

        // 我们需要根据onFulFilled 的执行结果去判断下一步执行 新promise 的 resolve，还是 reject
        this.onFulFilledCallbacks.push(() => {  // 根据onFulFilled的结果
          // 1. 执行onFulFilled，并将执行结果存起来
          // 2. 再根据执行结果 x 来判断下一步走 new Promise 的 resolve 还是 reject =>
          //    2.1 当x 是普通值，则直接传入到 resolve
          //    2.2 当onFulFilled 内部抛出异常，应调用 reject   
          setTimeout(() => {
            try {
              let x = onFulFilled(this.value)
              resolvePromise(p1, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(p1, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
      }
    })
    return p1
  }
}

// 此方法可以用来进行手写promise的规范测试，使用npm包为 promises-aplus-tests
Promise.deferred = function() {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return  dfd
}

// 必须暴露一下才能进行 promises-aplus-tests 测试
module.exports = Promise




/**
 * 测试场景
 */
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100)
  }, 1000)
}).then((data) => {
  console.log(data, 's');
  var x = new Promise((resolve, reject) => {
    // 立即执行
    resolve(new Promise((resolve, reject) => {
      resolve('唱歌吧方法')
    }).then(() => {
      console.log('里面');
    }).then(() => {
      console.log('里面2');
    })
    )
  }).then(() => {
    console.log('外面');

  })
  return x
  // 1. 调用完 onFulFilled 后 返回的是 x，是一个promise
  // 2. 执行promise的.then方法
  // 3. 谁的onFulFilled先执行完，先执行下一次.then
}, (err) => {
  console.log(err, 'e');
})

p1.then((data) => {
  console.log(data, 'ss')
}, (err) => {
  console.log(err, 'ee');
})

/**
 * 执行结果：
 * log: 外部promise
 * log: 外部第一个then
 * log: 内部promise
 * log: 内部第一个then
 * log: 内部第二个then
 * log: 内部第三个then
 * log: 内部第四个then
 * log: 外部第二个then
 * log: 外部第三个then
 * log: 外部第四个then
 * 
 * 原因：
 * 在第一个.then 的 onFulFilled 方法里面 手动return了一个promise对象
 * 若 onFulFilled 的执行结果 为一个promise 对象，就递归解析，优先执行该promise的then
 */
new Promise((resolve, reject) => {
  console.log("log: 外部promise");
  resolve();
})
  .then(() => {
    console.log("log: 外部第一个then");
    return new Promise((resolve, reject) => {
      console.log("log: 内部promise");
      resolve();
    })
      .then(() => {
        console.log("log: 内部第一个then");
      })
      .then(() => {
        console.log("log: 内部第二个then");
      })
      .then(() => {
        console.log("log: 内部第三个then");
      }).then(() => {
        console.log("log: 内部第四个then");
      });
  })
  .then(() => {
    console.log("log: 外部第二个then");
  }).then(() => {
    console.log("log: 外部第三个then");
  }).then(() => {
    console.log("log: 外部第四个then");
  });


/**
 * 执行结果
 * log: 外部promise
 * log: 外部第一个then
 * log: 内部promise
 * log: 内部第一个then
 * log: 外部第二个then
 * log: 内部第二个then
 * log: 外部第三个then
 * log: 内部第三个then
 * log: 外部第四个then
 * log: 内部第四个then
 * 原因：
 * 在第一个.then 的 onFulFilled 方法里面 没有返回结果
 * 若没有返回结果，就执行 resolve，然后执行下一个.then 的 reject
 * 下一个 .then 依赖于上一次 onFulFilled 的执行结果，内外 .then依次注册
 */
new Promise((resolve, reject) => {
  console.log("log: 外部promise");
  resolve();
})
  .then(() => {
    console.log("log: 外部第一个then");
    new Promise((resolve, reject) => {
      console.log("log: 内部promise");
      resolve();
    })
      .then(() => {
        console.log("log: 内部第一个then");
      })
      .then(() => {
        console.log("log: 内部第二个then");
      })
      .then(() => {
        console.log("log: 内部第三个then");
      }).then(() => {
        console.log("log: 内部第四个then");
      });
  })
  .then(() => {
    console.log("log: 外部第二个then");
  }).then(() => {
    console.log("log: 外部第三个then");
  }).then(() => {
    console.log("log: 外部第四个then");
  });