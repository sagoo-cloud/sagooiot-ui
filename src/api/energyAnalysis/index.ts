import { get, post, del, put, file } from '/@/utils/request';

export default {
  getStationInfoList: (params?: object) => get('/energy/station/info/list', params), // 换热站基础数据(分析报表数据)
  getEnergyHuanluWaterFlowList: (params?: object) => get('/energy/huanlu/water/flow/list', params), // 换热站失水分析条形图列表
  getEnergyHuanluWaterLossLineChart: (params?: object) => get('/energy/huanlu/water/loss/line/chart', params), // 换热站失水分析折现图列表
  getEnergyWaterWarnList: (params?: object) => get('/energy/early/warn/list', params), // 换热站温度压力报警
  getEnergyLoopdata: (params?: object) => get('/energy/loopdata', params), // 环路分析
  getEnergyLoopdataPage: (params?: object) => get('/energy/loopdata/page_list', params), // 环路分析
  getEnergyWaterLossLineChart: (params?: object) => get('/energy/water/loss/line/chart', params), // 换热站失水分析
  getEnergyHuanluWaterLossLineChartPage: (params?: object) => get('/energy/water/loss/page_list', params), // 换热站失水分析折现图列表
  getEnergyTop: (params?: object) => get('/energy/top', params), // 能耗排行榜
  loopdataExport: (params: object) => file('/energy/loopdata/export', params), // 导出：环路分析
  lossWaterExport: (params: object) => file('/energy/water/loss/export', params), // 导出：环路分析
  getEnergyPerformance: (params?: object) => get('/energy/performance', params), // 环路绩效考核
  performanceExport: (params: object) => file('/energy/performanceExport', params), // 导出：环路绩效考核数据导出
  getEnergyPerformanceStation: (params?: object) => get('/energy/performance/station', params), // 换热站绩效考核
  performanceExportStation: (params: object) => file('/energy/performance/station/export', params), // 导出：换热站绩效考核数据导出
  history: {
    historyYear: () => get('/energy/history/list'), // 历史年份
    getEnergyPerformance: (params?: object) => get('/energy/history/performance', params), // 环路绩效考核
    performanceExport: (params: object) => file('/energy/history/performanceExport', params), // 导出：环路绩效考核数据导出
    getEnergyPerformanceStation: (params?: object) => get('/energy/history/performance/station', params), // 换热站绩效考核
    performanceExportStation: (params: object) => file('/energy/history/performance/station/export', params), // 导出：换热站绩效考核数据导出
  },
}