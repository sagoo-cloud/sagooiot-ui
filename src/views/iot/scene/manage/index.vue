<template>
	<el-card shadow="hover">
		<div class="search">
			<el-form :inline="true" ref="queryRef">
				<el-form-item label="场景名称：" prop="name">
					<el-input v-model="params.keyWord" placeholder="请输入产品名称" clearable size="default" style="width: 240px"
						@keyup.enter.native="getList" />
				</el-form-item>
				<el-form-item label="运行状态" prop="status" style="width: 200px;">
					<el-select v-model="params.status" placeholder="运行状态" clearable size="default" style="width: 240px">
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="0" />
					</el-select>
				</el-form-item>

				<el-form-item>

					<el-button size="default" type="primary" class="ml10" @click="getList()">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-auth="'add'" @click="addOrEdit()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增场景
					</el-button>

				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
			<el-table-column prop="id" label="ID"  min-width="100" show-overflow-tooltip></el-table-column>
			<el-table-column prop="name" label="场景名称"  show-overflow-tooltip></el-table-column>
			<el-table-column prop="sceneType" label="场景类型" align="center">
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.sceneType == 'device'">设备触发</el-tag>
					<el-tag size="small" v-if="scope.row.sceneType == 'manual'">手动触发</el-tag>
					<el-tag size="small" v-if="scope.row.sceneType == 'timer'">定时触发</el-tag>
				</template>
			</el-table-column>

			<el-table-column prop="status" label="状态" align="center">
				<template #default="scope">
					<el-tag size="small" type="success" v-if="scope.row.status == 1">启用</el-tag>
					<el-tag size="small" type="info" v-if="scope.row.status == 0">未启用</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
	
			<el-table-column prop="createdAt" label="创建时间" align="center"></el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template #default="scope">
					<el-button size="small" text type="primary" v-if="!scope.row.folderName"
						@click="toDetail(scope.row.id)">详情</el-button>
					<el-button size="small" text type="warning" v-auth="'edit'" @click="addOrEdit(scope.row)">编辑</el-button>
					<el-button size="small" text type="success" @click="onActionStatus(scope.row)"
						v-if="scope.row.status == 0" v-auth="'startOrStop'">启用</el-button>
					<el-button size="small" text type="primary" @click="onActionStatus(scope.row)" v-if="scope.row.status > 0"
						v-auth="'startOrStop'">停用</el-button>
					<el-button size="small" text type="info" v-auth="'del'" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize"
			@pagination="getList()" />
		<EditForm ref="editFormRef" @getList="getList()"></EditForm>
	</el-card>
</template>

<script lang="ts" setup>
import api from '/@/api/scene';
import { useSearch } from '/@/hooks/useCommon';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import getOrigin from '/@/utils/origin'
import EditForm from './edit.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const queryRef = ref();
const router = useRouter();

const editFormRef = ref();

const { params, tableData, getList, loading } = useSearch<any[]>(api.manage.getList, 'Data', { keyWord: '' });

getList();
/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	getList();
};
const toDetail = (id: number) => {
	router.push(`/iotmanager/scene/manage/detail/${id}`)
};
function getTokenUrl(url: string) {
	const tokenUrl = import.meta.env.VITE_TOPO_URL
	return getOrigin(tokenUrl + url)
}

const view = (row: any) => {
	const url = getTokenUrl('#/show/' + row.id);
	window.open(url);
};

const addOrEdit = async (row?: any) => {
	// const url = getTokenUrl('#/editor/new');
	// window.open(url);
	if (row) {
		editFormRef.value.open(row);
		return;
	} else {
		editFormRef.value.open();
	}
};

const edit = (row: any) => {
	const url = getTokenUrl('#/editor/' + row.id);
	window.open(url);
};
const onActionStatus = (item: any) => {
	if (item.status == 0) {
		api.manage.status({ id: item.id,status:1 }).then((res: any) => {
			getList();
			ElMessage.success(res.message || '操作成功');
		});
	} else {
		api.manage.status({ id: item.id,status:0 }).then((res: any) => {
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
</script>
