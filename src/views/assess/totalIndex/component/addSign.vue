<template>
	<div class="system-add-user-container">
		<el-dialog title="新建标识项" v-model="isShowDialog" width="569px">
			<el-form :model="ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="标识" required>
							<el-input v-model="ruleForm.userName" placeholder="请输入标识" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="名称" required>
							<el-input v-model="ruleForm.phone" placeholder="请输入名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item class="has-symbol" label="权重" required>
							<el-input v-model="ruleForm.email" placeholder="请输入权重" clearable></el-input>
							<span class="symbol">%</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<!-- 添加取值范围 -->
			<div class="add-value-range">
				<div class="header">
					<p>添加取值范围</p>
					<el-button @click="addRange" size="small" plain type="primary">添加</el-button>

				</div>
				<div class="add-value-range-wrap">
					<section class="add-value-range-item" v-for="(item, index) in ruleForm.list" :key="index">
						<div class="left-wrap">
							<span class="symbol">*</span>
							<span class="label">取值范围</span>
							<el-input size="small" v-model="item.minVal" placeholder="请输入最小值" clearable></el-input>
							<span> ～ </span>
							<el-input size="small" v-model="item.maxVal" placeholder="请输入最大值" clearable></el-input>
						</div>
						<div class="right-wrap">
							<span class="symbol">*</span>
							<span class="label">得分</span>
							<el-input size="small" v-model="item.score" placeholder="请输入得分" clearable></el-input>
						</div>
						<el-button @click="deleteRange(index)" size="small" type="danger">删除</el-button>

					</section>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">保 存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent } from 'vue';
import { ElMessage } from 'element-plus';

// 定义接口来定义对象的类型
interface DeptData {
	deptName: string;
	createTime: string;
	status: boolean;
	sort: number | string;
	describe: string;
	id: number;
	children?: DeptData[];
}
interface RangeData {
	minVal: number | string;
	maxVal: number | string;
	score: number | string;
}
interface UserState {
	isShowDialog: boolean;
	ruleForm: {
		userName: string;
		userNickname: string;
		roleSign: string;
		department: any;
		phone: string;
		email: string;
		sex: string;
		password: string;
		overdueTime: string;
		status: boolean;
		describe: string;
		list: Array<RangeData>;
	};
	deptData: Array<DeptData>;
}

export default defineComponent({
	name: 'systemAddUser',
	setup() {
		const state = reactive<UserState>({
			isShowDialog: false,
			ruleForm: {
				userName: '', // 账户名称
				userNickname: '', // 用户昵称
				roleSign: '', // 关联角色
				department: [], // 部门
				phone: '', // 手机号
				email: '', // 邮箱
				sex: '', // 性别
				password: '', // 账户密码
				overdueTime: '', // 账户过期
				status: true, // 用户状态
				describe: '', // 用户描述
				list: []
			},
			deptData: [], // 部门数据
		});
		// 打开弹窗
		const openDialog = () => {
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
			closeDialog();
		};
		// 初始化部门数据
		const initTableData = () => {
			state.deptData.push({
				deptName: 'vueNextAdmin',
				createTime: new Date().toLocaleString(),
				status: true,
				sort: Math.random(),
				describe: '顶级部门',
				id: Math.random(),
				children: [
					{
						deptName: 'IT外包服务',
						createTime: new Date().toLocaleString(),
						status: true,
						sort: Math.random(),
						describe: '总部',
						id: Math.random(),
					},
					{
						deptName: '资本控股',
						createTime: new Date().toLocaleString(),
						status: true,
						sort: Math.random(),
						describe: '分部',
						id: Math.random(),
					},
				],
			});
			state.ruleForm.list = [{
				minVal: 10,
				maxVal: 100,
				score: 90
			}]
		};
		const addRange = () => {
			if(!state.ruleForm.list.length) {
				state.ruleForm.list.push({
					minVal: '',
					maxVal: '',
					score: ''
				})
				return
			}
			let item = state.ruleForm.list[state.ruleForm.list.length-1]
			const { minVal, maxVal, score } = item
			if(!minVal || !maxVal || !score.toString()) {
				ElMessage.error('请完善表单');
				return 
			}
			state.ruleForm.list.push({
				minVal: '',
				maxVal: '',
				score: ''
			})
		};
		const deleteRange = (index: number) => {
			console.log(index)
			state.ruleForm.list.splice(index, 1)
			// const { minVal, maxVal, score } = item
			// if(!minVal || !maxVal || !score.toString()) {
			// 	ElMessage.error('请完善表单');
			// 	return 
			// }
			// state.ruleForm.list.push({
			// 	minVal: '',
			// 	maxVal: '',
			// 	score: ''
			// })
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			openDialog,
			closeDialog,
			addRange,
			deleteRange,
			onCancel,
			onSubmit,
			...toRefs(state),
		};
	},
});
</script>

<style lang="scss" scoped>
::v-deep .has-symbol > .el-form-item__content {
	position: relative;
	.symbol {
		position: absolute;
		right: 8px;
	}
}
.el-form {
	border-bottom: 1px solid var(--el-border-color);
}
.add-value-range {
	// background-color: pink;
	padding: 10px 0;
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	.add-value-range-wrap {
		display: flex;
		flex-direction: column;
		.add-value-range-item {
			display: flex;
			justify-content: space-between;
				align-content: center;
				padding-top: 2px;
			.left-wrap,
			.right-wrap {
				display: flex;
				justify-content: center;
				align-content: center;
				height: 32px;
				line-height: 28px;
				.symbol {
					content: "*";
					color: var(--el-color-danger);
					margin-right: 4px;
				}
				.label {
					margin-right: 4px;
				}

			}
			::v-deep .el-input {
				width: 100px;
				height: 28px;
			}
		}
	}
}
::v-deep  .el-dialog__body {
	border-top: 1px var(--el-border-color) var(--el-border-style);
}
</style>
