import request from '/@/utils/request';

export function getRoleList(query:Object) {
    return request({
        url: '/system/role/list',
        method: 'get',
        params:query
    })
}

export function getRoleParams() {
    return request({
        url: '/system/role/getParams',
        method: 'get'
    })
}

export function addRole(data:object) {
    return request({
        url: '/system/role/add',
        method: 'post',
        data:data
    })
}

export function getRole(id:number) {
    return request({
        url: '/system/role/get',
        method: 'get',
        params:{id}
    })
}


export function editRole(data:object) {
    return request({
        url: '/system/role/edit',
        method: 'put',
        data:data
    })
}


export function deleteRole(id:number) {
    return request({
        url: '/system/role/delete',
        method: 'delete',
        data:{ids:[id]}
    })
}
