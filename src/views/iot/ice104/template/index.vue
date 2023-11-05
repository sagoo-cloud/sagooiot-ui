<!--
 * @Author: vera_min vera_min@163.com
 * @Date: 2023-10-23 17:05:57
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2023-10-25 10:29:58
 * @FilePath: /sagoo-admin-ui/src/views/iot/ice104/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="page page-full">
		<el-card shadow="hover" class="page-full-part">
			<div class="search">
				<el-form :model="params" :inline="true" ref="queryRef">
					<el-form-item label="模版名称" prop="title">
						<el-input v-model="params.title" placeholder="请输入模版名称" clearablestyle="width: 240px" @keyup.enter.native="getList(1)" />
					</el-form-item>
					<el-form-item>
						<el-button v-auth="'query'" size="default" type="primary" class="ml10" @click="getList(1)">
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
						<el-button v-auth="'add'" type="primary" @click="addOrEdit()">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增模版
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column v-col="'index'" type="index" label="序号" width="80" align="center" />
				<el-table-column v-col="'title'" prop="title" label="模版名称"  align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-col="'number'" prop="number" label="模版编码" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-col="'status'" prop="status" label="状态" align="center" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status == 1">启用</el-tag>
						<el-tag type="info" size="small" v-if="scope.row.status == 0">停用</el-tag>
					</template>
				</el-table-column>
				<el-table-column v-col="'remarks'" prop="remarks" label="备注" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-col="'handle'" fixed="right" label="操作" width="100" align="center">
					<template #default="scope">
						<el-button v-auth="'detail'" size="small" text type="primary" @click="toDetailPage(scope.row)">详情</el-button>
						<el-button v-auth="'del'" size="small" text type="info" @click="onDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.page" v-model:limit="params.size" @pagination="getList()" />
		</el-card>
		<EditForm ref="editFormRef" @updateList="getList()"></EditForm>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EditForm from './component/edit.vue';
import api from '/@/api/ice104/index';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonIce104';
import { useRouter } from 'vue-router';

const router = useRouter();

const editFormRef = ref();
const detailFormRef = ref();
const queryRef = ref();

const { params, tableData, getList, loading } = useSearch(api.template.getList, 'data', { title: '' });

getList();

const addOrEdit = async (row?: any) => {
	editFormRef.value.open(row);
};
/**
 * 去往设备详情页面
 */
const toDetailPage = async (row?: any) => {
	router.push(`/ice104/template/detail/${row.number}`)
};

// 重置表单
const resetQuery = () => {
	queryRef.value.resetFields();
	getList();
};

const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除接口：“${row.title}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.template.deleteItem({ number: row.number });
		ElMessage.success('删除成功');
		getList();
	});
};
</script>
