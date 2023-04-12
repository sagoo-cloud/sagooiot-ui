<template>
  <el-card shadow="hover">
    <div class="search">
      <el-form :inline="true">
        <el-form-item>
          <!-- <el-button size="default" type="primary" class="ml10" @click="getList(1)">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button> -->
          <el-button type="success" @click="addOrEdit()">
            <el-icon>
              <ele-FolderAdd />
            </el-icon>
            新增大屏
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remarks" label="描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="100" align="center"></el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" min-width="100" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button size="small" text type="primary" @click="preview(scope.row)">预览</el-button>
          <el-button size="small" text type="warning" @click="addOrEdit(scope.row)">编辑</el-button>
          <el-button size="small" text type="warning" @click="edit(scope.row)">设计大屏</el-button>
          <el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
    <EditForm ref="editFormRef" @getList="getList()"></EditForm>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '/@/api/screen';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommon';
import EditForm from './edit.vue';

const editFormRef = ref();

const { params, tableData, getList, loading } = useSearch<any[]>(api.getList, 'Data', { name: '', address: '' });

getList();

const addOrEdit = async (row?: any) => {
  if (row) {
    editFormRef.value.open(row);
    return;
  } else {
    editFormRef.value.open();
  }
};

const add = async () => {
  ElMessageBox.prompt('请输入项目名称', '创建大屏项目', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValidator: (value: string) => {
      if (value.trim()) {
        return true;
      } else {
        return '请输入项目名称';
      }
    },
    inputErrorMessage: '请输入描述',
  }).then(async ({ value: projectName }) => {
    ElMessageBox.prompt('请输入描述', '创建大屏项目', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    }).then(async ({ value: remarks }) => {
      await api.add({
        indexImage: null,
        projectName,
        remarks,
      });
      ElMessage.success('新增成功');
      getList();
    });
  });
};

const edit = async (row: any) => {
  const url = import.meta.env.VITE_SCREEN_URL + '#/chart/home/' + row.id;
  window.open(url);
};

const preview = async (row: any) => {
  const url = import.meta.env.VITE_SCREEN_URL + '#/chart/preview/' + row.id;
  window.open(url);
};

const onDel = (row: any) => {
  ElMessageBox.confirm(`此操作将删除接口：“${row.projectName}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await api.del([row.id as string]);
    ElMessage.success('删除成功');
    getList();
  });
};
</script>
