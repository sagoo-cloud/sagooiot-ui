import { get, post, del, put } from '/@/utils/request';

export const getRoleList = (params: object) => get('/system/role/tree', params)
export const getRole = (id: number) => get('/system/role/getInfoById', { id })
export const addRole = (data: object) => post('/system/role/add', data)
export const deleteRole = (id: number) => del('/system/role/delInfoById', { id })
export const editRole = (data: object) => put('/system/role/edit', data)