<template>
	<div class="page page-full border bg padding">
		<el-form inline ref="queryRef" @keyup.enter="getList(1)">
			<el-form-item label="关键字：" prop="keyWord">
				<el-input v-model="params.keyWord" placeholder="请输入关键字" clearable style="width: 240px" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" class="ml10" @click="getList(1)">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="addOrEdit()" v-auth="'add'" v-if="productIno">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增属性
				</el-button>
				<el-button type="info" @click="batchdel()" v-auth="'batchdel'">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					删除
				</el-button>
			</el-form-item>
		</el-form>
		<div class="page page-full-part flex-row gap-4">
			<el-card style="width: 250px;" shadow="nover">
				<el-tree :data="mergedData" :props="defaultProps" accordion default-expand-all @node-click="handleNodeClick" :node-key="'id'" highlight-current>
					<template #default="{ node, data }">
						<div class="custom-tree-node">
							<span class="tree-label">
								<el-icon v-if="data.is_type != '2'">
									<Folder />
								</el-icon>
                <SvgIcon name="iconfont icon-siweidaotu" v-if="data.is_type == '2'"></SvgIcon>
								{{ node.label }}
							</span>
						</div>
					</template>
				</el-tree>
			</el-card>
			<el-card class="flex1" shadow="nover">
				<div class="page page-full">
					<el-table :data="tableData" @selection-change="handleSelectionChange" style="width: 100%" row-key="id" v-loading="loading">
						<el-table-column type="selection" width="55" align="center" />
						<el-table-column prop="id" v-col="'id'" label="ID" min-width="100" show-overflow-tooltip></el-table-column>
						<el-table-column prop="name" v-col="'name'" label="字段名称" show-overflow-tooltip></el-table-column>
						<el-table-column prop="title" v-col="'title'" label="字段标题" show-overflow-tooltip></el-table-column>
						<el-table-column prop="types" v-col="'types'" label="字段类型" show-overflow-tooltip></el-table-column>
						<el-table-column prop="createdAt" v-col="'createdAt'" label="创建时间" width="160" align="center"></el-table-column>
						<el-table-column label="操作" width="200" align="center">
							<template #default="scope">
								<el-button size="small" text v-auth="'edit'" type="warning" @click="addOrEdit(scope.row)">编辑</el-button>
								<el-button size="small" text v-auth="'del'" type="info" @click="del(scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
				</div>
			</el-card>
		</div>
		<EditForm ref="editFormRef" @getList="getList(1)"></EditForm>
	</div>
</template>

<script lang="ts" setup>
import device from '/@/api/device'
import { useSearch } from '/@/hooks/useCommon'
import { Folder } from '@element-plus/icons-vue';

import { ElMessageBox, ElMessage } from 'element-plus'
import EditForm from './edit.vue'
interface Tree {
	label: string
	children?: Tree[]
}
import { ref, onMounted } from 'vue'
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
const productIno = ref();
const ids = ref<number[]>([])

const { params, tableData, getList, loading } = useSearch<any[]>(device.dev_asset_metadata.getList, 'Data', { keyWord: '' })
onMounted(() => {
	getCateList()
});
const handleSelectionChange = (selection: any[]) => {
	ids.value = selection.map((item) => item.id);
};
const addOrEdit = async (row?: any) => {
	if (row) {
		editFormRef.value.open(row, productIno.value)
		return
	} else {
		editFormRef.value.open({}, productIno.value)
	}
}

const getCateList = () => {
	device.category.getList({}).then((res: any) => {
		cateData.value = res.category;

		device.product.getLists({}).then((res: any) => {
			productData.value = res.product;
			params.productKey = res.product[0].key
			getList()
			mergedData.value = matchProductsToCategories(productData.value, cateData.value);

			// 默认加载第一个设备对应属性
			if (productData.value.length > 0) {
				handleNodeClick(mergedData.value[0].children[0])
			}
		});
	})
}

const handleNodeClick = (data: any) => {
	if (data.is_type === '2') {
		productIno.value = data;
		params.productKey = data.key
		getList()
	} else {
		productIno.value = '';
	}
}

const matchProductsToCategories = (productData: any, cateData: any) => {
	const treeData = []
	for (let category of cateData) {
		const treeNode = buildTree(category, productData)
		treeData.push(treeNode)
	}
	return treeData
}

const buildTree = (category: any, productData: any) => {
	const treeNode = {
		id: category.id,
		label: category.name,
		key: category.key,
		is_type: '1', // 1是分类
		children: [],
	}

	if (category.children && category.children.length > 0) {
		for (let child of category.children) {
			const childNode = buildTree(child, productData)
			treeNode.children.push(childNode)
		}
	} else {
		const products = productData.filter((product: any) => product.categoryId === category.id)
		for (let product of products) {
			const productNode = {
				id: product.id,
				label: product.name,
				key: product.key,
				is_type: '2', // 2是产品
			}
			treeNode.children.push(productNode)
		}
	}

	return treeNode
}
const batchdel = () => {
	ElMessageBox.confirm('是否确认要批量删除这些数据吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await device.dev_asset_metadata.delete({ ids: ids.value })
		ElMessage.success('删除成功')
		getList()
	})
}
const del = (row: any) => {
	ElMessageBox.confirm('是否确认删除名称为："' + row.name + '"的数据项?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await device.dev_asset_metadata.delete({ ids: row.id })
		ElMessage.success('删除成功')
		getList()
	})
}

</script>
<style scoped lang="scss">
.custom-tree-node {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
	overflow: hidden;

	.tree-label {
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 10px;
	}

	&:hover {
		.tree-options {
			display: block;
		}
	}
}
</style>