<template>
  <div class="page page-full">
    <el-form :model="tableData.param" ref="queryRef" inline label-width="90px" @keyup.enter.native="getList(1)">
      <el-form-item label="批次名称：" prop="name">
        <el-input v-model="tableData.param.keyWord" placeholder="请输入批次名称" clearable style="width: 240px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="ml10" @click="getList(1)">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button @click="resetQuery()">
          <el-icon>
            <ele-Refresh />
          </el-icon>
          重置
        </el-button>
        <el-button type="primary" v-auth="'add'" @click="onOpenAdd()">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          添加批次
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="name" label="名称" />
      <!--        <el-table-column prop="waitVersion" label="待升级版本号" width="120" />-->
      <el-table-column label="类型" prop="types" width="120" align="center">
        <template #default="scope">
          <el-tag type="success" size="small" v-if="scope.row.types == 0">验证</el-tag>
          <el-tag type="primary" size="small" v-else>升级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="active" width="120" align="center">
        <template #default="scope">
          <el-tag type="success" size="small" v-if="scope.row.active == 1">是</el-tag>
          <el-tag type="info" size="small" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="method" label="协议方式" show-overflow-tooltip>
        <template #default="scope">
          <el-tag size="small" v-if="scope.row.method == 1">http</el-tag>
          <el-tag size="small" v-if="scope.row.method == 2">https</el-tag>
          <el-tag size="small" v-if="scope.row.method == 3">mqtt</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stratege" label="升级方式" show-overflow-tooltip>
        <template #default="scope">
          <el-tag size="small" v-if="scope.row.stratege == 1">静态升级 </el-tag>
          <el-tag size="small" v-if="scope.row.stratege == 2">动态升级</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="push" label="主动推送" show-overflow-tooltip>
        <template #default="scope">
          <el-tag size="small" v-if="scope.row.push == 1">是 </el-tag>
          <el-tag size="small" v-if="scope.row.push == 2">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="100" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <!--            <router-link :to="'/iotmanager/operation/ota/update/device/' + scope.row.id" class="link-type" style="padding-right: 12px;font-size: 12px;color: #409eff;">-->
          <!--              <span>查看</span>-->
          <!--            </router-link>-->
          <el-button size="small" text type="primary" @click="getDeviceList(scope.row)">查看</el-button>
          <!--            <el-button size="small" text type="warning" v-auth="'edit'" @click="CheckUpdate(scope.row)">编辑</el-button>-->
          <!--            <el-button size="small" text type="danger" v-auth="'del'" @click="del(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="getList" />
    <CheckConfig ref="checkRef" @getList="getList(1)" />
    <DeviceList ref="deviceRef" />
  </div>
</template>

<script lang="ts">
import api from '/@/api/ota';
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus'
import CheckConfig from '/@/views/iot/ota-update/update/component/check.vue';
import DeviceList from '/@/views/iot/ota-update/update/component/deviceList.vue';

// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  name: string;
  waitVersion: string;
  method: number;
  stratege: string;
  push: string;
  createdAt: string;
}
interface TableDataState {
  ids: number[];
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      id: number;
      pageNum: number;
      pageSize: number;
      keyWord: string;
      dateRange: string[];
      devOtaFirmwareId: number;
    };
  };
}
export default defineComponent({
  components: { CheckConfig, DeviceList },
  props: {
    detail: {
      type: Object,
      default: ''
    }
  },
  setup(props) {
    const deviceRef = ref();
    const checkRef = ref();
    const queryRef = ref();
    const tabDataList = ref([{ dictLabel: '全部', dictValue: '' }]);
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          id: 0,
          dateRange: [],
          pageNum: 1,
          pageSize: 10,
          keyWord: '',
          devOtaFirmwareId: 0,
        },
      },
    });
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    // 激活操作
    const activation = (row: any) => {
      let active = 0;
      if (row.active === 1) active = 0;
      if (row.active === 0) active = 1;
      api.batch.stop({ id: row.id, active: active }).then((res: any) => {
        ElMessage.success('操作成功');
        batchList();
      });
    };
    // 初始化表格数据
    const initTableData = () => {
      batchList();
    };
    const getList = (pageNum?: number) => {
      typeof pageNum === 'number' && (state.tableData.param.pageNum = pageNum)
      state.tableData.loading = true;
      state.tableData.param.devOtaFirmwareId = props.detail.id;
      api.batch
        .getList(state.tableData.param)
        .then((res: any) => {
          state.tableData.data = res.Data;
          state.tableData.total = res.Total;
        })
        .finally(() => (state.tableData.loading = false));
    };
    // 打开新增弹窗
    const onOpenAdd = () => {
      state.tableData.param.id = props.detail.id;
      checkRef.value.openDialog(state.tableData.param);
    };
    // 删除模块
    const onRowDel = (row?: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除：“${row.name}”，是否继续?`;
        ids = [row.id];
      } else {
        ids = state.ids;
      }
      if (ids.length === 0) {
        ElMessage.error('请选择要删除的数据。');
        return;
      }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.batch.del(ids).then(() => {
          ElMessage.success('删除成功');
          getList();
        });
      })
        .catch(() => { });
    };
    /** 重置按钮操作 */
    const resetQuery = () => {
      queryRef.value.resetFields();
      getList();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map((item) => item.id);
    };
    // 获取列表
    const batchList = () => {
      getList();
    };
    const getDeviceList = (row: any) => {
      deviceRef.value.openDialog(row);
    };
    return {
      deviceRef,
      checkRef,
      queryRef,
      tabDataList,
      onOpenAdd,
      onRowDel,
      getList,
      activation,
      resetQuery,
      handleSelectionChange,
      getDeviceList,
      ...toRefs(props),
      ...toRefs(state),
    };
  },
});
</script>
