<template>
  <div class="system-menu-container">
    <el-card shadow="hover">
      <div class="system-menu-search mb15">
        <el-form :inline="true">
          <el-form-item label="菜单名称">
            <el-input v-model="queryParams.title" placeholder="请输入菜单名称" clearable class="w-50 m-2" size="default" />
          </el-form-item>
          <!-- <el-form-item label="组件路径">
            <el-input v-model="queryParams.component" placeholder="请输入组件路径" clearable size="default" class="w-50 m-2" />
          </el-form-item> -->
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="handleQuery">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddMenu(null)">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增菜单
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="menuTableData" style="width: 100%" row-key="path" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column label="菜单名称" show-overflow-tooltip>
          <template #default="scope">
            <SvgIcon :name="scope.row.icon" />
            <span class="ml10">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
        <el-table-column label="组件路径" prop="component" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序" prop="weigh" show-overflow-tooltip width="80"></el-table-column>
        <el-table-column label="类型" show-overflow-tooltip width="80">
          <template #default="scope">
            <el-tag :type="scope.row.menuType===0?'danger':(scope.row.menuType===1?'success':'warning')" size="small">{{scope.row.menuType===0?'目录':(scope.row.menuType===1?'菜单':'按钮') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isHide" label="显示状态" align="center" width="120">
          <template #default="{row}">
            {{row.isHide?'隐藏':'显示'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="scope">
            <el-button v-if="!scope.row.menuType" size="small" type="text" @click="onOpenAddMenu(scope.row)">新增</el-button>
            <el-button size="small" text type="warning" @click="onOpenEditMenu(scope.row)">修改</el-button>
            <el-button size="small" text type="danger" @click="onTabelRowDel(scope.row)">删除</el-button>
            <el-dropdown v-if="scope.row.menuType" size="small">
              <el-button type="text" size="small" style="margin-top:1px;margin-left:10px">更多
                <el-icon>
                  <ele-ArrowDown />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>按钮权限</el-dropdown-item>
                  <el-dropdown-item>列表权限</el-dropdown-item>
                  <el-dropdown-item>数据权限</el-dropdown-item>
                </el-dropdown-menu>
              </template>
              <!-- <el-dropdown-item @click.native="download(scope.row)" v-has="'btn_download'">
                  下载代码
                </el-dropdown-item> -->
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <EditMenu ref="editMenuRef" @menuList="menuList" :menu="menuTableData" :visibleOptions="sys_show_hide" :acType="acType" />
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onBeforeMount, defineComponent, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditMenu from '/@/views/system/menu/component/editMenu.vue';
import { delMenu, getMenuList } from '/@/api/system/menu';
export default defineComponent({
	name: 'apiV1SystemAuthMenuList',
	components: { EditMenu },
	setup() {
		const editMenuRef = ref();
		const state = reactive({
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
		// 删除当前行
		const onTabelRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除菜单：“${row.title}”, 是否继续?`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					delMenu(row.id).then(() => {
						ElMessage.success('删除成功');
						proxy.$refs['editMenuRef'].resetMenuSession();
						menuList();
					});
				})
				.catch(() => {});
		};
		onBeforeMount(() => {
			menuList();
		});
		const handleQuery = () => {
			menuList();
		};
		const menuList = () => {
			getMenuList(state.queryParams).then((res: any) => {
				// console.log({...res[0]})
				state.menuTableData = res || [];
			});
		};
		return {
			editMenuRef,
			onOpenAddMenu,
			onOpenEditMenu,
			onTabelRowDel,
			menuList,
			handleQuery,
			...toRefs(state),
			sys_show_hide,
			acType,
		};
	},
});
</script>
