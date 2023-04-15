<template>
	<div class="system-plugin-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="params" ref="queryRef" :inline="true" label-width="68px">
					<el-form-item label="关键字" prop="keyWord">
						<el-input v-model="params.keyWord" placeholder="请输入关键字" clearable style="width: 180px" size="default" @keyup.enter="getList" />
					</el-form-item>
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="getList">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button size="default" @click="resetQuery()">
							<el-icon>
								<ele-Refresh />
							</el-icon>
							重置
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column label="序号" align="center">
					<template #default="{ $index }">{{params.pageSize * (params.pageNum - 1) +  ($index + 1) }} </template>
				</el-table-column>
				<el-table-column label="名称" v-col="'name'" align="center" prop="name" />
				<el-table-column label="通信方式" v-col="'types'" align="center" prop="types" />
				<el-table-column label="功能类型" v-col="'handleType'" align="center" prop="handleType" />
				<el-table-column label="说明" v-col="'description'" align="center" prop="description" />
				<el-table-column label="作者" v-col="'author'" align="center" prop="author" />
				<el-table-column label="状态" v-col="'status'" align="center" prop="status" width="80">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status === 1">正常</el-tag>
						<el-tag type="error" size="small" v-else-if="scope.row.status === 0">停用</el-tag>
						<el-tag type="info" size="small" v-else-if="scope.row.status === -1">全部</el-tag>
						<el-tag type="info" size="small" v-else>-</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="200" align="center" fixed="right" v-col="'handle'">
					<template #default="scope">
						<el-button
							:disabled="scope.row.status == 0"
							type="warning"
							text="warning"
							size="small"
							link
							@click="changeStatus(scope.row, 0)"
							v-auth="'stop'"
							>停用</el-button
						>
						<el-button
							:disabled="scope.row.status == 1"
							size="small"
							type="success"
							text="success"
							link
							@click="changeStatus(scope.row, 1)"
							v-auth="'start'"
							>启用</el-button
						>
						<el-button
							:disabled="scope.row.status == 1"
							size="small"
							type="danger"
							text="danger"
							link
							@click="onDel(scope.row)"
							v-auth="'del'"
							>删除</el-button
						>
						<el-button
							size="small"
							type="primary"
							text="primary"
							link
							v-auth="'detail'"
							>详情</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<pagination :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList" />
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '/@/api/system'
import { useSearch } from '/@/hooks/useCommon'

const queryRef = ref()

const { params, tableData, getList, loading } = useSearch(api.plugin.getList, 'list', { keyWord: '' })

getList()

const changeStatus = (row: any, status: number) => {
	api.plugin.changeStatus({ id: row.id, status: status }).then((res: any) => {
		ElMessage.success('操作成功')
		getList()
	})
}

// 重置表单
const resetQuery = () => {
	queryRef.value.resetFields()
	getList(1)
}

const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除接口：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.plugin.del([row.id])
		ElMessage.success('删除成功')
		getList(1)
	})
}
</script>
