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
    },
   
   node:{
      getList: (params: object) => get('/source/node/list', params),
      add: (data: object) => post('/source/node/add', data),
      delete: (nodeId: number) => del('/source/node/del', { nodeId }),
      edit: (data: object) => put('/source/node/edit', data),
   } 
  
}