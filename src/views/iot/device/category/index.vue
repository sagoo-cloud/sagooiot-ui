<template>
  <div class="page">
    <el-card shadow="nover">
      <el-form inline>
        <el-form-item label="分类名称">
          <el-input v-model="tableData.param.name" placeholder="请输入分类名称" @keyup.enter.native="getCateList" class="w-50" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="ml10" @click="getCateList">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" class="ml10" @click="onOpenAdd" v-auth="'add'">
            <el-icon>
              <ele-FolderAdd />
            </el-icon>
            新增分类
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData.data" style="width: 100%" row-key="id" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="tableData.loading">
        <el-table-column prop="name" label="分类名称" v-col="'name'" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="desc" label="描述" align="center" v-col="'desc'"></el-table-column>
        <el-table-column prop="sort" v-col="'sort'" label="排序" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="140" fixed="right">
          <template #default="scope">
            <el-button size="small" type="text" @click="onOpenAdd(scope.row)" v-auth="'add'">新增</el-button>
            <el-button size="small" text type="warning" @click="onOpenEdit(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="info" @click="onTabelRowDel(scope.row)" v-auth="'del'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <EditCate ref="editDeptRef" @getCateList="getCateList" />
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, defineComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditCate from './component/edit.vue';
import api from '/@/api/device';

// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  parentId: number;
  name: string;
  status: number;
  orderNum: number;
  leader: string;
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
  name: 'deviceCate',
  components: { EditCate },
  setup() {
    const editDeptRef = ref();
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
      getCateList();
    };
    const getCateList = () => {
      state.tableData.loading = true;
      api.category.getList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.category;
      }).finally(() => (state.tableData.loading = false));
    };
    // 打开新增菜单弹窗
    const onOpenAdd = (row?: TableDataRow) => {
      editDeptRef.value.openDialog(row?.id);
    };
    // 打开编辑菜单弹窗
    const onOpenEdit = (row: TableDataRow) => {
      editDeptRef.value.openDialog({ ...row });
    };
    // 删除当前行
    const onTabelRowDel = (row: TableDataRow) => {
      ElMessageBox.confirm(`此操作将永久删除分类：${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.category.del(row.id).then(() => {
          ElMessage.success('删除成功');
          getCateList();
        });
      });
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      editDeptRef,
      getCateList,
      onOpenAdd,
      onOpenEdit,
      onTabelRowDel,
      ...toRefs(state),
    };
  },
});
</script>
