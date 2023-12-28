<template>
  <div class="page">
    <el-card shadow="nover" v-loading="batchLoading">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" inline>
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入设备名称" clearable style="width: 180px" @keyup.enter.native="typeList" />
          </el-form-item>
          <el-form-item label="设备标识" prop="key">
            <el-input v-model="tableData.param.key" placeholder="请输入设备标识" clearable style="width: 180px" @keyup.enter.native="typeList" />
          </el-form-item>
          <el-form-item label="所属产品" prop="productId">
            <el-select v-model="tableData.param.productId" style="width: 150px" filterable placeholder="请选择产品">
              <el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()" value-key="id"> </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="tableData.param.status" placeholder="状态" clearable style="width: 100px">
              <el-option label="在线" :value="2" />
              <el-option label="离线" :value="1" />
              <el-option label="未启用" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label="创建时间" prop="dateRange">
            <el-date-picker v-model="tableData.param.dateRange" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="ml10" @click="typeList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <el-button type="primary" class="ml10" @click="onOpenAddDic" v-auth="'add'">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增设备
            </el-button>
            <el-button type="info" class="ml10" @click="onRowDel(null)" v-auth="'del'">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除
            </el-button>

            <el-dropdown>
              <el-button type="danger" class="ml10">
                更多操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item> <el-button type="success" @click="setDeviceStatus1(null)">
                      <el-icon>
                        <ele-Delete />
                      </el-icon>
                      批量启用
                    </el-button></el-dropdown-item>
                  <el-dropdown-item><el-button type="warning" @click="setDeviceStatus0(null)">
                      <el-icon>
                        <ele-Delete />
                      </el-icon>
                      批量禁用
                    </el-button></el-dropdown-item>
                  <el-dropdown-item> <el-button @click="onOpenexcelDic('upload')">
                      <el-icon>
                        <ele-Upload />
                      </el-icon>
                      导入设备
                    </el-button></el-dropdown-item>
                  <el-dropdown-item><el-button @click="onOpenexcelDic('down')">
                      <el-icon>
                        <ele-Download />
                      </el-icon>
                      导出设备
                    </el-button></el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标识" prop="key" min-width="150" show-overflow-tooltip v-col="'key'" />
        <el-table-column label="设备名称" prop="name" min-width="160" show-overflow-tooltip v-col="'name'" />
        <el-table-column label="设备类型" prop="product.deviceType" min-width="120" align="center" show-overflow-tooltip v-col="'deviceType'" />
        <el-table-column label="产品名称" prop="productName" min-width="120" align="center" show-overflow-tooltip v-col="'productName'" />
        <el-table-column prop="status" label="状态" min-width="80" align="center" v-col="'status'">
          <template #default="scope">
            <el-tag type="info" size="small" v-if="scope.row.status == 1">离线</el-tag>
            <el-tag type="success" size="small" v-if="scope.row.status == 2">在线</el-tag>
            <el-tag type="info" size="small" v-if="scope.row.status == 0">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" align="center" width="160" v-col="'registryTime'"></el-table-column>
        <el-table-column prop="desc" label="说明" show-overflow-tooltip v-col="'desc'"></el-table-column>

        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <router-link :to="'/iotmanager/device/instance/' + scope.row.id" class="link-type" style="padding-right: 12px;font-size: 12px;color: #409eff;" v-auth="'detail'">
              <span>详情</span>
            </router-link>
            <el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="success" @click="onActionStatus(scope.row)" v-if="scope.row.status == 0" v-auth="'status'">启用</el-button>
            <el-button size="small" text type="primary" @click="onActionStatus(scope.row)" v-if="scope.row.status > 0" v-auth="'status'">停用</el-button>
            <el-button size="small" text type="info" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
    </el-card>
    <EditDic ref="editDicRef" @typeList="typeList" />
    <ExcelDic ref="excelDicRef" @typeList="typeList" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import ExcelDic from './component/excel.vue';
