import { get, del, post, put } from '/@/utils/request';

export default {
  getList: (data: object) => get('/screen/project/list', data),
  del: (ids: string[]) => del('/screen/project/delProjectById', { ids }),
  add: (data: any) => post('/screen/project/add', data),
  edit: (data: any) => put('/screen/project/edit', data),
}