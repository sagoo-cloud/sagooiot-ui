<template>
  <div class="mutiple-bind-dialog-wrap">
    <el-dialog title="选择产品" v-model="isShowDialog" width="700px">
      <el-form ref="formRef">
        <el-form-item label="" prop="name">
          <el-input v-model="tableData.param.name" placeholder="请输入产品标识或名称" clearable style="width: 240px" @keyup.enter.native="getProductList" />
          <el-button style="margin-left: 20px;" type="primary" @click="getProductList()"><el-icon><ele-Search /></el-icon>查询</el-button>
          <el-button style="margin-left: 20px;" :disabled="!deviceKeyList.length" type="danger" @click="confirmBind()"><el-icon><ele-Finished /></el-icon>确定选择</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="productTable" :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" @select-all="selectAll" v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标识" prop="key" show-overflow-tooltip v-col="'key'" />
        <el-table-column label="名称" prop="name" show-overflow-tooltip v-col="'name'" />
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="getProductList" />
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { toRefs, reactive, defineComponent, nextTick, getCurrentInstance, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import api from '/@/api/device'

interface TableDataState {
  isShowDialog: boolean,
  productData: object[],
  deviceKeyList: string[];
  deviceNameList: string[];
  checkKeyList: string[];
  tableData: {
    data: []
    total: number
    loading: boolean
    param: {
      status: number
      pageNum: number
      pageSize: number
      name: string
    }
  },
}
export default defineComponent({
  name: 'DeviceBindDialog',

  setup(prop, { emit }) {
    const { proxy } = getCurrentInstance() as any;
    const productTable = ref();
    const state = reactive<TableDataState>({
      deviceKeyList: [],
      deviceNameList: [],
      isShowDialog: false,
      productData: [],
      checkKeyList: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          status: 1,
          pageNum: 1,
          pageSize: 10,
          name: '',
        },
      },
    })

    const getProductList = () => {
      state.isShowDialog = true;
      state.tableData.loading = true;
      api.product.getList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.product;
        state.tableData.total = res.total;

        changeSelect();
      }).finally(() => (state.tableData.loading = false));
    };

    const openDialog = (checkKeyList: string[]) => {
      state.checkKeyList = checkKeyList;
      getProductList()
    };

    // 多选框选中数据
    const handleSelectionChange = (selection: any[]) => {
      state.deviceKeyList = selection.map((item) => item.key);
      state.deviceNameList = selection.map((item) => item.name);

      if (selection.length > 1) {
        const del_row = selection.shift();
        productTable.value.toggleRowSelection(del_row, false)
      }
    };

    const confirmBind = () => {
      if (state.deviceKeyList.length === 0) {
        ElMessage.error('请选择要确定绑定的数据。');
        return;
      }

      emit('bindSuccess', state.deviceKeyList, state.deviceNameList)
      state.isShowDialog = false;
    };

    const handleChange = () => {
      getProductList()
    }

    const changeSelect = () => {
      nextTick(() => {
        state.tableData.data.forEach((item: any) => {
          if (state.checkKeyList) {
            if (state.checkKeyList.includes(item.key)) {
              proxy.$refs.multipleTable.toggleRowSelection(item, true);
            }
          }
        });
      });
    };

    const selectAll = (selection: any[]) => {
      ElMessage.error('只可单选');
      productTable.value.clearSelection()
      return
    }

    return {
      openDialog,
      confirmBind,
      getProductList,
      handleSelectionChange,
      handleChange,
      selectAll,
      productTable,
      ...toRefs(state),
    }
  },
})
</script>


