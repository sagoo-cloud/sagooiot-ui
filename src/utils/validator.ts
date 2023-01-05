const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

export const phoneValidate = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback()
  }

  if (!reg_tel.test(value)) {
    callback(new Error('请填写正确手机号'))
  }
}


export const ruleRequired = (message = '不能为空', trigger = 'blur') => {
  return { required: true, message, trigger }
}