const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    this.onFulFilledCallbacks = [] // 存放异步时成功的回调
    this.onRejectedCallbacks = [] // 存放异步时失败的回调

    const resolve = (value) => {
      if(this.status == PENDING) {
        this.value = value
        this.status = FULFILLED
        this.onFulFilledCallbacks.forEach(cb => cb(this.value))
      }
    }

    const reject = (reason) => {
      if(this.status == PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.onRejectedCallbacks.forEach(cb => cb(this.reason))
      }
    }

    try {
      executor(resolve, reject)
    } catch(e) {
      reject(e)
    }
  }

  then(onFulFilled, onRejected) {
    if(this.status == FULFILLED) {
      onFulFilled(this.value)
    }
    if(this.status == REJECTED) {
      onRejected(this.reason)
    }

    if(this.status === PENDING) { // 异步问题解决方案：发布订阅（先执行了点then，调用then时，没成功也没失败，就将事件先存起来）
      // 使用发布订阅
      // 先把事件存起来，当状态发生改变时，再从数组中依次调
      this.onFulFilledCallbacks.push(onFulFilled)
      this.onRejectedCallbacks.push(onRejected)
    }
  }
}
