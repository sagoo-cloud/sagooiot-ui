import { get, post, del, put } from '/@/utils/request';

export default {

  common: {
    getList: (params: object) => get('/source/search', params),
    add: (data: object) => post('/source/api/add', data),
    delete: (ids: number) => del('/source/del', { ids }),
    edit: (data: object) => put('/source/api/edit', data),
    detail: (sourceId: number) => get('/source/detail', { sourceId }),
    deploy: (data: object) => post('/source/deploy', data),
    undeploy: (data: object) => post('/source/undeploy', data),  
    api: (sourceId: number) => get('/source/api/get', { sourceId }),
    devadd: (data: object) => post('/source/device/add', data),
    devedit: (data: object) => put('/source/device/edit', data),
    devapi: (sourceId: number) => get('/source/device/get', { sourceId }),
    getdevList: (params: object) => get('/product/device/list', params),
    getdata: (params: object) => get('/source/getdata', params),
    getLists: (params: object) => get('/source/list', params),
    copy: (params: object) => post('/source/copy', params),

    dbadd: (data: object) => post('/source/db/add', data),
    dbedit: (data: object) => put('/source/db/edit', data),
    getfields: (sourceId: number) => get('/source/db/fields', { sourceId }),

    devdb: (sourceId: number) => get('/source/db/get', { sourceId }),

    },
   
   node:{
      getList: (params: object) => get('/source/node/list', params),
      add: (data: object) => post('/source/node/add', data),
      delete: (nodeId: number) => del('/source/node/del', { nodeId }),
      edit: (data: object) => put('/source/node/edit', data),
      getpropertyList: (params: object) => get('/product/tsl/property/all', params),
   },

   template:{
      getList: (params: object) => get('/source/template/search', params),
      add: (data: object) => post('/source/template/add', data),
      delete: (ids: number) => del('/source/template/del', { ids }),
      edit: (data: object) => put('/source/template/edit', data),
      detail: (id: number) => get('/source/template/detail', { id }),
      allList: (params: object) => get('/source/template/list', params), // 获取所有已发布列表
      getdata: (params: object) => get('/source/template/getdata',  params ),
      getDictData: (params: object) => get('/common/dict/data/getDictData',  params ),
      cityTree: (params: object) => get('/common/city/tree',  params ),
      copy: (params: object) => post('/source/template/copy', params),
      
   } ,

   tnode:{
      getList: (params: object) => get('/source/template/node/list', params),
      add: (data: object) => post('/source/template/node/add', data),
      delete: (id: number) => del('/source/template/node/del', { id }),
      edit: (data: object) => put('/source/template/node/edit', data),
      deploy: (data: object) => post('/source/template/deploy', data),
      undeploy: (data: object) => post('/source/template/undeploy', data),  
   },
  
   weather:{
      getCityWeatherList: () => get('/envirotronics/weather/cityWeatherList'),
      getWhichCityWeather: (params: object) => get('/envirotronics/weather/getInfoById', params),
      getTemperatureEchartById: (params: object) => get('/envirotronics/weather/getTemperatureEchartById', params),
      getWindpowerEchartById: (params: object) => get('/envirotronics/weather/getWindpowerEchartById', params),
   },
   statistics:{
      getStatisticsChartData: (params: object) => get('/statistics/bar/chart/data', params),
      getStatisticsLineChartData: (params: object) => get('/statistics/broken/line/data', params),
      getStatisticsTotalData: (params: object) => get('/statistics/city/data', params),
      getStatisticsPieData: (params: object) => get('/statistics/tempering/ratio/data', params),
   },
   iotManage:{
      getOverviewData: () => get('/statistics/thing/overview'),
      getAlarmList: (params: object) => get('/alarm/log/list', params),
      getAlarmDetail: (id: number) => get('/alarm/log/detail', { id }),
      getAlarmHandle: (data: object) => post('/alarm/log/handle', data),
   }
}