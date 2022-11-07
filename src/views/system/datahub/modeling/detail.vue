<template>
  <div class="system-dic-container">
    <div class="content">
      <div class="cont_box">
        <div class="title">模型标识：{{ detail.key }}</div>
        <div class="title" style="margin-left: 20px">模型表名：{{ detail.name }}</div>

        <div class="pro-status"><span :class="developer_status == 1 ? 'on' : 'off'"></span>{{ developer_status == 1 ? '已发布' : '未发布' }}</div>

        <div class="pro-option" @click="CkOption">{{ developer_status == 1 ? '停用' : '发布' }}</div>
      </div>
    </div>

    <div class="content-box">
      <div class="wu-box">
        <div class="system-user-search mb15">
          <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="130px">
            <el-form-item label="字段标题" prop="key">
              <el-input v-model="tableData.param.key" placeholder="请输入字段标题" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
            </el-form-item>
            <el-form-item label="字段名称" prop="name">
              <el-input v-model="tableData.param.name" placeholder="请输入字段名称" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
            </el-form-item>

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
              <el-button size="default" type="success" class="ml10" @click="onOpenAdd" v-auth="'add'" v-if="developer_status==0">
                <el-icon>
                  <ele-FolderAdd />
                </el-icon>
                新增字段节点
              </el-button>
              <!-- <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除
            </el-button> -->
            </el-form-item>
          </el-form>
        </div>

        <el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
          <el-table-column label="ID" align="center" prop="id" width="60" v-col="'id'" />
          <el-table-column label="字段名称" prop="key" width="120" :show-overflow-tooltip="true" v-col="'key'" />
          <el-table-column label="字段标题" prop="name" width="120" :show-overflow-tooltip="true" v-col="'name'" />
          <el-table-column label="类型" prop="dataType" width="85" :show-overflow-tooltip="true" v-col="'dataType'" />

          <el-table-column label="数据源名称" align="center" v-col="'from'">
            <template #default="scope">
              <span v-if="scope.row.from==2">{{scope.row.source.name}}</span>
            </template>
          </el-table-column>
          <el-table-column label="默认值" prop="default" width="80" :show-overflow-tooltip="true" v-col="'default'" />
          <el-table-column label="备注说明" prop="value" width="100" :show-overflow-tooltip="true" v-col="'value'" />
          <el-table-column prop="createdAt" label="创建时间" align="center" width="160" v-col="'createdAt'"></el-table-column>

          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template #default="scope">
              <el-button size="small" text type="warning" @click="onOpenEdit(scope.row)" v-if="developer_status==0" v-auth="'edit'">修改</el-button>
              <el-button size="small" text type="danger" @click="onRowDel(scope.row)" v-if="developer_status==0" v-auth="'del'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <pagination
					v-show="tableData.data.length > 0"
					:total="tableData.total"
					v-model:page="tableData.param.pageNum"
					v-model:limit="tableData.param.pageSize"
					@pagination="typeList"
				/> -->
      </div>
    </div>
    <EditDic ref="editDicRef" @typeList="typeList" />
  </div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import { useRoute } from 'vue-router';
import EditDic from './component/editNode.vue';
import api from '/@/api/datahub';

interface TableDataState {
  ids: number[];
  tableData: {
    data: [];
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      name: string;
      deviceType: string;
      status: string;
      dateRange: string[];
    };
  };
}
export default defineComponent({
  name: 'dataDetail',
  components: { EditDic },
  setup(prop, context) {
    const editDicRef = ref();

    const route = useRoute();
    const state = reactive<TableDataState>({
      config: {},

      isShowDialog: false,
      detail: [],
      developer_status: 0,

      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          tid: route.params && route.params.id,
          status: '',
          dateRange: [],
        },
      },
    });

    onMounted(() => {
      const ids = route.params && route.params.id;
      api.template.detail(ids).then((res: any) => {
        state.detail = res.data;
        state.developer_status = res.data.status
      });

      typeList();
    });



    const typeList = () => {
      state.tableData.loading = true;
      api.tnode.getList(state.tableData.param).then((res: any) => {
        state.tableData.data = res.list;
        //state.tableData.total = res.Total;
      }).finally(() => (state.tableData.loading = false));
    };

    const handleClick = (tab: TabsPaneContext, event: Event) => {
      console.log(tab, event);
    };

    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除数据节点：“${row.name}”，是否继续?`;
        ids = row.id;
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
          api.tnode.delete(ids).then(() => {
            ElMessage.success('删除成功');
            typeList();
          });
        })
        .catch(() => { });
    };

    // 打开修改数据源弹窗
    const onOpenEdit = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
    };

    const onOpenAdd = () => {
      editDicRef.value.openDialog({ tid: route.params.id, id: 0, from: 1, isSorting: 0, isDesc: 1 });
    };

    const CkOption = () => {
      if (state.developer_status == 1) {
        api.tnode.undeploy({ id: route.params.id }).then((res: any) => {
          ElMessage.success('操作成功');
          state.developer_status = 0;
        });
      } else {
        api.tnode.deploy({ id: route.params.id }).then((res: any) => {
          ElMessage.success('操作成功');
          state.developer_status = 1;
        });
      }
    };

    return {
      Edit,
      CkOption,
      editDicRef,
      onOpenAdd,
      typeList,
      onRowDel,
      onOpenEdit,
      handleClick,
      ...toRefs(state),
    };
  },
});
</script>
<style>
.content {
	background: #fff;
	width: 100%;
	padding: 20px;
}
.content-box {
	background: #fff;
	width: 100%;
	padding: 20px;
	margin-top: 20px;
}
.cont_box {
	display: flex;
}
.cont_box .title {
	font-size: 18px;
}
.cont_box .pro-status {
	line-height: 30px;
	margin-left: 30px;
}
.cont_box .pro-status .on {
	background: #52c41a;
}
.cont_box .pro-status .off {
	background: #c41a1a;
}
.cont_box .pro-status span {
	position: relative;
	top: -1px;
	display: inline-block;
	width: 6px;
	height: 6px;
	vertical-align: middle;
	border-radius: 50%;
	margin-right: 5px;
}
.cont_box .pro-option {
	line-height: 30px;
	margin-left: 10px;
	color: #1890ff;
	cursor: pointer;
}
.content-box .pro-box {
	display: flex;
	padding: 10px;
}
.content-box .pro-box .protitle {
	font-size: 18px;
	font-weight: bold;
	line-height: 35px;
}
.content-box .pro-box .buttonedit {
	border: 0px;
	color: #1890ff;
}
</style>
