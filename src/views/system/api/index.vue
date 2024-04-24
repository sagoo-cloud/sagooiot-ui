<template>
	<div class="page">
		<el-card shadow="nover">
			<el-form :model="params" inline ref="queryRef">
				<el-form-item label="接口名称" prop="name">
					<el-input v-model="params.name" placeholder="请输入接口名称" clearable style="width: 180px" @keyup.enter.native="getList(1)" />
				</el-form-item>
				<el-form-item label="接口地址" prop="address">
					<el-input v-model="params.address" placeholder="请输入接口地址" clearable style="width: 180px" @keyup.enter.native="getList(1)" />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="params.status" placeholder="接口状态" clearable style="width: 120px">
						<el-option label="全部" :value="-1" />
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="ml10" @click="getList(1)">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
					<!-- <el-button @click="resetQuery()">
							<el-icon>
								<ele-Refresh />
							</el-icon>
							重置
						</el-button> -->
					<el-button type="primary" @click="addOrEdit()" v-auth="'add'">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增接口
					</el-button>
					<el-button type="primary" :disabled="!ids.length" @click="bindMenus()" v-auth="'batch'">
						<el-icon>
							<ele-Grid />
						</el-icon>
						批量绑定菜单
					</el-button>
					<el-button type="primary" @click="apiImport()" :loading="importing" v-auth="'import'">
						<el-icon>
							<ele-Download />
						</el-icon>
						系统API同步
					</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%" v-loading="loading" :expand-row-keys="[]" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
				<el-table-column v-col="'selection'" type="selection" width="55" align="center" />
				<!-- <el-table-column type="index" label="序号" width="60" align="center" /> -->
				<el-table-column prop="id" label="ID" width="120" align="center" />
				<el-table-column prop="name" v-col="'name'" label="接口名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="address" v-col="'address'" label="接口地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" v-col="'status'" label="状态" min-width="100" align="center">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status">启用</el-tag>
						<el-tag type="info" size="small" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="menuIds" label="绑定菜单" show-overflow-tooltip></el-table-column> -->
				<el-table-column label="操作" width="100" align="center" v-col="'handle'">
					<template #default="scope">
						<el-button size="small" text type="warning" @click="addOrEdit(scope.row)" v-auth="'edit'">修改</el-button>
						<el-button size="small" text type="info" @click="onDel(scope.row)" v-auth="'del'">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		</el-card>
		<EditForm ref="editFormRef" @getList="getList(1)"></EditForm>
		<bindVue ref="bindRef" @getList="getList(1)"></bindVue>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import EditForm from './component/edit.vue'
import bindVue from './component/bind.vue'
import { ApiRow } from '/@/api/model/system/menu'
import api from '/@/api/system'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useSearch } from '/@/hooks/useCommon'

const editFormRef = ref()
const bindRef = ref()
const queryRef = ref()
const importing = ref(false)
const ids = ref<number[]>([])

const { params, tableData, getList, loading } = useSearch<ApiRow[]>(api.api.getList, 'Info', { name: '', address: '', types: -1 })

getList()

const addOrEdit = async (row?: ApiRow) => {
	if (row) {
		const res = await api.api.detail(row.id as number)
		editFormRef.value.open(res)
		return
	} else {
		editFormRef.value.open()
	}
}

const handleSelectionChange = (selection: any[]) => {
	ids.value = selection.filter(item => item.types === 2).map((item) => item.id);
};

const apiImport = () => {
	importing.value = true
	api.api.import().then(() => {
		ElMessage.success('导入成功')
	}).finally(() => importing.value = false)
};

// 重置表单
const resetQuery = () => {
	queryRef.value.resetFields()
	getList(1)
}

// 重置表单
const bindMenus = () => {
	bindRef.value.open(ids.value)
}

const onDel = (row: ApiRow) => {
	ElMessageBox.confirm(`此操作将删除接口：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.api.del(row.id as number)
		ElMessage.success('删除成功')
		getList()
	})
}
</script>
