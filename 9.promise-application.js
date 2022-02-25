const fs = require('fs')
const path = require('path')
const { Promise, promisify, promisifyAll } = require('./my-promise')
const readFile = promisify(fs.readFile)
const fsPromise = promisifyAll(fs)

Promise.all([
  fsPromise.readFile(path.resolve(__dirname, 'name.txt'), 'utf-8'),
  fsPromise.readFile(path.resolve(__dirname, 'age.txt'), 'utf-8'),
]).then((data) => {
  console.log(data);
})

Promise.race([
  fsPromise.readFile(path.resolve(__dirname, 'name.txt'), 'utf-8'),
  fsPromise.readFile(path.resolve(__dirname, 'age.txt'), 'utf-8'),
]).then((data) => {
  console.log(data);
})

Promise.allSettled([
  fsPromise.readFile(path.resolve(__dirname, 'name.txt'), 'utf-8'),
  fsPromise.readFile(path.resolve(__dirname, 'age1.txt'), 'utf-8'),
]).then((data) => {
  console.log(data);
})