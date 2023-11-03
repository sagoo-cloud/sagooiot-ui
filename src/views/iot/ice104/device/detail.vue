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
			<el-tabs
				v-model="activeName"
				class="demo-tabs"
				@tab-click="handleClick"
			>
				<el-tab-pane label="设备详情" name="1">
					<EditDeviceForm ref="editFormRef" />
				</el-tab-pane>
				<el-tab-pane label="设备任务" name="2">
					<DeviceTaskTable />
				</el-tab-pane>
			</el-tabs>
			<!-- <div style="height: 100px;"></div>
			<div class="search">
				<el-form :model="params" :inline="true" ref="queryRef">
					<el-form-item label="设备名称" prop="title">
						<el-input v-model="params.title" placeholder="请输入设备名称" clearablestyle="width: 240px" @keyup.enter.native="getList()" />
					</el-form-item>
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="getList()">
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
						<el-button type="primary" @click="addOrEdit()">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增设备
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column type="index" label="序号" width="80" align="center" />
				<el-table-column prop="title" label="设备名称"  align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="commonAddr" label="设备通用地址" min-width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="subCode" label="mac地址" min-width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="templateNumber" label="模版编号" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="productKey" label="产品key" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="deviceKey" label="设备key" align="center" show-overflow-tooltip></el-table-column>

				<el-table-column prop="number" label="设备编码" min-width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createdAt" label="创建时间" min-width="160" align="center"></el-table-column>
				<el-table-column prop="updatedAt" label="更新时间" min-width="160" align="center"></el-table-column>
				<el-table-column fixed="right" label="操作" width="100" align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="addOrEdit(scope.row)">详情</el-button>
						<el-button size="small" text type="info" @click="onDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.page" v-model:limit="params.size" @pagination="getList()" />
		 -->
		</el-card>
		
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import EditDeviceForm from './component/editDeviceForm.vue';
import DeviceTaskTable from './component/deviceTaskTable.vue';

import api from '/@/api/ice104/index';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonIce104';
import { useRoute } from 'vue-router';
import type { TabsPaneContext } from 'element-plus'

const route = useRoute();
const editFormRef = ref();
const detailFormData = ref({});
const queryRef = ref();

const activeName = ref('1')



const { params, tableData, getList, loading } = useSearch(api.device.getList, 'data', { title: '' });

getList();



const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const addOrEdit = async (row?: any) => {
	
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
		await api.device.deleteItem({number: row.number});
		ElMessage.success('删除成功');
		getList();
	});
};

/**
 * 获取设备详情
 */
const initDeviceInfo = async () => {
	const res = await api.device.detailItem(route.params && route.params.id)
	console.log(res)
	detailFormData.value = res.data;
	editFormRef.value.open(res.data);
}
	// 页面加载时
	onMounted(() => {
		// const id: = route.params && route.params.id;
		// console.log(id)
		initDeviceInfo()
	});
	


</script>
