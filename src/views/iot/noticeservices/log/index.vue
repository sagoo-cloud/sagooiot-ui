<template>
	<div class="system-dic-container">
		<el-card shadow="nover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
					<el-form-item label="创建时间" prop="dateRange">
						<el-date-picker v-model="tableData.param.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="typeList">
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
						<el-button size="default" type="info" class="ml10" @click="onRowDel(null)" v-auth="'del'">
							<el-icon>
								<ele-Delete />
							</el-icon>
							删除
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
				<el-table-column type="selection" width="55" align="center" />

				<el-table-column label="ID" align="center" prop="id" width="100" v-col="'ID'" />

				<el-table-column label="标题" prop="title" align="center" show-overflow-tooltip v-col="'title'" />
				<el-table-column label="发送方式" prop="gateway" align="center" show-overflow-tooltip v-col="'title'" />
				<el-table-column prop="status" label="发送状态" align="center" v-col="'status'">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status">发送成功</el-tag>
						<el-tag type="info" size="small" v-else>发送失败</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="sendTime" label="发送时间" align="center" v-col="'createdAt'"></el-table-column>
				<el-table-column label="操作" width="150" align="center" fixed="right" v-col="'handle'">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenDetailDic(scope.row)" v-auth="'detail'">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
		</el-card>

		<EditDic ref="editDicRef" @dataList="typeList" />
		<DetailDic ref="detailRef" @dataList="typeList" />
	</div>
</template>
  
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/notice';
import DetailDic from './component/detail.vue';

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	name: string;
	deviceType: string;
	status: number;
	desc: string;
	createBy: string;
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
			status: number;
			dateRange: string[];
		};
	};
}

export default defineComponent({
	name: 'log',
	components: { DetailDic },

	setup() {
		const addDicRef = ref();
		const editDicRef = ref();
		const detailRef = ref();
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
					status: -1,
					dateRange: [],
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			typeList();
		};
		const typeList = () => {
			state.tableData.loading = true;
			api.log
				.getList(state.tableData.param)
				.then((res: any) => {
					state.tableData.data = res.list;
					state.tableData.total = res.Total;
				})
				.finally(() => (state.tableData.loading = false));
		};

		//打开详情页
		const onOpenDetailDic = (row: TableDataRow) => {
			detailRef.value.openDialog(row);
		};
		// 打开新增产品弹窗
		const onOpenAddDic = () => {
			editDicRef.value.openDialog();
		};
		// 打开修改产品弹窗
		const onOpenEditDic = (row: TableDataRow) => {
			editDicRef.value.openDialog(row);
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			typeList();
		};
		// 多选框选中数据
		const handleSelectionChange = (selection: TableDataRow[]) => {
			state.ids = selection.map((item) => item.id);
		};
		const onRowDel = (row: TableDataRow) => {
			let msg = '你确定要删除所选数据？';
			let ids: number[] = [];
			if (row) {
				msg = `此操作将永久删除产品：“${row.name}”，是否继续?`;
				ids = [row.id];
			} else {
				ids = state.ids;
			}
			if (ids.length === 0) {
				ElMessage.error('请选择要删除的数据。');
				return;
			}
			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.log.delete(ids).then(() => {
						ElMessage.success('删除成功');
						typeList();
					});
				})
				.catch(() => { });
		};
		return {
			onRowDel,
			addDicRef,
			editDicRef,
			queryRef,
			detailRef,
			onOpenDetailDic,
			onOpenAddDic,
			onOpenEditDic,
			typeList,
			resetQuery,
			handleSelectionChange,
			...toRefs(state),
		};
	},
});
</script>
  