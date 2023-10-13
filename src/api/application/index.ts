import { get, post, del, put, file } from '/@/utils/request';
export default {
  getList: (data: any) => get('/system/application/list', data),
  del: (ids: number) => del('/system/application/delete', { ids }),
  add: (data: any) => post('/system/application/add', data),
  edit: (data: any) => put('/system/application/edit', data),
  detail: (id: number) => get('/system/application/get', { id }),
  status: (data: object) => put('/system/application/status', data),

} 