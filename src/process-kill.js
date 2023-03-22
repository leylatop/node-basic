const http = require('node:http')
const hostname = '127.0.0.1'
const port = '4280'
const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World\n')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('server is closed')
  })
})

setTimeout(() => {
  console.log('after 2s，ready close server...')
  // 杀掉进程
  process.kill(process.pid, 'SIGTERM')
}, 2000)