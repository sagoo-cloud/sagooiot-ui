<template>
	<div class="system-edit-dic-container">
		<el-dialog title="告警处理" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="处理状态" prop="status">
					<el-radio-group v-model="ruleForm.status">
						<el-radio :label="1">已处理</el-radio>
						<el-radio :label="2">忽略</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="处理意见" prop="content">
					<el-input v-model="ruleForm.content" type="textarea" placeholder="请输入内容"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/alarm';
import { ElMessage } from 'element-plus';


interface RuleFormState {
	id?: number;
	status: number;
	content: string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: {};
}

export default defineComponent({
	name: 'Edit',

	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			ruleForm: {
				status: 1,
				content: '',
			},
			rules: {
				status: [{ required: true, message: '处理状态不能为空', trigger: 'blur' }],
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();
			api.log.detail(row.id).then((res: any) => {
				state.ruleForm.id = res.data.id;
			});

			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				status: 1,
				content: '',
			};
		};

		const onSubmit = () => {
			const formWrap = unref(formRef) as any;
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					api.log.handle(state.ruleForm).then(() => {
						ElMessage.success('告警处理成功');
						closeDialog(); // 关闭弹窗
						emit('dataList');
					});
				}
			});
		};

		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			formRef,
			...toRefs(state),
		};
	},
});
</script>

