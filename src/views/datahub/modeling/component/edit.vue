<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '模型'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="模型标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入模型名称" />
				</el-form-item>
				<el-form-item label="模型名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入模型名称" />
				</el-form-item>

				<el-form-item label="描述" prop="description">
					<el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入内容"></el-input>
				</el-form-item>

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
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/datahub';
import { ElMessage } from 'element-plus';

interface RuleFormState {
	id?: number;
	name: string;
	key: string;
	desc: string;
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
				id: 0,
				name: '',
				key: '',
				
				desc: '',
			},
			rules: {
				key: [{ required: true, message: '模型标识不能为空', trigger: 'blur' }],
				name: [{ required: true, message: '模型名称不能为空', trigger: 'blur' }],
			
			},
		});
		
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();

			if (row) {
				state.ruleForm = row
			}
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				name: '',
				key: '',
				
				desc: '',
			};
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
	

					if (state.ruleForm.id !== 0) {
						//修改
						api.template.edit(state.ruleForm).then(() => {
							ElMessage.success('模型类型修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					} else {
						//添加

						api.template.add(state.ruleForm).then(() => {
							ElMessage.success('模型类型添加成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					}
				}
			});
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

