<template>
  <div class="page page-full">
    <el-row :gutter="15" class="h-full">
      <el-col :span="6" class="h-full">
        <el-card shadow="nover" class="h-full">
          <el-scrollbar v-loading="treeLoading">
            <el-input :prefix-icon="Search" v-model="searchVal" placeholder="请输入设备树名称" clearable style="width: 100%;" />
            <el-button v-if="!treeLoading && !treeData.length" type="primary" v-auth="'add'" class="mt-2" @click="operateCmd('add', {})" style="width: 100%">新建节点</el-button>
            <el-tree ref="zlTreeSearchRef" class="mt-4" v-if="!treeLoading" :data="treeData" :props="{
              children: 'children',
              label: 'name'
            }" :filter-node-method="filterNode" :default-expand-all="true" :node-key="'id'" highlight-current @node-click="nodeClick">
              <template #default="{ node, data }">
                <div class="custom-tree-node">
                  <span class="tree-label">
                    <!-- <i class="iconfont icon-wenjianjia icon-wjj mr8" /> -->
                    {{ node.label }}
                  </span>
                  <span class="tree-options" @click.stop v-auth="'edit'">
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
        </el-card>
      </el-col>
      <el-col :span="18" class="h-full">
        <el-card shadow="nover" class="h-full" v-if="treeDetail.name">
          <el-form :model="ruleForm" ref="formRef" label-width="80px">
            <el-tabs v-model="tabName" @tab-click="onTabClick">
              <el-tab-pane label="设备树信息" name="1">
                <el-descriptions class="margin-top" :column="3" border>
                  <el-descriptions-item label="名称">{{ treeDetail.name }}</el-descriptions-item>
                  <el-descriptions-item label="设备标识">{{ treeDetail.deviceKey }}</el-descriptions-item>
                  <el-descriptions-item label="联系人">{{ treeDetail.contact }}</el-descriptions-item>
                  <el-descriptions-item label="经纬度">{{ treeDetail.lng }}, {{ treeDetail.lat }}</el-descriptions-item>
                  <el-descriptions-item label="联系电话">{{ treeDetail.phone }}</el-descriptions-item>
                  <el-descriptions-item label="类型">{{ treeDetail.types }}</el-descriptions-item>
                  <el-descriptions-item label="服务周期" span="2">{{ treeDetail.startDate }} - {{ treeDetail.endDate }}</el-descriptions-item>
                  <el-descriptions-item label="图片">
                    <el-image :src="treeDetail.image" :previewSrcList="[treeDetail.image]" style="width: 60px;height: 60px;">
                      <template #error>
                        <div class="image-slot">
                          <ele-Picture style="width: 30px;" />
                          加载失败
                        </div>
                      </template>
                    </el-image>
                  </el-descriptions-item>
                  <el-descriptions-item label="地址">{{ treeDetail.address }}</el-descriptions-item>
                  <el-descriptions-item label="所属公司">{{ treeDetail.company }}</el-descriptions-item>
                  <el-descriptions-item label="设备所属区域">{{ treeDetail.area }}</el-descriptions-item>
                </el-descriptions>
                <!-- <table>
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
                      <td class="ant-descriptions-item-content" colspan="1">
                        <el-image :src="treeDetail.image" v-if="treeDetail.image" />
                      </td>
                    </tr>
                    <tr class="ant-descriptions-row">
                      <th class="ant-descriptions-item-label ant-descriptions-item-colon">设备标识</th>
                      <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.deviceKey }}</td>
                      <th class="ant-descriptions-item-label ant-descriptions-item-colon">设备所属区域</th>
                      <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.area }}</td>
                      <th class="ant-descriptions-item-label ant-descriptions-item-colon">所属公司</th>
                      <td class="ant-descriptions-item-content" colspan="1">{{ treeDetail.company }}</td>
                    </tr>
                    <tr class="ant-descriptions-row">
                      <th class="ant-descriptions-item-label ant-descriptions-item-colon">类型</th>
                      <td class="ant-descriptions-item-content" colspan="5">{{ treeDetail.types }}</td>
                    </tr>
                  </tbody>
                </table> -->
              </el-tab-pane>
              <el-tab-pane label="时间周期" name="2">
                <el-form-item label="开始日期" prop="startDate">
                  <el-date-picker v-model="ruleForm.startDate" type="date" placeholder="选择开始日期" class="w-35" :size="'default'" />
                </el-form-item>
                <el-form-item label="结束日期" prop="endDate">
                  <el-date-picker v-model="ruleForm.endDate" type="date" placeholder="选择结束日期" class="w-35" :size="'default'" />
                </el-form-item>
                <!-- <el-form-item label="类型" prop="template">
                  <el-select v-model="ruleForm.template" filterable clearable placeholder="请选择类型" class="w-35">
                    <el-option v-for="dict in tree_types" :key="dict.value" :label="dict.label" :value="dict.value"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分类" prop="category">
                  <el-select v-model="ruleForm.category" filterable clearable placeholder="请选择分类" class="w-35">
                    <el-option v-for="dict in tree_category" :key="dict.value" :label="dict.label" :value="dict.value"> </el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label=" " prop="category">
                  <el-button type="primary" v-auth="'save'" @click="onSaveTime">保存</el-button>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="绑定实际设备" name="3">
                <el-form-item label="选择设备" prop="deviceKey">
                  <el-select v-model="ruleForm.deviceKey" filterable placeholder="请选择设备">
                    <el-option v-for="item in deviceList" :key="item.key" :label="item.name" :value="item.key">
                      <span style="float: left">{{ item.name }}</span>
                      <!-- <span style="float: right; font-size: 13px">{{ item.key }}</span> -->
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label=" " prop="category">
                  <el-button type="primary" v-auth="'save'" @click="onSaveTime">保存</el-button>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <AddOrUpdate ref="addOrUpdateRef" @finish="onFinish" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, watch } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import AddOrUpdate from './component/edit.vue';
