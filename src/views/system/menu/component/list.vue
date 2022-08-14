<template>
  <el-drawer v-model="drawer" :title="title" direction="rtl" size="700px">
    <div class="p-3">
      <el-button size="default" type="success" class="mr-3" @click="onAddRow">
        <el-icon>
          <ele-FolderAdd />
        </el-icon>
        新增
      </el-button>
    </div>

    <el-table :data="tableData" style="width: 100%" row-key="id" border :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="字段名称" width="220" show-overflow-tooltip></el-table-column>
      <el-table-column prop="code" label="字段key" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁" @change="handleStatusChange(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="scope">
          <el-button size="small" text type="warning" @click="onEdit(scope.row)">修改</el-button>
          <el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
  <listForm ref="listFormRef" :parent-data="tableData" @getList="getList"></listForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import listForm from './list-form.vue';
import { MenuListRow } from '/@/api/model/system/menu';
import api from '/@/api/system';
import { ElMessageBox, ElMessage } from 'element-plus';

const title = ref('列表权限');
const drawer = ref(false);
const tableData = ref<MenuListRow[]>([]);
const menuRow = ref();
const listFormRef = ref();
const getList = async () => {
	tableData.value = [];
	let res = await api.menu.list.getList({ menuId: menuRow.value.id as number, status: -1 });
	tableData.value = res || [];
};

const open = async (row: any) => {
	// console.log(row);
	title.value = '列表权限 - ' + row.name;
	drawer.value = true;
	menuRow.value = row;
	getList();
};

const onAddRow = () => {
	listFormRef.value.open({ menuId: menuRow.value.id });
};

const onEdit = (row: MenuListRow) => {
	listFormRef.value.open(row);
};

// 修改启用停用状态
const handleStatusChange = (row: MenuListRow) => {
	let text = row.status === 1 ? '启用' : '停用';
	ElMessageBox.confirm('确认要"' + text + '"："' + row.name + '"字段吗?', '警告', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async function () {
			// await api.user.setStatus(row.id as number, row.status);
			// ElMessage.success('操作成功');
		})
		.catch(function () {
			row.status = row.status === 0 ? 1 : 0;
		});
};

const onDel = (row: MenuListRow) => {
	ElMessageBox.confirm(`此操作将删除字段：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.menu.list.del(row.id as number);
		ElMessage.success('删除成功');
		getList();
	});
};

defineExpose({ open });
</script>
