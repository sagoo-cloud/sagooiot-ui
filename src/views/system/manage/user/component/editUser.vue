<template>
	<div class="system-edit-user-container">
		<el-dialog :title="(ruleForm.id ? '修改' : '添加') + '用户'" v-model="isShowDialog" width="769px">
			<el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="!ruleForm.id">
						<el-form-item label="用户名" prop="userName">
							<el-input v-model="ruleForm.userName" placeholder="请输入账户名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="!ruleForm.id">
						<el-form-item label="账户密码" prop="userPassword">
							<el-input v-model="ruleForm.userPassword" placeholder="请输入" type="password" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户昵称" prop="userNickname">
							<el-input v-model="ruleForm.userNickname" placeholder="请输入用户昵称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="关联角色" prop="roleIds">
							<el-cascader :options="roleData" :props="{ checkStrictly: true, multiple: true, emitPath: false, value: 'id', label: 'name' }" placeholder="请选择角色" clearable class="w100" v-model="ruleForm.roleIds">
								<template #default="{ node, data }">
									<span>{{ data.name }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门" prop="deptId">
							<el-cascader :options="deptData" :props="{ checkStrictly: true, emitPath: false, value: 'deptId', label: 'deptName' }" placeholder="请选择部门" clearable class="w100" v-model="ruleForm.deptId">
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号" prop="mobile">
							<el-input v-model="ruleForm.mobile" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱" prop="userEmail">
							<el-input v-model="ruleForm.userEmail" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="性别" prop="sex">
							<el-select v-model="ruleForm.sex" placeholder="请选择" clearable class="w100">
								<el-option label="保密" :value="0" />
								<el-option label="男" :value="1" />
								<el-option label="女" :value="2" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="岗位" prop="postIds">
							<el-cascader :options="postData" :props="{ checkStrictly: true, multiple: true, emitPath: false, value: 'postId', label: 'postName' }" placeholder="请选择部门" clearable class="w100" v-model="ruleForm.postIds">
								<template #default="{ node, data }">
									<span>{{ data.postName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户状态">
							<el-switch v-model="ruleForm.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="用户类型">
							<el-radio-group v-model="ruleForm.isAdmin">
								<el-radio :label="1">后台管理员</el-radio>
								<el-radio :label="0">前台用户</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="用户描述">
							<el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent, ref, unref } from 'vue';
import api from '/@/api/system';
import { ElMessage } from 'element-plus';

interface DialogRow {
	id?: number;
	userName: string; // 用户名
	userNickname: string; // 用户昵称
	deptId: number | null; // 部门id
	mobile: string; // 中国手机不带国家代码，国际手机号格式为：国家代码-手机号
	roleIds: number[]; // 角色ID数组
	postIds: number[]; // 岗位ID数组
	userTypes: 'system' | 'company'; // 系统 system 企业 company
	birthday?: string; // 用户昵称
	userPassword?: string; // 登录密码
	userEmail?: string; // 用户登录邮箱
	remark?: string; // 备注
	avatar?: string; // 用户头像
	address?: string; // 联系地址
	describe?: string; // 描述信息
	sex?: 0 | 1 | 2; // 性别;0:保密,1:男,2:女
	status: -1 | 0 | 1 | 2; // 用户状态;0:禁用,1:正常,2:未验证
	isAdmin: 0 | 1; // 是否后台管理员 1 是 0 否
}

const baseForm: DialogRow = {
	userName: '',
	userNickname: '',
	deptId: null,
	mobile: '',
	birthday: '',
	userPassword: '',
	userEmail: '',
	avatar: '',
	address: '',
	describe: '',
	remark: '',
	sex: 0,
	isAdmin: 1,
	status: 1,
	postIds: [],
	roleIds: [],
	userTypes: 'system',
};

export default defineComponent({
	name: 'systemEditUser',
	props: {
		deptData: {
			type: Array,
			default: () => [],
		},
		roleData: {
			type: Array,
			default: () => [],
		},
		postData: {
			type: Array,
			default: () => [],
		},
	},
	setup(prop, { emit }) {
		const postList = ref([]);
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				...baseForm,
			},
			//表单校验
			rules: {
				userName: [{ required: true, message: '用户名称不能为空', trigger: 'blur' }],
				userNickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
				deptId: [{ required: true, message: '归属部门不能为空', trigger: 'blur' }],
				postIds: [{ required: true, message: '岗位不能为空', trigger: 'blur' }],
				roleIds: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
				mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }],
				password: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
				userEmail: [
					{
						type: 'email',
						message: "'请输入正确的邮箱地址",
						trigger: ['blur', 'change'],
					},
				],
			},
		});
		// 打开弹窗
		const openDialog = (row?: any) => {
			resetForm();
			if (row) {
				api.user.detail(row.id).then((user: any) => {
					state.ruleForm = user;
				});
			}
			state.isShowDialog = true;
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		// 新增
		const onSubmit = () => {
			const formWrap = unref(formRef) as any;
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					if (!state.ruleForm.id) {
						//添加
						api.user.add(state.ruleForm).then(() => {
							ElMessage.success('用户添加成功');
							closeDialog(); // 关闭弹窗
							emit('getUserList');
						});
					} else {
						//修改
						api.user.edit(state.ruleForm).then(() => {
							ElMessage.success('用户修改成功');
							closeDialog(); // 关闭弹窗
							emit('getUserList');
						});
					}
				}
			});
		};
		// 初始化部门数据
		const initTableData = () => {
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		const resetForm = () => {
			state.ruleForm = {
				...baseForm,
			};
		};
		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			postList,
			formRef,
			...toRefs(state),
		};
	},
});
</script>
