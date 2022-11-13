import { get, post, del, put } from '/@/utils/request';

export default {
  common: {
    levelall: (id: number) => get('/alarm/level/all', { id }),
    trigger_type: (productKey: number) => get('/alarm/rule/trigger_type', { productKey }),
    trigger_param: (productKey: number) => get('/alarm/rule/trigger_param', { productKey }),
    operator: (productKey: number) => get('/alarm/rule/operator', { productKey }),
    getList: (params: object) => get('/alarm/rule/list', params),
    add: (data: object) => post('/alarm/rule/add', data),
    delete: (id: number) => del('/alarm/rule/del', { id }),
    edit: (data: object) => put('/alarm/rule/edit', data),
    detail: (id: number) => get('/alarm/rule/detail', { id }),
    deploy: (data: object) => post('/alarm/rule/deploy', data),
    undeploy: (data: object) => post('/alarm/rule/undeploy', data),
    level_edit: (data: object) => put('/alarm/level/edit', data),
    level_all: (productKey: number) => get('/alarm/level/all', { productKey }),
    },
    log: {
      getList: (params: object) => get('/alarm/log/list', params),
      detail: (id: number) => get('/alarm/log/detail', { id }),
      handle: (data: object) => post('/alarm/log/handle', data),
      },
}