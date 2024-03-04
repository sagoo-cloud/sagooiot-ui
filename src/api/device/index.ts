import { get, post, del, put, file } from '/@/utils/request';

export default {
  common: {
    singleImg: (data: FormData) => {
      data.append('source', '0')
      return post('/common/singleImg', data)
    },
  },
  product: {
    // 设备属性设置
    propertySet: (data: object) => post('/product/property/set', data),
    // 获取设备接入信息
    connect_intro: (productKey: string) => get('/product/connect_intro', { productKey }),
    getList: (params: object) => get('/product/page_list', params),
    getLists: (params?: object) => get('/product/list', params),
    add: (data: object) => post('/product/add', data),
    delete: (keys: string[]) => del('/product/del', { keys }),
    edit: (data: object) => put('/product/edit', data),
    detail: (productKey: string | string[]) => get('/product/detail', { productKey }),
    message_protocol_list: (params: object) => get('/product/protocol/message_protocol_list', params),
    trunsport_protocol_list: (params: object) => get('/product/protocol/trunsport_protocol_list', params),
    getDataType: (params: object) => get('/product/tsl/data_type', params),
    deploy: (productKey: any) => post('/product/deploy', { productKey }),
    undeploy: (productKey: any) => post('/product/undeploy', { productKey }),
    event: (data: object) => get('/product/tsl/event/all', data),
    getSubList: () => get('/product/sub_list'),
    export: (params: object) => file('/product/tsl/export', params),

    deleteSubDevice: (deviceKey: number) => del('/product/device/del_sub', { deviceKey }),
    // 获取插件通信方式类型
    getTypesAll: (data: object) => get('/system/plugins/getTypesAll', data),
    // 脚本更新
    script: (data: object) => put('/product/script/update', data),
  },
  category: {
    getList: (params: object) => get('/product/category/list', params),
    add: (data: object) => post('/product/category/add', data),
    edit: (data: object) => put('/product/category/edit', data),
    del: (id: number) => del('/product/category/del', { id }),
  },
  instance: {
    getList: (params: object) => get('/product/device/page_list', params),
    add: (data: object) => post('/product/device/add', data),
    edit: (data: object) => put('/product/device/edit', data),
    del: (keys: string[]) => del('/product/device/del', { keys }),
    detail: (deviceKey: any) => get('/product/device/detail', { deviceKey }),
    getLogList: (params: object) => get('/product/log/search', params),
    getlogcate: (params: object) => get('/product/log/type', params),
    getrun_status: (params: object) => get('/product/device/run_status', params),
    getLogDetail: (params: object) => get('/product/device/property/list', params),
    devonline: (data: object) => post('/product/device/online', data),
    devoffline: (data: object) => post('/product/device/offline', data),
    devdeploy: (deviceKey: string) => post('/product/device/deploy', { deviceKey }),
    devundeploy: (deviceKey: string) => post('/product/device/undeploy', { deviceKey }),
  },
  dept: {
    getList: (params: object) => get('/system/dept/tree', params),
  },
  tabDeviceFucntion: {
    getList: (params: object) => get('/product/tsl/function/all', params),
    do: (data: object) => post('/product/function/do', data),
  },

  model: {
    property: (params: object) => get('/product/tsl/property/list', params),
    propertyadd: (data: object) => post('/product/tsl/property/add', data),
    propertyedit: (data: object) => put('/product/tsl/property/edit', data),
    propertydel: (productKey: string, key: string) => del('/product/tsl/property/del', { productKey, key }),

    function: (params: object) => get('/product/tsl/function/list', params),
    functionadd: (data: object) => post('/product/tsl/function/add', data),
    functionedit: (data: object) => put('/product/tsl/function/edit', data),
    functiondel: (productKey: string, key: string) => del('/product/tsl/function/del', { productKey, key }),


    event: (params: object) => get('/product/tsl/event/list', params),
    eventadd: (data: object) => post('/product/tsl/event/add', data),
    eventedit: (data: object) => put('/product/tsl/event/edit', data),
    eventdel: (productKey: string, key: string) => del('/product/tsl/event/del', { productKey, key }),

    tag: (params: object) => get('/product/tsl/tag/list', params),
    tagadd: (data: object) => post('/product/tsl/tag/add', data),
    tagedit: (data: object) => put('/product/tsl/tag/edit', data),
    tagdel: (productKey: string, key: string) => del('/product/tsl/tag/del', { productKey, key }),
  },
  tree: {
    getList: (params: object) => get('/product/device_tree/list', params),
    add: (params: object) => post('/product/device_tree/info/add', params),
    edit: (params: object) => put('/product/device_tree/info/edit', params),
    detail: (params: object) => get('/product/device_tree/info/detail', params),
    delete: (params: object) => del('/product/device_tree/info/del', params),
    statistic: (params: object) => get('/envirotronics/device_tree/statistic', params),
    record: (params: object) => get('/envirotronics/device_tree/record', params),
    param: (params: object) => get('/envirotronics/device_tree/param', params),
  },
  device: {
    getList: (params: object) => get('/product/device/bind_list', params),
    allList: (params: object) => get('/product/device/list', params),
    getSubList: (params: object) => get('/product/device/sub_list', params),
    mutipleBind: (data: object) => post('/product/device/bind_sub', data),
    mutipleUnbind: (data: object) => post('/product/device/unbind_sub', data),
    updateOnlineTimeout: (data: object) => put('/product/device/extend/update', data),
    setDeviceStatus: (data: object) => post('/product/device/setDeviceStatus', data),
    import: (data: object) => post('/product/device/import', data),
    export: (data: object) => file('/product/device/export', data),
  },
  dev_asset: {
    getList: (params: object) => get('/product/dev_asset/list', params),
    add: (params: object) => post('/product/dev_asset/add', params),
    edit: (params: object) => put('/product/dev_asset/edit', params),
    detail: (params: object) => get('/product/dev_asset/get', params),
    delete: (params: object) => del('/product/dev_asset/delete', params),
  },
  dev_asset_metadata: {
    getList: (params: object) => get('/product/dev_asset_metadata/list', params),
    add: (params: object) => post('/product/dev_asset_metadata/add', params),
    edit: (params: object) => put('/product/dev_asset_metadata/edit', params),
    detail: (params: object) => get('/product/dev_asset_metadata/key', params),
    delete: (params: object) => del('/product/dev_asset_metadata/delete', params),
  }


}
