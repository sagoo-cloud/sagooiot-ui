<template>
  <div class="page">
    <el-card shadow="hover">
      <div class="search">
        <el-form :inline="true">
          <el-form-item label="接口名称">
            <el-input v-model="params.name" placeholder="请输入接口名称" clearablestyle="width: 240px" @keyup.enter.native="getList(1)" />
          </el-form-item>
          <el-form-item label="接口地址">
            <el-input v-model="params.address" placeholder="请输入接口地址" clearablestyle="width: 240px" @keyup.enter.native="getList(1)" />
          </el-form-item>
          <el-form-item label="状态" prop="status" style="width: 200px">
            <el-select v-model="params.status" placeholder="接口状态" clearablestyle="width: 240px">
              <el-option label="全部" :value="-1" />
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="getList(1)">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button type="success" @click="addOrEdit()" v-auth="'add'">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增接口
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" v-col="'name'" label="接口名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" v-col="'address'" label="接口地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" v-col="'status'" label="状态" min-width="100" align="center">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" size="small" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" v-col="'handle'">
          <template #default="scope">
            <template v-if="scope.row.types===2">
              <el-button size="small" text type="warning" @click="addOrEdit(scope.row)" v-auth="'edit'">修改</el-button>
              <el-button size="small" text type="danger" @click="onDel(scope.row)" v-auth="'del'">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
    </el-card>
    <EditForm ref="editFormRef" @getList="getList()"></EditForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import EditForm from './component/edit.vue';
import { ApiRow } from '/@/api/model/system/menu';
import api from '/@/api/system';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommon';

const editFormRef = ref();

const { params, tableData, getList, loading } = useSearch<ApiRow[]>(api.api.getList, 'Info', { name: '', address: '', types: -1 });

getList();

const addOrEdit = async (row?: ApiRow) => {
  if (row) {
    const res = await api.api.detail(row.id as number);
    editFormRef.value.open(res);
    return;
  } else {
    editFormRef.value.open();
  }
};

const onDel = (row: ApiRow) => {
  ElMessageBox.confirm(`此操作将删除接口：“${row.name}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await api.api.del(row.id as number);
    ElMessage.success('删除成功');
    getList();
  });
};
</script>
