<!--
 * @Author: vera_min vera_min@163.com
 * @Date: 2023-10-23 09:09:35
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2023-10-23 17:46:43
 * @FilePath: /sagoo-admin-ui/src/views/iot/device/channel/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="page">
		<el-card shadow="nover">
			<div class="search">
				<el-form :model="params" inline ref="queryRef" @keyup.enter.native="getList(1)">
					<el-form-item label="通道名称" prop="title">
						<el-input v-model="params.title" placeholder="请输入通道名称" clearable style="width: 240px" />
					</el-form-item>
					<el-form-item label="注册码" prop="number">
						<el-input v-model="params.number" placeholder="请输入注册码" clearable style="width: 240px" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" class="ml10" @click="getList(1)">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button @click="resetQuery()">
							<el-icon>
								<ele-Refresh />
							</el-icon>
							重置
						</el-button>
						<el-button type="primary" @click="addOrEdit()" v-auth="'add'">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增通道
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData" style="width: 100%" v-loading="loading">
				<el-table-column type="index" label="序号" width="80" align="center" />
				<el-table-column prop="title" label="通道名称" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="number" label="注册码" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="slaveId" label="设备地址" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100" align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" v-auth="'detail'" @click="viewDetail(scope.row)">详情</el-button>
						<el-button size="small" text type="info" v-auth="'del'" @click="onDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.page" v-model:limit="params.size" @pagination="getList()" />

			<EditForm ref="editFormRef" @getList="getList(1)"></EditForm>
			<detailForm ref="detailFormRef" @getList="getList(1)"></detailForm>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EditForm from './component/edit.vue';
import detailForm from './component/detail.vue';
import api from '/@/api/device/modbus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonModbus';

const editFormRef = ref();
const detailFormRef = ref();
const queryRef = ref();

const { params, tableData, getList, loading } = useSearch(api.channel.getList, 'list', { title: '', number: '' });

getList();

const addOrEdit = async (row?: any) => {
	editFormRef.value.open(row);
};
const viewDetail = async (row: any) => {
	detailFormRef.value.open(row);
};

// 重置表单
const resetQuery = () => {
	queryRef.value.resetFields();
	getList(1);
};

const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除通道：“${row.title}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.channel.deleteDevice({ number: row.number });
		ElMessage.success('删除成功');
		getList(1);
	});
};
</script>
