import { get } from '/@/utils/request_assess';

export default {
  getList: (params?: object) => get('/setup', params),
}