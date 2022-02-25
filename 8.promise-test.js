const { Promise } = require('./my-promise')

/**
 * 测试场景
 */
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100)
  }, 1000)
}).then((data) => {
  console.log(data, 's');
  var x = new Promise((resolve, reject) => {
    // 立即执行
    resolve(new Promise((resolve, reject) => {
      resolve('唱歌吧方法')
    }).then(() => {
      console.log('里面');
    }).then(() => {
      console.log('里面2');
    })
    )
  }).then(() => {
    console.log('外面');

  })
  return x
  // 1. 调用完 onFulFilled 后 返回的是 x，是一个promise
  // 2. 执行promise的.then方法
  // 3. 谁的onFulFilled先执行完，先执行下一次.then
}, (err) => {
  console.log(err, 'e');
})

p1.then((data) => {
  console.log(data, 'ss')
}, (err) => {
  console.log(err, 'ee');
})

/**
 * 执行结果：
 * log: 外部promise
 * log: 外部第一个then
 * log: 内部promise
 * log: 内部第一个then
 * log: 内部第二个then
 * log: 内部第三个then
 * log: 内部第四个then
 * log: 外部第二个then
 * log: 外部第三个then
 * log: 外部第四个then
 * 
 * 原因：
 * 在第一个.then 的 onFulFilled 方法里面 手动return了一个promise对象
 * 若 onFulFilled 的执行结果 为一个promise 对象，就递归解析，优先执行该promise的then
 */
new Promise((resolve, reject) => {
  console.log("log: 外部promise");
  resolve();
})
  .then(() => {
    console.log("log: 外部第一个then");
    return new Promise((resolve, reject) => {
      console.log("log: 内部promise");
      resolve();
    })
      .then(() => {
        console.log("log: 内部第一个then");
      })
      .then(() => {
        console.log("log: 内部第二个then");
      })
      .then(() => {
        console.log("log: 内部第三个then");
      }).then(() => {
        console.log("log: 内部第四个then");
      });
  })
  .then(() => {
    console.log("log: 外部第二个then");
  }).then(() => {
    console.log("log: 外部第三个then");
  }).then(() => {
    console.log("log: 外部第四个then");
  });


/**
 * 执行结果
 * log: 外部promise
 * log: 外部第一个then
 * log: 内部promise
 * log: 内部第一个then
 * log: 外部第二个then
 * log: 内部第二个then
 * log: 外部第三个then
 * log: 内部第三个then
 * log: 外部第四个then
 * log: 内部第四个then
 * 原因：
 * 在第一个.then 的 onFulFilled 方法里面 没有返回结果
 * 若没有返回结果，就执行 resolve，然后执行下一个.then 的 reject
 * 下一个 .then 依赖于上一次 onFulFilled 的执行结果，内外 .then依次注册
 */
new Promise((resolve, reject) => {
  console.log("log: 外部promise");
  resolve();
})
  .then(() => {
    console.log("log: 外部第一个then");
    new Promise((resolve, reject) => {
      console.log("log: 内部promise");
      resolve();
    })
      .then(() => {
        console.log("log: 内部第一个then");
      })
      .then(() => {
        console.log("log: 内部第二个then");
      })
      .then(() => {
        console.log("log: 内部第三个then");
      }).then(() => {
        console.log("log: 内部第四个then");
      });
  })
  .then(() => {
    console.log("log: 外部第二个then");
  }).then(() => {
    console.log("log: 外部第三个then");
  }).then(() => {
    console.log("log: 外部第四个then");
  });