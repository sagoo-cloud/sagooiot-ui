import { get, post, del, put } from '/@/utils/request';

export default {
  getLoopRegulation: (params: object) => get('/region/monitor/getLoopRegulation', params), // 环路监管
  getAllHeatStation: (params: object) => get('/region/monitor/getAllHeatStation', params), // 分布图
  getLoopRegulationDetail: (params: object) => get('/region/monitor/getLoopRegulationDetail', params), // 环路监管详情
}