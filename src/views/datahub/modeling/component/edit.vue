<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.sourceId !== 0 ? '修改' : '添加') + '自建表'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="自建表标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入自建表名称" />
				</el-form-item>
				<el-form-item label="自建表名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入自建表名称" />
				</el-form-item>

				<el-form-item label="描述" prop="description">
					<el-input v-model="ruleForm.description" type="textarea" placeholder="请输入内容"></el-input>
				</el-form-item>

			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.sourceId !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/datahub';
import { ElMessage } from 'element-plus';
import { Delete, Minus, Right } from '@element-plus/icons-vue';

interface RuleFormState {
	id: number;
	name: string;
	key: string;
	description: string;
	status: number;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: {};
}

export default defineComponent({
	name: 'Edit',
	components: { Delete, Minus, Right },

	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			
			isShowDialog: false,
			

			ruleForm: {
				sourceId: 0,
				name: '',
				from: 1,
				key: '',
				rule: [],
				config: {
					method: '',
					url: '',
					interval: '',
					intervalUnit: '',
					requestParams: [],
				},
				description: '',
			},
			rules: {
				key: [{ required: true, message: '自建表标识不能为空', trigger: 'blur' }],
				name: [{ required: true, message: '自建表名称不能为空', trigger: 'blur' }],
				from: [{ required: true, message: '自建表类型不能为空', trigger: 'blur' }],
			
			},
		});
		const delParams = (index) => {
			state.requestParams.splice(index, 1);
		};

		const addParams = () => {
			state.requestParams.push({
				type: '',
				key: '',
				name: '',
				value: '',
			});
		};

		const delRule = (index) => {
			state.rule.splice(index, 1);
		};

		const addRule = () => {
			state.rule.push({
				expression: '',
				params: {
					name: '',
					value: '',
				},
			});
		};
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();

			if (row) {
				 api.common.detail(row.sourceId).then((res:any)=>{
				    state.ruleForm = res.data
					state.config=res.data.apiConfig
					state.requestParams=res.data.apiConfig.requestParams

           			res.data.sourceRule.forEach((item, index) => {
						state.rule[index].expression = item.expression;
						state.rule[index].params.name =Object.keys(item.params) ;
						state.rule[index].params.value = item.params[Object.keys(item.params)];
					});


				 })
			}
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
						sourceId: 0,
				name: '',
				from: 1,
				key: '',
				rule: [],
				config: {
					method: '',
					url: '',
					interval: '',
					intervalUnit: '',
					requestParams: [],
				},
				description: '',
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
					//修改rule数据
					state.rule.forEach((item, index) => {
						item.params[item.params.name] = item.params.value;
						delete item.params.name;
						delete item.params.value;
					});

					state.ruleForm.rule = state.rule;
					state.config.requestParams = state.requestParams;
					state.ruleForm.config = state.config;

					if (state.ruleForm.sourceId !== 0) {
						//修改
						api.common.edit(state.ruleForm).then(() => {
							ElMessage.success('自建表类型修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					} else {
						//添加

						api.common.add(state.ruleForm).then(() => {
							ElMessage.success('自建表类型添加成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					}
				}
			});
		};

		return {
			addRule,
			delRule,
			addParams,
			delParams,
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
<style>
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
}
.conicon {
	width: 55px;
	height: 25px;

	font-size: 28px;
	line-height: 28px;
	cursor: pointer;
}
</style>
