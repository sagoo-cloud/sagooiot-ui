<template>
	<el-drawer v-model="drawer" :title="title" direction="rtl" size="700px">
		<div class="p-3">
			<el-button type="success" class="mr-3" @click="onAddRow">
				<el-icon>
					<ele-FolderAdd />
				</el-icon>
				绑定接口
			</el-button>
		</div>

		<el-table :data="tableData" style="width: 100%" max-height="calc(100vh - 140px)" row-key="id" border :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
			<el-table-column type="index" label="序号" width="60" align="center" />
			<el-table-column prop="method" label="方法" width="70" align="center"></el-table-column>
			<el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
			<el-table-column label="操作" width="100" align="center">
				<template #default="scope">
					<el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-drawer>
	<!-- <listForm ref="listFormRef" :parent-data="tableData" @getList="getList"></listForm> -->
	<listForm ref="listFormRef" @getList="getList"></listForm>
	<BindVue ref="bindRef" @getList="getList"></BindVue>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import listForm from './list-form.vue';
import { MenuListRow } from '/@/api/model/system/menu';
import api from '/@/api/system';
import { ElMessageBox, ElMessage } from 'element-plus';
import BindVue from './bind.vue'

const title = ref('接口权限');
const drawer = ref(false);
const tableData = ref<MenuListRow[]>([]);
const menuRow = ref();
const bindRef = ref();
const listFormRef = ref();
const getList = async () => {
	tableData.value = [];
	let res = await api.menu.api.getList({ menuId: menuRow.value.id as number, status: -1 });
	tableData.value = res || [];
};

const open = async (row: any) => {
	title.value = '接口权限 - ' + row.title;
	drawer.value = true;
	menuRow.value = row;
	getList();
};

const onAddRow = () => {
	bindRef.value.open(tableData.value.map(item => item.id), menuRow.value.id)
};

const onDel = (row: MenuListRow) => {
	ElMessageBox.confirm(`此操作将删除接口：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.menu.api.add({
			menuId: menuRow.value.id,
			apiIds: tableData.value.map(item => item.id).filter(id => id !== row.id)
		});
		ElMessage.success('删除成功');
		getList();
	});
};

defineExpose({ open });
</script>
