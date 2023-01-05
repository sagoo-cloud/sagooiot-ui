import { get, del, post } from '/@/utils/request';

export default {
  getFolder: () => get('/configure/folder/list'),
  addFolder: (data: any) => post('/configure/folder/add', data),
  getList: (data: any) => get('/configure/diagram/getList', data),
  del: (id: number) => del('/configure/diagram/del', { id }),
  add: (data: any) => post('/configure/diagram/add', data),
  edit: (data: any) => post('/configure/diagram/edit', data),
}