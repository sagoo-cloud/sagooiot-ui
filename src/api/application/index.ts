import { get, post, del, put, file } from '/@/utils/request';
import getOrigin from '/@/utils/origin';
const baseUrl = getOrigin(import.meta.env.VITE_SERVER_URL);

export default {
  manage: {
    getList: (data: any) => get('/dev_ota_fireware/list', data),
    del: (ids: number) => del('/dev_ota_fireware/delete', { ids }),
    add: (data: any) => post('/dev_ota_fireware/add', data),
    edit: (data: any) => post('/dev_ota_fireware/edit', data),
    detail: (id: number) => get('/dev_ota_fireware/get', { id }),

  },
  module: {
    getSubList: () => get('/product/list'),
    getList: (data: any) => get('/dev_ota_module/list', data),
    del: (ids: number) => del('/dev_ota_module/delete', { ids }),
    add: (data: any) => post('/dev_ota_module/add', data),
    edit: (data: any) => post('/dev_ota_module/edit', data),
  },
  batch: {
    getList: (data: any) => get('/dev_ota_strategy/list', data),
    getDeviceList: (data: any) => get('/product/device/list', data),
    del: (ids: number) => del('/dev_ota_strategy/delete', { ids }),
    add: (data: any) => post('/dev_ota_strategy/add', data),
    edit: (data: any) => post('/dev_ota_strategy/edit', data),
  },
  device: {
    getList: (data: any) => get('/dev_ota_detail/list', data),
    del: (ids: number) => del('/dev_ota_detail/delete', { ids }),
    add: (data: any) => post('/dev_ota_detail/add', data),
    edit: (data: any) => post('/dev_ota_detail/edit', data),
  }
} 