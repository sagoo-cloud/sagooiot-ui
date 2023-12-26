<template>
  <div class="page">
    <el-card shadow="nover">
      <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px" @keyup.enter.native="getList(1)">
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="tableData.param.name" placeholder="请输入模块名称" clearable size="default" style="width: 200px;" />
        </el-form-item>
        <el-form-item label="所属产品" prop="productId">
          <el-select v-model="tableData.param.productId" clearable filterable placeholder="请选择产品">
            <el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()" value-key="id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="default" type="primary" class="ml10" @click="getList(1)">
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
          <el-button type="primary" v-auth="'add'" @click="onOpenAddDic()">
            <el-icon>
              <ele-FolderAdd />
            </el-icon>
            添加模块
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
        <el-table-column label="ID" v-col="'id'" align="center" prop="id" width="100" />
        <el-table-column label="模块名称" v-col="'name'" prop="name" show-overflow-tooltip />
        <el-table-column label="模块别名" v-col="'nameAs'" prop="nameAs" show-overflow-tooltip />
        <el-table-column label="所属产品" v-col="'ProductName'" align="center" show-overflow-tooltip>
          <template #default="scope">
            <router-link :to="'/iotmanager/device/product/detail/' + scope.row.productId" class="link-type">
              <span>{{ scope.row.ProductName }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" align="center" />
        <el-table-column label="操作" width="100" v-col="'handle'" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="info" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="getList" />
      <EditConfig ref="editDicRef" @getList="getList(1)" />
    </el-card>
  </div>
</template>
  
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import api from '/@/api/ota'
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'
// import EditConfig from './edit.vue'
import EditConfig from '/@/views/iot/ota-update/module/component/edit.vue';

// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  name: string;
  nameAs: string;
  ProductName: number;
  createdAt: string;
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
      keyWord: string;
      productId: string;
      dateRange: string[];
    };
  };
}

export default defineComponent({
  name: 'apiV1OtaModuleDataList',
  components: { EditConfig },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const addDicRef = ref();
    const editDicRef = ref();
    const queryRef = ref();
    const tabDataList = ref([{ dictLabel: '全部', dictValue: '' }]);
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          dateRange: [],
          pageNum: 1,
          pageSize: 10,
          keyWord: '',
          productId: '',
        },
      },
      productData: [],
    });
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    // 初始化表格数据
    const initTableData = () => {
      moduleList();
    };
    const getList = (pageNum: number) => {
      typeof pageNum === 'number' && (state.tableData.param.pageNum = pageNum)
      state.tableData.loading = true;
      api.module
        .getList(state.tableData.param)
        .then((res: any) => {
          state.tableData.data = res.Data;
          state.tableData.total = res.Total;
        })
        .finally(() => (state.tableData.loading = false));
    };
    // 打开新增弹窗
    const onOpenAddDic = () => {
      editDicRef.value.openDialog();
    };
    // 打开修改弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
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
        api.module.del(ids).then(() => {
          ElMessage.success('删除成功');
          getList();
        });
      })
        .catch(() => { });
    };
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      getList();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map((item) => item.id);
    };
    // 获取列表
    const moduleList = () => {
      getList();

      api.module.getSubList().then((res: any) => {
        state.productData = res.product;
      });
    };
    return {
      addDicRef,
      editDicRef,
      queryRef,
      tabDataList,
      onOpenAddDic,
      onOpenEditDic,
      onRowDel,
      getList,
      resetQuery,
      handleSelectionChange,
      ...toRefs(state),
    };
  },
});
</script>
  