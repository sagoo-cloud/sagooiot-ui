<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="100px">
					<el-form-item label="换热站名称" prop="name">
						<el-input v-model="tableData.param.name" placeholder="请输入换热站名称" clearable size="default" @keyup.enter="queryList" />
					</el-form-item>
					<el-form-item label="换热站编号" prop="code">
						<el-input v-model="tableData.param.code" placeholder="请输入换热站编号" clearable size="default" @keyup.enter="queryList" />
					</el-form-item>
					<el-form-item>
						<el-button size="default" type="primary" v-auth="'query'" class="ml10" @click="queryList">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button size="default" v-auth="'reset'" @click="resetQuery(queryRef)">
							<el-icon>
								<ele-Refresh />
							</el-icon>
							重置
						</el-button>
						<el-button size="default" type="success" v-auth="'add'" class="ml10" @click="onOpenAddDic">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增
						</el-button>
						<el-button @click="exportExcel" v-auth="'dwonload'">
							<el-icon> <ele-Download /> </el-icon>
							数据导出
						</el-button>
						<uploadBtn @update="queryList" url="/region/heatStation/import" v-auth="'upload'"></uploadBtn>
						<!-- <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除
            </el-button> -->
					</el-form-item>
				</el-form>
			</div>

			<el-table
				:data="tableData.data"
				v-loading="tableData.loading"
				style="width: 100%"
				row-key="id"
				default-expand-all
				:indent="16"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<!-- <el-table-column type="selection" width="55" align="center" /> -->
				<!-- <el-table-column label="ID" align="center" prop="id" width="60" /> -->
				<el-table-column label="换热站" prop="name" v-col="'name'" :show-overflow-tooltip="true" />
				<el-table-column label="换热站编号" prop="code" v-col="'code'" :show-overflow-tooltip="true" />
				<el-table-column label="位置" prop="position" v-col="'position'" :show-overflow-tooltip="true" />
				<el-table-column label="负责人" prop="principalInfo.userNickname" v-col="'principalInfo.userNickname'" width="80" />
				<el-table-column label="状态" prop="status" v-col="'status'" width="80">
					<template #default="scope">
						{{ scope.row.status === 1 ? '启用' : '禁用' }}
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createdAt" v-col="'createdAt'" :show-overflow-tooltip="true" />
				<el-table-column label="操作" width="200" v-col="'handle'" align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenDetail(scope.row)">详情</el-button>
						<el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)">修改</el-button>
						<el-button size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination
				v-show="tableData.total > 0"
				:total="tableData.total"
				v-model:page="tableData.param.pageNum"
				v-model:limit="tableData.param.pageSize"
				@pagination="queryList"
			/>
		</el-card>
		<EditDic ref="editDicRef" :treeData="tableData.data" @queryList="queryList" />
		<Detail ref="detailRef" />
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import Detail from './component/detail.vue';
import uploadBtn from '/@/components/upload/button.vue';
import api from '/@/api/heatStation';
import downloadFile from '/@/utils/download';

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	name: string;
	code: string;
	stationId: string;
	loopTypes: number;
	energyTypes: number;
	heatingObject: number;
	heatingTypes: number;
	heatingArea: string;
	forRealArea: string;
	decade: string;
	status: number;
}
interface TableDataState {
	ids: number[];
	tableData: {
		data: Array<TableDataRow>;
		loading: boolean;
		param: {
			name: string;
			code: string;
			status: number;
		};
	};
}

export default defineComponent({
	name: 'heatStation',
	components: { EditDic, Detail, uploadBtn },
	setup() {
		const addDicRef = ref();
		const editDicRef = ref();
		const detailRef = ref();
		const queryRef = ref();
		const state = reactive<TableDataState>({
			ids: [],
			tableData: {
				data: [],
				loading: false,
				param: {
					name: '',
					code: '',
					status: -1,
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			queryList();
		};
		const queryList = () => {
			state.tableData.loading = true;
			api.heatStation.getList(state.tableData.param).then((res: any) => {
				state.tableData.data = res || [];
				state.tableData.loading = false;
			});
		};

		//查看详情
		const onOpenDetail = (row: TableDataRow) => {
			detailRef.value.openDialog(row);
		};
		// 打开新增产品弹窗
		const onOpenAddDic = () => {
			editDicRef.value.openDialog(null, state.tableData.data);
		};
		// 打开修改产品弹窗
		const onOpenEditDic = (row: TableDataRow) => {
			editDicRef.value.openDialog(row, state.tableData.data);
		};
		// 删除产品
		const onRowDel = (row: TableDataRow) => {
			let msg = '你确定要删除所选数据？';
			// let ids: number[] = [];
			// if (row) {
			msg = `此操作将永久删除设备：“${row.name}”，是否继续?`;
			// ids = [row.id];
			// } else {
			// 	ids = state.ids;
			// }
			// if (ids.length === 0) {
			// 	ElMessage.error('请选择要删除的数据。');
			// 	return;
			// }
			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.heatStation.del(row.id).then(() => {
						ElMessage.success('删除成功');
						queryList();
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
			queryList();
		};
		// 多选框选中数据
		const handleSelectionChange = (selection: TableDataRow[]) => {
			state.ids = selection.map((item) => item.id);
		};
		// 后端导出
		const exportExcel = () => {
			api.heatStation.heatStationExport(state.tableData.param).then((res: any) => {
				downloadFile(res, '换热站列表数据导出.xlsx');
			});
		};
		return {
			addDicRef,
			editDicRef,
			detailRef,
			queryRef,
			onOpenDetail,
			onOpenAddDic,
			onOpenEditDic,
			onRowDel,
			queryList,
			resetQuery,
			exportExcel,
			handleSelectionChange,
			...toRefs(state),
		};
	},
});
</script>
