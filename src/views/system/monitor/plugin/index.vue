<template>
	<div class="system-plugin-container page-full">
		<el-card shadow="hover" class="page-full-part">
			<div class="system-user-search mb15">
				<el-form :model="params" ref="queryRef" :inline="true" label-width="68px">
					<el-form-item label="关键字" prop="keyWord">
						<el-input v-model="params.keyWord" placeholder="请输入关键字" clearable style="width: 180px" size="default" @keyup.enter="getList(1)" />
					</el-form-item>
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="getList(1)">
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
						<el-button size="default" type="primary" v-auth="'upload'" @click="addOrEdit()">
							<el-icon>
								<ele-Plus />
							</el-icon>
							上传插件ZIP
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column label="序号" align="center" width="80">
					<template #default="{ $index }">{{ params.pageSize * (params.pageNum - 1) + ($index + 1) }} </template>
				</el-table-column>
				<el-table-column label="名称" v-col="'name'" align="center" prop="name" />
				<el-table-column label="插件类型" v-col="'types'" align="center" prop="types" />
				<el-table-column label="功能类型" v-col="'handleType'" align="center" prop="handleType" />
				<el-table-column label="说明" v-col="'description'" show-overflow-tooltip align="left" prop="description" />
				<el-table-column label="作者" v-col="'author'" align="center" prop="author">
					<template #default="scope">
						{{JSON.parse(scope.row.author).join(" ")}}
					</template>
				</el-table-column>
				<el-table-column label="状态" v-col="'status'" align="center" prop="status" width="80">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status === 1">正常</el-tag>
						<el-tag type="error" size="small" v-else-if="scope.row.status === 0">停用</el-tag>
						<el-tag type="info" size="small" v-else-if="scope.row.status === -1">全部</el-tag>
						<el-tag type="info" size="small" v-else>-</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" align="center" fixed="right" v-col="'handle'">
					<template #default="scope">
						<el-button v-if="scope.row.status == 1" type="warning" size="small" link @click="changeStatus(scope.row, 0)" v-auth="'stop'">停用</el-button>
						<el-button v-if="scope.row.status == 0" size="small" type="success" link @click="changeStatus(scope.row, 1)" v-auth="'start'">启用</el-button>
						<el-button v-if="scope.row.status == 0" size="small" type="info" link @click="onDel(scope.row)" v-auth="'del'">删除</el-button>
						<el-button size="small" type="plain" link @click="addOrEdit(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		</el-card>
		<EditForm ref="editFormRef" @getList="getList(1)"></EditForm>
	</div>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '/@/api/system'
import { useSearch } from '/@/hooks/useCommon'
import EditForm from './edit.vue'

const queryRef = ref()
const editFormRef = ref()

let uploadFile: File | null = null

const { params, tableData, getList, loading } = useSearch(api.plugin.getList, 'list', { keyWord: '' })

getList()

// 添加插件主要是上传编译好插件包，进行上传。
// 在添加窗口中显示：
// 插件名称、插件类型、上传插件包、说明
// 注：按统一的文件目录格式，进行插件文件压缩。并上传到平台后，自动解压的指定的插件目录。

const addOrEdit = (row?: any) => {
	// edit
	if (row) {
		editFormRef.value.open(row)
	} else {
		uploadFile = null
		// add
		ElMessageBox({
			title: '上传插件',
			message: h('input', {
				type: 'file',
				accept: '.zip',
				onchange: function (file: any) {
					uploadFile = file.target.files[0]
					// console.log(uploadFile)
				},
			}),
			showCancelButton: true,
			confirmButtonText: '上传',
			cancelButtonText: '取消',
			beforeClose: (action, instance, done) => {
				if (action === 'confirm') {
					if (!uploadFile) return ElMessage('请先上传插件！')

					instance.confirmButtonLoading = true
					instance.confirmButtonText = '上传中...'

					const formData = new FormData()
					formData.append('file', uploadFile)

					api.plugin
						.addPluginFile(formData)
						.then(() => {
							ElMessage.success('上传成功')
							getList(1)
							done()
						}).finally(() => {
							instance.confirmButtonLoading = false
							instance.confirmButtonText = '上传'
						})
				} else {
					uploadFile = null
					done()
				}
			},
		})
	}
}

const changeStatus = (row: any, status: number) => {
	api.plugin.changeStatus({ id: row.id, status: status }).then(() => {
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
	ElMessageBox.confirm(`此操作将删除插件：“${row.name}”，是否继续?`, '提示', {
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
