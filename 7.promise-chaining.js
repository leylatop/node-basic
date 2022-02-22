const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100)
  }, 1000)
}).then((data) => {
  console.log(data, 's');
  return new Promise((resolve, reject) => {

  })
  return data
}, (err) => {
  console.log(err, 'e');
})

p1.then((data) => {
  console.log(data, 'ss')
}, (err) => {
  console.log(err, 'ee');
})

// x 是调用then的返回值
// p1 是调用then后返回的新promise
// 我们用x的值来决定p1是成功还是失败

// 1. new promise的实例的 then方法的 resolve方法，resolve方法执行结果返回的如果不是promise（undefined、数字、字母之类的），那么return的结果会作为下一个.then的resolve的参数
// 2. new promise的实例的 then方法的 resolve方法，resolve方法执行出错了，会执行下一个.then的第二个参数即 reject 方法
// 3. new promise的实例的 then方法的 resolve方法，resolve方法执行结果返回了一个promise，则会根据该promise的执行结果，来决定执行下一个 .then 的 resolve 还是 reject方法

// 失败情况，会走下一个.then 的 reject方法
// 1. resolve/reject 抛出异常
// 2. resolve 返回了失败的promise
// 其他情况都会走下一次的 resolve 方法