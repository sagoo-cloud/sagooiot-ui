<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '配置'" v-model="isShowDialog" width="50%">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="110px">
				<el-form-item label="名称" prop="title">
					<el-input v-model.trim="ruleForm.title" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item label="通知类型" prop="types">
					<el-radio-group v-model="ruleForm.types">
						<el-radio label="1"  value="1">即时发送</el-radio>
						<el-radio label="2" value="2">预约发送</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/notice';


import { ElMessage } from 'element-plus';
import { Delete, Plus, CircleClose, Top, Bottom, Minus, Right } from '@element-plus/icons-vue';

interface RuleFormState {
	id: number;
	name: string;
	type: string;
	sendGateway:string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: {};

}

export default defineComponent({
	name: 'Edit',
	components: { Delete, Plus, CircleClose, Minus, Right, Top, Bottom },

	setup(prop, { emit }) {
		const myRef = ref<HTMLElement | null>(null);
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			id: 0,
			isShowDialog: false,
		
			
			ruleForm: {
				id: 0,
				title: '',
				types: "1",
				sendGateway:'',
				
			},
			rules: {
				title: [{ required: true, message: '配置名称不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '配置类型不能为空', trigger: 'blur' }],
				
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null,type) => {
			resetForm();
			if (row) {
				state.ruleForm = row;
			}
			state.ruleForm.sendGateway=type
			state.isShowDialog = true;
		};

		

		const resetForm = () => {
		
			state.ruleForm = {
				id: 0,
				title: '',
				types: "1",
				sendGateway:'',
			
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
						
						api.config.edit(state.ruleForm).then(() => {
							ElMessage.success('配置修改成功');
							closeDialog(); // 关闭弹窗
							emit('dataList');
						});
					} else {
						//添加
						api.config.add(state.ruleForm).then(() => {
							ElMessage.success('配置添加成功');
							closeDialog(); // 关闭弹窗
							emit('dataList');
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
			myRef,
			...toRefs(state),
		};
	},
});
</script>
<style>
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
