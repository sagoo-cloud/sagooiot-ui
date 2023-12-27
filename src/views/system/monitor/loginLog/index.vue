<template>
  <div class="page">
    <el-card shadow="nover">
      <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
        <el-form-item label="登录IP" prop="ipaddr">
          <el-input v-model="tableData.param.ipaddr" placeholder="请输入登录地址" clearable style="width: 180px" size="default" @keyup.enter.native="dataList" />
        </el-form-item>

        <el-form-item label="登录地点" prop="loginLocation">
          <el-input v-model="tableData.param.loginLocation" placeholder="请输入登录地点" clearable style="width: 180px" size="default" @keyup.enter.native="dataList" />
        </el-form-item>

        <!-- <el-form-item label="用户名称" prop="userName">
            <el-input v-model="tableData.param.userName" placeholder="请输入用户名称" clearable style="width: 180px;" size="default" @keyup.enter.native="dataList" />
          </el-form-item> -->

        <el-form-item label="状态" prop="status">
          <el-select v-model="tableData.param.status" placeholder="登录状态" size="default" style="width: 180px">
            <el-option label="全部" :value="-1" />
            <el-option label="成功" :value="1" />
            <el-option label="失败" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="登录时间" prop="dateRange">
          <el-date-picker v-model="tableData.param.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
          <el-button size="default" type="info" class="ml10" @click="onRowDel(null)" v-auth="'del'">
            <el-icon>
              <ele-Delete />
            </el-icon>
            删除日志
          </el-button>

          <el-button size="default" type="primary" class="ml10" @click="onRowExport()">
            <el-icon>
              <ele-Download />
            </el-icon>
            导出日志
          </el-button>
          <!--<el-button size="default" type="info" class="ml10" @click="onRowClear()">
              <el-icon>
                <ele-Delete />
              </el-icon>
              清空日志
            </el-button> -->
        </el-form-item>
      </el-form>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" width="100" prop="infoId" />
        <el-table-column label="登录名称" align="center" prop="loginName" />
        <el-table-column label="登录地址" align="center" prop="ipaddr" width="150" show-overflow-tooltip />
        <el-table-column label="登录地点" v-col="'loginLocation'" align="center" prop="loginLocation" show-overflow-tooltip />
        <el-table-column label="浏览器" align="center" prop="browser" />
        <el-table-column label="操作系统" show-overflow-tooltip align="center" prop="os" />
        <el-table-column label="登录状态" v-col="'status'" align="center" prop="status" width="90">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status === 1">成功</el-tag>
            <el-tag type="info" size="small" v-else>失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作信息" v-col="'msg'" show-overflow-tooltip prop="msg" align="center" />
        <el-table-column label="登录日期" v-col="'loginTime'" align="center" prop="loginTime" width="180" />
        <el-table-column label="登录模块" v-col="'module'" align="center" show-overflow-tooltip prop="module" width="120"></el-table-column>
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="dataList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/system';
import downloadFile from '/@/utils/download';

// 定义接口来定义对象的类型
interface TableDataRow {
  infoId: number;
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
      status: number;
      ipaddr: string;
      loginLocation: string;
      userName: string;
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
          status: -1,
          ipaddr: '',
          loginLocation: '',
          userName: '',
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      dataList();
    };
    const dataList = () => {
      state.tableData.loading = true;
      api.log
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
        ids = [row.infoId];
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

            api.log.del(ids).then(() => {
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

    // 导出日志
    const onRowExport = () => {
      api.log.export({
        ...state.tableData.param,
        // pageSize: state.tableData.total
      }).then((res: any) => downloadFile(res))
    };


    // 清空日志
    const onRowClear = () => {
      ElMessageBox.confirm('你确定要删除所选数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api.log.clearLog().then(() => {
            ElMessage.success('清除成功');
            dataList();
          });
        })
        .catch(() => { });
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
      state.ids = selection.map((item) => item.infoId);
    };
    return {
      queryRef,
      onRowDel,
      onRowExport,
      dataList,
      resetQuery,
      handleSelectionChange,
      onRowClear,
      admin_login_status,
      ...toRefs(state),
    };
  },
});
</script>
