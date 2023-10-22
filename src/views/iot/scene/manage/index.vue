<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">

					<el-form-item label="场景名称：" prop="keyWord">
						<el-input v-model="tableData.param.keyWord" placeholder="请输入场景名称" clearable size="default"
							style="width: 240px" @keyup.enter.native="getList" />
					</el-form-item>

					<el-form-item label="触发方式" prop="sceneType" style="width: 200px;">
						<el-select v-model="tableData.param.sceneType" placeholder="触发方式" clearable size="default"
							style="width: 240px">
							<el-option label="设备触发" value="device" />
							<el-option label="手动触发" value="manual" />
							<el-option label="定时触发" value="timer" />
						</el-select>
					</el-form-item>

					<el-form-item label="运行状态" prop="status" style="width: 200px;">
						<el-select v-model="tableData.param.status" placeholder="运行状态" clearable size="default"
							style="width: 240px">
							<el-option label="全部" :value="-1" />
							<el-option label="启用" :value="1" />
							<el-option label="禁用" :value="0" />
						</el-select>
					</el-form-item>

					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="getList">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button type="success" v-auth="'add'" @click="addOrEdit()">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增场景
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
				<el-table-column prop="id" label="ID" min-width="100" show-overflow-tooltip  v-col="'id'"></el-table-column>
				<el-table-column prop="name" label="场景名称" show-overflow-tooltip v-col="'name'"></el-table-column>
				<el-table-column prop="sceneType" label="场景类型" align="center" v-col="'sceneType'">
					<template #default="scope">
						<el-tag size="small" v-if="scope.row.sceneType == 'device'">设备触发</el-tag>
						<el-tag size="small" v-if="scope.row.sceneType == 'manual'">手动触发</el-tag>
						<el-tag size="small" v-if="scope.row.sceneType == 'timer'">定时触发</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="status" label="状态" align="center" v-col="'status'">
					<template #default="scope">
						<el-tag size="small" type="success" v-if="scope.row.status == 1">启用</el-tag>
						<el-tag size="small" type="info" v-if="scope.row.status == 0">未启用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="description" label="描述" show-overflow-tooltip v-col="'description'"></el-table-column>

				<el-table-column prop="createdAt" label="创建时间" align="center" v-col="'createdAt'"></el-table-column>
				<el-table-column label="操作" width="200" align="center">
					<template #default="scope">
					
						<router-link :to="'/iotmanager/scene/manage/' + scope.row.id" class="link-type"
							style="padding-right: 12px;font-size: 12px;color: #409eff;" v-auth="'detail'">
							<span>详情</span>
						</router-link>
						<el-button size="small" text type="warning" v-auth="'edit'"
							@click="addOrEdit(scope.row)">编辑</el-button>
						<el-button size="small" text type="success" @click="onActionStatus(scope.row)"
							v-if="scope.row.status == 0" v-auth="'startOrStop'">启用</el-button>
						<el-button size="small" text type="primary" @click="onActionStatus(scope.row)"
							v-if="scope.row.status > 0" v-auth="'startOrStop'">停用</el-button>
						<el-button size="small" text type="info" v-auth="'del'" @click="del(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum"
				v-model:limit="tableData.param.pageSize" @pagination="getList" />
		</el-card>

		<EditDic ref="editFormRef" @getList="getList" />
	</div>
</template>
  
<script lang="ts">
import { toRefs, reactive, onMounted,onActivated, ref, defineComponent } from 'vue';
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
import api from '/@/api/scene';
import EditDic from './edit.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

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
			keyWord:string,
			status:number,
			sceneType:string,
			dateRange: string[];
		};
	};
}

export default defineComponent({
	components: { EditDic },

	setup() {
		const editFormRef = ref();
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
					keyWord: '',
					status: -1,
					sceneType: '',
					dateRange: [],
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			getList();
		};
		const getList = () => {
			state.tableData.loading = true;
			api.manage.getList(state.tableData.param)
				.then((res: any) => {
					state.tableData.data = res.list;
					state.tableData.total = res.Total;
				})
				.finally(() => (state.tableData.loading = false));
		};
		onActivated(() => {
			initTableData();
		});
		const onActionStatus = (item: any) => {
			if (item.status == 0) {
				api.manage.status({ id: item.id, status: 1 }).then((res: any) => {
					getList();
					ElMessage.success(res.message || '操作成功');
				});
			} else {
				api.manage.status({ id: item.id, status: 0 }).then((res: any) => {
					getList();
					ElMessage.success(res.message || '操作成功');
				});
			}
		}

		const del = (row: any) => {
			ElMessageBox.confirm(`此操作将删除图形：“${row.name}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(async () => {
				await api.manage.del(row.id);
				ElMessage.success('删除成功');
				getList();
			});
		};

		const addOrEdit = async (row?: any) => {

			if (row) {
				editFormRef.value.open(row);
				return;
			} else {
				editFormRef.value.open();
			}
			};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		/** 重置按钮操作 */

		// 多选框选中数据
		const handleSelectionChange = (selection: TableDataRow[]) => {
			state.ids = selection.map((item) => item.id);
		};
		return {
			editFormRef,
			queryRef,
			del,
			addOrEdit,
			onActionStatus,
			getList,
			handleSelectionChange,
			...toRefs(state),
		};
	},
});
</script>
  