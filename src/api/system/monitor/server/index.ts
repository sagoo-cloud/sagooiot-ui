import request from '/@/utils/request';


export function getSysInfo() {
    return request({
        url: '/system/monitor/server',
        method: 'get'
    })
}
