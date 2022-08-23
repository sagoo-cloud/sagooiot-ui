import { get, post, del, put } from '/@/utils/request';

export default {
  loop: {
    getList: (params: object) => get('/region/loop/list', params),
    add: (data: object) => post('/region/loop/add', data),
    edit: (data: object) => post('/region/loop/edit', data)
  },
  heatStation: {
    getList: (params: object) => get('/region/heatStation/tree', params),
    add: (data: object) => post('/region/heatStation/add', data),
    edit: (data: object) => put('/region/heatStation/edit', data),
    del: (id: number) => del('/region/heatStation/del', { id }),
  }
}