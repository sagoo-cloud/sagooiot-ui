<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="系统模块" prop="title">
            <el-input v-model="tableData.param.title" placeholder="请输入系统模块" clearable style="width: 180px" size="default" @keyup.enter="dataList" />
          </el-form-item>

          <el-form-item label="操作人员" prop="operName">
            <el-input v-model="tableData.param.operName" placeholder="请输入操作人员" clearable style="width: 180px" size="default" @keyup.enter="dataList" />
          </el-form-item>

          <el-form-item label="业务类型" prop="businessType">
            <el-select v-model="tableData.param.businessType" placeholder="请选择类型" clearable size="default" style="width: 180px">
              <el-option label="新增" :value="1" />
              <el-option label="修改" :value="2" />
              <el-option label="删除" :value="3" />
              <el-option label="其它" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="tableData.param.status" placeholder="请选择状态" clearable size="default" style="width: 180px">
              <el-option label="全部" :value="-1" />
              <el-option label="正常" :value="0" />
              <el-option label="停用" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="dataList">
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
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)" v-auth="'del'">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除日志
            </el-button>
            <!-- <el-button size="default" type="danger" class="ml10" @click="onRowClear()">
              <el-icon>
                <ele-Delete />
              </el-icon>
              清空日志
            </el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" width="80" prop="operId" />
        <el-table-column label="系统模块" align="center" prop="title" />
        <el-table-column label="业务类型" align="center" prop="businessType" width="130">
          <template #default="scope">
            <span size="small" v-if="scope.row.businessType === 0">其他</span>
            <span size="small" v-else-if="scope.row.businessType === 1">新增</span>
            <span size="small" v-else-if="scope.row.businessType === 2">修改</span>
            <span size="small" v-else-if="scope.row.businessType === 3">删除</span>
          </template>
        </el-table-column>
        <el-table-column label="操作类型" v-col="'operatorType'" align="center" prop="operatorType" width="130">
          <template #default="scope">
            <span size="small" v-if="scope.row.operatorType === 0">其他</span>
            <span size="small" v-else-if="scope.row.operatorType === 1">后台用户</span>
            <span size="small" v-else-if="scope.row.operatorType === 2">手机端用户</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" v-col="'operName'" align="center" prop="operName" :show-overflow-tooltip="true" />
        <el-table-column label="部门名称" align="center" prop="deptName" />
        <el-table-column label="主机" show-overflow-tooltip align="center" prop="operIp" />
        <el-table-column label="操作地点" v-col="'operLocation'" show-overflow-tooltip align="center" prop="operLocation" />
        <el-table-column label="操作时间" v-col="'operTime'" show-overflow-tooltip align="center" prop="operTime" />
        <el-table-column label="操作状态" v-col="'status'" align="center" prop="status" width="80">
          <template #default="scope">
            <el-tag type="info" size="small" v-if="scope.row.status === 1">停用</el-tag>
            <el-tag type="success" size="small" v-else-if="scope.row.status === 0">正常</el-tag>
            <el-tag type="info" size="small" v-else-if="scope.row.status === -1">全部</el-tag>
            <el-tag type="info" size="small" v-else>-</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作信息" show-overflow-tooltip prop="msg" /> -->
        <el-table-column label="操作" v-col="'handle'" width="100" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" type="text" @click="onOpenDetail(scope.row)" v-auth="'detail'">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="dataList" />
    </el-card>

    <el-dialog :title="currentRow.title + '详情'" v-model="dialogVisible" width="550px">
      <el-form :model="currentRow" ref="formRef" size="default" label-width="90px">
        <el-form-item label="模块标题" prop="title">
          {{ currentRow.title }}
        </el-form-item>
        <el-form-item label="请求方式" prop="title">
          {{ currentRow.requestMethod }}
        </el-form-item>
        <el-form-item label="方法名称" prop="title">
          {{ currentRow.method }}
        </el-form-item>
        <el-form-item label="操作地点" prop="title">
          {{ currentRow.operLocation }}
        </el-form-item>
        <el-form-item label="请求参数" prop="title">
          {{ currentRow.operParam }}
        </el-form-item>
        <el-form-item label="返回参数" prop="title">
          {{ currentRow.jsonResult }}
        </el-form-item>
        <el-form-item label="操作状态" prop="title">
          {{ currentRow.status === 0 ? '正常' : '异常' }}
        </el-form-item>
        <el-form-item label="操作时间" prop="title">
          {{ currentRow.operTime }}
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" size="default">关 闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/system';

// 定义接口来定义对象的类型
interface TableDataRow {
  operId: number;
  loginName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: number;
  msg: string;
  loginTime: string;
  module: string;
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
      dateRange: string[];
      operName: number | string;
      businessType: number | string;
      status: number | string;
      title: string;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemLoginLogList',
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const queryRef = ref();
    const { admin_login_status } = proxy.useDict('admin_login_status');
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          dateRange: [],
          operName: '',
          businessType: '',
          status: -1,
          title: '',
        },
      },
    });
    const dialogVisible = ref(false);
    const currentRow = ref({});
    // 初始化表格数据
    const initTableData = () => {
      dataList();
    };
    const dataList = () => {
      state.tableData.loading = true;
      api.oper
        .getList(state.tableData.param)
        .then((res: any) => {
          state.tableData.data = res.list;
          state.tableData.total = res.total;
        })
        .finally(() => {
          state.tableData.loading = false;
        });
    };
    // 删除日志
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除：“${row.loginName}”，是否继续?`;
        ids = [row.operId];
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
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '删除中';

            api.oper.del(ids).then(() => {
              ElMessage.success('删除成功');
              dataList();
              done();
            });
          } else {
            done();
          }
        },
      }).catch(() => { });
    };
    // 清空日志
    // const onRowClear = () => {
    // 	ElMessageBox.confirm('你确定要删除所选数据？', '提示', {
    // 		confirmButtonText: '确认',
    // 		cancelButtonText: '取消',
    // 		type: 'warning',
    // 	})
    // 		.then(() => {
    // 			api.oper.clearLog().then(() => {
    // 				ElMessage.success('清除成功');
    // 				dataList();
    // 			});
    // 		})
    // 		.catch(() => {});
    // };
    const onOpenDetail = (row: TableDataRow) => {
      dialogVisible.value = true;
      currentRow.value = row;
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      dataList();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map((item) => item.operId);
    };
    return {
      queryRef,
      onRowDel,
      onOpenDetail,
      dataList,
      resetQuery,
      handleSelectionChange,
      // onRowClear,
      dialogVisible,
      currentRow,
      admin_login_status,
      ...toRefs(state),
    };
  },
});
</script>
