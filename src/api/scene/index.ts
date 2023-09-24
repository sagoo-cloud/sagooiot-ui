import { get, post, del, put, file } from '/@/utils/request';
import getOrigin from '/@/utils/origin';
const baseUrl = getOrigin(import.meta.env.VITE_SERVER_URL);

export default {
  manage: {
    getFolder: () => get('/configure/folder/list'),
    addFolder: (data: any) => post('/configure/folder/add', data),
    getList: (data: any) => get('/configure/diagram/getList', data),
    del: (id: number) => del('/configure/diagram/del', { id }),
    deploy: (data: object) => post('/product/deploy', data),
    undeploy: (data: object) => post('/product/undeploy', data),
    add: (data: any) => post('/configure/diagram/add', data),
    edit: (data: any) => post('/configure/diagram/edit', data),
  }
}