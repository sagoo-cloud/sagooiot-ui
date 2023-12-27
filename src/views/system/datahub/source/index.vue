<template>
	<div class="page">
		<el-card shadow="nover">
			<el-form :inline="true" ref="queryRef">
				<el-form-item label="数据源标识" prop="name">
					<el-input v-model="params.key" placeholder="数据源标识" clearable size="default" style="width: 160px" @keyup.enter.native="getList" />
				</el-form-item>
				<el-form-item label="数据源名称" prop="name">
					<el-input
						v-model="params.name"
						placeholder="请输入数据源名称"
						clearable
						size="default"
						style="width: 160px"
						@keyup.enter.native="getList"
					/>
				</el-form-item>
				<el-form-item label="数据源类型" prop="from">
					<el-select v-model="params.from" placeholder="请选择数据源类型" @keyup.enter.native="getList">
						<el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button size="default" type="primary" class="ml10" @click="getList(1)">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
					<el-button v-auth="'reset'" size="default" @click="resetQuery()">
						<el-icon>
							<ele-Refresh />
						</el-icon>
						重置
					</el-button>
					<el-button v-auth="'add'" size="default" type="primary" class="ml10" @click="onOpenAdd">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增数据源
					</el-button>
					<el-button size="default" type="info" class="ml10" @click="batchdel()" v-auth="'del'">
						<el-icon>
							<ele-Delete />
						</el-icon>
						批量删除
					</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" row-key="id" v-loading="loading">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="ID" align="center" prop="sourceId" width="100" v-col="'sourceId'" />
				<el-table-column label="数据源标识" prop="key" show-overflow-tooltip v-col="'key'" />
				<el-table-column label="数据源名称" prop="name" show-overflow-tooltip v-col="'name'" />
				<el-table-column prop="from" label="数据源类型" width="160" align="center" v-col="'from'">
					<template #default="scope">
						<span v-if="scope.row.from == 1">api导入</span>
						<span v-if="scope.row.from == 2">数据库</span>
						<span v-if="scope.row.from == 3">文件</span>
						<span v-if="scope.row.from == 4">设备</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="100" align="center" v-col="'status'">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status == 1">已发布</el-tag>
						<el-tag type="info" size="small" v-if="scope.row.status == 0">未发布</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="200" align="center" fixed="right">
					<template #default="scope">
						<router-link
							:to="'/config/datahub/source/' + scope.row.sourceId"
							class="link-type"
							style="padding-right: 12px; font-size: 12px; color: #409eff"
							v-auth="'detail'"
						>
							<span>详情</span>
						</router-link>
						<el-button size="small" text type="success" @click="onOpenList(scope.row)" v-if="scope.row.status == 1" v-auth="'detail'"
							>数据记录</el-button
						>
						<el-button size="small" text type="warning" @click="onOpenEdit(scope.row)" v-if="scope.row.status == 0" v-auth="'edit'">修改</el-button>
						<el-button size="small" text type="info" @click="del(scope.row)" v-if="scope.row.status == 0" v-auth="'del'">删除</el-button>
						<el-button size="small" text type="primary" @click="copy(scope.row)" v-auth="'copy'">复制</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		</el-card>
		<EditDic ref="editDicRef" @typeList="getList" />
		<ListDic ref="listDicRef" />
	</div>
</template>

<script lang="ts" setup>
import api from '/@/api/datahub'
import { useSearch } from '/@/hooks/useCommon'
import { ElMessageBox, ElMessage } from 'element-plus'
import EditDic from './component/edit.vue'
import ListDic from './component/list.vue'
import { ref,onMounted } from 'vue'
const queryRef = ref()
const editDicRef = ref()
const listDicRef = ref()
const typeData = ref([
	{
		label: '全部',
		value: '-1',
	},
	{
		label: 'api导入',
		value: '1',
	},
	{
		label: '数据库',
		value: '2',
	},
	{
		label: '文件',
		value: '3',
	},
	{
		label: '设备',
		value: '4',
	},
])
const ids = ref()
const { params, tableData, getList, loading } = useSearch<any[]>(api.common.getList, 'list', { keyWord: '' })
onMounted(() => {
	getList()
});
//打开数据记录
const onOpenList = async (row?: any) => {
	listDicRef.value.openDialog(row)
}
// 打开新增数据源弹窗
const onOpenAdd = () => {
	editDicRef.value.openDialog()
}
// 打开修改数据源弹窗
const onOpenEdit = async (row?: any) => {
	editDicRef.value.openDialog(row)
}
// 重置表单
const resetQuery = () => {
	queryRef.value.resetFields()
	getList()
}

//复制数据
const copy = (row: any) => {
	ElMessageBox.confirm('确定要复制该数据吗？', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			api.common.copy({ sourceId: row.sourceId }).then(() => {
				ElMessage.success('复制成功')
				getList()
			})
		})
		.catch(() => {})
}
const handleSelectionChange = (selection: any[]) => {
	ids.value = selection.map((item) => item.sourceId)
}
const batchdel = () => {
	ElMessageBox.confirm('是否确认要批量删除这些数据吗?', '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.common.delete(ids.value)
		ElMessage.success('删除成功')
		getList()
	})
}
const del = (row: any) => {
	ElMessageBox.confirm(`此操作将删除：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.common.delete(row.sourceId)
		ElMessage.success('删除成功')
		getList(1)
	})
}
</script>
