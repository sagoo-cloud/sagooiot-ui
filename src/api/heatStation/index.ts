import { get, post, del, put, file } from '/@/utils/request';

export default {
  loop: {
    getList: (params: object) => get('/region/loop/list', params),
    add: (data: object) => post('/region/loop/add', data),
    export: (params: object) => file('/region/loop/export', params), // 环路列表导出
    upload: (params: object) => file('/region/loop/import', params), // 环路列表导出
    edit: (data: object) => put('/region/loop/edit', data),
    del: (id: number) => del('/region/loop/del', { id }),
    detail: (id: number) => get('/region/loop/getInfoById', { id }),
  },
  heatStation: {
    // getAll: (params?: object) => get('/region/monitor/getAllHeatStation', params),
    getAll: (params?: object) => get('/region/monitor/loopMap', params),
    getList: (params: object) => get('/region/heatStation/tree', params),
    heatStationExport: (params: object) => file('/region/heatStation/export', params), // 换热站列表导出
    getAllList: (params: object) => get('/region/heatStation/getAll', params),
    add: (data: object) => post('/region/heatStation/add', data),
    edit: (data: object) => put('/region/heatStation/edit', data),
    del: (id: number) => del('/region/heatStation/del', { id }),
    detail: (id: number) => get('/region/heatStation/getInfoById', { id }),
    getAllStaAndLoop: (params?: object) => get('/region/heatStation/getAllStaAndLoop', params),
    stationDetail: (params?: object) => get('/energy/performance/station/detail', params),
    stationDetailHistory: (params?: object) => get('/energy/history/performance/station/detail', params),
  }
}
