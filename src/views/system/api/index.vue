<template>
  <div class="page">
    <el-card shadow="hover">
      <div class="search">
        <el-form :inline="true">
          <el-form-item>
            <el-button size="default" type="success" class="mr-3" @click="addOrEdit()">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增接口
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="接口名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="接口地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁" @change="handleStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button size="small" text type="warning" @click="addOrEdit(scope.row)">修改</el-button>
            <el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <EditForm ref="editFormRef" @getList="getList"></EditForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EditForm from './component/edit.vue';
import { ApiRow } from '/@/api/model/system/menu';
import api from '/@/api/system';
import { ElMessageBox, ElMessage } from 'element-plus';

const tableData = ref<ApiRow[]>([]);
const editFormRef = ref();

const getList = async () => {
	tableData.value = [];
	let res = await api.api.getList();
	tableData.value = res || [];
};

getList();

const addOrEdit = (row?: ApiRow) => {
	editFormRef.value.open(row);
};

const onDel = (row: ApiRow) => {
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
</script>
