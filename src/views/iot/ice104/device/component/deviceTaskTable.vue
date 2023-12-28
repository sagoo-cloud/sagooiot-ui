<template>
  <div class="page">
    <el-form :model="params" inline ref="queryRef">
      <el-form-item label="任务名称" prop="title">
        <el-input v-model="params.title" placeholder="请输入任务名称" clearable style="width: 240px" @submit.prevent />
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'query'" type="primary" class="ml10" @click="getList(1)">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button v-auth="'reset'" @click="resetQuery()">
          <el-icon>
            <ele-Refresh />
          </el-icon>
          重置
        </el-button>
        <el-button v-auth="'add'" type="primary" @click="addOrEdit()">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增任务
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column v-col="'index'" type="index" label="序号" width="80" align="center" />
      <el-table-column v-col="'title'" prop="title" label="任务名称" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column v-col="'deviceNumber'" prop="deviceNumber" label="设备编码" min-width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column v-col="'interval'" prop="interval" label="执行间隔（s）" min-width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column v-col="'jobType'" prop="jobType" label="任务类型" min-width="120" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-tag type="info" size="small" v-if="scope.row.jobType == 100">总召唤</el-tag>
          <el-tag type="info" size="small" v-if="scope.row.jobType == 101">电度召唤</el-tag>
          <el-tag type="info" size="small" v-if="scope.row.jobType == 103">时钟同步</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-col="'handle'" fixed="right" label="操作" width="100" align="center">
        <template #default="scope">
          <el-button size="small" v-auth="'edit'" text type="primary" @click="addOrEdit(scope.row)">修改</el-button>
          <el-button size="small" v-auth="'del'" text type="info" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
    <EditForm ref="editFormRef" @updateList="getList(1)"></EditForm>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from 'vue';
import api from '/@/api/ice104/index';
import { useI18n } from 'vue-i18n';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonIce104';
import apiDevice from '/@/api/device';
import EditForm from './addOrEditDeviceTask.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { params, tableData, getList, loading } = useSearch(api.job.getList, 'data', { title: '', deviceNumber: route.params.id });

const emit = defineEmits(['updateList']);
const editFormRef = ref();
const queryRef = ref();

/**
 * 新增设备任务
 */
const addOrEdit = async (row?: any) => {
  const data = { ...row };
  editFormRef.value.open(data);
};

/**
 * 单一删除
 */
const onDel = (row: any) => {
  ElMessageBox.confirm(`此操作将删除任务：“${row.title}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await api.job.deleteItem({ number: row.number });
    ElMessage.success('删除成功');
    getList();
  });
};

// 重置表单
const resetQuery = () => {
  queryRef.value.resetFields();
  getList();
};

// 页面加载时
onMounted(() => {
  getList();
});

</script>

<style lang="scss" scoped>
.width100 {
  width: 100%;
}
</style>
