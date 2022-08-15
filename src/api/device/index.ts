import { get, post, del, put } from '/@/utils/request';

export default {
  common:{
    singleImg: (data: object) => post('/common/singleImg', data),
  },
  product: {
    getList: (params: object) => get('/product/page_list', params),
    getLists: (params: object) => get('/product/list', params),
    add: (data: object) => post('/product/add', data),
    delete: (id: number) => del('/product/del', { id }),
    edit: (data: object) => put('/product/edit', data),
    detail: (id: number) => get('/product/detail', { id }),
    message_protocol_list: (params: object) => get('/product/protocol/message_protocol_list', params),
    trunsport_protocol_list: (params: object) => get('/product/protocol/trunsport_protocol_list', params),
  },
  category:{
    getList: (params: object) => get('/product/category/list', params),
    add: (data: object) => post('/product/category/add', data),
    edit: (data: object) => put('/product/category/edit', data),
    del: (id: number) => del('/product/category/del', { id }),
  },
  instance:{
    getList: (params: object) => get('/product/device/page_list', params),
    add: (data: object) => post('/product/device/add', data),
    edit: (data: object) => put('/product/device/edit', data),
    del: (id: number) => del('/product/device/del', { id }),
  },
  dept: {
    getList: (params: object) => get('/system/dept/tree', params),
  },
  
  
}