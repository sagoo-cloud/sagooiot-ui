import { get, del, post } from '/@/utils/request';

export default {
  getFolder: () => get('/configure/folder/list'),
  getList: (folderId: number) => get('/configure/diagram/getInfoByFolderId', { folderId }),
  del: (ids: string[]) => del('/screen/project/delProjectById', { ids }),
  add: (data: any) => post('/screen/project/add', data),
}