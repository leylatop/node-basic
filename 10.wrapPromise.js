const { Promise } = require('./my-promise')
// 定义一个模仿超时的逻辑
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('data~~~~~~~')
  }, 2000)
})

p = wrapPromise(p)
setTimeout(() => {
  p.abort('超时了')   // 若1s内没有返回值，就定义超时，调用abort方法，不再采用成功的结果
}, 1000)

function wrapPromise(userPromise) {
  let abort
  let innerPromise = new Promise((resolve, reject) => {
    abort = reject
  })

  let racePromise = Promise.race([
    innerPromise,
    userPromise
  ])

  racePromise.abort = abort
  return racePromise
}

p.then(data => {
  console.log(data);
}, err => {
  console.log(err);

})