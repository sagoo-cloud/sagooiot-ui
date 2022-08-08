import request, { get } from '/@/utils/request';

export const getMenuList = (params: Object) => get('/system/menu/tree', params)
export const getMenuDetail = (id: number) => get('/system/menu/detail', { id })

export function getMenuParams() {
    return request({
        url: '/system/menu/getParams',
        method: 'get'
    })
}

export function addMenu(data: Object) {
    return request({
        url: '/system/menu/add',
        method: 'post',
        data: data
    })
}

export function getMenuInfo(id: number) {
    return request({
        url: '/system/menu/get',
        method: 'get',
        params: { id }
    })
}

export function updateMenu(data: Object) {
    return request({
        url: '/system/menu/update',
        method: 'put',
        data: data
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
