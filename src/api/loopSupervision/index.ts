import { get, post, del, put, file } from '/@/utils/request';

export default {
  getLoopHistoryData: (params: object) => get('/region/monitor/getLoopHistoryData', params), // 环路监管
  getLoopRegulation: (params: object) => get('/region/monitor/getLoopRegulation', params), // 环路监管
  getAllHeatStation: (params: object) => get('/region/monitor/getAllHeatStation', params), // 分布图
  getLoopRegulationDetail: (params: object) => get('/region/monitor/getLoopRegulationDetail', params), // 环路监管详情
  loopReportExport: (params: object) => file('/region/monitor/loopReportExport', params), // 环路监管详情列表导出
}