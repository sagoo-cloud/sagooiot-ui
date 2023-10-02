<template>
	<div class="system-add-flag-container">
		<el-dialog :title="isEdit?'编辑标识项':'新建标识项'" v-model="isShowDialog" width="569px">
			<el-form class="add-flag-container" ref="ruleTagRef" :rules="rules" :model="ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="标识" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入标识" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="名称" prop="title">
							<el-input v-model="ruleForm.title" placeholder="请输入名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item class="has-symbol" label="权重" prop="weight">
							<el-input v-model.number="ruleForm.weight" placeholder="请输入权重" clearable></el-input>
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
					<section class="add-value-range-item" v-for="(item, index) in ruleForm.ranges" :key="index">
						<div class="left-wrap">
							<span class="symbol">*</span>
							<span class="label">取值范围</span>
							<el-input size="small" v-model="item.start_value" placeholder="请输入最小值" clearable></el-input>
							<span> ～ </span>
							<el-input size="small" v-model="item.end_value" placeholder="请输入最大值" clearable></el-input>
						</div>
						<div class="right-wrap">
							<span class="symbol">*</span>
							<span class="label">得分</span>
							<el-input size="small" v-model.number="item.base_value" placeholder="请输入得分" clearable></el-input>
						</div>
						<el-button @click="deleteRange(index)" size="small" type="danger">删除</el-button>

					</section>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleTagRef)" size="default">保 存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';

// 定义接口来定义对象的类型
interface DeptData {
	start_value: string;
	end_value: string;
	base_value: string;
}
// interface RangeData {
// 	minVal: number | string;
// 	maxVal: number | string;
// 	score: number | string;
// }
interface UserState {
	isShowDialog: boolean;
	ruleForm: {
		name: string;
		title: string;
		weight: string;
		ranges: Array<DeptData>;
	};
	index: any;
	isEdit: Boolean;
	// deptData: Array<DeptData>;
}

export default defineComponent({
	name: 'systemAddUser',
	setup(prop, { emit }) {
		const state = reactive<UserState>({
			isShowDialog: false,
			ruleForm: {
				name: '', // 标识
				title: '', // 名称
				weight: '', // 权重
				ranges: []
			},
			index: null,
			isEdit: false
		});
		const ruleTagRef = ref<FormInstance>()
		const rules = reactive<FormRules>({
			name: [
				{ required: true, message: '请输入标识', trigger: 'blur' },
			],
			title: [
				{ required: true, message: '请输入名称', trigger: 'blur' },
			],
			weight: [
				{ required: true, message: '请输入权重', trigger: 'blur' },
			]
		});
		// 打开弹窗
		const openDialog = (row:any, index: any, isEdit: Boolean) => {

			if(!isEdit) {
				state.ruleForm = {
					name: '', // 标识
					title: '', // 名称
					weight: '', // 权重
					ranges: []
				}
			}
			if(row) {
				state.ruleForm = row
			}
			state.index = index
			state.isEdit = isEdit
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
		// // 新增
		// const onSubmit = () => {


		// };
		// 保存数据
		const onSubmit = async (formEl: FormInstance | undefined) => {
			if (!formEl) return
			await formEl.validate((valid) => {
				if (valid) {
					if(state.ruleForm.ranges.length) {
						let item = state.ruleForm.ranges[state.ruleForm.ranges.length-1]
						const { start_value, end_value, base_value } = item
						if(!start_value || !end_value || !base_value.toString()) {
							ElMessage.error('请完善表单');
							return
						}
					}
					emit('handleChange', state.ruleForm, state.index, state.isEdit)
					closeDialog();
				}
			})
		}
		// 初始化组织数据
		// const initTableData = () => {
		// 	state.deptData.push({
		// 		deptName: 'vueNextAdmin',
		// 		createTime: new Date().toLocaleString(),
		// 		status: true,
		// 		sort: Math.random(),
		// 		describe: '顶级组织',
		// 		id: Math.random(),
		// 		children: [
		// 			{
		// 				deptName: 'IT外包服务',
		// 				createTime: new Date().toLocaleString(),
		// 				status: true,
		// 				sort: Math.random(),
		// 				describe: '总部',
		// 				id: Math.random(),
		// 			},
		// 			{
		// 				deptName: '资本控股',
		// 				createTime: new Date().toLocaleString(),
		// 				status: true,
		// 				sort: Math.random(),
		// 				describe: '分部',
		// 				id: Math.random(),
		// 			},
		// 		],
		// 	});
		// 	state.ruleForm.list = [{
		// 		minVal: 10,
		// 		maxVal: 100,
		// 		score: 90
		// 	}]
		// };
		const addRange = () => {
			if(!state.ruleForm.ranges.length) {
				state.ruleForm.ranges.push({
					start_value: '',
					end_value: '',
					base_value: ''
				})
				return
			}
			let item = state.ruleForm.ranges[state.ruleForm.ranges.length-1]
			const { start_value, end_value, base_value } = item
			if(!start_value || !end_value || !base_value.toString()) {
				ElMessage.error('请完善表单');
				return
			}
			state.ruleForm.ranges.push({
				start_value: '',
				end_value: '',
				base_value: ''
			})
		};
		const deleteRange = (index: number) => {
			state.ruleForm.ranges.splice(index, 1)
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
			// initTableData();
		});
		return {
			rules,
			ruleTagRef,
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
