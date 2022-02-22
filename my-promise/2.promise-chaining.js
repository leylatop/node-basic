// 链式调用
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

// 根据 x 返回结果，来判断要走resolve还是reject
function resolvePromise(p1, x, resolve, reject) {
  console.log(p1, x, resolve, reject);

  // 核心：用 x 处理 promise 是成功还是失败
  // 需要考虑不同人写的Promise 互相兼容，所以要 按照promise 规范，保证promise 可以互相调用
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
