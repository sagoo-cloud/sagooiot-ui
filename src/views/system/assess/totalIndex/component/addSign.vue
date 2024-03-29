<template>
	<div class="add-or-edit-assess">
		<el-dialog :title="isEdit?'编辑标识项':'新建标识项'" v-model="isShowDialog" width="569px">
			<el-form class="add-flag-container" ref="ruleTagRef" :rules="rules" :model="ruleForm" label-width="100px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="标识" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入标识" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="数据项名称" prop="title">
							<el-input v-model="ruleForm.title" placeholder="请输入数据项名称" clearable></el-input>
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
							<el-input size="small" v-model.number="item.start_value" placeholder="请输入最小值" clearable></el-input>
							<span> ～ </span>
							<el-input size="small" v-model.number="item.end_value" placeholder="请输入最大值" clearable></el-input>
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
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleTagRef)">保 存</el-button>
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
}

export default defineComponent({
	name: 'AddOrEditAssess',
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
				{ required: true, message: '请输入数据项名称', trigger: 'blur' },
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
		// 保存数据
		const onSubmit = async (formEl: FormInstance | undefined) => {
			if (!formEl) return
			await formEl.validate((valid) => {
				if (valid) {
					if(state.ruleForm.ranges.length) {
						let item = state.ruleForm.ranges[state.ruleForm.ranges.length-1]
						const { start_value, end_value, base_value } = item
						if(!start_value || !end_value || !base_value.toString()) {
							ElMessage.error('取值范围不能为空');
							return
						}
						if(start_value >= end_value) {
							ElMessage.error('最大值最小值范围设置错误');
							return
						}
					}
					emit('handleChange', state.ruleForm, state.index, state.isEdit)
					closeDialog();
				}
			})
		}
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
			if(start_value >= end_value) {
				ElMessage.error('最大值最小值范围设置错误');
				return
			}
			state.ruleForm.ranges.push({
				start_value: '',
				end_value: '',
				base_value: ''
			})
		};
		const deleteRange = (index: number) => {
			state.ruleForm.ranges.splice(index, 1);
		};
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
:deep(.has-symbol) > .el-form-item__content {
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
			:deep(.el-input) {
				width: 100px;
				height: 28px;
			}
		}
	}
}
:deep(.el-dialog__body) {
	border-top: 1px var(--el-border-color) var(--el-border-style);
}
</style>
