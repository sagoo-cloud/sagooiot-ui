<template>
	<div class="page">
		<el-card shadow="hover">
			<div class="search">
				<el-form :model="params" :inline="true" ref="queryRef">
					<el-form-item label="模板名称" prop="title">
						<el-input v-model="params.title" placeholder="请输入模板名称" clearablestyle="width: 240px" @keyup.enter.native="getList(1)" />
					</el-form-item>
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="getList(1)">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button size="default" @click="resetQuery()">
							<el-icon>
								<ele-Refresh />
							</el-icon>
							重置
						</el-button>
						<el-button type="success" @click="addOrEdit()">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增模板
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column type="index" label="序号" width="80" align="center" />
				<el-table-column prop="title" label="模板名称" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mode" label="模式" align="center" width="120" show-overflow-tooltip>
					<template #default="{ row }">
						{{ row.mode === 0 ? '顺序读取' : '批量读取' }}
					</template>
				</el-table-column>
				<el-table-column prop="remarks" label="备注" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="160" align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="handleImport(scope.row)">导入</el-button>
						<el-button size="small" text type="primary" @click="handleExport(scope.row)">导出</el-button>
						<el-button size="small" text type="primary" @click="addOrEdit(scope.row)">详情</el-button>
						<el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.page" v-model:limit="params.size" @pagination="getList()" />
		</el-card>
		<EditForm ref="editFormRef" @getList="getList()"></EditForm>
		<ImportFile ref="importFile" />
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EditForm from './component/edit.vue';
import ImportFile from './component/importFile.vue';
import api from '/@/api/device/modbus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonModbus';
import getOrigin from '/@/utils/origin'

const importFile = ref();
const editFormRef = ref();
const queryRef = ref();

const { params, tableData, getList, loading } = useSearch(api.template.getList, 'list', { title: '', number: '' });

getList();

const addOrEdit = async (row?: any) => {
	editFormRef.value.open(row ? 'update' : 'create', row);
};

const handleImport = async (row: any) => {
	importFile.value.templateNumber = row.number;
	importFile.value.openDialog();
};

const handleExport = async (row: any) => {
	window.open(getOrigin(import.meta.env.VITE_MODBUS_API + '/data_area/export?number=' + row.number))
};

// 重置表单
const resetQuery = () => {
	queryRef.value.resetFields();
	getList(1);
};

const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除接口：“${row.title}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.template.deleteTemplate({ number: row.number });
		ElMessage.success('删除成功');
		getList();
	});
};
</script>
