<template>
	<div class="system-user-container">
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
			<el-table :data="tableData.data" style="width: 100%">
				<!-- <el-table-column type="index" label="序号" width="60" /> -->
				<el-table-column align="center" prop="title" label="名称" show-overflow-tooltip></el-table-column>
				<el-table-column align="center" prop="explain" label="描述" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column prop="userNickname" label="用户昵称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleSign" label="关联角色" show-overflow-tooltip></el-table-column>
				<el-table-column prop="department" label="部门" show-overflow-tooltip></el-table-column>
				<el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="用户状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="describe" label="用户描述" show-overflow-tooltip></el-table-column> -->
				<!-- <el-table-column align="center" prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column> -->
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
		<!-- <AddUer ref="addUserRef" /> -->
		<EditItem ref="editItemRef" />

		<AddItem ref="addItemRef" />

		<DetailItem ref="detailItemRef" />

		
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
// import AddUer from '/@/views/system/user/component/addUser.vue';
import EditItem from './component/editItem.vue';

import AddItem from './component/addItem.vue';

import DetailItem from './component/detailItem.vue';

import api from '/@/api/assess';

// 定义接口来定义对象的类型
interface TableDataRow {
	userName: string;
	description: string;
	// userNickname: string;
	// roleSign: string;
	// department: string[];
	// phone: string;
	// email: string;
	// sex: string;
	// password: string;
	// overdueTime: Date;
	// status: boolean;
	// describe: string;
	createTime: string;
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
	components: {  EditItem, AddItem, DetailItem },
	setup() {
		const addItemRef = ref();
		const editItemRef = ref();
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
			api.getList().then((res: any) => {
				console.log(res);
				state.tableData.data = res;
				// state.tableData.total = res.total;
			});
		};
		// 打开新增用户弹窗
		const onOpenAddItem = () => {
			addItemRef.value.openDialog();
		};
		// 打开修改用户弹窗
		const onOpenEditItem = (row: TableDataRow) => {
			editItemRef.value.openDialog(row);
		};
		// 打开详细信息弹窗
		const onOpenDetailItem = (row: TableDataRow) => {
			detailItemRef.value.openDialog(row);
		};
		// 删除用户
		const onRowDel = (row: TableDataRow) => {
			ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.title}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					ElMessage.success('删除成功');
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
			addItemRef,
			editItemRef,
			detailItemRef,
			onOpenAddItem,
			onOpenEditItem,
			onOpenDetailItem,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
			...toRefs(state),
		};
	},
});
</script>
