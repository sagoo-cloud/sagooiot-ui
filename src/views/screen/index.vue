<template>
	<div class="page">
		<el-card shadow="hover">
			<div class="search">
				<el-form :inline="true">
					<el-form-item>
						<!-- <el-button size="default" type="primary" class="ml10" @click="getList(1)">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button> -->
						<el-button type="success" @click="add()">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增大屏
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
				<el-table-column prop="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createdAt" label="创建时间" min-width="100" align="center"></el-table-column>
				<el-table-column prop="updatedAt" label="更新时间" min-width="100" align="center"></el-table-column>
				<el-table-column label="操作" width="100" align="center">
					<template #default="scope">
						<el-button size="small" text type="warning" @click="edit(scope.row)">编辑</el-button>
						<el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import api from '/@/api/screen';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommon';
import { getUUID } from '/@/utils/uuid';

const { params, tableData, getList } = useSearch<any[]>(api.getList, 'Data', { name: '', address: '' });

getList();

const add = async () => {
	await api.add({
		indexImage: null,
		projectName: getUUID(),
		remarks: null,
	});
	ElMessage.success('新增成功');
	getList();
};

const edit = async (row: any) => {
	window.open(import.meta.env.VITE_SCREEN_URL + '#/chart/home/' + row.id);
};

const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除接口：“${row.projectName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.del([row.id as string]);
		ElMessage.success('删除成功');
		getList();
	});
};
</script>
