import { get, post, del, put } from '/@/utils/request';

export default {
  heatingDistrict: {
    getTree: (params: object) => get('/region/zhgy/tree', params),
    getPlotCount: (params: object) => get('/region/plot/count', params), // 获取小区数量
    getResidentCount: (params: object) => get('/region/resident/count', params), // 获取住户数量
    getOrganizationCount: (params: object) => get('/system/organization/count', params), // 获取组织数量
  },
  regionalManage: {
    allList: (params: object) => get('/region/plot/all', params),
    getList: (params: object) => get('/region/plot/list', params),
    add: (data: object) => post('/region/plot/add', data),
    edit: (data: object) => put('/region/plot/edit', data),
    del: (id: number) => del('/region/plot/del', { id }),
    detail: (id: number) => get('/region/plot/detail', { id }),
    setStatus: (id: number, status: number) => put('/region/plot/editStatus', { id, status }),
  },
  floor: {
    allList: (params: object) => get('/region/floor/all', params),
    getList: (params: object) => get('/region/floor/list', params),
    add: (data: object) => post('/region/floor/add', data),
    edit: (data: object) => put('/region/floor/edit', data),
    del: (id: number) => del('/region/floor/del', { id }),
    detail: (id: number) => get('/region/floor/detail', { id }),
    setStatus: (id: number, status: number) => put('/region/floor/editStatus', { id, status }),
  },
  unit: {
    getListByFloorId: (params: object) => get('/region/unit/getInfoByFloorId', params),
    getList: (params: object) => get('/region/unit/list', params),
    add: (data: object) => post('/region/unit/add', data),
    edit: (data: object) => put('/region/unit/edit', data),
    del: (id: number) => del('/region/unit/del', { id }),
    detail: (id: number) => get('/region/unit/getInfoById', { id }),
    setStatus: (id: number, status: number) => put('/region/unit/editStatus', { id, status }),
  },
  resident: {
    getList: (params: object) => get('/region/resident/list', params),
    add: (data: object) => post('/region/resident/add', data),
    edit: (data: object) => put('/region/resident/edit', data),
    del: (id: number) => del('/region/resident/del', { id }),
    detail: (id: number) => get('/region/resident/getInfoById', { id }),
    setStatus: (id: number, status: number) => put('/region/resident/editStatus', { id, status }),
  }
}