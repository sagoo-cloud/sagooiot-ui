import request from '/@/utils/request';


export function getConfigList(query:Object) {
    return request({
        url: '/common/config/list',
        method: 'get',
        params:query
    })
}

export function getConfig(id:number) {
    return request({
        url: '/common/config/get',
        method: 'get',
        params:{id}
    })
}

export function addConfig(data:any) {
    return request({
        url: '/common/config/add',
        method: 'post',
        data:data
    })
}

export function editConfig(data:any) {
    return request({
        url: '/common/config/edit',
        method: 'put',
        data:data
    })
}

export function deleteConfig(ids:number[]) {
    return request({
        url: '/common/config/delete',
        method: 'delete',
        data:{ids}
    })
}
