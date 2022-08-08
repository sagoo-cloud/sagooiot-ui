import request, { get, post } from '/@/utils/request';

export const getMenuList = (params: object) => get('/system/menu/tree', params)
export const getMenuDetail = (id: number) => get('/system/menu/detail', { id })
export const addMenu = (data: object) => post('/system/menu/add', data)
export const updateMenu = (data: object) => post('/system/menu/edit', data)

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

// 删除菜单
export function delMenu(menuId: number) {
    return request({
        url: '/system/menu/delete',
        method: 'delete',
        data: { ids: [menuId] }
    })
}
