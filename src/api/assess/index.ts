import { get, post, del, put } from '/@/utils/request_assess';

export default {
  getList: (params?: object) => get('/setup', params),
  setItem: (params?: object) => post('/setup', params),
  deleteItem: (params?: object) => del('/setup', params),
  getDataSourceInfo: (params?: object) => get('/datasetup/target', params),
  testDataSource:  (params?: object) => post('/datasetup/test', params),
  addDataSourceInfo: (params?: object) => post('/datasetup', params),
  editataSourceInfo: (params?: object) => put('/datasetup', params),
}