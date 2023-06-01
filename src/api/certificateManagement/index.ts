import { get, post, del, put, file } from '/@/utils/request';
import getOrigin from '/@/utils/origin';
const baseUrl = getOrigin(import.meta.env.VITE_SERVER_URL);

export default {
  certificateManagement: {
    getList: (params: object) => get('/system/certificate/list', params),
    getAll: () => get('/system/certificate/getAll'),
    add: (data: object) => post('/system/certificate/add', data),
    edit: (data: object) => put('/system/certificate/edit', data),
    del: (id: number) => del('/system/certificate/delete', { id }),
    editStatus: (data: object) => post('/system/certificate/editStatus', data),
  }
}