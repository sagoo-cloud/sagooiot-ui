/*
 * @Author: vera_min vera_min@163.com
 * @Date: 2022-09-05 08:41:57
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2022-09-06 17:18:17
 * @FilePath: /sagoo-admin-ui/src/api/network/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post, del, put } from '/@/utils/request_network';

export default {
  tunnel: {
    getList: (params?: object) => get('/tunnel/list', params),
    deleteItem: (params?: object) => del('/tunnel/delete', params),
    getDetail: (params?: object) => get('/tunnel/get', params),
    changeTunnelStatus: (params?: object) => post('/tunnel/status', params),
  
  },
  server: {
    getList: (params?: object) => get('/server/list', params),
    deleteItem: (params?: object) => del('/server/delete', params),
    getDetail: (params?: object) => get('/get', params),
    changeServerStatus: (params?: object) => post('/server/status', params),
  
  }

}