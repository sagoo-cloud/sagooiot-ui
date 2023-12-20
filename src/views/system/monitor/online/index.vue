<template>
	<div class="system-dic-container">
		<el-card shadow="nover">
			<div class="system-user-search mb15" v-if="false">
				<el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
					<el-form-item label="登录时间" prop="dateRange">
						<el-date-picker v-model="tableData.param.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="编号" align="center" width="60" prop="id" />
				<el-table-column label="用户名" v-col="'userName'" align="center" prop="userName" />
				<el-table-column label="token" align="center" prop="token" show-overflow-tooltip />
				<el-table-column label="登录地址" v-col="'ip'" align="center" prop="ip" show-overflow-tooltip />
				<el-table-column label="登录时间" align="createdAt" prop="createdAt" show-overflow-tooltip />
				<el-table-column label="浏览器" align="center" prop="explorer" />
				<el-table-column label="操作系统" v-col="'os'" show-overflow-tooltip align="center" prop="os" />
				<el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-col="'handle'">
					<template #default="scope">
						<el-button size="mini" type="text" @click="handleForceLogout(scope.row)" v-auth="'out'">强退</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="dataList" />
		</el-card>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/system';

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	userName: string;
	token: string;
	ip: string;
	createdAt: string;
	explorer: string;
	os: string;
}
interface TableDataState {
	tableData: {
		data: Array<TableDataRow>;
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			dateRange: string[];
		};
	};
}

export default defineComponent({
	name: 'online',
	setup() {
		const queryRef = ref();
		const state = reactive<TableDataState>({
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					dateRange: [],
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			dataList();
		};
		const dataList = () => {
			state.tableData.loading = true;
			api.online
				.getList(state.tableData.param)
				.then((res: any) => {
					state.tableData.data = res.list;
					state.tableData.total = res.total;
				})
				.finally(() => (state.tableData.loading = false));
		};
		const handleForceLogout = (row: TableDataRow) => {
			ElMessageBox.confirm('你确定要强制退出所选数据？', '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.online.strongBack(row.id).then(() => {
						ElMessage.success('清除成功');
						dataList();
					});
				})
				.catch(() => { });
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
			dataList,
			resetQuery,
			handleForceLogout,
			...toRefs(state),
		};
	},
});
</script>
