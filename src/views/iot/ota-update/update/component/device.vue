<template>
	<el-card shadow="hover">
		<div class="search">
			<el-form :inline="true" ref="queryRef">
				<el-form-item label="设备名称：" prop="name">
					<el-input v-model="tableData.param.deviceName" placeholder="请输入设备名称" clearable size="default" style="width: 240px" @submit.prevent />
				</el-form-item>

				<el-form-item>

					<el-button size="default" type="primary" class="ml10" @click="getDetail">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
				</el-form-item>

			</el-form>
		</div>
		<el-table :data="tableData.data" style="width: 100%" row-key="id" v-loading="tableData.loading">
			<el-table-column prop="id" label="ID" width="60" show-overflow-tooltip></el-table-column>
			<el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="status" label="状态" show-overflow-tooltip>
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.status == 0">待推送</el-tag>
					<el-tag size="small" v-if="scope.row.status == 1">已推送</el-tag>
					<el-tag size="small" v-if="scope.row.status == 2">升级中</el-tag>
					<el-tag size="small" v-if="scope.row.status == 3">升级成功</el-tag>
					<el-tag size="small" v-if="scope.row.status == 4">升级失败</el-tag>
					<el-tag size="small" v-if="scope.row.status == 5">已取消</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="step" label="升级进度" show-overflow-tooltip></el-table-column>
			<el-table-column prop="fail" label="失败原因" width="100" align="center">
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.fail == -1">升级失败</el-tag>
					<el-tag size="small" v-if="scope.row.fail == -2">下载失败</el-tag>
					<el-tag size="small" v-if="scope.row.fail == -3">校验失败</el-tag>
					<el-tag size="small" v-if="scope.row.fail == -4">烧写失败</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createdAt" label="时间" min-width="100" align="center"></el-table-column>
			<!-- <el-table-column label="操作" width="200" align="center">
				<template #default="scope">

					<el-button size="small" text type="warning" v-auth="'edit'" @click="addOrEdit(scope.row)">编辑</el-button>

					<el-button size="small" text type="danger" v-auth="'del'" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column> -->
		</el-table>
<!--		<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />-->
    <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="getDetail" />

	</el-card>
</template>

<script lang="ts">
import api from '/@/api/ota';
import { useSearch } from '/@/hooks/useCommon';
import { ElMessageBox, ElMessage } from 'element-plus';
import {ref, onMounted, defineComponent, reactive, toRefs} from 'vue';
import { useRoute } from 'vue-router'
import EditForm from "/@/views/iot/ota-update/update/component/edit.vue";
import InfoList from "/@/views/iot/ota-update/update/component/info.vue";
import BatchList from "/@/views/iot/ota-update/update/component/batch.vue";

interface TableDataRow {
  id: number;
  name: string;
  typo: string;
  productName: number;
  moduleName: string;
  checkres: string;
  createdAt: string;
}
interface TableDataState {
  ids: number[];
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      deviceName: string;
      devOtaFirmwareId: number;
    };
  };
}

export default defineComponent({
  setup(props) {
    const route = useRoute()
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          deviceName: '',
          devOtaFirmwareId: 0,
        },
      },
    });
    const getDetail = () => {
      state.tableData.loading = true;
      const id = route.params && route.params.id
      state.tableData.param.devOtaFirmwareId = Number(id);
      api.device.getList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.Data;
        state.tableData.total = res.Total;
      }).finally(() => (state.tableData.loading = false));
    };
    onMounted(() => {
      getDetail()
    });
    return {
      getDetail,
      ...toRefs(props),
      ...toRefs(state),
    }
  },
})

// const props = defineProps({
// 	detail: {
// 		type: Object,
// 		default: () => { }
// 	},
// })
// const queryRef = ref();
//
// console.log(props.detail);
//
// const { params, tableData, getList, loading } = useSearch<any[]>(api.device.getList, 'firmware', { devOtaFirmwareId: props.detail.id });
//
// getList();
//
//
// const del = (row: any) => {
// 	ElMessageBox.confirm(`此操作将删除图形：“${row.name}”，是否继续?`, '提示', {
// 		confirmButtonText: '确认',
// 		cancelButtonText: '取消',
// 		type: 'warning',
// 	}).then(async () => {
// 		await api.manage.del(row.id);
// 		ElMessage.success('删除成功');
// 		getList();
// 	});
// };
</script>
