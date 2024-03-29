/*
 * @Author: vera_min vera_min@163.com
 * @Date: 2022-09-05 08:41:57
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2022-09-07 08:35:57
 * @FilePath: /sagoo-admin-ui/src/api/network/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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