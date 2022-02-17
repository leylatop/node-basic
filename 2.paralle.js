const fs = require('fs')
const path = require('path')

function after(times, callback) {
  const obj = {}
  return function (key, value) {
    obj[key] = value
    if (--times === 0) {
      callback(obj)
    }
  }
}

const done = after(2, function (obj) {
  console.log(obj)
})
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf-8', function (err, data) {
  done('name', data)
})

fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf-8', function (err, data) {
  done('age', data)
})