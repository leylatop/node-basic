function say(args) {
  console.log('say', args)
}

Function.prototype.before = function (cb) {
  return (...args) => {
    cb()
    // 谁调用的before 就指向谁
    // this指向最外的使用 function() {} 的那个方法
    this(...args);
  }
}

let newSay = say.before(() => {
  console.log('beforesay')
})

newSay('hello')