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
    api: (sourceId: number) => get('/source/api/get', { sourceId }),
    },
   
   node:{
      getList: (params: object) => get('/source/node/list', params),
      add: (data: object) => post('/source/node/add', data),
      delete: (nodeId: number) => del('/source/node/del', { nodeId }),
      edit: (data: object) => put('/source/node/edit', data),
   },

   template:{
      getList: (params: object) => get('/source/template/search', params),
      add: (data: object) => post('/source/template/add', data),
      delete: (ids: number) => del('/source/template/del', { ids }),
      edit: (data: object) => put('/source/template/edit', data),
      detail: (id: number) => get('/source/template/detail', { id }),
   } ,

   tnode:{
      getList: (params: object) => get('/source/template/node/list', params),
      add: (data: object) => post('/source/template/node/add', data),
      delete: (id: number) => del('/source/template/node/del', { id }),
      edit: (data: object) => put('/source/template/node/edit', data),
   },
  
}