<template>
  <el-card shadow="hover">
    <div class="search">
      <el-form :inline="true">
        <el-form-item>
          <el-input size="default" v-model="params.keyWord" style="width: 200px; margin-left: 20px" class="search-input" placeholder="请输入搜索关键字" @keyup.enter.native="getList(1)" clearable>
          </el-input>
          <el-button size="default" type="primary" class="ml10" @click="getList(1)">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="addOrEdit()">
            <el-icon>
              <ele-FolderAdd />
            </el-icon>
            新增图纸
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
      <!-- <el-table-column type="index" label="序号" width="60" align="center" /> -->
      <el-table-column prop="id" label="ID" width="60" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" label="组态图名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="100" align="center"></el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" min-width="100" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button size="small" text type="primary" v-if="!scope.row.folderName" @click="view(scope.row)">预览</el-button>
          <el-button size="small" text type="warning" @click="addOrEdit(scope.row)">编辑</el-button>
          <el-button size="small" text type="warning" @click="edit(scope.row)">编辑组态图</el-button>
          <el-button size="small" text type="danger" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
    <EditForm ref="editFormRef" @getList="getList()"></EditForm>
  </el-card>
</template>

<script lang="ts" setup>
import api from '/@/api/configuration';
import { useSearch } from '/@/hooks/useCommon';
import { ElMessageBox, ElMessage } from 'element-plus';
import getOrigin from '/@/utils/origin'
import EditForm from './edit.vue';
import { ref } from 'vue';

const editFormRef = ref();

const { params, tableData, getList, loading } = useSearch<any[]>(api.getList, 'data', { keyWord: '' });

getList();

function getTokenUrl(url: string) {
  const tokenUrl = import.meta.env.VITE_TOPO_URL
  return getOrigin(tokenUrl + url)
}

const view = (row: any) => {
  const url = getTokenUrl('#/show/' + row.id);
  window.open(url);
};

const addOrEdit = async (row?: any) => {
  // const url = getTokenUrl('#/editor/new');
  // window.open(url);
  if (row) {
    editFormRef.value.open(row);
    return;
  } else {
    editFormRef.value.open();
  }
};

const edit = (row: any) => {
  const url = getTokenUrl('#/editor/' + row.id);
  window.open(url);
};

const del = (row: any) => {
  ElMessageBox.confirm(`此操作将删除图形：“${row.name}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await api.del(row.id);
    ElMessage.success('删除成功');
    getList(1);
  });
};
</script>
