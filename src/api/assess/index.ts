import { get } from '/@/utils/request_assess';

export default {
  getList: (params?: object) => get('/history', params),
}