<template>
  <div class="system-dept-container">
    <el-card shadow="hover">
      <div class="system-dept-search mb15">
        <el-form :model="tableData.param" :inline="true" ref="queryRef">
          <el-form-item label="部门名称" prop="deptName">
            <el-input size="default" v-model="tableData.param.deptName" placeholder="请输入部门名称" class="w-50" clearable />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select size="default" placeholder="请选择状态" class="w-50" v-model="tableData.param.status">
              <el-option label="全部" :value="-1" />
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="deptList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="resetQuery()">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddDept" v-auth="'add'">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增部门
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" row-key="deptId" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="tableData.loading">
        <el-table-column prop="deptName" label="部门名称" v-col="'deptName'" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="status" label="部门状态" v-col="'status'" align="center" min-width="120">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status === 1">启用</el-tag>
            <el-tag type="info" size="small" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" v-col="'orderNum'" align="center" min-width="120"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" v-col="'createdAt'" align="center" min-width="180"></el-table-column>
        <el-table-column label="操作" align="center" width="140" v-col="'handle'">
          <template #default="scope">
            <el-button size="small" type="text" @click="onOpenAddDept(scope.row)" v-auth="'add'">新增</el-button>
            <el-button size="small" text type="warning" @click="onOpenEditDept(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="danger" @click="onTabelRowDel(scope.row)" v-auth="'del'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <EditDept ref="editDeptRef" @deptList="deptList" />
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditDept from './component/edit.vue';
import api from '/@/api/system';

// 定义接口来定义对象的类型
interface TableDataRow {
  deptId: number;
  parentId: number;
  deptName: string;
  status: number;
  orderNum: number;
  leader: string;
  phone: string;
  email: string;
  children?: TableDataRow[];
}
interface TableDataState {
  tableData: {
    data: Array<TableDataRow>;
    loading: boolean;
    param: {
      deptName: string;
      status: number;
    };
  };
}

export default defineComponent({
  name: 'systemOrg',
  components: { EditDept },
  setup() {
    const editDeptRef = ref();
    const queryRef = ref();
    const state = reactive<TableDataState>({
      tableData: {
        data: [],
        loading: false,
        param: {
          deptName: '',
          status: -1,
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      deptList();
    };
    const deptList = () => {
      state.tableData.loading = true;
      api.dept
        .getList(state.tableData.param)
        .then((res: any) => {
          state.tableData.data = res;
        })
        .finally(() => (state.tableData.loading = false));
    };
    // 打开新增菜单弹窗
    const onOpenAddDept = (row?: TableDataRow) => {
      editDeptRef.value.openDialog(row?.deptId);
    };
    // 打开编辑菜单弹窗
    const onOpenEditDept = (row: TableDataRow) => {
      editDeptRef.value.openDialog(row);
    };
    // 重置表单
    const resetQuery = () => {
      queryRef.value.resetFields();
      deptList();
    };
    // 删除当前行
    const onTabelRowDel = (row: TableDataRow) => {
      ElMessageBox.confirm(`此操作将永久删除部门：${row.deptName}, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.dept.del(row.deptId).then(() => {
          ElMessage.success('删除成功');
          deptList();
        });
      });
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      queryRef,
      resetQuery,
      editDeptRef,
      deptList,
      onOpenAddDept,
      onOpenEditDept,
      onTabelRowDel,
      ...toRefs(state),
    };
  },
});
</script>
