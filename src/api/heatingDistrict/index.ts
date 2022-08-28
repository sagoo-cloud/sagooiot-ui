import { get, post, del, put } from '/@/utils/request';

export default {
  regionalManage: {
    allList: (params: object) => get('/region/plot/all', params),
    getList: (params: object) => get('/region/plot/list', params),
    add: (data: object) => post('/region/plot/add', data),
    edit: (data: object) => put('/region/plot/edit', data),
    del: (id: number) => del('/region/plot/del', { id }),
    detail: (id: number) => get('/region/plot/detail', { id }),
  },
  floor: {
    allList: (params: object) => get('/region/floor/all', params),
    getList: (params: object) => get('/region/floor/list', params),
    add: (data: object) => post('/region/floor/add', data),
    edit: (data: object) => put('/region/floor/edit', data),
    del: (id: number) => del('/region/floor/del', { id }),
    detail: (id: number) => get('/region/floor/detail', { id }),
  },
  unit: {
    getListByFloorId: (params: object) => get('/region/unit/getInfoByFloorId', params),
    getList: (params: object) => get('/region/unit/list', params),
    add: (data: object) => post('/region/unit/add', data),
    edit: (data: object) => put('/region/unit/edit', data),
    del: (id: number) => del('/region/unit/del', { id }),
    detail: (id: number) => get('/region/unit/getInfoById', { id }),
  },
  resident: {
    allList: (params: object) => get('/region/resident/all', params),
    getList: (params: object) => get('/region/resident/list', params),
    add: (data: object) => post('/region/resident/add', data),
    edit: (data: object) => put('/region/resident/edit', data),
    del: (id: number) => del('/region/resident/del', { id }),
    detail: (id: number) => get('/region/resident/detail', { id }),
  }
}