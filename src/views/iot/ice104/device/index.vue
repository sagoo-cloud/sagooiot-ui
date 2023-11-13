<!--
 * @Author: vera_min vera_min@163.com
 * @Date: 2023-10-23 17:05:57
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2023-10-25 10:11:06
 * @FilePath: /sagoo-admin-ui/src/views/iot/ice104/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="page page-full">
		<el-card shadow="hover" class="page-full-part">
			<div class="search">
				<el-form :model="params" :inline="true" ref="queryRef" @submit.prevent>
					<el-form-item label="设备名称" prop="title">
						<el-input v-model="params.title" placeholder="请输入设备名称" clearablestyle="width: 240px" @keyup.enter.native="getList(1)" />
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
							新增设备
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column v-col="'index'" type="index" label="序号" width="80" align="center" />
				<el-table-column v-col="'title'" prop="title" label="设备名称"  align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-col="'commonAddr'" prop="commonAddr" label="设备通用地址" min-width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-col="'subCode'" prop="subCode" label="mac地址" min-width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-col="'templateNumber'" prop="templateNumber" label="模版编号" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-col="'productKey'" prop="productKey" label="产品key" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-col="'deviceKey'" prop="deviceKey" label="设备key" align="center" show-overflow-tooltip></el-table-column>

				<el-table-column v-col="'number'" prop="number" label="设备编码" min-width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-col="'createdAt'" prop="createdAt" label="创建时间" min-width="160" align="center"></el-table-column>
				<el-table-column v-col="'updatedAt'" prop="updatedAt" label="更新时间" min-width="160" align="center"></el-table-column>
				<el-table-column v-col="'handle'" fixed="right" label="操作" width="100" align="center">
					<template #default="scope">
						<el-button size="small" v-auth="'del'" text type="primary" @click="toDetailPage(scope.row)">详情</el-button>
						<el-button size="small" v-auth="'detail'" text type="info" @click="onDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		</el-card>
		<EditForm ref="editFormRef" @updateList="getList(1)"></EditForm>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import EditForm from './component/edit.vue';
import api from '/@/api/ice104/index';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonIce104';
import { useRouter } from 'vue-router';

const router = useRouter();
const editFormRef = ref();
const queryRef = ref();


const { params, tableData, getList, loading } = useSearch(api.device.getList, 'data', { title: '' });

getList();

/**
 * 去往设备详情页面
 */
const toDetailPage = async (row?: any) => {
	router.push(`/ice104/device/detail/${row.number}`)
};

/**
 * 新增设备
 */
const addOrEdit = async (row?: any) => {
	editFormRef.value.open(row);
};

// 重置表单
const resetQuery = () => {
	queryRef.value.resetFields();
	getList();
};

/**
 * 单一删除
 */
const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除接口：“${row.title}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.device.deleteItem({number: row.number});
		ElMessage.success('删除成功');
		getList();
	});
};
</script>
