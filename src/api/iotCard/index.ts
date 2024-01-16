
/*
 * @Author: vera_min vera_min@163.com
 * @Date: 2023-10-23 22:45:52
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2023-10-25 10:20:08
 * @FilePath: /sagoo-admin-ui/src/api/ice104/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post, del, put } from '/@/utils/request';

export default {
  // 物联网卡列表
  simCard: {
    getList: (params: object) => get('/sim_collect/list', params),
    addItem: (data: object) => post('/device/add', data),
    editItem: (data: object) => put('/device/edit', data),
    deleteItem: (data: object) => del('/sim_collect/delete', data),
    detailItem: (params: object) => get('/sim_collect/one', params),
    getFlowDataByDateRange: (data: object) => post('/sim_collect/flow_date', data),
  },
  dashboard: {
    getFlowDataByDateRange: (data: object) => post('/sim_history_traffic/date', data),
    getTop10Data: (data: object) => post('/sim_traffic_statis/top_flow', data),
    getFlowData: (data: object) => get('/sim_traffic_statis/get', data)
  }
}