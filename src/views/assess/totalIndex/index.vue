<template>
	<div class="assess-total-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<!-- <el-input size="default" placeholder="请输入用户名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="success" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button> -->
				<el-button size="default" type="primary" class="ml10" @click="onOpenAddItem">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新建
				</el-button>
			</div>
			<el-table v-loading="loading" :data="tableData.data" style="width: 100%">
				<el-table-column align="left" prop="title" label="名称"  width="260" show-overflow-tooltip></el-table-column>
				<el-table-column align="left" prop="explain" label="描述" show-overflow-tooltip></el-table-column>
				<el-table-column align="center" label="操作" width="180">
					<template #default="scope">
						<el-button size="small" type="text"  @click="onOpenEditItem(scope.row)">编辑</el-button>
						<el-button size="small" type="text" @click="onRowDel(scope.row)">删除</el-button>
						<el-button size="small" type="text" @click="onOpenDetailItem(scope.row)">详细信息</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30]"
				v-model:current-page="tableData.param.page"
				background
				v-model:page-size="tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableData.total"
			>
			</el-pagination> -->
		</el-card>
		<EditOrAddItem ref="EditOrAddItem" @fetchList="fetchList" />
		<DetailItem ref="detailItemRef" />


	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
// import AddUer from '/@/views/system/user/component/addUser.vue';
import EditOrAddItem from './component/editItem.vue';

// import AddItem from './component/addItem.vue';

import DetailItem from './component/detailItem.vue';

import api from '/@/api/assess';

// 定义接口来定义对象的类型
interface TableDataRow {
	title: string;
	explain: string;
	config: string;
	item_code: string;
	targets: Array<any>
	// department: string[];
	// phone: string;
	// email: string;
	// sex: string;
	// password: string;
	// overdueTime: Date;
	// status: boolean;
	// describe: string;
	// createTime: string;
}
interface TableDataState {
	tableData: {
		data: Array<TableDataRow>;
		total: number;
		loading: boolean;
		param: {
			page: number;
			pageSize: number;
		};
	};
}

export default defineComponent({
	name: 'systemUser',
	components: {  EditOrAddItem, DetailItem },
	setup() {
		// const addItemRef = ref();
		const EditOrAddItem = ref();
		const detailItemRef = ref();
		const state = reactive<TableDataState>({
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					page: 1,
					pageSize: 10,
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			console.log('刷新数据了')
			fetchList()
			// const data: Array<TableDataRow> = [];
			// for (let i = 0; i < 9; i++) {
			// 	data.push({
			// 		userName: '这里是名称',
			// 		description: '这里是描述这里是描述这里是描述这里是描述',
			// 		createTime: new Date().toLocaleString(),

			// 	});
			// }
			// state.tableData.data = data;
			// state.tableData.total = state.tableData.data.length;
			// console.log(data)

		};
		const fetchList = () => {
			state.tableData.loading = true
			api.getList().then((res: any) => {
				console.log(res);
				state.tableData.data = res;
				state.tableData.loading = false
				// state.tableData.total = res.total;
			});
		};
		// 打开新增用户弹窗
		const onOpenAddItem = () => {
			console.log(111)
			EditOrAddItem.value.openDialog();
		};
		// 打开修改用户弹窗
		const onOpenEditItem = (row: TableDataRow) => {
			EditOrAddItem.value.openDialog(row);
		};
		// 打开详细信息弹窗
		const onOpenDetailItem = (row: TableDataRow) => {
			detailItemRef.value.openDialog(row);
		};
		// 删除
		const onRowDel = (row: TableDataRow) => {
			ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.title}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.deleteItem({itemcode: row.item_code}).then((res: any) => {
						fetchList()
						ElMessage.success('删除成功');
					});
				})
				.catch(() => {});
		};
		// 分页改变
		const onHandleSizeChange = (val: number) => {
			state.tableData.param.pageSize = val;
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.tableData.param.page = val;
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			// addItemRef,
			EditOrAddItem,
			detailItemRef,
			onOpenAddItem,
			onOpenEditItem,
			onOpenDetailItem,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
			fetchList,
			...toRefs(state),
		};
	},
});
</script>

<style lang="scss" scoped>
::v-deep  .el-dialog__body {
	border-top: 1px var(--el-border-color) var(--el-border-style);
}
</style>
