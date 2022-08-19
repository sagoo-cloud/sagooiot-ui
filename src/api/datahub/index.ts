import { get, post, del, put } from '/@/utils/request';

export default {

  common: {
    getList: (params: object) => get('/common/base/db/list', params),
    add: (data: object) => post('/common/base/db/add', data),
    delete: (id: number) => del('/common/base/db/del', { id }),
    edit: (data: object) => put('/common/base/db/edit', data),
    detail: (id: number) => get('/common/base/db/detail', { id }),
  },
  
}