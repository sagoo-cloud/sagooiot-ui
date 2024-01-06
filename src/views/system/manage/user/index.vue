<template>
	<div class="page flex-row gap-4">
		<el-card shadow="nover" style="width:270px">
			<el-scrollbar>
				<el-input :prefix-icon="search" v-model="filterText" placeholder="请输入组织名称" clearable style="width: 100%;" />
				<el-tree ref="treeRef" class="filter-tree mt-4" :data="deptData" :props="deptProps" default-expand-all :filter-node-method="deptFilterNode" @node-click="handleNodeClick">
					<template #default="{ node, data }">
						<div class="custom-tree-node" :title="node.label">
							{{ node.label }}
						</div>
					</template>
				</el-tree>
			</el-scrollbar>
		</el-card>
		<el-card shadow="nover" class="flex1">
			<el-form :model="tableData.param" ref="queryRef" inline label-width="68px">
				<el-form-item label="关键字" prop="keyWords">
					<el-input v-model="tableData.param.keyWords" placeholder="请输入用户名或姓名" clearable style="width: 240px" @keyup.enter.native="userList" />
				</el-form-item>
				<!--							<el-form-item label="手机号码" prop="mobile">-->
				<!--								<el-input v-model="tableData.param.mobile" placeholder="请输入手机号码" clearable style="width: 240px" @keyup.enter.native="userList" />-->
				<!--							</el-form-item>-->
				<el-form-item label="状态" prop="status" style="width: 200px;">
					<el-select v-model="tableData.param.status" placeholder="用户状态" style="width: 240px">
						<el-option label="全部" :value="-1" />
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="0" />
						<!-- <el-option label="未验证" :value="2" /> -->
					</el-select>
				</el-form-item>
				<el-form-item label="创建时间" prop="dateRange">
					<el-date-picker v-model="tableData.param.dateRange" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" class="ml10" @click="userList">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
					<el-button @click="resetQuery(queryRef)">
						<el-icon>
							<ele-Refresh />
						</el-icon>
						重置
					</el-button>
					<el-button type="primary" class="ml10" @click="onOpenAddUser" v-auth="'add'">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增用户
					</el-button>
					<!-- <el-button type="info" class="ml10" @click="onRowDel(null)">
									<el-icon>
										<ele-Delete />
									</el-icon>
									删除用户
								</el-button> -->
				</el-form-item>
			</el-form>
			<el-table :data="tableData.data" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
				<!-- <el-table-column type="selection" width="55" align="center" /> -->
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="userName" label="用户名" v-col="'userName'" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userNickname" label="姓名" v-col="'userNickname'" width="160" show-overflow-tooltip></el-table-column>
				<el-table-column prop="dept.deptName" label="组织" v-col="'deptName'" show-overflow-tooltip></el-table-column>
				<el-table-column label="角色" min-width="120" prop="rolesNames" v-col="'rolesNames'" show-overflow-tooltip></el-table-column>
				<el-table-column prop="mobile" label="手机号" v-col="'mobile'" width="120" align="center"></el-table-column>
				<el-table-column prop="status" label="用户状态" width="120" v-col="'status'" align="center">
					<template #default="scope">
						<el-switch v-model="scope.row.status" :disabled="scope.row.id === 1" v-auth="'change-status'" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁" @change="handleStatusChange(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column prop="createdAt" label="创建时间" width="180" v-col="'createdAt'" align="center"></el-table-column>
				<el-table-column label="操作" width="180" align="center" v-col="'handle'" fixed="right">
					<template #default="scope">
						<!-- <el-button size="small" text type="warning" @click="onOpenEditUser(scope.row)" v-auths="['edit','del']">修改</el-button>
                <el-button size="small" text type="warning" @click="onOpenEditUser(scope.row)" v-auth-all="['edit','del']">修改</el-button> -->
						<el-button size="small" text type="warning" @click="onOpenEditUser(scope.row)" v-auth="'edit'">修改</el-button>
						<el-button size="small" text type="info" @click="onRowDel(scope.row)" v-if="scope.row.id !== 1" v-auth="'del'">删除</el-button>
						<el-button size="small" text type="success" @click="handleResetPwd(scope.row)" v-auth="'reset'">重置</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="userList" />

			<EditUser ref="editUserRef" :dept-data="deptData" :post-data="postData" :role-data="roleData" @getUserList="userList" />
			<EditPer ref="editPerRef" @getUserList="userList" />
		</el-card>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, watch } from 'vue';
import { ElMessageBox, ElMessage, ElTree, FormInstance } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import EditUser from './component/editUser.vue';
import api from '/@/api/system';
import useCommon from '/@/hooks/useCommon';
import { encrypt } from '/@/utils/rsa'

