import { get, post, del, put } from '/@/utils/request';

export default {
  loop: {
    getList: (params: object) => get('/region/loop/list', params),
    add: (data: object) => post('/region/loop/add', data),
    edit: (data: object) => post('/region/loop/edit', data),
    // getLists: (params: object) => get('/product/list', params),
    // delete: (ids: number) => del('/product/del', { ids }),
    // edit: (data: object) => put('/product/edit', data),
    // detail: (id: number) => get('/product/detail', { id }),
  },
  heatStation: {
    getList: (params: object) => get('/region/heatStation/tree', params),
    add: (data: object) => post('/region/heatStation/add', data),
    edit: (data: object) => post('/region/heatStation/edit', data),
    // delete: (ids: number) => del('/product/del', { ids }),
    // detail: (id: number) => get('/product/detail', { id }),
  }
}