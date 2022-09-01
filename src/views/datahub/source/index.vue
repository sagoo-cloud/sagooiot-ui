<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true">
					<el-form-item label="数据源标识" prop="key">
						<el-input
							v-model="tableData.param.key"
							placeholder="数据源标识"
							clearable
							size="default"
							style="width: 240px"
							@keyup.enter.native="typeList"
						/>
					</el-form-item>
					<el-form-item label="数据源名称" prop="name">
						<el-input
							v-model="tableData.param.name"
							placeholder="请输入数据源名称"
							clearable
							size="default"
							style="width: 240px"
							@keyup.enter.native="typeList"
						/>
					</el-form-item>

					<el-form-item label="数据源类型" prop="host">
						<el-select v-model="tableData.param.from" placeholder="请选择数据源类型" @keyup.enter.native="typeList">
							<el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
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
						<el-button size="default" type="success" class="ml10" @click="onOpenAdd">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增数据源
						</el-button>
						<el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
							<el-icon>
								<ele-Delete />
							</el-icon>
							删除
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="ID" align="center" prop="sourceId" width="80" />
				<el-table-column label="数据源标识" prop="key" :show-overflow-tooltip="true" />
				<el-table-column label="数据源名称" prop="name" :show-overflow-tooltip="true" />
				<el-table-column prop="from" label="数据源类型" align="center">
					<template #default="scope">
						<span v-if="scope.row.from == 1">api导入</span>
						<span v-if="scope.row.from == 2">数据库</span>
						<span v-if="scope.row.from == 3">文件</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="120" align="center">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status == 1">已发布</el-tag>
						<el-tag type="info" size="small" v-if="scope.row.status == 0">未发布</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="createdAt" label="创建时间" align="center" width="180"></el-table-column>

				<el-table-column label="操作" width="200" align="center">
					<template #default="scope">
						<router-link
							:to="'/datahub/source/detail/' + scope.row.sourceId"
							class="link-type"
							style="padding-right: 12px; font-size: 12px; color: #409eff"
						>
							<span>详情</span>
						</router-link>

						<el-button size="small" text type="warning" @click="onOpenEdit(scope.row)">修改</el-button>
						<el-button size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
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
		<EditDic ref="editDicRef" @typeList="typeList" />
		<Detail ref="detailRef" />
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import api from '/@/api/datahub';

// 定义接口来定义对象的类型
interface TableDataRow {
	sourceId: number;
	name: string;
	key: string;
	status: number;
	from: string;
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
			name: string;
			key: string;
			from: string;
		};
	};
}

export default defineComponent({
	name: 'sourcelist',
	components: { EditDic },
	setup() {
		const addDicRef = ref();
		const editDicRef = ref();
		const queryRef = ref();
		const state = reactive<TableDataState>({
			typeData: [
				{
					label: 'api导入',
					value: '1',
				},
				{
					label: '数据库',
					value: '2',
				},
				{
					label: '文件',
					value: '3',
				},
			],
			ids: [],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					name: '',
					types: '',
					status: '',
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			typeList();
		};
		const typeList = () => {
			api.common.getList(state.tableData.param).then((res: any) => {
				state.tableData.data = res.list;
				state.tableData.total = res.Total;
			});
		};
		// 打开新增数据源弹窗
		const onOpenAdd = () => {
			editDicRef.value.openDialog();
		};
		// 打开修改数据源弹窗
		const onOpenEdit = (row: TableDataRow) => {
			editDicRef.value.openDialog(row);
		};
		const onRowDel = (row: TableDataRow) => {
			let msg = '你确定要删除所选数据？';
			let ids: number[] = [];
			if (row) {
				msg = `此操作将永久删除数据源：“${row.name}”，是否继续?`;
				ids = [row.sourceId];
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
					api.common.delete(ids).then(() => {
						ElMessage.success('删除成功');
						typeList();
					});
				})
				.catch(() => {});
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
			state.ids = selection.map((item) => item.sourceId);
		};

		return {
			addDicRef,
			editDicRef,
			queryRef,
			onOpenAdd,
			onOpenEdit,
			onRowDel,
			typeList,
			resetQuery,
			handleSelectionChange,
			...toRefs(state),
		};
	},
});
</script>
