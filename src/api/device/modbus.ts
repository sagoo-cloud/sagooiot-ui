import { get, post } from '/@/utils/request_modbus';

export default {
  channel: {
    getList: (params: object) => get('/device', params),
    addDevice: (data: object) => post('/device/add', data),
    deleteDevice: (data: object) => post('/device/delete', data),
    editDevice: (data: object) => post('/device/edit', data),
  },
  template: {
    getList: (params: object) => get('/template', params),
    getDataId: (params: object) => get('/dict/getdataid', params),
    addTemplate: (data: object) => post('/template/add', data),
    deleteTemplate: (data: object) => post('/template/delete', data),
    editTemplate: (data: object) => post('/template/edit', data),
    importFile: (data: object, config: object) => post('/data_area/import', data, config),
    exportFile: (params: object) => get('/data_area/import', params, {
      headers: {
        responseType: 'blob'
      }
    })
  }
}
