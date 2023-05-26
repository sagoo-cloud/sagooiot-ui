<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <LrLayout width="260px">
        <template #left>
          <div class="zl-tree-search">
            <div class="flex zl-tree-search__filter">
              <el-input v-model.trim="searchVal" placeholder="搜索">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                  <!-- <i class="iconfont icon-search" /> -->
                </template>
              </el-input>
            </div>
          </div>
          <div class="zl-tree-search-scroll">
            <el-scrollbar ref="zlTreeSearchScroll" height="100%" v-loading="treeLoading">
              <el-tree
                ref="zlTreeSearchRef"
                v-if="!treeLoading"
                :data="treeData"
                :props="{
                  children: 'children',
                  label: 'name'
                }"
                :filter-node-method="filterNode"
                :default-expand-all="true"
                :node-key="'id'"
                highlight-current
                @node-click="nodeClick">
                <template #default="{ node, data }">
                  <div class="custom-tree-node">
                    <span class="tree-label">
                      <i class="iconfont icon-wenjianjia icon-wjj mr8" />{{ node.label }}
                    </span>
                    <span class="tree-options" >
                      <slot name="operate" :data="data">
                        <el-dropdown @command="command => operateCmd(command, data)">
                          <el-icon>
                            <More></More>
                          </el-icon>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item command="add">
                                <el-icon>
                                  <Plus></Plus>
                                </el-icon>
                              </el-dropdown-item>
                              <el-dropdown-item command="edit">
                                <el-icon>
                                  <Edit></Edit>
                                </el-icon>
                              </el-dropdown-item>
                              <el-dropdown-item command="delete">
                                <el-icon>
                                  <Delete></Delete>
                                </el-icon>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </slot>
                    </span>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </div>
        </template>
        <template #right>
          <!--  @tab-click="handleClick" -->
          <el-tabs v-model="tabName">
            <el-tab-pane label="设备树信息" name="1">
              <table>
                <tbody>
                  <tr class="ant-descriptions-row">
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">名称</th>
                    <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.name }}</td>
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">地址</th>
                    <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.address }}</td>
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">经度</th>
                    <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.lng }}</td>
                  </tr>
                  <tr class="ant-descriptions-row">
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">纬度</th>
                    <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.lat }}</td>
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">联系人</th>
                    <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.contact }}</td>
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">联系电话</th>
                    <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.phone }}</td>
                  </tr> 
                  <tr class="ant-descriptions-row">
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">服务周期：开始日期</th>
                    <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.startDate }}</td>
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">服务周期：截止日期</th>
                    <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.endDate }}</td>
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">图片</th>
                    <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.image }}</td>
                  </tr>
                  <tr class="ant-descriptions-row">
                    <th class="ant-descriptions-item-label ant-descriptions-item-colon">设备标识</th>
                    <td class="ant-descriptions-item-content" colspan="5">{{ treeDetail.deviceKey }}</td>
                  </tr>
                </tbody>
              </table>
            </el-tab-pane>
            <el-tab-pane label="时间周期" name="2">Config</el-tab-pane>
            <el-tab-pane label="绑定实际设备" name="3">Role</el-tab-pane>
          </el-tabs>
        </template>
      </LrLayout>

      <AddOrUpdate ref="addOrUpdateRef" @finish="getTreeList"/>
    </el-card>
    <!-- <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入产品名称" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceType">
            <el-input v-model="tableData.param.deviceType" placeholder="请输入设备类型" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
          </el-form-item>
          <el-form-item label="发布状态" prop="status" style="width: 200px;">
            <el-select v-model="tableData.param.status" placeholder="发布状态" clearable size="default" style="width: 240px">
              <el-option label="已发布" :value="1" />
              <el-option label="未发布" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="dateRange">
            <el-date-picker v-model="tableData.param.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
            <el-button size="default" type="success" class="ml10" @click="onOpenAddDic" v-auth="'add'">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增产品
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)" v-auth="'del'">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标识" prop="key" :show-overflow-tooltip="true" v-col="'key'" />
        <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" v-col="'name'" />
        <el-table-column label="分类" prop="categoryName" :show-overflow-tooltip="true" v-col="'categoryName'" />
        <el-table-column label="消息协议" prop="messageProtocol" :show-overflow-tooltip="true" v-col="'messageProtocol'" />
        <el-table-column label="接入方式" prop="transportProtocol" :show-overflow-tooltip="true" v-col="'transportProtocol'" />
        <el-table-column label="类型" prop="deviceType" :show-overflow-tooltip="true" v-col="'deviceType'" />

        <el-table-column prop="status" label="状态" width="100" align="center" v-col="'status'">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status">已发布</el-tag>
            <el-tag type="info" size="small" v-else>未发布</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="scope">
            <router-link :to="'/iotmanager/device/product/detail/' + scope.row.id" class="link-type" style="padding-right: 12px;font-size: 12px;color: #409eff;">
              <span>详情</span>
            </router-link>
            <el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
    </el-card>
    <EditDic ref="editDicRef" @typeList="typeList" /> -->
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import AddOrUpdate from './component/edit.vue';
import api from '/@/api/device';
import LrLayout from '/@/components/lrLayout/index.vue'
import { Fold, Expand, More, Plus, Edit, Delete, Search } from '@element-plus/icons-vue'

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
      name: string;
      status: string;
    };
  };
  treeData: any[]
  treeLoading: boolean
  tabName: string
  searchVal: string
  treeDetail: any
}

