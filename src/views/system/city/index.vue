<template>
  <div class="system-dic-container">
    <el-card shadow="nover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="100px">
          <el-form-item label="城市名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入城市名称" clearable size="default" @keyup.enter="queryList" />
          </el-form-item>
          <el-form-item label="城市编号" prop="code">
            <el-input v-model="tableData.param.code" placeholder="请输入城市编号" clearable size="default" @keyup.enter="queryList" />
          </el-form-item>
          <el-form-item>
            <el-button v-auth="'query'" size="default" type="primary" class="ml10" @click="queryList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button v-auth="'reset'" size="default" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <el-button v-auth="'add'" size="default" type="primary" class="ml10" @click="onOpenAddDic">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%" row-key="id" default-expand-all :indent="16" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column label="城市名称" v-col="'name'" prop="name" show-overflow-tooltip />
        <el-table-column label="城市编号" v-col="'code'" prop="code" show-overflow-tooltip />
        <el-table-column label="状态" v-col="'status'" prop="status" width="80">
          <template #default="scope">
            {{ scope.row.status === 1 ? '在线' : '不在线' }}
          </template>
        </el-table-column>
        <el-table-column label="排序" v-col="'sort'" prop="sort" align="center" />
        <el-table-column label="创建时间" prop="createdAt" v-col="'createdAt'" show-overflow-tooltip />
        <el-table-column label="操作" width="200" align="center" v-col="'handle'">
          <template #default="scope">
            <el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="info" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="queryList" />
    </el-card>
    <EditDic ref="editDicRef" :treeData="tableData.data" @queryList="queryList" />
    <!-- <Detail ref="detailRef"  /> -->
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
// import Detail from './component/detail.vue';
import api from '/@/api/system';

// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  name: string;
  code: string;
  stationId: string;
  loopTypes: number;
  energyTypes: number;
  heatingObject: number;
  heatingTypes: number;
  heatingArea: string;
  forRealArea: string;
  decade: string;
  status: number;
}
interface TableDataState {
  ids: number[];
  tableData: {
    data: Array<TableDataRow>;
    loading: boolean;
    param: {
      name: string;
      code: string;
      status: number;
    };
  };
}

export default defineComponent({
  name: 'cityManage',
  components: { EditDic },
  setup() {
    const addDicRef = ref();
    const editDicRef = ref();
    // const detailRef = ref();
    const queryRef = ref();
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        loading: false,
        param: {
          name: '',
          code: '',
          status: -1
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      queryList();
    };
    const queryList = () => {
      state.tableData.loading = true
      api.city.getList(state.tableData.param)
        .then((res: any) => {
          state.tableData.data = res || [];
          state.tableData.loading = false
        });
    };

    // //查看详情
    // const onOpenDetail=(row: TableDataRow)=>{
    // 	detailRef.value.openDialog(row);
    // }
    // 打开新增产品弹窗
    const onOpenAddDic = () => {
      editDicRef.value.openDialog(null, state.tableData.data);
    };
    // 打开修改产品弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row, state.tableData.data);
    };
    // 删除产品
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      // let ids: number[] = [];
      // if (row) {
      msg = `此操作将永久删除城市：“${row.name}”，是否继续?`;
      // ids = [row.id];
      // } else {
      // 	ids = state.ids;
      // }
      // if (ids.length === 0) {
      // 	ElMessage.error('请选择要删除的数据。');
      // 	return;
      // }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api.city.del(row.id).then(() => {
            ElMessage.success('删除成功');
            queryList();
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
      queryList();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map((item) => item.id);
    };
    return {
      addDicRef,
      editDicRef,
      // detailRef,
      queryRef,
      // onOpenDetail,
      onOpenAddDic,
      onOpenEditDic,
      onRowDel,
      queryList,
      resetQuery,
      handleSelectionChange,
      ...toRefs(state),
    };
  },
});
</script>