import api from '/@/api/device';
import { ArrowDown } from '@element-plus/icons-vue'


// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  name: string;
  key: string;
  status: number;
  desc: string;
  createBy: string;
}
interface TableDataState {
  ids: number[];
  productData: Array<TableDataRow>;
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      name: string;
      key: string;
      productId: string;
      status: string;
      dateRange: string[];
    };
  };
}

export default defineComponent({
  name: 'deviceInstance',
  components: { EditDic, ExcelDic, ArrowDown },
  setup() {
    const addDicRef = ref();
    const editDicRef = ref();
    const excelDicRef = ref();
    const detailRef = ref();
    const queryRef = ref();
    const batchLoading = ref(false);
    const state = reactive<TableDataState>({
      ids: [],
      productData: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          name: '',
          key: '',
          status: '',
          dateRange: [],
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      typeList();
      getProductList()

    };
    const typeList = () => {
      state.tableData.loading = true;
      api.instance.getList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.device;
        state.tableData.total = res.total;
      }).finally(() => (state.tableData.loading = false));
    };
    const getProductList = () => {
      api.product.getLists().then((res: any) => {
        state.productData = res.product
      })
    }
    //查看详情
    const onOpenDetail = (row: TableDataRow) => {
      detailRef.value.openDialog(row);
    }
    // 打开新增产品弹窗
    const onOpenAddDic = () => {
      editDicRef.value.openDialog();
    };
    // 打开修改产品弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
    };


    const onOpenexcelDic = (type: string) => {
      excelDicRef.value.openDialog(type);
    };

    //批量启用
    const setDeviceStatus1 = (row: TableDataRow) => {
      let ids: number[] = [];
      if (row) {
        ids = [row.id];
      } else {
        ids = state.ids;
      }
      if (ids.length === 0) {
        ElMessage.error('请选择要操作的数据。');
        return;
      }
      ElMessageBox.confirm("确认要批量启用这些设备吗？", '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          batchLoading.value = true
          api.device.setDeviceStatus({ ids: ids, status: 1 }).then(() => {
            ElMessage.success('启用成功');
            typeList();
          }).finally(() => batchLoading.value = false)
        })
        .catch(() => { });
    }

    //批量禁用
    const setDeviceStatus0 = (row: TableDataRow) => {
      let ids: number[] = [];
      if (row) {
        ids = [row.id];
      } else {
        ids = state.ids;
      }
      if (ids.length === 0) {
        ElMessage.error('请选择要操作的数据。');
        return;
      }
      ElMessageBox.confirm("确认要批量禁用这些设备吗？", '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          batchLoading.value = true
          api.device.setDeviceStatus({ ids: ids, status: 0 }).then(() => {
            ElMessage.success('禁用成功');
            typeList();
          }).finally(() => batchLoading.value = false)
        })
        .catch(() => { });
    }
    // 删除产品
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除设备：“${row.name}”，是否继续?`;
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
      })
        .then(() => {
          api.instance.del(ids).then(() => {
            ElMessage.success('删除成功');
            typeList();
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
      typeList();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map((item) => item.id);
    };
    const onActionStatus = (item: TableDataRow[]) => {
      if (item.status == 0) {
        api.instance.devdeploy({ id: item.id }).then((res: any) => {
          typeList();
          ElMessage.success(res.message || '操作成功');
        });
      } else {
        api.instance.devundeploy({ id: item.id }).then((res: any) => {
          typeList();
          ElMessage.success(res.message || '操作成功');
        });
      }
    }
    return {

      addDicRef,
      excelDicRef,
      onOpenexcelDic,
      editDicRef,
      detailRef,
      queryRef,
      onActionStatus,
      batchLoading,
      setDeviceStatus1,
      setDeviceStatus0,
      onOpenDetail,
      onOpenAddDic,
      onOpenEditDic,
      onRowDel,
      typeList,
      resetQuery,
      handleSelectionChange,
      ...toRefs(state),
    };
  },
});
</script>
