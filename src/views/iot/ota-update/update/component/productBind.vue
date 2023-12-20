<template>
  <div class="mutiple-bind-dialog-wrap">
    <el-dialog title="选择产品" v-model="isShowDialog" width="90%">
      <el-form ref="formRef" size="small" label-width="110px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="tableData.param.name" placeholder="请输入产品名称" clearable size="default" style="width: 240px" @keyup.enter.native="getProductList" />
          <el-button style="margin-left: 20px;" type="primary" @click="getProductList()">查询</el-button>

          <el-button style="margin-left: 20px;" :disabled="!deviceKeyList.length" type="danger" @click="confirmBind()">确定选择</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="productTable" :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" @select-all="selectAll" v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标识" prop="key" show-overflow-tooltip v-col="'key'" />
        <el-table-column label="名称" prop="name" show-overflow-tooltip v-col="'name'" />
        <el-table-column label="分类" prop="categoryName" show-overflow-tooltip v-col="'categoryName'" />
        <el-table-column label="消息协议" prop="messageProtocol" show-overflow-tooltip v-col="'messageProtocol'" />
        <el-table-column label="接入方式" prop="transportProtocol" show-overflow-tooltip v-col="'transportProtocol'" />
        <el-table-column label="类型" prop="deviceType" show-overflow-tooltip v-col="'deviceType'" />

        <el-table-column prop="status" label="状态" width="100" align="center" v-col="'status'">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status">已发布</el-tag>
            <el-tag type="info" size="small" v-else>未发布</el-tag>
          </template>
        </el-table-column>

      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="getProductList" />

    </el-dialog>
  </div>
</template>
<script lang="ts">
import { toRefs, reactive, defineComponent, nextTick, getCurrentInstance, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import 'vue3-json-viewer/dist/index.css'
import api from '/@/api/device'

interface TableDataState {
  isShowDialog: boolean,
  productData: object[],
  deviceKeyList: string[];
  deviceIdList: string[];
  deviceNameList: string[];
  checkIdList: string[];
  tableData: {
    data: []
    total: number
    loading: boolean
    param: {
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
      deviceIdList: [],
      deviceNameList: [],
      isShowDialog: false,
      productData: [],
      checkIdList: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
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

    const openDialog = (checkIdData: any) => {
      state.checkIdList = checkIdData;
      getProductList()
    };

    // 多选框选中数据
    const handleSelectionChange = (selection: any[]) => {
      state.deviceKeyList = selection.map((item) => item.key);
      state.deviceIdList = selection.map((item) => item.id);
      state.deviceNameList = selection.map((item) => item.name);

      if (selection.length > 1) {
        const del_row = selection.shift();
        productTable.value.toggleRowSelection(del_row, false)
      }
    };

    const confirmBind = () => {
      let msg = '是否确定选择产品？';
      if (state.deviceKeyList.length === 0) {
        ElMessage.error('请选择要确定绑定的数据。');
        return;
      }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        emit('bindSuccess', state.deviceIdList, state.deviceNameList)
        state.isShowDialog = false;
      })
    };

    const handleChange = () => {
      getProductList()
    }

    const changeSelect = () => {
      nextTick(() => {
        state.tableData.data.forEach((item) => {
          if (state.checkIdList.includes(item.id)) {
            proxy.$refs.multipleTable.toggleRowSelection(item, true);
          }
        })
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


