import { get, post, del, put, file } from '/@/utils/request';
import getOrigin from '/@/utils/origin';
const baseUrl = getOrigin(import.meta.env.VITE_SERVER_URL);

export default {
  manage: {
    getList: (data: any) => get('/scene/scene/list', data),
    del: (ids: number) => del('/scene/scene/delete', { ids }),
    status: (data: object) => post('/scene/scene/status', data),
    add: (data: any) => post('/scene/scene/add', data),
    edit: (data: any) => put('/scene/scene/edit', data),
    getDetail: (data: any) => get('/scene/scene/get', data),
    getColumns: (data: any) => post('/scene/scene/parameter_columns', data),
    addDetail: (data: any) => post('/scene/detail/add', data),
    editDetail: (data: any) => put('/scene/detail/edit', data),
    delDetail: (ids: number) => del('/scene/detail/delete', { ids }),
    getOneDetail: (data: any) => get('/scene/detail/list', data),
  }
}