import { reactive, ref } from 'vue'

export default function () {
  const statusParams = reactive({
    status: 1
  })

  return { statusParams }
}

export function useSearch<T>(api: any, resKey: string, expandParams?: any) {

  //  <pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />

  // import api from '/@/api/system';
  // import { ApiRow } from '/@/api/model/system/menu';
  // import { useSearch } from '/@/hooks/useCommon';

  // const { params, tableData, getList } = useSearch<ApiRow[]>(api.api.getList, 'Info', { name: '', address: '' });
  // getList() // 获取列表数据

  interface SearchParams {
    page: number;
    size: number;
    total: number;
    [key: string]: any;
  }

  const params = reactive<SearchParams>({
    page: 1,
    size: 10,
    total: 0,
    ...expandParams
  })

  const loading = ref(false)

  const tableData = ref<T[] | any[]>([])

  const getList = async (page?: number) => {
    page && (params.page = page);
    tableData.value = [];
    loading.value = true;
    params.total = 0;
    let res = await api(params).finally(() => loading.value = false)
    tableData.value = (resKey ? (res[resKey]) : (res)) || [];
    params.total = res.Total;
  };

  return { params, tableData, getList, loading }
}
