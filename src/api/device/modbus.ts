import { get, post } from '/@/utils/request_modbus';

export default {
  getDict: (params: object) => get('/dict', params),
  getDataId: () => get('/dict/getdataid'),
  channel: {
    getList: (params: object) => get('/device', params),
    addDevice: (data: object) => post('/device/add', data),
    deleteDevice: (data: object) => post('/device/delete', data),
    editDevice: (data: object) => post('/device/edit', data),
    downloadLog: (number: string) => get('/debug/export_message', { number }),
  },
  data: {
    getList: (params: object) => get('/device_template', params),
    addDeviceTemplate: (data: object) => post('/device_template/add', data),
    editDeviceTemplate: (data: object) => post('/device_template/edit', data),
    deleteDeviceTemplate: (data: object) => post('/device_template/delete', data),
  },
  area: {
    getList: (params: object) => get('/data_area', params),
    addDataArea: (data: object) => post('/data_area/add', data),
    editDataArea: (data: object) => post('/data_area/edit', data),
    deleteDataArea: (data: object) => post('/data_area/delete', data),
  },
  task: {
    getList: (params: object) => get('/device_job', params),
    addDeviceJob: (data: object) => post('/device_job/add', data),
    editDeviceJob: (data: object) => post('/device_job/edit', data),
    deleteDeviceJob: (data: object) => post('/device_job/delete', data),
  },
  template: {
    getList: (params: object) => get('/template', params),
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
