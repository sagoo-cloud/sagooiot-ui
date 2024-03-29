<template>
  <div class="page">
    <el-card shadow="nover">
      <el-form :model="tableData.param" ref="queryRef" inline>
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="tableData.param.jobName" placeholder="请输入" clearable style="width: 150px;" @keyup.enter="dataList" />
        </el-form-item>
        <el-form-item label="任务组名" prop="jobGroup">
          <el-select v-model="tableData.param.jobGroup" placeholder="请选择" style="width: 150px;">
            <el-option v-for="dict in sys_job_group" :key="dict.value" :label="dict.label" :value="dict.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="tableData.param.status" style="width: 100px" placeholder="请选择">
            <el-option label="启用" :value="0" />
            <el-option label="禁用" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="ml10" @click="dataList">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
          <!-- <el-button @click="resetQuery(queryRef)">
            <el-icon>
              <ele-Refresh />
            </el-icon>
            重置
          </el-button> -->
          <el-button type="primary" class="ml10" @click="onOpenAddDic" v-auth="'add'">
            <el-icon>
              <ele-FolderAdd />
            </el-icon>
            新增任务
          </el-button>
          <el-button type="info" class="ml10" @click="onRowDel(null)" v-auth="'del'">
            <el-icon>
              <ele-Delete />
            </el-icon>
            删除任务
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" v-col="'jobId'" prop="jobId" width="100" />
        <el-table-column label="任务名称" v-col="'jobName'" prop="jobName" show-overflow-tooltip />
        <el-table-column label="任务描述" v-col="'remark'" prop="remark" show-overflow-tooltip />
        <el-table-column label="任务分组" v-col="'jobGroup'" prop="jobGroup" width="120" :formatter="jobGroupFormat" />
        <el-table-column label="任务方法名" v-col="'invokeTarget'" prop="invokeTarget" />
        <el-table-column label="cron执行表达式" v-col="'cronExpression'" prop="cronExpression" />
        <el-table-column label="状态" v-col="'status'" align="center" prop="status" width="100">
          <template #default="scope">
            <!-- {{ row.status ? '正常' : '暂停' }} -->
            <el-switch v-model="scope.row.status" inline-prompt :active-value="0" v-auth="'status'" :inactive-value="1" active-text="启" inactive-text="禁" @change="handleStatusChange(scope.row)">
            </el-switch>
            <span v-noauth="'status'">{{ scope.row.status ? '正常' : '暂停' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right" v-col="'handle'">
          <template #default="scope">
            <el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="info" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
            <el-button size="small" text type="primary" @click="onRowRun(scope.row)" v-auth="'do'">执行一次</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="dataList" />
    </el-card>
    <EditConfig ref="editDicRef" @dataList="dataList" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, unref, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditConfig from '/@/views/system/task/component/editConfig.vue';
import api from '/@/api/system';

// 定义接口来定义对象的类型
interface TableDataRow {
  jobName: string;
  jobParams: string;
  jobGroup: string;
  invokeTarget: string;
  cronExpression: string;
  misfirePolicy: number;
  status: number;
  jobId: number;
}
interface TableDataState {
  ids: number[] | undefined;
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      jobName: string;
      jobGroup: string;
      status: number | null;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemDictDataList',
  components: { EditConfig },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const addDicRef = ref();
    const editDicRef = ref();
    const queryRef = ref();
    const { sys_yes_no, sys_job_group } = proxy.useDict('sys_yes_no', 'sys_job_group');
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          jobName: '',
          jobGroup: '',
          status: null,
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      dataList();
    };
    const dataList = () => {
      state.tableData.loading = true;
      api.task
        .getList(state.tableData.param)
        .then((res: any) => {
          state.tableData.data = res.list;
          state.tableData.total = res.total;
        })
        .finally(() => (state.tableData.loading = false));
    };
    // 打开新增任务弹窗
    const onOpenAddDic = () => {
      editDicRef.value.openDialog();
    };
    // 打开修改任务弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
    };
    // 删除任务
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: any = [];
      if (row) {
        msg = `此操作将永久删除任务名称：“${row.jobName}”，是否继续?`;
        ids = [row.jobId];
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
      })
        .then(() => {
          api.task.del(ids).then(() => {
            ElMessage.success('删除成功');
            dataList();
          });
        })
        .catch(() => { });
    };
    const onRowRun = (row: TableDataRow) => {
      ElMessageBox.confirm(`是否确认立即执行一次该任务?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.task.run(row.jobId).then(() => {
          ElMessage.success('操作成功');
          dataList();
        });
      });
    };
    const handleStatusChange = (row: TableDataRow) => {
      let text = row.status === 0 ? '启用' : '停用';
      ElMessageBox.confirm('确认要"' + text + '"："' + row.jobName + '"任务吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          if (row.status === 0) {
            return api.task.start(row.jobId);
          } else {
            return api.task.stop(row.jobId);
          }
        })
        .then(() => {
          ElMessage.success(text + '成功');
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0;
        });
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
      state.ids = selection.map((item) => item.jobId);
    };
    const jobGroupFormat = (row: TableDataRow) => {
      return proxy.selectDictLabel(unref(sys_job_group), row.jobGroup);
    };
    return {
      addDicRef,
      editDicRef,
      queryRef,
      sys_yes_no,
      sys_job_group,
      onOpenAddDic,
      onOpenEditDic,
      onRowDel,
      onRowRun,
      handleStatusChange,
      dataList,
      resetQuery,
      handleSelectionChange,
      jobGroupFormat,
      ...toRefs(state),
    };
  },
});
</script>
