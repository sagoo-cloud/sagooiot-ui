import { get, post } from '/@/utils/request';

// 登录api接口集合
export const login = (data: object) => post('/login', data)
// 获取验证码
export const captcha = () => get('/captcha')
// 退出登录
export const signOut = (data: object) => post('/user/signOut', data)