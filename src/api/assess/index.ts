import { get, post } from '/@/utils/request_assess';

export default {
  getList: (params?: object) => get('/setup', params),
  setItem: (params?: object) => post('/setup', params),
}