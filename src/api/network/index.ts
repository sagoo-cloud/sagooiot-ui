import { get, post, del, put } from '/@/utils/request';

export default {
  tunnel: {
    getList: (params?: object) => get('/network/tunnel/list', params),
    addItem: (params?: object) => post('/network/tunnel/add', params),
    editItem: (params?: object) => put('/network/tunnel/edit', params),
    deleteItem: (params?: object) => del('/network/tunnel/delete', params),
    getDetail: (params?: object) => get('/network/tunnel/get', params),
    changeTunnelStatus: (params?: object) => post('/network/tunnel/status', params),
  },
  server: {
    getList: (params?: object) => get('/network/server/list', params),
    addItem: (params?: object) => post('/network/server/add', params),
    editItem: (params?: object) => put('/network/server/edit', params),
    deleteItem: (params?: object) => del('/network/server/delete', params),
    getDetail: (params?: object) => get('/network/get', params),
    changeServerStatus: (params?: object) => post('/network/server/status', params),
  }
}