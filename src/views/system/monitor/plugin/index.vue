<template>
	<div class="system-plugin-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
					<el-form-item label="关键字" prop="keyWord">
						<el-input v-model="tableData.param.keyWord" placeholder="请输入关键字" clearable style="width: 180px" size="default" @keyup.enter="dataList" />
					</el-form-item>
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="dataList">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button size="default" @click="resetQuery(queryRef)">
							<el-icon>
								<ele-Refresh />
							</el-icon>
							重置
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
				<el-table-column label="插件类型" align="center" prop="types" />
				<el-table-column label="名称" v-col="'name'" align="center" prop="name" />
				<el-table-column label="介绍" v-col="'intro'" align="center" prop="intro" />
				<el-table-column label="作者" v-col="'author'" align="center" prop="author" />
				<el-table-column label="状态" v-col="'status'" align="center" prop="status" width="80">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status === 1">正常</el-tag>
						<el-tag type="error" size="small" v-else-if="scope.row.status === 0">停用</el-tag>
						<el-tag type="info" size="small" v-else-if="scope.row.status === -1">全部</el-tag>
						<el-tag type="info" size="small" v-else>-</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="100" align="center" fixed="right" v-col="'handle'">
					<template #default="scope">
						<el-button :disabled="scope.row.status == 0" type='danger' text='danger' size="small" link @click="changeStatus(scope.row, 0)" v-auth="'stop'">停用</el-button>
						<el-button :disabled="scope.row.status == 1" size="small" type='success' text='success' link @click="changeStatus(scope.row, 1)" v-auth="'start'">启用</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="dataList" />
		</el-card>
	</div>
</template>



<script lang="ts">
//  插件型类，名称，介绍，作者，状态
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/system';

interface TableDataState {
	ids: number[];
	tableData: {
		data: Array<any>;
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			keyWord: string;
		};
	};
}

export default defineComponent({
	name: 'apiV1SystemPluginList',
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const queryRef = ref();
		const state = reactive<TableDataState>({
			ids: [],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					keyWord: ""
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			dataList();
		};
		const dataList = () => {
			state.tableData.loading = true;
			api.plugin
				.getList(state.tableData.param)
				.then((res: any) => {
					state.tableData.data = res.list;
					state.tableData.total = res.total;
				})
				.finally(() => {
					state.tableData.loading = false;
				});
		};
		const changeStatus = (row: any, status: number) => {
			api.plugin.changeStatus({ id: row.id, status: status }).then((res: any) => {
				ElMessage.success('操作成功');
				dataList();
			})
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			dataList();
		};
		return {
			queryRef,
			changeStatus,
			dataList,
			resetQuery,
			...toRefs(state),
		};
	},
});
</script>
