<template>
  <div class="ota-edit-module-container">
    <el-dialog :title="'设备详情'" v-model="isShowDialog" width="769px">
      <div class="search">
        <el-form inline ref="queryRef">
          <el-form-item label="设备名称：" prop="name">
            <el-input v-model="tableData.param.deviceName" placeholder="请输入设备名称" clearable style="width: 240px" @submit.prevent />
          </el-form-item>

          <el-form-item>

            <el-button type="primary" class="ml10" @click="getDetail">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
          </el-form-item>

        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" row-key="id" v-loading="tableData.loading">
        <el-table-column prop="id" label="ID" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag size="small" v-if="scope.row.status == 0">待推送</el-tag>
            <el-tag size="small" v-if="scope.row.status == 1">已推送</el-tag>
            <el-tag size="small" v-if="scope.row.status == 2">升级中</el-tag>
            <el-tag size="small" v-if="scope.row.status == 3">升级成功</el-tag>
            <el-tag size="small" v-if="scope.row.status == 4">升级失败</el-tag>
            <el-tag size="small" v-if="scope.row.status == 5">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="step" label="升级进度" show-overflow-tooltip>
          <template #default="scope">
            <el-tag size="small" type="success" v-if="scope.row.step > 0">{{ scope.row.step }}%</el-tag>
            <el-tag size="small" v-else>{{ scope.row.step }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fail" label="失败原因" width="100" align="center">
          <template #default="scope">
            <el-tag size="small" type="danger" v-if="scope.row.fail == -1">升级失败</el-tag>
            <el-tag size="small" type="danger" v-if="scope.row.fail == -2">下载失败</el-tag>
            <el-tag size="small" type="danger" v-if="scope.row.fail == -3">校验失败</el-tag>
            <el-tag size="small" type="danger" v-if="scope.row.fail == -4">烧写失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" min-width="100" align="center"></el-table-column>
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="getDetail" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import api from '/@/api/ota';
import {defineComponent, reactive, toRefs} from 'vue';

interface TableDataRow {
  id: number;
  name: string;
  types: string;
  productName: number;
  moduleName: string;
  checkres: string;
  createdAt: string;
}

interface TableDataState {
  ids: number[];
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      deviceName: string;
      devOtaStrategy: number;
    };
  };
  isShowDialog: boolean;
}

export default defineComponent({
  setup(prop) {
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          deviceName: '',
          devOtaStrategy: 0,
        },
      },
      isShowDialog: false,
    });
    // 打开弹窗
    const openDialog = (row: any) => {
      state.tableData.loading = true;
      state.tableData.param.devOtaStrategy = Number(row.id);
      api.device.getList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.Data;
        state.tableData.total = res.Total;
      }).finally(() => (state.tableData.loading = false));
      state.isShowDialog = true;
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };
    const getDetail = () => {
      state.tableData.loading = true;
      api.device.getList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.Data;
        state.tableData.total = res.Total;
      }).finally(() => (state.tableData.loading = false));
    };
    return {
      getDetail,
      openDialog,
      closeDialog,
      onCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.width100 {
  width: 100%;
}
</style>