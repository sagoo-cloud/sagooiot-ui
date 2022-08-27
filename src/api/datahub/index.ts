import { get, post, del, put } from '/@/utils/request';

export default {

  common: {
    getList: (params: object) => get('/source/search', params),
    add: (data: object) => post('/source/api/add', data),
    delete: (ids: number) => del('/source/del', { ids }),
    edit: (data: object) => put('/source/api/edit', data),
    detail: (sourceId: number) => get('/source/detail', { sourceId }),
    deploy: (data: object) => post('/source/deploy', data),
    undeploy: (data: object) => post('/source/undeploy', data),  
    }
  
}