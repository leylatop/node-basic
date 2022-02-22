/**
 * 链式调用：上一次输出是下一次输入
 */

const fs = require('fs')
const path = require('path')

// fs.readFile(path.resolve(__dirname, 'file.txt'), 'utf-8', function(err, data) {
//   if(err) return new Error(err)
//   fs.readFile(path.relative(__dirname, data), 'utf-8', function (err, data) {
//     if(err) return new Error(err)
//     console.log(data);
//   })
// })

function readFile (url, format) {
  return new Promise((resolve, reject) => {
    fs.readFile(url, format, function(err, data) {
      if(err) reject(err)
      resolve(data)
    })
  })
}

// 1. new promise的实例的 then方法的 resolve方法，resolve方法执行结果返回的如果不是promise（undefined、数字、字母之类的），那么return的结果会作为下一个.then的resolve的参数
// 2. new promise的实例的 then方法的 resolve方法，resolve方法执行出错了，会执行下一个.then的第二个参数即 reject 方法
// 3. new promise的实例的 then方法的 resolve方法，resolve方法执行结果返回了一个promise，则会根据该promise的执行结果，来决定执行下一个 .then 的 resolve 还是 reject方法

// 失败情况，会走下一个.then 的 reject方法
// 1. resolve/reject 抛出异常
// 2. resolve 返回了失败的promise
// 其他情况都会走下一次的 resolve 方法
readFile(path.resolve(__dirname, 'file.txt'), 'utf-8').then((data) => {
  return readFile(path.resolve(__dirname, data+1), 'utf-8') 
  // 出错了，会执行下一次.then的reject
  // 若 下一次 .then 的 reject 未抛出异常，会执行下下次 .then 的 resolve 方法；
  // 若 下一次 .then 的 reject 抛出异常，会执行下下次 .then 的 reject 方法；
}).then((data)=> {
  console.log(data, 's');
}, (err) => {
  console.log(err, 'e');
  throw new Error('ll')
}).then((data) => {
  console.log(data, 'ss');
}, (err) => {
  console.log(err, 'ee');
})