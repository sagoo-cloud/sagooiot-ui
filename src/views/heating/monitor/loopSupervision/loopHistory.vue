<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="创建时间" prop="dateRange">
            <el-date-picker v-model="tableData.param.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="typeList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column label="时间" prop="dateTime"  min-width="180" />
        <el-table-column label="换热站" prop="stationName" :show-overflow-tooltip="true" />
        <el-table-column label="环路名称" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="一网供水温度" prop="inTemperature1" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网供水温度" prop="inTemperature2" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网回水温度" prop="outTemperature1" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="供水流量" prop="supplyWaterFlow" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="回水流量" prop="returnWaterFlow" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网供水压力" prop="inPressure1" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网供水压力" prop="inPressure2" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网回水压力" prop="outPressure1" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网回水压力" prop="outPressure2" min-width="120" :show-overflow-tooltip="true" />
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/loopSupervision';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'deviceproduct',
  setup() {
    const queryRef = ref();
    const route = useRoute()
    const state = reactive({
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          types: 'loop',
          code: '',
          dateRange: [],
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      state.tableData.param.pageNum = 1
      typeList();
    };
    const typeList = () => {
      state.tableData.loading = true;
      api.getLoopHistoryData(state.tableData.param).then((res: any) => {
        state.tableData.data = res.Data;
        state.tableData.total = res.Total;
      }).finally(() => (state.tableData.loading = false));
    };
    // 页面加载时
    onMounted(() => {
      state.tableData.param.code = route.query.code
      initTableData();
    });
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      typeList();
    };
    return {
      queryRef,
      typeList,
      resetQuery,
      ...toRefs(state),
    };
  },
});
</script>
