const https = require('https')

// 发送一个get请求
const options = {
  hostname: 'nodejs.cn',
  port: '443',
  path: '/todos',
  method: 'get'
}

const req = https.request(options, res => {
  console.log(`状态码: ${res.statusCode}`)
  res.on('data', (d) => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.end()