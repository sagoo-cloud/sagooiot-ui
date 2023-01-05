import { get, post, del, put } from '/@/utils/request';
import getOrigin from '/@/utils/origin';

const baseUrl = getOrigin(import.meta.env.VITE_ASSESS_URL);
console.log(baseUrl)

export default {
  getList: (params?: object) => get(baseUrl + '/setup', params),
  setItem: (params?: object) => post(baseUrl + '/setup', params),
  deleteItem: (params?: object) => del(baseUrl + '/setup', params),
  getDataSourceInfo: (params?: object) => get(baseUrl + '/datasetup/target', params),
  testDataSource: (params?: object) => post(baseUrl + '/datasetup/test', params),
  addDataSourceInfo: (params?: object) => post(baseUrl + '/datasetup', params),
  editataSourceInfo: (params?: object) => put(baseUrl + '/datasetup', params),
}