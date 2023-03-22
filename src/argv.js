const argvArray = process.argv
console.log('argvArray', argvArray)

// argv 是一个数组， 数组的元素为包含了命令调用时的参数
// 第一个参数是 node 命令的完整路径，直接输入 node = 输入第一个参数（/usr/local/bin/node）
// 第二个参数是 正在被执行的文件的完整路径（/Users/modao/Desktop/GitHub/node-basic/src/argv.js）
// 从第三个参数开始，是其他参数，比如 node argv.js test，第三个参数就是 test

const args = process.argv.slice(2)
// 从第三个参数开始之后的参数
console.log(args)


