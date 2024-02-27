<template>
  <div class="system-dept-container">
    <el-card shadow="nover">
      <div class="system-dept-search mb15">
        <el-form :model="tableData.param" inline ref="queryRef">
          <el-form-item label="区域名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入区域名称" class="w-50" clearable />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select placeholder="请选择状态" class="w-50" v-model="tableData.param.status">
              <el-option label="全部" :value="-1" />
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="ml10" @click="deptList">
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
            <el-button type="primary" class="ml10" @click="onOpenAddDept" v-auth="'add'">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增区域
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" default-expand-all row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="tableData.loading">
        <el-table-column prop="name" label="区域名称" show-overflow-tooltip v-col="'name'"> </el-table-column>
        <el-table-column prop="number" label="区域编号" show-overflow-tooltip v-col="'number'"> </el-table-column>
        <el-table-column prop="status" label="区域状态" align="center" min-width="120" v-col="'status'">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status === 1">启用</el-tag>
            <el-tag type="info" size="small" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" align="center" min-width="120" v-col="'orderNum'"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" align="center" min-width="180" v-col="'createdAt'"></el-table-column>
        <el-table-column label="操作" align="center" v-col="'handle'" width="140">
          <template #default="scope">
            <el-button size="small" type="text" @click="onOpenAddDept(scope.row)" v-auth="'add'">新增</el-button>
            <el-button size="small" text type="warning" @click="onOpenEditDept(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="info" @click="onTabelRowDel(scope.row)" v-auth="'del'">删除</el-button>
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
  id: number;
  parentId: number;
  name: string;
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
      name: string;
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
          name: '',
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
      api.org
        .getList(state.tableData.param)
        .then((res: any) => {
          state.tableData.data = res;
        })
        .finally(() => (state.tableData.loading = false));
    };
    // 打开新增菜单弹窗
    const onOpenAddDept = (row?: TableDataRow) => {
      editDeptRef.value.openDialog(row?.id);
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
      ElMessageBox.confirm(`此操作将永久删除组织：${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api.org.del(row.id).then(() => {
            ElMessage.success('删除成功');
            deptList();
          });
        })
        .catch(() => { });
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
