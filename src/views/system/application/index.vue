<template>
	<el-card shadow="hover">
		<div class="search">
			<el-form :inline="true" ref="queryRef">
				<el-form-item label="应用名称：" prop="name">
					<el-input
						v-model="params.keyWord"
						placeholder="请输入应用名称"
						clearable
						size="default"
						style="width: 240px"
						@keyup.enter.native="getList"
					/>
				</el-form-item>
				<el-form-item>
					<el-button size="default" type="primary" class="ml10" @click="getList()">
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
					<el-button type="primary" v-auth="'add'" @click="addOrEdit()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						添加应用
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
			<el-table-column prop="id" label="ID" width="60" show-overflow-tooltip  v-col="'id'"></el-table-column>
			<el-table-column prop="appId" label="应用标识" show-overflow-tooltip v-col="'appId'"></el-table-column>
			<el-table-column prop="name" label="应用名称"  show-overflow-tooltip v-col="'name'"></el-table-column>
			<el-table-column prop="desc" label="描述"  show-overflow-tooltip  v-col="'desc'"></el-table-column>
			<el-table-column prop="status" label="应用状态"  width="80" align="center" v-col="'status'">
				<template #default="scope">
					<el-tag size="small" type="success" v-if="scope.row.status == 1">启用</el-tag>
					<el-tag size="small" type="info" v-if="scope.row.status == 0">未启用</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createdAt" label="创建时间" width="160" align="center"  v-col="'createdAt'"></el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template #default="scope">
					<el-button size="small" text type="success" @click="onActionStatus(scope.row)"
						v-if="scope.row.status == 0" v-auth="'startOrStop'">启用</el-button>
					<el-button size="small" text type="primary" @click="onActionStatus(scope.row)" v-if="scope.row.status > 0"
						v-auth="'startOrStop'">停用</el-button>
					<el-button size="small" text type="warning" v-auth="'edit'" @click="addOrEdit(scope.row)">编辑</el-button>
					<el-button size="small" text type="danger" v-auth="'del'" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		<EditForm ref="editFormRef"  :deptData="deptData" @getList="getList()"></EditForm>
	</el-card>
</template>
  
<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import EditForm from './edit.vue'
import { ref } from 'vue'
import api from '/@/api/application'
import user from '/@/api/system';
import { useSearch } from '/@/hooks/useCommon'

const queryRef = ref()
const deptData = ref([])
const editFormRef = ref()
const { params, tableData, getList, loading } = useSearch<any[]>(api.getList, 'Data', { keyWord: '' })
getList()
/** 重置按钮操作 */
const resetQuery = (formEl: any) => {
	if (!formEl) return;
	formEl.resetFields();
	getList();
};
const initTableData = () => {
	user.dept.getList({status:1}).then((res: any) => {
		deptData.value = res;
	});
};
initTableData();
const onActionStatus = (item: any) => {
	if (item.status == 0) {
		api.status({ id: item.id,status:1 }).then((res: any) => {
			getList();
			ElMessage.success(res.message || '操作成功');
		});
	} else {
		api.status({ id: item.id,status:0 }).then((res: any) => {
			getList();
			ElMessage.success(res.message || '操作成功');
		});
	}
}
const addOrEdit = async (row?: any) => {
	if (row) {
		editFormRef.value.open(row)
		return
	} else {
		editFormRef.value.open()
	}
}
const del = (row: any) => {
	ElMessageBox.confirm(`此操作将删除应用：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.del(row.id)
		ElMessage.success('删除成功')
		getList()
	})
}
</script>
  