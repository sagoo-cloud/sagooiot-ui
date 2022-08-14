<template>
  <el-drawer v-model="drawer" :title="title" direction="rtl" size="700px">
    <div class="p-3">
      <el-button size="default" type="success" class="ml10" @click="onAddRow">
        <el-icon>
          <ele-FolderAdd />
        </el-icon>
        新增
      </el-button>
    </div>

    <el-table :data="tableData" style="width: 100%" row-key="id" border :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="name" label="按钮名称" width="220" show-overflow-tooltip></el-table-column>
      <el-table-column prop="types" label="按钮编码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="scope">
          <el-tag type="success" size="small" v-if="scope.row.status===1">启用</el-tag>
          <el-tag type="info" size="small" v-else>禁用</el-tag>
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
  <btnForm ref="btnFormRef" :parent-data="tableData" @getList="getList"></btnForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import btnForm from './btn-form.vue';
import { MenuBtnRow } from '/@/api/model/system/menu';
import api from '/@/api/system';
import { ElMessageBox, ElMessage } from 'element-plus';

const title = ref('按钮权限');
const drawer = ref(true);
const tableData = ref([]);
const menuRow = ref({ id: 34 });
const btnFormRef = ref();
const getList = async () => {
	let res = await api.menu.btn.getList({ menuID: menuRow.value.id, status: -1 });
	tableData.value = res || [];
};
getList();

const open = async (row: any) => {
	// console.log(row);
	title.value = '按钮权限 - ' + row.name;
	drawer.value = true;
	menuRow.value = row;
	getList();
};

const onAddRow = () => {
	btnFormRef.value.open({menuId: menuRow.value.id});
};

const onEdit = (row: MenuBtnRow) => {
	btnFormRef.value.open(row);
};

const onDel = (row: MenuBtnRow) => {
	ElMessageBox.confirm(`此操作将删除按钮：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.menu.btn.del(row.id as number);
		ElMessage.success('删除成功');
		getList();
	});
};

defineExpose({ open });
</script>
