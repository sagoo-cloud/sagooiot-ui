import { get, del, post, put } from '/@/utils/request';

export default {
  // 添加规则实例管理
  detail: (id: string) => get('/rule-engine/instance/get', { id }),
  // 获取规则实例管理列表
  getList: (data: object) => get('/rule-engine/instance/list', data),
  // 删除规则实例管理
  del: (ids: string[]) => del('/rule-engine/instance/delete', { ids }),
  // 添加规则实例管理
  add: (data: any) => post('/rule-engine/instance/add', data),
  // 编辑规则实例管理
  edit: (data: any) => put('/rule-engine/instance/edit', data),
  // 修改规则实例流程状态
  setStatus: (id: number, status: number) => post('/rule-engine/instance/status', { id, status }),
}
