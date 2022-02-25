// 以下api未在promise 规范内
Promise.all = function (promises) {
  let result = []
  let times = 0
  return new Promise((resolve, reject) => {
    function processResult(data, index) {
      result[index] = data
      if (++times === processResult.length) {
        resolve(result)
      }
    }
    for (let i = 0; i < promises.length; i++) {
      let promise = promises[i]
      // 将数组中的每个值强制换算成promise，方便.then
      Promise.resolve(promise).then((data) => {
        processResult(data, i)
      }, reject)
    }
  })
}


// race方法：赛跑，以第一个结果为基准，其他代码还会执行，只是不采用结果了
Promise.race = function (promises = []) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i]
      // 任何一个成功了都会直接调用外层promise的resolve， 任何一个失败了都会直接调用外层promise 的 reject
      // 只要成功了就不会再失败，只要失败了就不会再成功（状态不可逆）
      Promise.resolve(promise).then(resolve, reject)
    }
  })
}

// 执行完所有的promise，无论成功还是失败都会返回：状态 + value/reason
Promise.allSettled = function (promises) {
  let result = []
  let times = 0
  return new Promise((resolve, reject) => {
      function processResult(data, index, status) {
          result[index] = {
              status
          }
          if (status === 'fulfilled') {
              result[index] = {
                  ...result[index],
                  value: data
              }
          } else if (status === 'rejected') {
              result[index] = {
                  ...result[index],
                  reason: data
              }
          }
          if (++times === promises.length) {
              resolve(result)
          }
      }
      for (let i = 0; i < promises.length; i++) {
          const promise = promises[i]
          // 任何一个成功了都会直接调用外层promise的resolve， 任何一个失败了都会直接调用外层promise 的 reject
          // 只要成功了就不会再失败，只要失败了就不会再成功（状态不可逆）
          Promise.resolve(promise).then((data) => {
              processResult(data, i, 'fulfilled')
          }, (err) => {
              processResult(err, i, 'rejected')
          })
      }
  })
}
module.exports = Promise
