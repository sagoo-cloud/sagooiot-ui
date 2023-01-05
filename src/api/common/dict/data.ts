import { get } from '/@/utils/request';
import { ref, toRefs, ToRefs } from 'vue'

// 根据字典类型查询字典数据信息
export function getDicts(dictType: string, defaultValue?: string): Promise<any> {
  return get('/common/dict/data/list', {
    dictType: dictType,
    status: 1,
    pageNum: 1,
    pageSize: 50,
    defaultValue: defaultValue ?? ''
  })
}

/**
 * 获取字典数据
 */
export function useDict(...args: string[]): ToRefs<any> {
  const res: any = ref({});
  args.forEach((d: string) => {
    res.value[d] = [];
    getDicts(d).then(resp => {
      res.value[d] = (resp.list || []).map((p: any) => ({ label: p.dictLabel, value: p.dictValue, isDefault: p.isDefault,status:p.status,remark:p.remark }))
    })
  })
  return toRefs(res.value);
}
