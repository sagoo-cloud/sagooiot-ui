const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

export const phoneValidate = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback()
  }

  if (!reg_tel.test(value)) {
    callback(new Error('请填写正确手机号'))
  }
  return callback()
}


export const ruleRequired = (message = '不能为空', trigger = 'change') => {
  return { required: true, message, trigger }
}

export const validateNoSpace = (rule: any, value: any, callback: any) => {
  if (/\s/.test(value)) {
    callback(new Error('名称不能包含空格'));
  } else {
    callback();
  }
}

// 校验版本号
export const checkVersion = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback()
  }

  if (!/^(\d{1,3}\.){2}\d{1,3}$/.test(value)) {
    callback(new Error('输入版本号格式错误，示例：（xx.xxx.xxx）'))
  }
  return callback()
}