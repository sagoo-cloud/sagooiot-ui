<template>
  <div class="page">
    <el-card shadow="nover">
      <el-form :model="tableData.param" ref="queryRef" inline>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="tableData.param.dictType" placeholder="请输入字典类型" clearable @keyup.enter.native="dataList" />
        </el-form-item>
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="tableData.param.dictLabel" placeholder="请输入字典标签" style="width: 150px" clearable @keyup.enter.native="dataList" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="tableData.param.status" placeholder="字典状态" style="width: 120px">
            <el-option label="全部" :value="-1" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="ml10" @click="dataList">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" class="ml10" @click="onOpenAddDic" v-auth="'add'">
            <el-icon>
              <ele-FolderAdd />
            </el-icon>
            新增字典
          </el-button>
          <el-button type="danger" class="ml10" @click="onRowDel()" v-auth="'del'">
            <el-icon>
              <ele-Delete />
            </el-icon>
            删除字典
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="字典编码" v-col="'dictCode'" width="90" align="center" prop="dictCode" />
        <el-table-column label="字典标签" v-col="'dictLabel'" align="center" prop="dictLabel" />
        <el-table-column label="字典键值" v-col="'dictValue'" align="center" prop="dictValue" />
        <el-table-column label="字典排序" v-col="'dictSort'" width="100" align="center" prop="dictSort" />
        <el-table-column label="备注" v-col="'remark'" align="center" prop="remark" show-overflow-tooltip />
        <!-- <el-table-column label="创建时间" align="center" prop="createdAt" width="180" /> -->
        <el-table-column prop="status" label="字典状态" v-col="'status'" width="120" align="center">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status">启用</el-tag>
            <el-tag type="info" size="small" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" v-col="'handle'">
          <template #default="scope">
            <el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="dataList" />
    </el-card>
    <EditDic ref="editDicRef" @dataList="dataList" :dict-type="tableData.param.dictType" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/editDicData.vue';
import api from '/@/api/system';
import { useRoute } from 'vue-router';

// 定义接口来定义对象的类型
interface TableDataRow {
  dictCode: number;
  dictSort: number;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  status: number;
  remark: string;
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
      dictType: string;
      dictLabel: string;
      status: number;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemDictDataList',
  components: { EditDic },
  setup() {
    const route = useRoute();
    const addDicRef = ref();
    const editDicRef = ref();
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
          dictLabel: '',
          dictType: '',
          status: -1,
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      dataList();
    };
    const dataList = () => {
      api.dict.getDataList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.list;
        state.tableData.total = res.total;
      });
    };
    // 打开新增字典弹窗
    const onOpenAddDic = () => {
      editDicRef.value.openDialog();
    };
    // 打开修改字典弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
    };
    // 删除字典
    const onRowDel = (row?: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除用户：“${row.dictLabel}”，是否继续?`;
        ids = [row.dictCode];
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
          api.dict.deleteData(ids).then(() => {
            ElMessage.success('删除成功');
            dataList();
          });
        })
        .catch(() => { });
    };
    // 页面加载时
    onMounted(() => {
      const dictType = route.params && route.params.dictType;
      state.tableData.param.dictType = <string>dictType;
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
      state.ids = selection.map((item) => item.dictCode);
    };
    return {
      addDicRef,
      editDicRef,
      queryRef,
      onOpenAddDic,
      onOpenEditDic,
      onRowDel,
      dataList,
      resetQuery,
      handleSelectionChange,
      ...toRefs(state),
    };
  },
});
</script>
