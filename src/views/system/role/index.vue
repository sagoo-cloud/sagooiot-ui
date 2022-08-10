<template>
  <div class="system-role-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :inline="true">
          <!-- <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="上级角色">
              <el-cascader :options="menu" :props="{ label: 'title',value: 'id',checkStrictly: true,emitPath: false }" placeholder="请选择上级菜单" clearable class="w100" v-model="ruleForm.parentId">
                <template #default="{ node, data }">
                  <span>{{ data.title }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col> -->
          <el-form-item label="角色名称">
            <el-input size="default" v-model="tableData.param.roleName" placeholder="请输入角色名称" class="w-50 m-2" clearable />
          </el-form-item>
          <el-form-item label="状态">
            <el-select size="default" placeholder="请选择状态" class="w-50 m-2" v-model="tableData.param.status" clearable>
              <el-option label="全部" :value="-1" />
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="roleList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddRole">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增角色
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="角色描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="listOrder" label="排序" width="60" align="center"></el-table-column>
        <el-table-column prop="status" label="角色状态" width="100" align="center">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status===1">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="170" align="center"></el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button size="small" type="text" @click="onOpenEditRole(scope.row)">修改</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
            <el-dropdown size="small">
              <el-button type="text" size="small" style="margin-top:1px;margin-left:10px">更多
                <el-icon>
                  <ele-ArrowDown />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>角色成员</el-dropdown-item>
                  <el-dropdown-item @click.native="permission(scope.row)">角色权限</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="roleList" /> -->
    </el-card>
    <EditRole ref="editRoleRef" @getRoleList="roleList" />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, toRaw, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditRole from '/@/views/system/role/component/editRole.vue';
import { deleteRole, getRoleList } from '/@/api/system/role';
// 定义接口来定义对象的类型
interface TableData {
	id: number;
	status: number;
	listOrder: number;
	name: string;
	remark: string;
	dataScope: number;
	createdAt: string;
}
interface TableDataState {
	tableData: {
		data: Array<TableData>;
		// total: number;
		loading: boolean;
		param: {
			roleName: string;
			status: number;
		};
	};
}

export default defineComponent({
	name: 'apiV1SystemRoleList',
	components: { EditRole },
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const addRoleRef = ref();
		const editRoleRef = ref();
		const state = reactive<TableDataState>({
			tableData: {
				data: [],
				// total: 0,
				loading: false,
				param: {
					roleName: '',
					status: -1,
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			roleList();
		};
		const roleList = () => {
			const data: Array<TableData> = [];
			getRoleList(state.tableData.param).then((res: TableData[]) => {
				const list = res || [];
				list.map((item: TableData) => {
					data.push({
						id: item.id,
						status: item.status,
						listOrder: item.listOrder,
						name: item.name,
						remark: item.remark,
						dataScope: item.dataScope,
						createdAt: item.createdAt,
					});
				});
				state.tableData.data = data;
				// state.tableData.total = res.data.total;
			});
		};
		// 打开新增角色弹窗
		const onOpenAddRole = () => {
			editRoleRef.value.openDialog();
		};
		// 打开修改角色弹窗
		const onOpenEditRole = (row: Object) => {
			editRoleRef.value.openDialog(toRaw(row));
		};
		// 删除角色
		const onRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除角色：“${row.name}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					deleteRole(row.id).then(() => {
						ElMessage.success('删除成功');
						proxy.$refs['editRoleRef'].resetMenuSession();
						roleList();
					});
				})
				.catch(() => {});
		};
		// 分页改变
		const onHandleSizeChange = (val: number) => {
			state.tableData.param.pageSize = val;
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.tableData.param.pageNum = val;
		};
		// 设置权限
		const permission = (row: any) => {
			console.log(row)
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			addRoleRef,
			editRoleRef,
			permission,
			onOpenAddRole,
			onOpenEditRole,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
			roleList,
			...toRefs(state),
		};
	},
});
</script>