export default defineComponent({
  name: 'deviceTree',
  components: { AddOrUpdate, LrLayout, Fold, Expand, More, Plus, Edit, Delete, Search },
  setup() {
    const addOrUpdateRef = ref();
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
          status: '',
          name: ''
        },
      },
      treeData: [],
      treeLoading: false,
      tabName: '1',
      searchVal: '',
      treeDetail: {}
    });
    // 初始化表格数据
    const initTableData = () => {
      getTreeList();
    };
    const getTreeList = () => {
      state.treeLoading = true;
      api.tree.getList({}).then((res: any) => {
        state.treeData = res.list;
      }).finally(() => (state.treeLoading = false));
    }
    const typeList = () => {

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
    const nodeClick = (data: any) => {
      api.tree.detail({ infoId: data.infoId })
        .then((res: any) => {
          state.treeDetail = res.data || {}
        })
    }

    const operateCmd = (type: string, data: any) => {
      switch(type) {
        case 'add':
          addOrUpdateRef.value.openDialog(type, data)
          break
        case 'edit':
          addOrUpdateRef.value.openDialog(type, data)
          break
        case 'delete':
          ElMessageBox.confirm('是否删除该设备树', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              api.tree.delete({ id: data.infoId }).then(() => {
                ElMessage.success('删除成功');
                getTreeList();
              });
            })
            .catch(() => { });
          break
      }
    }
    return {
      addOrUpdateRef,
      queryRef,
      typeList,
      resetQuery,
      handleSelectionChange,
      operateCmd,
      getTreeList,
      nodeClick,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
.zl-tree-search {
  margin: 0 12px 0 0;
  background-color: #fff;
  border-radius: 4px;
  &__filter {
    padding: 4px 10px;
    border-bottom: 1px solid #EAEAEA;
  }
}
.zl-tree-search__filter :deep .el-input__wrapper {
  box-shadow: none;
}

.custom-tree-node {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  &:hover {
    .tree-options {
      display: block;
    }
  }
}
:deep(.column-right) {
  padding: 0;
  background-color: transparent;
}
.icon-wjj {
  font-size: 12px;
  color: #C4C6CF;
}

table {
  width: 100%;
	border-collapse: collapse;
	text-indent: initial;
	border-spacing: 2px;
}
tbody {
	box-sizing: border-box;
	display: table-row-group;
	vertical-align: middle;
	border-color: inherit;
}

tr {
	display: table-row;
	vertical-align: inherit;
	border-color: inherit;
}
.ant-descriptions-view {
	width: 100%;
	overflow: hidden;
	border-radius: 4px;
}
.ant-descriptions-view {
	border: 1px solid #e8e8e8;
}
.ant-descriptions-view table {
	width: 100%;
	table-layout: fixed;
}
.ant-descriptions-view > table {
	table-layout: auto;
}
.ant-descriptions-row {
	border-bottom: 1px solid #e8e8e8;
}
.ant-descriptions-item-label {
	color: rgba(0, 0, 0, 0.85);
	font-weight: 400;
	font-size: 14px;
	line-height: 1.5;
}
.ant-descriptions-item-label {
	padding: 16px;
	border-right: 1px solid #e8e8e8;
}
.ant-descriptions-item-label {
	background-color: #fafafa;
}
.ant-descriptions-item-content {
	padding: 16px;
	border-right: 1px solid #e8e8e8;
	display: table-cell;
	color: rgba(0, 0, 0, 0.65);
	font-size: 14px;
	line-height: 1.5;
}
</style>