interface Tree {
	id: number;
	label: string;
	children?: Tree[];
}

interface TableDataState {
	ids: number[];
	loading: boolean;
	deptProps: {};
	deptData: any[];
	roleData: any[];
	postData: any[];
	tableData: {
		data: any[];
		total: number;
		param: {
			pageNum: number;
			pageSize: number;
			status: number;
			deptId: string;
			keyWords: string;
			mobile: string;
			userNickname: string;
			userName: string;
			dateRange: string[];
		};
	};
}

export default defineComponent({
	name: 'systemUser',
	components: { EditUser },
	setup() {
		const editUserRef = ref();
		const queryRef = ref();
		const filterText = ref('');
		const treeRef = ref<InstanceType<typeof ElTree>>();
		const search = Search;
		const { statusParams } = useCommon();
		const state = reactive<TableDataState>({
			loading: false,
			ids: [],
			deptProps: {
				id: 'deptId',
				children: 'children',
				label: 'deptName',
			},
			deptData: [],
			postData: [],
			roleData: [],
			tableData: {
				data: [],
				total: 0,
				param: {
					status: -1,
					pageNum: 1,
					pageSize: 10,
					deptId: '',
					userNickname: '',
					userName: '',
					keyWords: '',
					mobile: '',
					dateRange: [],
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			api.dept.getList(statusParams).then((res: any) => {
				state.deptData = res;
			});
			api.post.getList(statusParams).then((res: any) => {
				state.postData = res;
			});
			api.role.getList(statusParams).then((res: any) => {
				state.roleData = res;
			});
			userList();
		};
		const userList = () => {
			state.loading = true;
			api.user
				.getList(state.tableData.param)
				.then((res: any) => {
					state.tableData.data = res.list;
					state.tableData.total = res.total;
				})
				.finally(() => {
					state.loading = false;
				});
		};
		// 打开新增用户弹窗
		const onOpenAddUser = () => {
			editUserRef.value.openDialog();
		};
		// 打开修改用户弹窗
		const onOpenEditUser = (row: any) => {
			editUserRef.value.openDialog(row);
		};
		// 删除用户
		const onRowDel = (row: any) => {
			let msg = '你确定要删除所选用户？';
			// let ids: number[] = [];
			// if (row) {
			msg = `此操作将永久删除用户：“${row.userName}”，是否继续?`;
			// 	ids = [row.id];
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
					api.user.del(row.id).then(() => {
						ElMessage.success('删除成功');
						userList();
					});
				})
				.catch(() => { });
		};
		// 分页改变
		const onHandleSizeChange = (val: number) => {
			state.tableData.param.pageSize = val;
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.tableData.param.pageNum = val;
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		watch(filterText, (val) => {
			treeRef.value!.filter(val);
		});
		const deptFilterNode = (value: string, data: any) => {
			if (!value) return true;
			return data.deptName.includes(value);
		};
		// 多选框选中数据
		const handleSelectionChange = (selection: any[]) => {
			state.ids = selection.map((item) => item.id);
		};
		// 节点单击事件
		const handleNodeClick = (data: any) => {
			state.tableData.param.deptId = data.deptId;
			userList();
		};
		/** 重置密码按钮操作 */
		const handleResetPwd = (row: any) => {
			ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			})
				.then(async ({ value }) => {
					if (!value || value == '') {
						ElMessage.success('密码不能为空');
						return;
					}

					let password: string
					if (sessionStorage.isRsaEnabled) {
						password = await encrypt(value)
					} else {
						password = value
					}

					api.user.resetPassword(row.id, password).then(() => {
						ElMessage.success('修改成功，新密码是：' + value);
					});
				})
				.catch(() => { });
		};
		// 用户状态修改
		const handleStatusChange = (row: any) => {
			let text = row.status === 1 ? '启用' : '停用';
			ElMessageBox.confirm('确认要"' + text + '"："' + row.userName + '"用户吗?', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(function () {
					return api.user.setStatus(row.id, row.status);
				})
				.then(() => {
					ElMessage.success(text + '成功');
				})
				.catch(function () {
					row.status = row.status === 0 ? 1 : 0;
				});
		};
		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			userList();
		};
		return {
			queryRef,
			editUserRef,
			onOpenAddUser,
			onOpenEditUser,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
			deptFilterNode,
			filterText,
			treeRef,
			search,
			userList,
			handleSelectionChange,
			handleNodeClick,
			handleResetPwd,
			handleStatusChange,
			resetQuery,
			...toRefs(state),
		};
	},
});
</script>
