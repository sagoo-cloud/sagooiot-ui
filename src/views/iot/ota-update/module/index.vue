<template>
	<el-card shadow="hover">
		<div class="search">
			<el-form :inline="true" ref="queryRef">
				<el-form-item label="模块名称：" prop="name">
					<el-input
						v-model="params.keyWord"
						placeholder="请输入产品名称"
						clearable
						size="default"
						style="width: 240px"
						@keyup.enter.native="getList"
					/>
				</el-form-item>
				<el-form-item label="所属产品" prop="productId">
					<el-select v-model="params.productId" filterable placeholder="请选择产品">
						<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()" value-key="id"> </el-option>
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
					<el-button type="primary" v-auth="'add'" @click="addOrEdit()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						添加模块
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
			<el-table-column prop="id" label="ID" width="60" show-overflow-tooltip></el-table-column>
			<el-table-column prop="name" label="模块名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="nameAs" label="模块别名" show-overflow-tooltip></el-table-column>
			<el-table-column prop="ProductName" label="所属产品" show-overflow-tooltip></el-table-column>

			<el-table-column prop="createdAt" label="创建时间" min-width="100" align="center"></el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template #default="scope">
					<el-button size="small" text type="warning" v-auth="'edit'" @click="addOrEdit(scope.row)">编辑</el-button>
					<el-button size="small" text type="danger" v-auth="'del'" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		<EditForm ref="editFormRef" @getList="getList()"></EditForm>
	</el-card>
</template>
  
<script lang="ts" setup>
import api from '/@/api/ota'
import { useSearch } from '/@/hooks/useCommon'
import { ElMessageBox, ElMessage } from 'element-plus'
import EditForm from './edit.vue'
import { ref } from 'vue'

const queryRef = ref()
const productData = ref([
	{
		id: '',
		name: '',
	},
])
const editFormRef = ref()

const { params, tableData, getList, loading } = useSearch<any[]>(api.module.getList, 'Data', { keyWord: '' })

getList()
const getProductList = () => {
	api.module.getSubList().then((res: any) => {
		let productDataList = res.product
		productData.value = productDataList
	})
}
getProductList()

const addOrEdit = async (row?: any) => {
	if (row) {
		editFormRef.value.open(row)
		return
	} else {
		editFormRef.value.open()
	}
}



const del = (row: any) => {
	ElMessageBox.confirm(`此操作将删除模型：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.module.del(row.id)
		ElMessage.success('删除成功')
		getList()
	})
}
</script>
  