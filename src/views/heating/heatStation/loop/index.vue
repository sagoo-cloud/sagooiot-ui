<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
					<el-form-item label="环路名称" prop="name">
						<el-input
							v-model="tableData.param.name"
							placeholder="请输入环路名称"
							clearable
							size="default"
							style="width: 240px"
							@keyup.enter="queryList"
						/>
					</el-form-item>
					<el-form-item label="环路编号" prop="code">
						<el-input
							v-model="tableData.param.code"
							placeholder="请输入环路编号"
							clearable
							size="default"
							style="width: 240px"
							@keyup.enter="queryList"
						/>
					</el-form-item>
					<el-form-item label="环路类型" prop="loopTypes" style="width: 200px">
						<el-select v-model="tableData.param.loopTypes" placeholder="全部" clearable size="default" style="width: 240px">
							<el-option label="一网" :value="1" />
							<el-option label="二网" :value="2" />
						</el-select>
					</el-form-item>
					<el-form-item label="供暖对象" prop="heatingObject" style="width: 200px">
						<el-select v-model="tableData.param.heatingObject" placeholder="全部" clearable size="default" style="width: 240px">
							<el-option label="公建" :value="1" />
							<el-option label="居民" :value="2" />
						</el-select>
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
						<el-button @click="exportExcel" v-auth="'download'">
							<el-icon> <ele-Download /> </el-icon>
							数据导出
						</el-button>
						<uploadBtn @update="queryList" url="/region/loop/import" v-auth="'upload'"></uploadBtn>
						<!-- <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除
            </el-button> -->
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column label="ID" align="center" prop="id" width="60" />
				<el-table-column label="编号" prop="code" v-col="'code'" :show-overflow-tooltip="true" />
				<el-table-column label="名称" prop="name" v-col="'name'" :show-overflow-tooltip="true">
					<template #default="{ row }">
					{{ row.stationInfo.name }}-{{ row.name }}
					</template>
				</el-table-column>
				<!-- stationInfo -->
				<el-table-column label="类型" prop="loopTypes" v-col="'loopTypes'">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.loopTypes === 1">一网</el-tag>
						<el-tag type="info" size="small" v-else-if="scope.row.loopTypes === 2">二网</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="节能类型" prop="energyTypes" v-col="'energyTypes'">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.energyTypes === 1">节能</el-tag>
						<el-tag type="success" size="small" v-else-if="scope.row.energyTypes === 2">非节能</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="供暖对象" prop="heatingObject" v-col="'heatingObject'" :show-overflow-tooltip="true">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.heatingObject === 1">公建</el-tag>
						<el-tag type="info" size="small" v-else-if="scope.row.heatingObject === 2">居民</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="供暖类型" prop="heatingTypes" v-col="'heatingTypes'">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.heatingTypes === 1">地暖</el-tag>
						<el-tag type="info" size="small" v-else-if="scope.row.heatingTypes === 2">暖气片</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="联网面积" prop="forRealArea" v-col="'forRealArea'" :show-overflow-tooltip="true" />
				<el-table-column label="实供面积" prop="heatingArea" v-col="'heatingArea'" :show-overflow-tooltip="true" />
				<!--	    	<el-table-column label="环路年代" prop="decade" :show-overflow-tooltip="true" />-->
				<el-table-column prop="status" label="状态" v-col="'status'" align="center">
					<template #default="scope">
						<el-tag type="info" size="small" v-if="scope.row.status === 0">禁用</el-tag>
						<el-tag type="success" size="small" v-else-if="scope.row.status === 1">启用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150" v-col="'handle'" align="center">
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
		<EditDic ref="editDicRef" @queryList="queryList" />
		<Detail ref="detailRef" />
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import Detail from './component/detail.vue';
import api from '/@/api/heatStation';
import downloadFile from '/@/utils/download';
import uploadBtn from '/@/components/upload/button.vue';

// 定义接口来定义对象的类型
interface Point {
	sort?: number;
	lnt: number;
	lat: number;
}
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
	viaPoint: Array<Point>;
	decade: string;
	status: number;
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
			code: string;
			loopTypes: string;
			heatingObject: string;
			status: number;
		};
	};
}

export default defineComponent({
	name: 'loop',
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
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					name: '',
					code: '',
					loopTypes: '',
					heatingObject: '',
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
			api.loop.getList(state.tableData.param).then((res: any) => {
				console.log(res);
				state.tableData.data = res.Data || [];
				state.tableData.total = res.Total;
				state.tableData.loading = false;
			});
		};

		//查看详情
		const onOpenDetail = (row: TableDataRow) => {
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
		// 删除产品
		const onRowDel = (row: TableDataRow) => {
			// let msg = '你确定要删除所选数据？';
			// let ids: number[] = [];
			// if (row) {
			let msg = `此操作将永久删除环路：“${row.name}”，是否继续?`;
			// 	ids = [row.id];
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
					api.loop.del(row.id).then(() => {
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
			api.loop.export(state.tableData.param).then((res: any) => {
				downloadFile(res, '环路列表数据导出.xlsx');
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
			handleSelectionChange,
			exportExcel,
			...toRefs(state),
		};
	},
});
</script>
