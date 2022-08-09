import request, { get, post, put, del } from '/@/utils/request';

export const getMenuList = (params: object) => get('/system/menu/tree', params)
export const getMenuDetail = (id: number) => get('/system/menu/detail', { id })
export const addMenu = (data: object) => post('/system/menu/add', data)
export const updateMenu = (data: object) => put('/system/menu/edit', data)
export const delMenu = (id: number) => del('/system/menu/del', { id })

export function getMenuParams() {
    return request({
        url: '/system/menu/getParams',
        method: 'get'
    })
}

export function getMenuInfo(id: number) {
    return request({
        url: '/system/menu/get',
        method: 'get',
        params: { id }
    })
}
