// util.promisify 的本质是一个高阶函数，接收一个函数作为参数，并且返回一个新的函数，执行函数的结果，会返回一个promise
// promisify 的作用是 将回调方法转化成promise （仅仅针对的是node中的api，因为node中的回调方法都有err和data）
function promisify(fn) {
  return function(...args) {
      return new Promise((resolve, reject) => {
          fn(...args, function(err, data) {   // fn是要被转化的函数，是node api，会返回err/data
              if(err) reject(err)
              resolve(data)
          })
      })
  }
}

// 把一个对象中所有的api都转化成promise
function promisifyAll(obj) {
  let  result = {}
  for(let key in obj) {
      // 如果对象中的value是一个函数，就把函数转化成promise
      result[key] = typeof obj[key] === 'function' ? promisify(obj[key]) : obj[key] 
  }
  return result
}

module.exports = {
  promisify,
  promisifyAll
}