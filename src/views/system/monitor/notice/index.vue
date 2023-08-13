<template>
	<div class="page">
		<el-card shadow="hover">
			<div class="search">
				<el-form :model="params" :inline="true" ref="queryRef">
					<!-- <el-form-item label="接口名称" prop="name">
            <el-input v-model="params.name" placeholder="请输入接口名称" clearablestyle="width: 240px" @keyup.enter.native="getList(1)" />
          </el-form-item> -->
					<!-- <el-form-item label="状态" prop="status" style="width: 200px">
            <el-select v-model="params.status" placeholder="接口状态" clearablestyle="width: 240px">
              <el-option label="全部" :value="-1" />
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item> -->
					<el-form-item>
						<!-- <el-button size="default" type="primary" class="ml10" @click="getList(1)">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button> -->
						<!-- <el-button size="default" type="primary" class="ml10" @click="getList(1)">
							<el-icon>
								<ele-Search />
							</el-icon>
							清空
						</el-button> -->
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="MessageInfo.title" label="标题" show-overflow-tooltip></el-table-column>
				<el-table-column prop="MessageInfo.content" label="内容" show-overflow-tooltip></el-table-column>
				<el-table-column prop="MessageInfo.createdAt" label="发生事件" width="160"></el-table-column>
				<el-table-column prop="" label="状态" min-width="100" align="center">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.isRead">已读</el-tag>
						<el-tag type="info" size="small" v-else>未读</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="150" align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" v-if="!scope.row.isRead">设为已读</el-button>
						<el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		</el-card>
		<EditForm ref="editFormRef" @getList="getList()"></EditForm>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EditForm from './component/edit.vue';
import { ApiRow } from '/@/api/model/system/menu';
import api from '/@/api/message';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommon';

const editFormRef = ref();
const queryRef = ref();

const { params, tableData, getList, loading } = useSearch<ApiRow[]>(api.getList, 'Info', { name: '', address: '', types: -1 });

getList();

const addOrEdit = async (row?: ApiRow) => {
	if (row) {
		const res = await api.api.detail(row.id as number);
		editFormRef.value.open(res);
		return;
	} else {
		editFormRef.value.open();
	}
};

// 重置表单
const resetQuery = () => {
	queryRef.value.resetFields();
	getList(1);
};

const onDel = (row: ApiRow) => {
	ElMessageBox.confirm(`此操作将删除接口：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.api.del(row.id as number);
		ElMessage.success('删除成功');
		getList();
	});
};
</script>
