<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
					<el-form-item label="创建时间" prop="dateRange">
						<el-date-picker
							v-model="tableData.param.dateRange"
							size="default"
							style="width: 240px"
							value-format="YYYY-MM-DD"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
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
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
				<el-table-column label="ID" align="center" prop="id" width="60" v-col="'ID'" />
				<el-table-column label="告警类型" prop="type" :show-overflow-tooltip="true" v-col="'type'">
					<template #default="scope">
						<span v-if="scope.row.type == 1">规则告警</span>
						<span v-else>设备自主告警</span>
					</template>
				</el-table-column>
				<el-table-column label="规则名称" prop="ruleName" :show-overflow-tooltip="true" v-col="'ruleName'" />
				<el-table-column label="规则级别" prop="alarmLevel" :show-overflow-tooltip="true" v-col="'alarmLevel'">
					<template #default="scope">
						{{ scope.row.alarmLevel.name }}
					</template>
				</el-table-column>
				<el-table-column label="产品标识" prop="productKey" :show-overflow-tooltip="true" v-col="'productKey'" />
				<el-table-column label="设备标识" prop="deviceKey" :show-overflow-tooltip="true" v-col="'deviceKey'" />

				<el-table-column prop="status" label="告警状态" width="100" align="center" v-col="'status'">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status">已处理</el-tag>
						<el-tag type="info" size="small" v-else>未处理</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createdAt" label="告警时间" align="center" width="180" v-col="'createdAt'"></el-table-column>
				<el-table-column label="操作" width="150" align="center" fixed="right" v-col="'handle'">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenDetailDic(scope.row)" v-auth="'detail'">详情</el-button>
						<el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-if="scope.row.status == 0" v-auth="'edit'">处理</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-show="tableData.total > 0"
				:total="tableData.total"
				v-model:page="tableData.param.pageNum"
				v-model:limit="tableData.param.pageSize"
				@pagination="typeList"
			/>
		</el-card>

		<EditDic ref="editDicRef" @dataList="typeList" />
		<DetailDic ref="detailRef" @dataList="typeList" />
	</div>
</template>
  
  <script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/alarm';
import EditDic from './component/edit.vue';
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

			dateRange: string[];
		};
	};
}

export default defineComponent({
	name: 'log',
	components: { EditDic, DetailDic },

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
					status: '',
					dateRange: [],
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			//typeList();
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
		return {
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
  