// worker.js

self.addEventListener('message', ({ data }) => {
  // console.log(data)
  const { type, functionString, functionName, params } = data

  // 校验函数字符串是否合法，是否含有parse和send函数
  if (type === 'validateFunctionString') {
    try {
      eval(functionString)
    } catch (_err) {
      // throw new Error('请确保语法正确')
      self.postMessage({ isOk: false, message: '请确保语法正确' });
    }
    try {
      if (parse) {
        try {
          if (send) {
            self.postMessage({ isOk: true, data: 'xxx' });
          }
        } catch (_err) {
          // throw new Error('请确保含有【send】函数')
          self.postMessage({ isOk: false, message: '请确保含有【send】函数' });
        }
      }
    } catch (_err) {
      self.postMessage({ isOk: false, message: '请确保含有【parse】函数' });
      // throw new Error('请确保含有【parse】函数')
    }
    return
  }

  // 执行函数
  if (type === 'runFunction') {
    eval(functionString)
    try {
      const func = eval(functionName)
      // 先尝试转换为json，如果失败再当做字符串使用
      try {
        const parseParams = JSON.parse(params)
        const data = func(parseParams)
        self.postMessage({ isOk: true, data });
      } catch (_err) {
        const data = func(params)
        self.postMessage({ isOk: true, data });
      }
    } catch (_err) {
      self.postMessage({ isOk: false, message: _err.message });
    }
    return
  }

});
