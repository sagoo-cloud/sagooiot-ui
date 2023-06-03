<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="区域" prop="area" style="width: 200px;">
            <el-select v-model="tableData.param.area" placeholder="区域" clearable size="default" style="width: 200px">
            </el-select>
          </el-form-item>
          <el-form-item label="管道序号" prop="name" style="width: 200px;">
            <el-select v-model="tableData.param.name" placeholder="管道序号" clearable size="default" style="width: 200px">
            </el-select>
          </el-form-item>
          <el-form-item label="输送单位" prop="company" style="width: 200px;">
            <el-select v-model="tableData.param.company" placeholder="输送单位" clearable size="default" style="width: 200px">
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="dateRange">
            <el-date-picker v-model="tableData.param.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="类型" prop="types" style="width: 200px;">
            <el-select v-model="tableData.param.types" filterable clearable placeholder="请选择类型" style="width: 200px">
              <el-option v-for="dict in tree_types_2" :key="dict.value" :label="dict.label" :value="dict.value"> </el-option>
            </el-select>
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
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <el-table-column label="管道" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="区域名称" prop="area" :show-overflow-tooltip="true"/>
        <el-table-column label="用量（m³）" prop="value" :show-overflow-tooltip="true" />
        <el-table-column label="输送单位" prop="company" :show-overflow-tooltip="true" />
        <el-table-column label="类型" prop="types" :show-overflow-tooltip="true"/>
        <el-table-column label="输送时间" prop="datetime" align="center" width="180" ></el-table-column>
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/device';

// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  name: string;
  key: string;
  status: number;
  desc: string;
  createBy: string;
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
      name: string;
      area: string;
      company: string;
      types: string;
      dateRange: string[];
    };
  };
}

export default defineComponent({
  name: 'deviceInstance',
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const queryRef = ref();
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          name: '',
          area: '',
          company: '',
          types: '',
          dateRange: [],
        },
      },
    });
    const { tree_types_2 } = proxy.useDict('tree_types_2');
    // 初始化表格数据
    const initTableData = () => {
      typeList();
    };
    const typeList = () => {
      state.tableData.loading = true;
      api.tree.record(state.tableData.param).then((res: any) => {
        console.log(res);
        state.tableData.data = res.list;
        state.tableData.total = res.total;
      }).finally(() => (state.tableData.loading = false));
    };

    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      typeList();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map((item) => item.id);
    };
    const onActionStatus = (item: TableDataRow[]) => {
      if (item.status == 0) {
        api.instance.devdeploy({ id: item.id }).then((res: any) => {
          typeList();
          ElMessage.success(res.message || '操作成功');
        });
      } else {
        api.instance.devundeploy({ id: item.id }).then((res: any) => {
          typeList();
          ElMessage.success(res.message || '操作成功');
        });
      }
    }
    return {
      queryRef,
      onActionStatus,
      typeList,
      resetQuery,
      handleSelectionChange,
      tree_types_2,
      ...toRefs(state),
    };
  },
});
</script>
