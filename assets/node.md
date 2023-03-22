- node 的模块化实现是读取文件

- path
  - path.join(__dirname, 'a', 'b', '.', '/', '..') 根据系统分隔符，将对应路径拼接在一起
  - path.resolve(__dirname, 'a', 'b', '/') 根据执行的路径，解析出一个绝对路径，默认是可变的（根据执行的路径来发生变化）
  - path.extname() 获取文件的后缀名
  - path.dirname() 获取父路径 = __dirname