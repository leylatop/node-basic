const fs = require('fs')
const path = require('path')

const events = {
  _events: [],
  on(cb) {
    this._events.push(cb)
  },
  emit(...args) {
    this._events.forEach(cb => {
      cb(...args)
    });
  }
}

events.on(function () {
  console.log('执行了一次')
})
let school = {}
events.on(function (key, data) {
  school[key] = data
  if (Object.keys(school).length == 2) {
    console.log('打印', school)
  }
})

fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf-8', function (err, data) {
  events.emit('name', data)
})

fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf-8', function (err, data) {
  events.emit('age', data)
})

// 所谓订阅就是将事情存到一个列表里，每次发布的时候，将列表函数依次执行

// 观察者模式和发布订阅区别
// 1. 发布订阅之间没有耦合关系，什么时候发布取决于自己
// 2. 观察者模式，需要被观察者收集所有的观察者，当状态发生变化的时候，会主动通知所有的观察者去更新
// 3. 观察者模式包含发布订阅