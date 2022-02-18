const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    const resolve = (value) => {
      if(this.status == PENDING) {
        this.value = value
        this.status = FULFILLED
      }
    }

    const reject = (reason) => {
      if(this.status == PENDING) {
        this.reason = reason
        this.status = REJECTED
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
  }
}

const p1 = new Promise((resolve, reject) => {
  // resolve('成功')
  // reject('失败')
  throw new Error('未知错误')
})

p1.then((value) => {
  console.log('成功了耶', value)
}, (reason) => {
  console.log('失败了哦', reason)
})
