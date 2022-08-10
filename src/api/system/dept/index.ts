import request,{ get, post, del, put } from '/@/utils/request';

export const getDeptList = (params: object) => post('/system/dept/tree', params)
export const addDept = (data: object) => post('/system/dept/add', data)

export function editDept(data:object) {
    return request({
        url: '/system/dept/edit',
        method: 'put',
        data:data
    })
}


export function deleteDept(id:number) {
    return request({
        url: '/system/dept/delete',
        method: 'delete',
        data:{id}
    })
}
