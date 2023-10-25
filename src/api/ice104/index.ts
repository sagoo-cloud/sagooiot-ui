/*
 * @Author: vera_min vera_min@163.com
 * @Date: 2023-10-23 22:45:52
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2023-10-25 10:20:08
 * @FilePath: /sagoo-admin-ui/src/api/ice104/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post, del, put,file } from '/@/utils/request_ice104';

export default {
  common:{
    singleImg: (data: object) => post('/common/singleImg', data),
  },
  device: {
    getList: (params: object) => get('/device/list', params),
    addItem: (data: object) => post('/device/add', data),
    editItem: (data: object) => put('/device/edit', data),
    deleteItem: (data: object) => del('/device/delete', data),
  },
  template: {
    getAll: (params: object) => get('/template/all', params),
    getList: (params: object) => get('/template/list', params),
    addItem: (data: object) => post('/template/add', data),
    editItem: (data: object) => put('/template/edit', data),
    deleteItem:  (data: object) => del('/template/delete', data),
  },
  deviceTask: {
    getList: (params: object) => get('/device/job/list', params),
    addItem: (data: object) => post('/device/job/add', data),
    editItem: (data: object) => put('/device/job/edit', data),
    deleteItem: (ids: number) => del('/device/job/delete', { ids }),
  },
  deviceTemplate: {
    getList: (params: object) => get('/device/template/list', params),
    addItem: (data: object) => post('/device/template/add', data),
    editItem: (data: object) => put('/device/template/edit', data),
    deleteItem: (ids: number) => del('/device/template/delete', { ids }),
  }
}