<template>
	<div class="system-edit-dic-container">
		<el-dialog title="设置配置信息" v-model="isShowDialog" width="65%">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="110px">
				<div style="display: flex; justify-content: space-between">
					<div style="width: 50%; padding: 10px">
						<div>配置内容</div>
						<el-input v-model="ruleForm.value" type="textarea" placeholder="配置内容，一行一条" style="min-height:420px"></el-input>
					</div>
					<div style="width: 50%; padding: 10px">
						<div>配置说明</div>
						<div><Editor :is-disable="false" v-model="ruleForm.doc" /></div>
					</div>
				</div>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit">{{ ruleForm.id !== 0 ? '设 置' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/notice';
import Editor from '/@/components/editor/index.vue';

import { ElMessage } from 'element-plus';
import { Delete, Plus, CircleClose, Top, Bottom, Minus, Right } from '@element-plus/icons-vue';

interface RuleFormState {
	id: number;
	name: string;
	type: string;
	value: string;
	doc: string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: {};
	configData: {};
	id: number;
	type_name: string;
}

export default defineComponent({
	name: 'Edit',
	components: { Delete, Plus, CircleClose, Minus, Right, Top, Bottom, Editor },

	setup(prop, { emit }) {
		const myRef = ref<HTMLElement | null>(null);
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			id: 0,
			configData: [],
			type_name: '',
			isShowDialog: false,
			ruleForm: {
				id: 0,
				name: '',
				type: 'notice',
				value: '',
				doc: '',
			},
			rules: {
				value: [{ required: true, message: '配置内容不能为空', trigger: 'blur' }],
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			if (row) {
				state.type_name = row.value;

				api.config.getbyname({ name: row.value, type: 'notice' }).then((res: any) => {
					state.ruleForm = res || [];
				});
			}

			state.isShowDialog = true;
		};

		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				name: '',
				type: 'notice',
				value: '',
				doc: '',
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
					state.ruleForm.name = state.type_name;
					state.ruleForm.type = 'notice';
					api.config.save(state.ruleForm).then(() => {
						ElMessage.success('插件设置成功');
						closeDialog(); // 关闭弹窗
						emit('dataList');
					});
				}
			});
		};

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			formRef,
			myRef,
			...toRefs(state),
		};
	},
});
</script>
<style>
.el-textarea__inner{
	min-height: 420px !important;
}
.inline {
	display: inline-flex;
}
.el-input__wrapper {
	width: 98%;
}

.box-content {
	border: 1px solid #e8e8e8;
	margin: 10px;
	padding: 10px;
}

.content-f {
	display: flex;
	margin-bottom: 10px;
}
.content-f .el-input__wrapper {
	margin-right: 5px;
}
.addbutton {
	width: 100%;
	margin-top: 10px;
	background: #fff;
	border: 1px solid #d1d1d1;
	color: #8d8b8b;
}
.conicon {
	width: 55px;
	height: 25px;

	font-size: 28px;
	line-height: 28px;
	cursor: pointer;
}
.jv-node {
	margin-left: 25px;
}
</style>
