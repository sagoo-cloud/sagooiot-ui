<template>
  <div class="system-user-container">
    <el-card shadow="nover">
      <div class="system-menu-search">
        <el-form :model="state.queryParams" :inline="true" ref="queryRef" @keyup.enter="handleQuery()">
          <el-form-item label="菜单名称" prop="title">
            <el-input v-model="state.queryParams.title" placeholder="请输入菜单名称" size="default" clearable class="w-50" />
          </el-form-item>
          <!-- <el-form-item label="组件路径">
            <el-input v-model="queryParams.component" placeholder="请输入组件路径" clearable  class="w-50" />
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" class="ml10" @click="handleQuery">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="resetQuery()">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <el-button type="primary" class="ml10" @click="onOpenAddMenu(null)" v-auth="'add'">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增菜单
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="state.menuTableData" :default-expand-all="false" style="width: 100%" row-key="path" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="state.loading">
        <el-table-column label="菜单名称" show-overflow-tooltip v-col="'title'">
          <template #default="scope">
            <SvgIcon :name="scope.row.icon" />
            <span class="ml10">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" v-col="'path'" label="路由路径" show-overflow-tooltip></el-table-column>
        <el-table-column label="组件路径" v-col="'component'" prop="component" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序" v-col="'weigh'" prop="weigh" width="80" align="center"></el-table-column>
        <el-table-column label="类型" v-col="'menuType'" width="80" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.menuType === 0 ? 'info' : scope.row.menuType === 1 ? 'success' : 'warning'" size="small">{{
							scope.row.menuType === 0 ? '目录' : scope.row.menuType === 1 ? '菜单' : '按钮'
						}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isHide" v-col="'isHide'" label="显示状态" align="center" width="120">
          <template #default="{ row }">
            {{ row.isHide ? '隐藏' : '显示' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" v-col="'handle'" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button v-if="!scope.row.menuType" size="small" type="text" @click="onOpenAddMenu(scope.row)" v-auth="'add'">新增</el-button>
            <el-button size="small" text type="warning" @click="onOpenEditMenu(scope.row)" v-auth="'edit'">修改</el-button>
            <el-button size="small" text type="info" @click="onTabelRowDel(scope.row)" v-auth="'del'">删除</el-button>
            <el-dropdown v-if="scope.row.menuType">
              <el-button type="text" size="small" style="margin-top: 1px; margin-left: 10px" v-auth="'more'">更多
                <el-icon>
                  <ele-ArrowDown />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click.native="authOpen(scope.row, 'buttonAuthorizeList')" v-auth="'btn'">按钮权限</el-dropdown-item>
                  <el-dropdown-item @click.native="authOpen(scope.row, 'listAuthorizeList')" v-auth="'list'">列表权限</el-dropdown-item>
                  <el-dropdown-item @click.native="authOpen(scope.row, 'apiAuthorizeList')" v-auth="'list'">接口权限</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <EditMenu ref="editMenuRef" @menuList="menuList" :menu="state.menuTableData" :visibleOptions="sys_show_hide" :acType="acType" />
    <ButtonAuthorizeListDrawer ref="buttonAuthorizeList" />
    <ListAuthorizeListDrawer ref="listAuthorizeList" />
    <ApiAuthorizeListDrawer ref="apiAuthorizeList" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onBeforeMount, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditMenu from '/@/views/system/menu/component/editMenu.vue';
import api from '/@/api/system';
import ButtonAuthorizeListDrawer from './component/btn.vue';
import ListAuthorizeListDrawer from './component/list.vue';
import ApiAuthorizeListDrawer from './component/api.vue';
const editMenuRef = ref();
const queryRef = ref();
const buttonAuthorizeList = ref();
const listAuthorizeList = ref();
const apiAuthorizeList = ref();
const state = reactive({
  loading: false,
  queryParams: {
    title: '',
    component: '',
    status: -1,
  },
  menuTableData: [],
});
const { proxy } = getCurrentInstance() as any;
const { sys_show_hide } = proxy.useDict('sys_show_hide');
const acType = ref('add');
// 打开新增菜单弹窗
const onOpenAddMenu = (row: any) => {
  acType.value = 'add';
  editMenuRef.value.openDialog(row);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (row: any) => {
  acType.value = 'edit';
  editMenuRef.value.openDialog(row);
};

// 打开按钮权限抽下
const authOpen = (row: any, key: string) => {
  if (key === 'buttonAuthorizeList') {
    return buttonAuthorizeList.value.open(row);
  }
  if (key === 'listAuthorizeList') {
    return listAuthorizeList.value.open(row);
  }
  if (key === 'apiAuthorizeList') {
    return apiAuthorizeList.value.open(row);
  }
};

// 删除当前行
const onTabelRowDel = (row: any) => {
  ElMessageBox.confirm(`此操作将永久删除菜单：“${row.title}”, 是否继续?`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      api.menu.del(row.id).then(() => {
        ElMessage.success('删除成功');
        proxy.$refs['editMenuRef'].resetMenuSession();
        menuList();
      });
    })
    .catch(() => { });
};
onBeforeMount(() => {
  menuList();
});
const handleQuery = () => {
  menuList();
};
// 重置表单
const resetQuery = () => {
  queryRef.value.resetFields();
  handleQuery();
};
const menuList = () => {
  state.loading = true;
  api.menu
    .getList(state.queryParams)
    .then((res: any) => {
      // console.log({...res[0]})
      state.menuTableData = res || [];
    })
    .finally(() => (state.loading = false));
};
</script>
