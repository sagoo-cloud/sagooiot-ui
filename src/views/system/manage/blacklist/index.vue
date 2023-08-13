<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="IP地址" prop="keyWord">
            <el-input v-model="tableData.param.keyWord" placeholder="请输入IP地址" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
          </el-form-item>
          <!-- <el-form-item label="状态" prop="status" style="width: 200px;">
            <el-select v-model="tableData.param.status" placeholder="状态" clearable size="default" style="width: 240px">
              <el-option label="正常" :value="1" />
              <el-option label="停用" :value="0" />
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="typeList">
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
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd" v-auth="'add'">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新建
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)" v-auth="'del'">
              <el-icon>
                <ele-Delete />
              </el-icon>
              批量删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center" />
        <!--        <el-table-column label="ID" align="center" prop="id" width="60"  v-col="'id'"/>-->
        <!-- <el-table-column label="标识" prop="key" :show-overflow-tooltip="true" v-col="'key'" /> -->
        <el-table-column label="IP" prop="ip" v-col="'ip'"/>
        <!-- <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" v-col="'name'" /> -->
         <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" v-col="'remark'"/>
        <!-- <el-table-column label="分类" prop="categoryName" :show-overflow-tooltip="true" v-col="'categoryName'" /> -->
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          v-col="'status'"
        >
        <template #default="scope">
          <el-tag
            v-if="scope.row.status == 0"
            class="ml-2"
            type="info"
          >停用</el-tag>
          <el-tag
            v-else
            class="ml-2"
            type="success"
          >正常</el-tag>
        </template>
      </el-table-column>
        <el-table-column v-col="'createdAt'" prop="createdAt" label="创建时间" align="center" width="180"></el-table-column>
        <el-table-column v-col="'handle'"  label="操作" width="150" align="center" fixed="right">
          <template #default="scope">
            <!-- <router-link :to="'/iotmanager/device/product/detail/' + scope.row.id" class="link-type" style="padding-right: 12px;font-size: 12px;color: #409eff;">
              <span>详情</span>
            </router-link> -->
            <el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-auth="'edit'">编辑</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
            <el-popover
              placement="bottom"
              :width="154"
              trigger="click"
            >
              <template #reference>
                <el-button
                  size="small"
                  type="text"
                  class="more-btn"
                  @click="isShowMore = !isShowMore"
                  v-auth="'more'"
                >更多
                  <i
                    style="margin-left: 2px;"
                    :class="isShowMore ? 'fa fa-angle-down':'fa fa-angle-up'"
                  ></i>
                </el-button>
              </template>
              <div class="more-opearte-wrap">
                <el-button
                  @click="onChangeStatus(scope.row.id, 1)"
                  :disabled="scope.row.status == 1"
                  link
                  size="small"
                  key="success"
                  type="success"
                  v-auth="'on'"
                >设为启用</el-button>
                <el-divider direction="vertical" />
                <el-button
                  @click="onChangeStatus(scope.row.id, 0)"
                  :disabled="scope.row.status == 0"
                  link
                  size="small"
                  key="warning"
                  type="warning"
                  v-auth="'off'"
                >设为禁用</el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
    </el-card>
    <EditDic ref="editDicRef" @typeList="typeList" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/editPro.vue';
// import api from '/@/api/device';
import api from '/@/api/system';// blackList

// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  name: string;
  deviceType: string;
  status: number;
  desc: string;
  createBy: string;
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
      dateRange: string[];
    };
  };
  isShowMore: boolean
}

export default defineComponent({
  name: 'deviceproduct',
  components: { EditDic },
  setup() {
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
          keyWord: '',
          dateRange: [],
        },
      },
      isShowMore: true
    });
    // 初始化表格数据
    const initTableData = () => {
      typeList();
    };
    const typeList = () => {
      state.tableData.loading = true;
      api.blackList.getList(state.tableData.param).then((res: any) => {
        console.log(res);
        state.tableData.data = res.list;
        state.tableData.total = res.total;
      }).finally(() => (state.tableData.loading = false));
    };
    // 改变状态
    const onChangeStatus = (id: number, status: number) => {
      api.blackList.changeStatus({ id: id, status: status }).then((res: any) => {
        ElMessage.success(status == 1 ? '已开启' : '已关闭');
        typeList();
      })
    };
    // 打开新增产品弹窗
    const onOpenAdd = () => {
      editDicRef.value.openDialog();
    };
    // 打开修改产品弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
    };
    // 删除产品
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除IP：“${row.ip}”，是否继续?`;
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
          api.blackList.delete(ids).then(() => {
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
      console.log(state.ids)
    };
    return {
      addDicRef,
      editDicRef,
      queryRef,
      onChangeStatus,
      onOpenAdd,
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
