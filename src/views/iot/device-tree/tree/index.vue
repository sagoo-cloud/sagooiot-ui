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
            <el-tab-pane label="时间周期" name="2">
			        <el-form :model="ruleForm" ref="formRef" size="default" label-width="110px">
                <el-form-item label="时间窗口" prop="duration">
                  <div class="flex">
                    <el-input v-model="ruleForm.duration" placeholder="请输入" class="w-35" />
                    <el-select v-model="ruleForm.timeUnit" placeholder="请选择单位">
                      <el-option v-for="item in unitData" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item label="类型" prop="template">
                  <el-select v-model="ruleForm.template" filterable placeholder="请选择类型" class="w-35">
                    <el-option v-for="item in []" :key="item.id" :label="item.name" :value="item.key">
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; font-size: 13px">{{ item.key }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分类" prop="category">
                  <el-select v-model="ruleForm.category" filterable placeholder="请选择分类" class="w-35">
                    <el-option v-for="item in []" :key="item.id" :label="item.name" :value="item.key">
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; font-size: 13px">{{ item.key }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label=" " prop="category">
                  <el-button type="primary">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="绑定实际设备" name="3">
              <el-form-item label="选择设备" prop="deviceKey">
                <el-select v-model="ruleForm.deviceKey" filterable placeholder="请选择设备">
                  <el-option v-for="item in []" :key="item.key" :label="item.name" :value="item.key">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; font-size: 13px">{{ item.key }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </template>
      </LrLayout>

      <AddOrUpdate ref="addOrUpdateRef" @finish="getTreeList"/>
    </el-card>
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
  unitData: any
  ruleForm: any
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
      treeDetail: {},
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