import { get, post, del, put } from '/@/utils/request';

export default {
  role: {
    getRoleList: (params: object) => get('/system/role/tree', params),
    getRole: (id: number) => get('/system/role/getInfoById', { id }),
    addRole: (data: object) => post('/system/role/add', data),
    deleteRole: (id: number) => del('/system/role/delInfoById', { id }),
    editRole: (data: object) => put('/system/role/edit', data)
  },
  org: {
    getList: (params: object) => get('/system/organization/tree', params),
    del: (id: number) => del('/system/organization/del', { id }),
    add: (data: object) => post('/system/organization/add', data),
    edit: (data: object) => put('/system/organization/edit', data),
  },
  dept: {
    getList: (params: object) => get('/system/dept/tree', params),
    del: (deptId: number) => del('/system/dept/del', { deptId }),
    add: (data: object) => post('/system/dept/add', data),
    edit: (data: object) => put('/system/dept/edit', data),
  },
  user: {
    getList: (params: object) => get('/system/user/list', params),
    detail: (id: number) => get('/system/user/getInfoById', { id }),
    add: (data: object) => post('/system/user/add', data),
    resetPassword: (data: object) => post('/system/user/resetPassword', data),
    del: (id: number) => del('/system/user/delInfoById', { id }),
    edit: (data: object) => put('/system/user/edit', data),
  }
}