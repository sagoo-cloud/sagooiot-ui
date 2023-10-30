<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="tableData.param.dictName" placeholder="请输入字典名称" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
          </el-form-item>
<!--          <el-form-item label="字典类型" prop="dictType">-->
<!--            <el-input v-model="tableData.param.dictType" placeholder="请输入字典类型" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />-->
<!--          </el-form-item>-->
          <el-form-item label="状态" prop="status" style="width: 200px">
            <el-select v-model="tableData.param.status" placeholder="字典状态" clearable size="default" style="width: 240px">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
<!--          <el-form-item label="创建时间" prop="dateRange">-->
<!--            <el-date-picker v-model="tableData.param.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>-->
<!--          </el-form-item>-->
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
            <el-button size="default" type="primary" class="ml10" @click="onOpenAddDic" v-auth="'add'">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增字典
            </el-button>
            <el-button size="default" type="info" class="ml10" @click="onRowDel()" v-auth="'del'">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除字典
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 字典切换 -->
      <el-tabs v-model="tableData.param.moduleClassify" class="demo-tabs" @tab-change="typeList">
				<el-tab-pane v-for="dict in tabDataList" :label="dict.dictLabel" :name="dict.dictValue">
          <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="字典ID" v-col="'dictId'" align="center" prop="dictId" width="80" />
            <el-table-column label="字典名称" v-col="'dictName'" prop="dictName" :show-overflow-tooltip="true" />
            <el-table-column label="字典类型" v-col="'dictType'" align="center" :show-overflow-tooltip="true">
              <template #default="scope">
                <router-link :to="'/config/dict/' + scope.row.dictType" class="link-type">
                  <span>{{ scope.row.dictType }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="字典状态" v-col="'status'" width="120" align="center">
              <template #default="scope">
                <el-tag type="success" size="small" v-if="scope.row.status">启用</el-tag>
                <el-tag type="info" size="small" v-else>禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" v-col="'remark'" label="字典描述" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="createdAt" label="创建时间" align="center" width="180"></el-table-column> -->
            <el-table-column label="操作" width="100" align="center" v-col="'handle'">
              <template #default="scope">
                <el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-auth="'edit'">修改</el-button>
                <el-button size="small" text type="info" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
				</el-tab-pane>
			</el-tabs> 
    </el-card>
    <EditDic ref="editDicRef" @typeList="typeList" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent} from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/editDic.vue';
import api from '/@/api/system';

// 定义接口来定义对象的类型
interface TableDataRow {
  dictId: number;
  dictName: string;
  moduleClassify: string;
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
      dictName: string;
      moduleClassify: string; // 字典类型
      dictType: string;
      status: string;
      dateRange: string[];
    };
  };
}

export default defineComponent({
  name: 'systemDic',
  components: { EditDic },
  setup() {
    const addDicRef = ref();
    const editDicRef = ref();
    const queryRef = ref();
    const tabDataList = ref([{dictLabel: '全部', dictValue: ''}]);
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          dictName: '',
          moduleClassify: '',// 字典分类
          dictType: '',
          status: '',
          dateRange: [],
        },
      },
    });
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    // 初始化表格数据
    const initTableData = () => {
      dictList();
    };
    const typeList = () => {
      let params = state.tableData.param;
      state.tableData.loading = true;
      api.dict
        .getTypeList(params)
        .then((res: any) => {
          state.tableData.data = res.dictTypeList;
          state.tableData.total = res.total;
        })
        .finally(() => (state.tableData.loading = false));
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
        msg = `此操作将永久删除用户：“${row.dictName}”，是否继续?`;
        ids = [row.dictId];
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
          api.dict.deleteType(ids).then(() => {
            ElMessage.success('删除成功');
            typeList();
          });
        })
        .catch(() => { });
    };
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      typeList();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map((item) => item.dictId);
    };
    // 获取字典列表
    const dictList = () => {
      state.tableData.loading = true;
      api.dict.getDataList({dictType: 'dict_class_type',status: 1,pageNum: 1,pageSize: 50,defaultValue: ''})
        .then((res: any) => {
          tabDataList.value = tabDataList.value.concat(res.list);
          typeList();
        }).finally(() => (state.tableData.loading = false));
    };
    return {
      addDicRef,
      editDicRef,
      queryRef,
      tabDataList,
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
