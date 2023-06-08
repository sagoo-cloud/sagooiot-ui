<template>
  <div class="system-dic-container" style="background: #fff">
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
                  <!-- <span class="tree-options" >
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
                  </span> -->
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </template>
      <template #right>
        <!-- max-height="30vh" -->
        <el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%; padding: 12px" >
          <el-table-column :label="item.name + `${item.unit ? `(${item.unit})` : ''}`" :prop="item.key" v-for="(item, index) in tableData
          .columns" :key="index" :show-overflow-tooltip="true" />
        </el-table>

        <div  style="text-align: center;padding: 28px;" v-if="(tableData.data.length)">暂无数据</div>
      </template>
    </LrLayout>

  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
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
      columns: Array<any>;
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
  deviceList: any[]
  treeLoading: boolean
  tabName: string
  searchVal: string
  treeDetail: any
  unitData: any
  ruleForm: any
}

export default defineComponent({
  name: 'realTimeStatistics',
  components: { LrLayout, Fold, Expand, More, Plus, Edit, Delete, Search },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const addOrUpdateRef = ref();
    const queryRef = ref();
    const state = reactive<TableDataState>({
      ids: [],
      tableData: {
        data: [],
        columns: [],
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
      treeDetail: {},
      deviceList: [],
			unitData: [
				{ label: '秒', value: 1 },
				{ label: '分', value: 2 },
				{ label: '时', value: 3 },
				{ label: '天', value: 4 },
			],
      ruleForm: {
        duration: '',
        timeUnit: '',
        template: 'default',
        category: 'default'
      }
    });
    
    // const { tree_types, tree_category } = proxy.useDict('tree_types', 'tree_category');
    // 初始化表格数据
    const initTableData = () => {
      getTreeList();

      nodeClick({ infoId:  1 })
    };
    const getTreeList = () => {
      state.treeLoading = true;
      api.tree.getList({}).then((res: any) => {
        state.treeData = res.list;
      }).finally(() => (state.treeLoading = false));
    }
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: TableDataRow[]) => {
      state.ids = selection.map((item) => item.id);
    };
    const nodeClick = (data: any) => {
      api.tree.statistic({ infoId: data.infoId })
        .then((res: any) => {
          state.tableData.columns = []
          state.tableData.data = []
          if (res.name) {
            let header = res.header || []
            let list = res.list || []
            state.tableData.columns = header
            state.tableData.data = list.map((item: any) => {
              return {
                time: item.time,
                ...item.data
              }
            })
            state.tableData.columns.unshift({ name: '时间', key: 'time' })
          }
          // state.treeDetail = res.data || {}
        })
    }
    const onSaveTime = () => {
      if (!state.treeDetail.id) {
        ElMessage.warning('请选择节点树')
        return
      }
      //修改
      api.tree.edit({
        ...state.treeDetail,
        template: state.ruleForm.template,
        category: state.ruleForm.category,
        deviceKey: state.ruleForm.deviceKey,
      }).then(() => {
        ElMessage.success('修改成功');
      });
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
      resetQuery,
      handleSelectionChange,
      operateCmd,
      getTreeList,
      nodeClick,
      ...toRefs(state),
      onSaveTime
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