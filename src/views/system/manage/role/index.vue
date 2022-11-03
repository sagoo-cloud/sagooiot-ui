<template>
	<div class="system-role-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :inline="true">
					<el-form-item label="角色名称">
						<el-input size="default" v-model="tableData.param.name" placeholder="请输入角色名称" class="w-50" clearable />
					</el-form-item>
					<el-form-item label="状态">
						<el-select size="default" placeholder="请选择状态" class="w-50" v-model="tableData.param.status">
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
						<el-button size="default" type="success" class="ml10" @click="onOpenAddRole" v-auth="'add'">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增角色
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="tableData.data" style="width: 100%" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" v-loading="tableData.loading">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="name" v-col="'name'" label="角色名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" v-col="'remark'" label="角色描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="listOrder" v-col="'listOrder'" label="排序" width="60" align="center"></el-table-column>
				<el-table-column prop="status" v-col="'status'" label="角色状态" width="100" align="center">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status === 1">启用</el-tag>
						<el-tag type="info" size="small" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createdAt" v-col="'createdAt'" label="创建时间" width="170" align="center"></el-table-column>
				<el-table-column label="操作" width="220" v-col="'handle'" align="center" fixed="right">
					<template #default="scope">
						<el-button size="small" type="text" @click="onOpenEditRole(scope.row)" v-auth="'edit'">修改</el-button>
						<el-button size="small" text type="danger" @click="onRowDel(scope.row)" v-auth="'del'">删除</el-button>
						<el-button size="small" text type="success" @click="permission(scope.row)" v-auth="'role-premission'">角色权限</el-button>
						<el-button size="small" text type="info" @click="dataPermission(scope.row)" v-auth="'data-premission'">数据权限</el-button>
						<!-- <el-dropdown size="small">
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
            </el-dropdown> -->
					</template>
				</el-table-column>
			</el-table>
			<!-- <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="roleList" /> -->
		</el-card>
		<EditRole ref="editRoleRef" @getList="roleList" :list="tableData.data" />
		<permissionVue ref="permissionRef" />
		<EditPer ref="dataPermissionRef" :dept-data="deptData" />
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, toRaw, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditRole from './component/editRole.vue';
import EditPer from './component/editPer.vue';
import permissionVue from './component/permission.vue';
import api from '/@/api/system';
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
	deptData: any[];
	tableData: {
		data: Array<TableData>;
		// total: number;
		loading: boolean;
		param: {
			name: string;
			status: number;
		};
	};
}

export default defineComponent({
	name: 'apiV1SystemRoleList',
	components: { EditRole, permissionVue, EditPer },
	setup() {
		const { proxy } = getCurrentInstance() as any;
		const addRoleRef = ref();
		const editRoleRef = ref();
		const permissionRef = ref();
		const dataPermissionRef = ref();
		const state = reactive<TableDataState>({
			deptData: [],
			tableData: {
				data: [],
				// total: 0,
				loading: false,
				param: {
					name: '',
					status: -1,
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			roleList();
			api.dept
				.getList({
					status: 1,
				})
				.then((res: any) => {
					state.deptData = res;
				});
		};
		const roleList = () => {
			state.tableData.loading = true;
			api.role
				.getList(state.tableData.param)
				.then((res: Array<TableData>) => {
					state.tableData.data = res || [];
				})
				.finally(() => (state.tableData.loading = false));
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
			}).then(() => {
				api.role.deleteRole(row.id).then(() => {
					ElMessage.success('删除成功');
					proxy.$refs['editRoleRef'].resetMenuSession();
					roleList();
				});
			});
		};

		// 设置权限
		const permission = async (row: any) => {
			const { isAllow } = await api.role.auth.isAllow(row.id);
			if (isAllow) {
				permissionRef.value.openDialog(row);
			} else {
				ElMessage.error('该角色禁止被授权');
			}
		};
		// 设置数据权限
		const dataPermission = async (row: any) => {
			dataPermissionRef.value.openDialog(row);
		};

		// 页面加载时
		onMounted(() => {
			initTableData();
		});

		return {
			addRoleRef,
			editRoleRef,
			permissionRef,
			dataPermissionRef,
			dataPermission,
			permission,
			onOpenAddRole,
			onOpenEditRole,
			onRowDel,
			roleList,
			...toRefs(state),
		};
	},
});
</script>
