
<template>
	<el-card shadow="hover">
		<div class="search">
			<el-form :inline="true" ref="queryRef">
				<el-form-item label="升级包名称：" prop="keyWord">
					<el-input v-model="params.keyWord" placeholder="请输入升级包名称" clearable size="default" style="width: 240px"
						@keyup.enter.native="getList" />
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
					<el-button type="primary" v-auth="'add'" @click="addOrEdit()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						添加升级包
					</el-button>

				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
			<el-table-column prop="id" label="ID" width="60" show-overflow-tooltip></el-table-column>
			<el-table-column prop="name" label="升级包名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="typo" label="类型" show-overflow-tooltip>
				<template #default="scope">
					<el-tag  size="small" v-if="scope.row.typo==1">整包</el-tag>
					<el-tag  type="info" size="small" v-if="scope.row.typo==2">差分</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="productName" label="所属产品" show-overflow-tooltip></el-table-column>
			<el-table-column prop="moduleName" label="模块名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="checkres" label="状态" width="100" align="center">
				<template #default="scope">
					<el-tag type="success" size="small" v-if="scope.row.checkres==1">验证</el-tag>
					<el-tag type="info" size="small" v-else>未验证</el-tag>
				</template>
			</el-table-column> 
			<el-table-column prop="createdAt" label="创建时间" min-width="100" align="center"></el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template #default="scope">
					<el-button size="small" text type="primary" v-if="!scope.row.folderName"
						@click="toDetail(scope.row.id)">查看</el-button>
					<el-button size="small" text type="warning" v-auth="'edit'" @click="addOrEdit(scope.row)">编辑</el-button>
					<el-button size="small" text type="success" v-auth="'edit'" @click="CheckUpdate(scope.row)">验证</el-button>
				
					<el-button size="small" text type="danger" v-auth="'del'" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize"
			@pagination="getList()" />
		<EditForm ref="editFormRef" @getList="getList()"></EditForm>
		<CheckForm ref="checkFormRef" @getList="getList()"></CheckForm>
	</el-card>
</template>
  
<script lang="ts" setup>
import api from '/@/api/ota';
import { useSearch } from '/@/hooks/useCommon';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditForm from './edit.vue';
import CheckForm from './check.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const queryRef = ref();
const router = useRouter();

const editFormRef = ref();
const checkFormRef = ref();

const { params, tableData, getList, loading } = useSearch<any[]>(api.manage.getList, 'fireware', { keyWord: '' });

getList();
/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	getList();
};
const toDetail = (id: number) => {
      router.push(`/iotmanager/ota/update/detail/${id}`)
};

const CheckUpdate= async (row?: any) => {
	if (row) {
		let array={
			productId:row.productId,
			devOtaFirewareId:row.id
		}
		checkFormRef.value.open(array);
		return;
	}
};

const addOrEdit = async (row?: any) => {
	if (row) {
		editFormRef.value.open(row);
		return;
	} else {
		editFormRef.value.open();
	}
};

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
  