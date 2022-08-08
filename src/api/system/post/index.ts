import request from '/@/utils/request';

export function getPostList(query:Object) {
    return request({
        url: '/system/post/list',
        method: 'get',
        params:query
    })
}

export function addPost(data:object) {
    return request({
        url: '/system/post/add',
        method: 'post',
        data:data
    })
}


export function editPost(data:object) {
    return request({
        url: '/system/post/edit',
        method: 'put',
        data:data
    })
}


export function deletePost(ids:number[]) {
    return request({
        url: '/system/post/delete',
        method: 'delete',
        data:{ids}
    })
}
