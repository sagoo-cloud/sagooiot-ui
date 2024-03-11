
import { get, post, del, put } from '/@/utils/request';

export default {
  // 单点登录列表
  SSO: {
    getList: (params: object) => get('/system/sys_oauth/list', params),
    addItem: (data: object) => post('/system/sys_oauth/add', data),
    editItem: (data: object) => put('/system/sys_oauth/edit', data),
    deleteItem: (data: object) => del('/system/sys_oauth/delete', data),
  }
}