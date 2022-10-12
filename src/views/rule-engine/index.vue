<template>
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
					<el-button type="success" @click="addOrEdit()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增规则编排
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" style="width: 100%" v-loading="loading">
			<el-table-column type="index" label="序号" width="80" align="center" />
			<el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="expound" label="说明" show-overflow-tooltip></el-table-column>
			<el-table-column prop="createdAt" label="创建时间" min-width="100" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" width="100" align="center">
				<template #default="scope">
					<el-tag type="success" size="small" v-if="scope.row.status == 1">已启动</el-tag>
					<el-tag type="info" size="small" v-else>已停止</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template #default="scope">
					<el-button size="small" text type="info" v-if="scope.row.status" @click="setStatus(scope.row.id, 0)">停止</el-button>
					<el-button size="small" text type="primary" v-else @click="setStatus(scope.row.id, 1)">启动</el-button>
					<el-button size="small" text type="warning" @click="addOrEdit(scope.row)">编辑</el-button>
					<el-button size="small" text type="warning" @click="edit(scope.row)">规则编辑</el-button>
					<el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		<EditForm ref="editFormRef" @getList="getList()" :types="0"></EditForm>
	</el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '/@/api/rule';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommon';
import { Session } from '/@/utils/storage';
import EditForm from './edit.vue';

const editFormRef = ref();

const { params, tableData, getList, loading } = useSearch<any[]>(api.getList, 'Data', { types: 0 });

getList();

const addOrEdit = async (row?: any) => {
	if (row) {
		editFormRef.value.open(row);
		return;
	} else {
		editFormRef.value.open();
	}
};

const setStatus = (id: number, status: number) => {
	api
		.setStatus(id, status)
		.then(() => {
			ElMessage.success('操作成功');
			getList();
		})
		.catch(() => {
			ElMessage.error('操作失败');
		});
};

const edit = async (row: any) => {
	const url = window.location.protocol + '//' + window.location.hostname + ':1880/?access_token=' + Session.get('token') + '#flow/' + row.flowId;
	window.open(url);
};

const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除：“${row.name}”，是否继续?`, '提示', {
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
