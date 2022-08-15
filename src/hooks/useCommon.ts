import { reactive, ref } from 'vue'

export default function () {
  const statusParams = reactive({
    status: 1
  })

  return { statusParams }
}

export function useSearch<T>(expandParams?: any) {
  //  <pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList" />
  interface SearchParams {
    status: -1 | 0 | 1,
    pageNum: number;
    pageSize: number;
    total: number;
    [key: string]: any;
  }
  const params = reactive<SearchParams>({
    status: -1,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    ...expandParams
  })

  const tableData = ref<T | []>([])

  return { params, tableData }
}
