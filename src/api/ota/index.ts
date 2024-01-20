import { get, post, del, put } from '/@/utils/request';

export default {
  manage: {
    getList: (data: any) => get('/operate/ota_firmware/list', data),
    del: (ids: number) => del('/operate/ota_firmware/delete', {ids}),
    add: (data: any) => post('/operate/ota_firmware/add', data),
    edit: (data: any) => put('/operate/ota_firmware/edit', data),
    detail: (id: number) => get('/operate/ota_firmware/get', {id}),

  },
  module: {
    getSubList: () => get('/product/list'),
    getList: (data: any) => get('/operate/ota_module/list', data),
    del: (ids: number) => del('/operate/ota_module/delete', {ids}),
    add: (data: any) => post('/operate/ota_module/add', data),
    edit: (data: any) => put('/operate/ota_module/edit', data),
    detail: (id: number) => get('/operate/ota_module/get', {id}),
  },
  batch: {
    getList: (data: any) => get('/operate/ota_strategy/list', data),
    getDeviceList: (data: any) => get('/product/device/list', data),
    del: (ids: number) => del('/operate/ota_strategy/delete', {ids}),
    add: (data: any) => post('/operate/ota_strategy/add', data),
    edit: (data: any) => put('/operate/ota_strategy/edit', data),
    distribute: (data: any) => post('/operate/ota_strategy/distribute', data)
  },
  device: {
    getList: (data: any) => get('/operate/ota_detail/list', data),
    del: (ids: number) => del('/operate/ota_detail/delete', {ids}),
    add: (data: any) => post('/operate/ota_detail/add', data),
    edit: (data: any) => post('/operate/ota_detail/edit', data),
  }
}