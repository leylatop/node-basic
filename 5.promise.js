// Promise 默认是一个类，用的时候需要new一个实例，而且创建的实例上都有一个then方法，在new的时候接收一个执行器（一个形参为2个参数的函数）
// 1. promise 中有一个value用来描述成功的原因，reason用来描述失败的原因
// 2. promise 中如果出现异常也会走执行失败的逻辑
// 3. promise 有三种状态： pending 既不成功也不失败；fulfilled 成功态； rejected 失败态
// 4. 当状态是pending的时候，可以转化成fulfilled 或者rejected；，否则不能去改变状态，状态只能修改一次，且不可逆；
// 5. then里面需要两个参数，onFulfilled，onRejected
// 6. 执行器函数接收两个参数，且会立即执行；

const p1 = new Promise((resolve, reject) => {
  resolve('成功')
  reject('失败')
})

p1.then((value) => {
  resolve('成功了耶', value)
}, (reason) => {
  resolve('失败了哦', reason)
})