import api from '/@/api/device';
import { More, Plus, Edit, Delete, Search } from '@element-plus/icons-vue'

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
  deviceList: any[]
  treeLoading: boolean
  tabName: string
  searchVal: string
  treeDetail: any
  unitData: any
  currentTree: any
}

export default defineComponent({
  name: 'deviceTree',
  components: { AddOrUpdate, More, Plus, Edit, Delete },
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
      deviceList: [],
      unitData: [
        { label: '秒', value: 1 },
        { label: '分', value: 2 },
        { label: '时', value: 3 },
        { label: '天', value: 4 },
      ],
      currentTree: {}
    });

    let ruleForm = ref({
      startDate: '',
      endDate: '',
      deviceKey: ''
    })
    let zlTreeSearchRef = ref()

    watch(() => state.searchVal, (val) => {
      zlTreeSearchRef.value!.filter(val);
    });

    const filterNode = (value: string, data: any) => {
      if (!value) return true;
      return data.name.includes(value);
    };

    // 初始化表格数据
    const initTableData = () => {
      getTreeList();
      getDeviceList()
    };
    const getTreeList = () => {
      state.treeLoading = true;
      api.tree.getList({}).then((res: any) => {
        state.treeData = res.list;
      }).finally(() => (state.treeLoading = false));
    }
    const getDeviceList = () => {
      api.device.allList({}).then((res: any) => {
        state.deviceList = res.device || [];
      })
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
      state.currentTree = data
      getTreeDetail(data)
    }
    const getTreeDetail = (data: any) => {
      api.tree.detail({ infoId: data.infoId })
        .then((res: any) => {
          state.treeDetail = res.data || {}
          ruleForm.value.startDate = state.treeDetail.startDate
          ruleForm.value.endDate = state.treeDetail.endDate
          ruleForm.value.deviceKey = state.treeDetail.deviceKey
        })
    }
    const onFinish = () => {
      getTreeList()
      getTreeDetail(state.currentTree)
    }
    const onTabClick = () => {
      // ruleForm.value.startDate = ''
      // ruleForm.value.endDate = ''
      // ruleForm.value.deviceKey = ''
    }
    const onSaveTime = () => {
      if (!state.treeDetail.id) {
        ElMessage.warning('请选择节点树')
        return
      }

      if (!(new Date(ruleForm.value.endDate) >= new Date(ruleForm.value.startDate))) {
        ElMessage.warning('开始时间不能大于结束时间')
        return
      }
      //修改
      api.tree.edit({
        ...state.treeDetail,
        endDate: ruleForm.value.endDate,
        startDate: ruleForm.value.startDate,
        deviceKey: ruleForm.value.deviceKey,
      }).then(() => {
        ElMessage.success('修改成功');
      });
    }

    const operateCmd = (type: string, data: any) => {
      switch (type) {
        case 'add':
          addOrUpdateRef.value.openDialog(type, data)
          break
        case 'edit':
          addOrUpdateRef.value.openDialog(type, data)
          break
        case 'delete':
          ElMessageBox.confirm('是否删除该设备树?', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              api.tree.delete({ id: data.infoId }).then(() => {
                ElMessage.success('删除成功');
                state.searchVal = ''
                state.treeDetail = {}
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
      zlTreeSearchRef,
      typeList,
      resetQuery,
      handleSelectionChange,
      operateCmd,
      getTreeList,
      nodeClick,
      ...toRefs(state),
      ruleForm,
      Search,
      onSaveTime,
      filterNode,
      onFinish,
      onTabClick
    };
  },
});
</script>

<style scoped lang="scss">
.el-card ::v-deep(.el-card__body) {
  height: 100%;
}

.el-tree ::v-deep(.el-tree-node__label) {
  width: 100%;
  overflow: hidden;
  display: block;
}

// :deep(.el-card__body) {
//   padding: 0;
// }
.zl-tree-search {
  margin: 0 12px 0 0;
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
  overflow: hidden;

  .tree-label {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 10px;
  }

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
  border: 1px solid #e8e8e8;
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

.ant-descriptions-view>table {
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