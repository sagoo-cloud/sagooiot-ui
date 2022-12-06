import { get, post, del, put } from '/@/utils/request';

export default {
  sysinfo: () => get('/sysinfo'),
  login: {
    login: (data: object) => post('/login', data),
    currentUser: () => get('/system/user/currentUser'),
    captcha: () => get('/captcha'),
    logout: () => post('/loginOut'),
  },
  api: {
    getList: (params?: object) => get('/system/api/tree', params),
    getAll: () => get('/system/api/GetAll'),
    detail: (id: number) => get('/system/api/detail', { id }),
    add: (data: object) => post('/system/api/add', data),
    del: (id: number) => del('/system/api/del', { id }),
    edit: (data: object) => put('/system/api/edit', data),
  },
  menu: {
    getList: (params: object) => get('/system/menu/tree', params),
    detail: (id: number) => get('/system/menu/detail', { id }),
    add: (data: object) => post('/system/menu/add', data),
    del: (id: number) => del('/system/menu/del', { id }),
    edit: (data: object) => put('/system/menu/edit', data),
    btn: {
      getList: (params: object) => get('/system/menu/button/tree', params),
      detail: (id: number) => get('/system/menu/button/detail', { id }),
      add: (data: object) => post('/system/menu/button/add', data),
      del: (id: number) => del('/system/menu/button/del', { id }),
      edit: (data: object) => put('/system/menu/button/edit', data),
      setStatus: (id: number, menuId: number, status: number) => put('/system/menu/button/editStatus', { id, menuId, status })
    },
    list: {
      getList: (params: object) => get('/system/menu/column/tree', params),
      detail: (id: number) => get('/system/menu/column/detail', { id }),
      add: (data: object) => post('/system/menu/column/add', data),
      del: (id: number) => del('/system/menu/column/del', { id }),
      edit: (data: object) => put('/system/menu/column/edit', data),
      setStatus: (id: number, menuId: number, status: number) => put('/system/menu/column/editStatus', { id, menuId, status })
    }
  },
  role: {
    getList: (params: object) => get('/system/role/tree', params),
    getRole: (id: number) => get('/system/role/getInfoById', { id }),
    getRoleIds: (id: number) => get('/system/role/getAuthorizeById', { id }),
    addRole: (data: object) => post('/system/role/add', data),
    dataScope: (data: object) => post('/system/role/dataScope', data),
    deleteRole: (id: number) => del('/system/role/delInfoById', { id }),
    editRole: (data: object) => put('/system/role/edit', data),
    auth: {
      getList: (itemsType: 'menu' | 'button' | 'column' | 'api' | string, menuIds?: number[]) => get('/system/authorize/query', { itemsType, menuIds }),
      set: (data: object) => post('/system/authorize/Add', data),
      // 判断是否允许给角色授权
      isAllow: (roleId: number) => get('/system/authorize/isAllow', { roleId }),
    }
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
  post: {
    getList: (params: object) => get('/system/post/tree', params),
    detail: (postId: number) => get('/system/post/detail', { postId }),
    del: (postId: number) => del('/system/post/del', { postId }),
    add: (data: object) => post('/system/post/add', data),
    edit: (data: object) => put('/system/post/edit', data),
  },
  user: {
    getList: (params: object) => get('/system/user/list', params),
    getAllList: (params: object) => get('/system/user/getAll', params),
    params: () => get('/system/user/params'),
    detail: (id: number) => get('/system/user/getInfoById', { id }),
    add: (data: object) => post('/system/user/add', data),
    resetPassword: (id: number, userPassword: string) => post('/system/user/resetPassword', { id, userPassword }),
    del: (id: number) => del('/system/user/delInfoById', { id }),
    edit: (data: object) => put('/system/user/edit', data),
    setStatus: (id: number, status: number) => put('/system/user/editStatus', { id, status }),
    setAvatar: (id: number, avatar: string) => put('/system/user/editAvatar', { id, avatar }),
  },
  config: {
    getList: (params: object) => get('/common/config/list', params),
    detail: (id: number) => get('/common/config/get', { id }),
    add: (data: object) => post('/common/config/add', data),
    del: (ids: number[]) => del('/common/config/delete', { ids }),
    edit: (data: object) => put('/common/config/edit', data),
  },
  dict: {
    getTypeList: (params: object) => get('/common/dict/type/list', params),
    getType: (dictId: number) => get('/common/dict/type/get', { dictId }),
    addType: (data: object) => post('/common/dict/type/add', data),
    addData: (data: object) => post('/common/dict/data/add', data),
    editType: (data: object) => put('/common/dict/type/edit', data),
    editData: (data: object) => put('/common/dict/data/edit', data),
    deleteType: (dictIds: number[]) => del('/common/dict/type/delete', { dictIds }),
    getDataList: (params: object) => get('/common/dict/data/list', params),
    getData: (dictCode: string) => get('/common/dict/data/get', { dictCode }),
    deleteData: (ids: number[]) => del('/common/dict/data/delete', { ids }),
  },
  getSysInfo: () => get('/system/monitor/server'),

  log: {
    getList: (params: object) => get('/system/login/log/list', params),
    export: (params: object) => get('/system/login/log/export', params),
    del: (infoIds: number[]) => del('/system/login/log/del', { infoIds }),
    detail: (infoId: number) => get('/system/login/log/detail', { infoId }),
    clearLog: () => post('/system/login/log/clear'),
  },
  oper: {
    getList: (params: object) => get('/system/oper/log/list', params),
    del: (operIds: number) => del('/system/oper/log/del', { operIds }),
    detail: (operId: number) => get('/system/oper/log/detail', { operId }),
    clearLog: () => post('/system/oper/log/clear'),
  },
  online: {
    getList: (params: object) => get('/system/userOnline/list', params),
    strongBack: (id: number) => del('/system/userOnline/strongBack', { id }),
  },
  task: {
    getList: (params: object) => get('/system/job/list', params),
    add: (data: object) => post('/system/job/add', data),
    edit: (data: object) => put('/system/job//edit', data),
    del: (id: number) => del('/system/job/delJobById', { id }),
    detail: (id: number) => get('/system/job/getJobById', { id }),
    run: (id: number) => put('/system/job/run', { id }),
    start: (id: number) => put('/system/job/start', { id }),
    stop: (id: number) => put('/system/job/stop', { id })
  },
  city: {
    getList: (params: object) => get('/common/city/tree', params),
    add: (data: object) => post('/common/city/add', data),
    edit: (data: object) => put('/common/city/edit', data),
    del: (id: number) => del('/common/city/del', { id }),
    detail: (id: number) => get('/common/city/getInfoById', { id }),
  },
  plugin: {
    getList: (params: object) => get('/system/plugins/list', params),
    changeStatus: (params: object) => post('/system/plugins/set', params),
  }
}
