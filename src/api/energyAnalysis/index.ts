import { get, post, del, put } from '/@/utils/request';

export default {
  getStationInfoList: (params?: object) => get('/energy/station/info/list', params), // 换热站基础数据(分析报表数据)
  getEnergyHuanluWaterFlowList: (params?: object) => get('/energy/huanlu/water/flow/list', params), // 换热站失水分析条形图列表
  getEnergyHuanluWaterLossLineChart: (params?: object) => get('/energy/huanlu/water/loss/line/chart', params), // 换热站失水分析折现图列表
  getEnergyWaterWarnList: (params?: object) => get('/energy/early/warn/list', params), // 换热站温度压力报警

  
  getEnergyLoopdata: (params?: object) => get('/energy/loopdata', params), // 环路分析
  getEnergyWaterLossLineChart: (params?: object) => get('/energy/water/loss/line/chart', params), // 换热站失水分析
  getEnergyPerformance: (params?: object) => get('/energy/performance', params), // 绩效考核
  getEnergyTop: (params?: object) => get('/energy/top', params), // 能耗排行榜
}