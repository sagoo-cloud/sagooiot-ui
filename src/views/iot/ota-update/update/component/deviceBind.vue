<template>
  <div class="mutiple-bind-dialog-wrap">
    <el-dialog title="选择设备" v-model="isShowDialog" width="90%">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" size="small" label-width="110px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="tableData.param.name" placeholder="请输入设备名称" clearable size="default" style="width: 240px" @keyup.enter.native="getDeviceList" />
          <el-button style="margin-left: 20px;" type="primary" @click="getDeviceList()">查询</el-button>

          <el-button style="margin-left: 20px;" :disabled="!deviceKeyList.length" type="danger" @click="confirmBind()">确定选择</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标识" prop="key" width="130" :show-overflow-tooltip="true" v-col="'key'" />
        <el-table-column label="设备名称" prop="name" :show-overflow-tooltip="true" v-col="'name'" />
        <el-table-column label="产品名称" prop="productName" :show-overflow-tooltip="true" v-col="'productName'" />

        <el-table-column prop="status" label="状态" width="100" align="center" v-col="'status'">
          <template #default="scope">
            <el-tag type="info" size="small" v-if="scope.row.status == 1">离线</el-tag>
            <el-tag type="success" size="small" v-if="scope.row.status == 2">在线</el-tag>
            <el-tag type="info" size="small" v-if="scope.row.status == 0">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="registryTime" label="激活时间" align="center" width="150" v-col="'registryTime'"></el-table-column>
        <el-table-column prop="desc" label="说明" v-col="'desc'"></el-table-column>

      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="getDeviceList" />

    </el-dialog>
  </div>
</template>
<script lang="ts">
import { toRefs, reactive, defineComponent, nextTick, getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

import 'vue3-json-viewer/dist/index.css'

import { useRoute } from 'vue-router'

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
  ruleForm: {
    productId: string | number
  },
  rules: {}
}
export default defineComponent({
  name: 'DeviceBindDialog',

  setup(prop, { emit }) {
    const { proxy } = getCurrentInstance() as any;
    const route = useRoute()
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
      ruleForm: {
        productId: ''
      },
      rules: {
        productId: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
      }
    })

    const getDeviceList = () => {
      // if (!state.ruleForm.productId) {
      //   state.tableData.data = [];
      //   state.tableData.total = 0;
      //   return;
      // }
      state.isShowDialog = true;
      state.tableData.loading = true;
      api.instance.getList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.device;
        state.tableData.total = res.total;

        changeSelect();
      }).finally(() => (state.tableData.loading = false));
    };

    const getProductList = () => {
      api.product.getSubList().then((res: any) => {
        let productDataList = res.product
        state.productData = productDataList;
        state.ruleForm.productId = state.productData[0].id
        getDeviceList()
      });
    };

    const openDialog = (checkIdData: any) => {
      state.checkIdList = checkIdData;
      getDeviceList()
    };

    // 多选框选中数据
    const handleSelectionChange = (selection: any[]) => {
      state.deviceKeyList = selection.map((item) => item.key);
      state.deviceIdList = selection.map((item) => item.id);
      state.deviceNameList = selection.map((item) => item.name);
    };

    const confirmBind = () => {
      let msg = '是否确定选择设备？';
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

    const handleChange = (productId: number) => {
      state.ruleForm.productId = productId;
      getDeviceList()
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

    return {
      openDialog,
      getProductList,
      confirmBind,
      getDeviceList,
      handleSelectionChange,
      handleChange,
      ...toRefs(state),
    }
  },
})
</script>


