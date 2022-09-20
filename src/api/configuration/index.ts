import { get, del, post } from '/@/utils/request';

export default {
  getFolder: () => get('/configure/folder/list'),
  getList: (data: any) => get('/configure/diagram/getList', data),
  del: (id: number) => del('/configure/diagram/del', { id }),
  add: (data: any) => post('/screen/project/add', data),
}