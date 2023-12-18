<template>
	<el-card shadow="hover">
		<div class="search">
			<el-form :inline="true" ref="queryRef" @keyup.enter="getList(1)">
				<el-form-item label="名称：" prop="keyWord">
					<el-input v-model="params.keyWord" placeholder="请输入名称" clearable size="default" style="width: 240px" />
				</el-form-item>

				<el-form-item>
					<el-button size="default" type="primary" class="ml10" @click="getList(1)">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="addOrEdit()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增档案
					</el-button>

					<el-button type="primary" @click="addOrEdit()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						批量添加
					</el-button>

					<el-button type="danger" @click="addOrEdit()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						批量删除
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-row>
			<el-col :span="6">
				<el-tree :data="mergedData" :props="defaultProps" accordion default-expand-all	 @node-click="handleNodeClick" style="border: 1px solid #eee;padding: 10px;margin-right: 10px;">
					<template #default="{ node, data }">
						<span :style="data.is_type === '2' ? { color: '#409eff' } : {}">
							<el-icon  v-if="data.is_type == '2'"><Expand /></el-icon>
						{{ node.label }}
						</span>
					</template>
					</el-tree>
			</el-col>
			<el-col :span="18"><el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
					<el-table-column prop="id" label="设备名称" min-width="100" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="设备ID" show-overflow-tooltip></el-table-column>
					<el-table-column prop="sceneType" label="设备编码" align="center">
						<template #default="scope">
							<el-tag size="small" v-if="scope.row.sceneType == 'device'">设备触发</el-tag>
							<el-tag size="small" v-if="scope.row.sceneType == 'manual'">手动触发</el-tag>
							<el-tag size="small" v-if="scope.row.sceneType == 'timer'">定时触发</el-tag>
						</template>
					</el-table-column>

					<el-table-column prop="name" label="所属区域" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="管理单位" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="建设单位" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="维护单位" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="设备类型" show-overflow-tooltip></el-table-column>

					<el-table-column prop="status" label="状态" align="center">
						<template #default="scope">
							<el-tag size="small" type="success" v-if="scope.row.status == 1">启用</el-tag>
							<el-tag size="small" type="info" v-if="scope.row.status == 0">禁用</el-tag>
						</template>
					</el-table-column>

					<el-table-column prop="createdAt" label="创建时间" width="160" align="center"></el-table-column>
					<el-table-column label="操作" width="200" align="center">
						<template #default="scope">
							<el-button size="small" text type="primary" v-if="!scope.row.folderName"
								@click="toDetail(scope.row.id)">属性</el-button>
							<el-button size="small" text type="warning" v-auth="'edit'"
								@click="addOrEdit(scope.row)">编辑</el-button>

							<el-button size="small" text type="info" v-auth="'del'" @click="del(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum"
					v-model:limit="params.pageSize" @pagination="getList()" />
			</el-col>
		</el-row>

		<EditForm ref="editFormRef" @getList="getList(1)"></EditForm>
	</el-card>
</template>

<script lang="ts" setup>
import device from '/@/api/device'
import api from '/@/api/scene'
import { useSearch } from '/@/hooks/useCommon'
import {  Expand } from '@element-plus/icons-vue';

import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
import EditForm from './edit.vue'
interface Tree {
  label: string
  children?: Tree[]
}
import { ref,onMounted} from 'vue'
import { useRouter } from 'vue-router'
const defaultProps = {
  children: 'children',
  label: 'label',
}
const queryRef = ref()
const router = useRouter()
const productData = ref([])
const mergedData = ref()
const cateData = ref()
const editFormRef = ref()


const { params, tableData, getList, loading } = useSearch<any[]>(api.manage.getList, 'Data', { keyWord: '' })
getList()
const toDetail = (id: number) => {
	router.push(`/device/dossier/manage/${id}`)
}
onMounted(() => {
	getCateList()

});
const addOrEdit = async (row?: any) => {
	if (row) {
		editFormRef.value.open(row)
		return
	} else {
		editFormRef.value.open()
	}
}


const getCateList = () => {
	device.category.getList({}).then((res: any) => {
		cateData.value = res.category;

		device.product.getLists({}).then((res: any) => {
			productData.value = res.product;
			mergedData.value = matchProductsToCategories(productData.value, cateData.value);
			console.log(mergedData.value); // 打印生成的树形数据
			// 将treeData绑定到el-tree的data属性上
		})

	})
}

const handleNodeClick = (data: Tree) => {
  console.log(data)
}

const matchProductsToCategories = (productData:any, cateData:any) => {
  const treeData = []
  for (let category of cateData) {
    const treeNode = buildTree(category, productData)
    treeData.push(treeNode)
  }
  return treeData
}

const buildTree = (category:any, productData:any) => {
  const treeNode = {
    id: category.id,
    label: category.name,
    is_type: '1', // 1是分类
    children: [],
  }

  if (category.children && category.children.length > 0) {
    for (let child of category.children) {
      const childNode = buildTree(child, productData)
      treeNode.children.push(childNode)
    }
  } else {
    const products = productData.filter((product:any) => product.categoryId === category.id)
    for (let product of products) {
      const productNode = {
        id: product.id,
        label: product.name,
        is_type: '2', // 2是产品
      }
      treeNode.children.push(productNode)
    }
  }

  return treeNode
}

const del = (row: any) => {
	ElMessageBox.confirm('是否确认删除名称为："' + row.name + '"的数据项?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.manage.del(row.id)
		ElMessage.success('删除成功')
		getList()
	})
}
getCateList()

</script>
