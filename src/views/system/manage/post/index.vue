<template>
  <el-card shadow="nover" class="page">
    <el-form :model="tableData.param" inline ref="queryRef">
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="tableData.param.postName" placeholder="请输入岗位名称" class="w-50" clearable />
      </el-form-item>
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="tableData.param.postCode" placeholder="请输入岗位编码" class="w-50" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select placeholder="请选择状态" style="width: 80px;" v-model="tableData.param.status">
          <el-option label="全部" :value="-1" />
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="ml10" @click="postList">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button @click="resetQuery()">
          <el-icon>
            <ele-Refresh />
          </el-icon>
          重置
        </el-button>
        <el-button type="primary" class="ml10" @click="onOpenAddPost" v-auth="'add'">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增岗位
        </el-button>
        <!-- <el-button type="info" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除岗位
            </el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" row-key="postId" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="tableData.loading">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="postCode" v-col="'postCode'" label="岗位编码" width="220" show-overflow-tooltip></el-table-column>
      <el-table-column prop="postName" v-col="'postName'" label="岗位名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="postSort" v-col="'postSort'" label="排序" width="60" align="center"></el-table-column>
      <el-table-column prop="status" v-col="'status'" label="岗位状态" width="120" align="center">
        <template #default="scope">
          <el-tag type="success" size="small" v-if="scope.row.status === 1">启用</el-tag>
          <el-tag type="info" size="small" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" v-col="'remark'" label="岗位描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdAt" v-col="'createdAt'" label="创建时间" width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="100" v-col="'handle'">
        <template #default="scope">
          <el-button size="small" text type="warning" @click="onOpenEditPost(scope.row)" v-auth="'edit'">修改</el-button>
          <el-button size="small" text type="info" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <EditPost ref="editPostRef" @getPostList="postList" />
  </el-card>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, toRaw } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditPost from './component/editPost.vue';
import api from '/@/api/system';
// 定义接口来定义对象的类型
interface TableData {
  postId: number;
  postCode: string;
  postName: string;
  postSort: number;
  status: number;
  remark: string;
  createdAt: string;
}
interface TableDataState {
  ids: number[];
  tableData: {
    data: Array<TableData>;
    total: number;
    loading: boolean;
    param: {
      postName: string;
      status: number;
      postCode?: string;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemPostList',
  components: { EditPost },
  setup() {
    const addPostRef = ref();
    const editPostRef = ref();
    const queryRef = ref();
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          postName: '',
          status: -1,
          postCode: '',
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      postList();
    };
    const postList = () => {
      state.tableData.loading = true;
      api.post
        .getList(state.tableData.param)
        .then((res: any) => {
          state.tableData.data = res;
        })
        .finally(() => (state.tableData.loading = false));
    };
    // 打开新增岗位弹窗
    const onOpenAddPost = () => {
      editPostRef.value.openDialog();
    };
    // 打开修改岗位弹窗
    const onOpenEditPost = (row: Object) => {
      editPostRef.value.openDialog(toRaw(row));
    };
    // 删除岗位
    const onRowDel = (row: any) => {
      let msg = '你确定要删除所选岗位？';
      // let ids: number[] = [];
      // if (row) {
      msg = `此操作将永久删除岗位：“${row.postName}”，是否继续?`;
      // ids = [row.postId];
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
          api.post.del(row.postId).then(() => {
            ElMessage.success('删除成功');
            postList();
          });
        })
        .catch(() => { });
    };
    // 重置表单
    const resetQuery = () => {
      queryRef.value.resetFields();
      initTableData();
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    // 多选框选中数据
    const handleSelectionChange = (selection: Array<TableData>) => {
      state.ids = selection.map((item) => item.postId);
    };
    return {
      queryRef,
      resetQuery,
      addPostRef,
      editPostRef,
      onOpenAddPost,
      onOpenEditPost,
      onRowDel,
      postList,
      handleSelectionChange,
      ...toRefs(state),
    };
  },
});
</script>
