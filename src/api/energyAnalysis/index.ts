import { get, post, del, put } from '/@/utils/request';

export default {
  // loop: {
  //   getList: (params: object) => get('/region/loop/list', params),
  //   add: (data: object) => post('/region/loop/add', data),
  //   edit: (data: object) => put('/region/loop/edit', data),
  //   del: (id: number) => del('/region/loop/del', { id }),
  //   detail: (id: number) => get('/region/loop/getInfoById', { id }),
  // },
  getStationInfoList: (params?: object) => get('/energy/station/info/list', params), // 换热站基础数据(分析报表数据)
  getEnergyWaterLossList: (params?: object) => get('/energy/water/loss/list', params), // 换热站失水分析条形图列表
  getEnergyWaterLossLineChart: (params?: object) => get('/energy/water/loss/line/chart', params), // 换热站失水分析折现图列表
}