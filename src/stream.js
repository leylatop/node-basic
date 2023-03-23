const http = require('http')
const fs = require('fs')
const hostname = '127.0.0.1'
const port = '4280'
const server = http.createServer((req, res) => {
  const stream = fs.createReadStream(__dirname, '/age.txt')
  stream.pipe(res)
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})