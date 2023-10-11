import { get, post, del, put } from '/@/utils/request';

export default {
  // 获取所有未读消息
  allUnRead: () => get('/system/message/allUnRead'),
  // 一键清空消息
  clear: () => get('/system/message/clear'),
  // 批量删除消息
  del: (ids: number[]) => del('/system/message/del', { ids }),
  // 获取消息列表
  getList: (data: object) => get('/system/message/list', data),
  // 阅读消息
  read: (id: number) => put('/system/message/read', { id }),
  // 获取所有未读消息数量
  unReadCount: () => get('/system/message/unReadCount')
}
