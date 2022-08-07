import { get, post } from '/@/utils/request';

// 登录api接口
export const login = (data: object) => post('/api/v1/login', data)

// 获取登录用户信息
export const currentUser = () => get('/system/user/currentUser')

// 获取验证码
export const captcha = () => get('/api/v1/captcha')

// 退出登录
export const signOut = (data: object) => post('/api/v1/user/signOut', data)
