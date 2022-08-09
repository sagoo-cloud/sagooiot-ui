import request, { get } from '/@/utils/request';

export const getRoleList = (params: object) => get('/system/role/tree', params)
export const getRole = (id: number) => get('/system/role/getInfoById', { id })

export function getRoleParams() {
    return request({
        url: '/system/role/getParams',
        method: 'get'
    })
}

export function addRole(data: object) {
    return request({
        url: '/system/role/add',
        method: 'post',
        data: data
    })
}



export function editRole(data: object) {
    return request({
        url: '/system/role/edit',
        method: 'put',
        data: data
    })
}


export function deleteRole(id: number) {
    return request({
        url: '/system/role/delete',
        method: 'delete',
        data: { ids: [id] }
    })
}
