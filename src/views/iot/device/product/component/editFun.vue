<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '功能定义'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="120px">
				<el-form-item label="功能定义标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入功能定义标识" :disabled="ruleForm.id !== 0 ? true : false" />
				</el-form-item>
				<el-form-item label="功能定义名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入功能定义名称" />
				</el-form-item>

				<el-form-item label="输入参数" prop="maxLength">
					<div v-for="(item, index) in inputsdata" :key="index" class="jslist">
						<div class="jsonlist">
							<div>参数名称：</div>
							<div style="width: 60%">{{ item.name }} ({{ item.key }})</div>
							<div class="jsonoption">
								<!-- <el-link type="primary">编辑</el-link> -->
								<el-link type="primary" @click="deljson(index, 'fun')">删除</el-link>
							</div>
						</div>
					</div>

					<div style="display: block; width: 100%">
						<div class="input-options" @click="addJson('fun')">
							<el-icon>
								<Plus />
							</el-icon>
							<div>添加参数</div>
						</div>
					</div>
				</el-form-item>

				<el-form-item label="输出参数" prop="">
					<div v-for="(item, index) in outputsdata" :key="index" class="jslist">
						<div class="jsonlist">
							<div>参数名称：</div>
							<div style="width: 60%">{{ item.name }} ({{ item.key }})</div>
							<div class="jsonoption">
								<!-- <el-link type="primary">编辑</el-link> -->
								<el-link type="primary" @click="deljsonOut(index, 'fun')">删除</el-link>
							</div>
						</div>
					</div>

					<div style="display: block; width: 100%">
						<div class="input-options" @click="addJsonOut('fun')">
							<el-icon>
								<Plus />
							</el-icon>
							<div>添加参数</div>
						</div>
					</div>
				</el-form-item>

				<el-form-item label="功能定义描述	" prop="desc">
					<el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入功能定义描述"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
		<EditOption ref="editOptionRef" key="editOptionRef" @typeList="getOptionData" />
		<EditOption ref="editOptionOutRef" key="editOptionOutRef" @typeList="getOptionDataOut" />
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/device';
import uploadVue from '/@/components/upload/index.vue';
import { Plus, Minus, Right } from '@element-plus/icons-vue';
import EditOption from './editOption.vue';

import { ElMessage, UploadProps } from 'element-plus';

interface RuleFormState {
	id: number;
	productId: number;
	name: string;
	dictType: string;
	valueType: Object;
	inputs: Object;
	output: Object;
	status: number;
	desc: string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	typeData: RuleFormState[];
	rules: {};
}

export default defineComponent({
	name: 'deviceEditPro',
	components: { Plus, Minus, Right, EditOption },
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const editOptionRef = ref();
		const editOptionOutRef = ref();
		const state = reactive<DicState>({
			isShowDialog: false,
			typeData: [], //
			type: '',
			types: '',
			productId: 0,
			valueType: {
				type: '',
				maxLength: '',
				trueText: '是',
				trueValue: 'true',
				falseText: '否',
				falseValue: 'false',
			},
			elementType: {
				type: '',
				maxLength: '',
			},
			enumdata: [
				{
					text: '',
					value: '',
				},
			],

			jsondata: [],
			inputsdata: [],
			outputsdata: [],

			ruleForm: {
				productId: 0,
				name: '',
				key: '',
				inputs: [],
				outputs: [],
				valueType: {
					type: '',
					maxLength: '',
				},

				desc: '',
			},
			rules: {
				name: [{ required: true, message: '功能定义名称不能为空', trigger: 'blur' }],
				key: [{ required: true, message: '功能定义标识不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '请选择数据类型', trigger: 'blur' }],
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null, productId: number | null) => {
			resetForm();
			// console.log(row);
			state.ruleForm = row;
			state.productId = productId;
			state.inputsdata = row.inputs || [];
			state.outputsdata = row.outputs || [];
			state.isShowDialog = true;

		};
		const resetForm = () => {
			state.ruleForm = {
				name: '',
				key: '',
				status: 1,
				valueType: {
					type: '',
					maxLength: '',
				},

				desc: '',
			};
			state.type = '';
			state.types = '';
			state.inputsdata = [];
			state.outputsdata = [];
			state.elementType = [];
			state.valueType = {};
		};

		const seletChange = (val) => {
			state.type = val;
			state.ruleForm.type = val;

			console.log(val);
		};
		const seletChanges = (val) => {
			console.log(val);
			state.types = val;
			console.log(val);
		};

		const addEnum = () => {
			state.enumdata.push({
				text: '',
				value: '',
			});
		};
		const delEnum = (index) => {
			state.enumdata.splice(index, 1);
		};

		const deljson = (index, type) => {
			if (type == 'fun') {
				state.inputsdata.splice(index, 1);
			} else {
				state.jsondata.splice(index, 1);
			}
		};

		const deljsonOut = (index, type) => {
			if (type == 'fun') {
				state.outputsdata.splice(index, 1);
			} else {
				state.outputsdata.splice(index, 1);
			}
		};

		const addJson = (type) => {
			editOptionRef.value.openDialog({ product_id: 0, id: 0, type_data: type });
		};

		const addJsonOut = (type) => {
			editOptionOutRef.value.openDialog({ product_id: 0, id: 0, type_data: type });
		};

		const getOptionData = (data, type_data) => {
			if (type_data == 'fun') {
				state.inputsdata.push(data);
			} else {
				state.jsondata.push(data);
			}

			// console.log(state.jsondata);
			// console.log(type_data);
		};
		const getOptionDataOut = (data, type_data) => {
			if (type_data == 'fun') {
				state.outputsdata.push(data);
			} else {
				state.outputsdata.push(data);
			}

			// console.log(state.jsondata);
			// console.log(type_data);
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
					state.ruleForm.inputs = state.inputsdata;
					state.ruleForm.outputs = state.outputsdata;
					if (state.ruleForm.id !== 0) {
						state.ruleForm.productId = state.productId;
						api.model.functionedit(state.ruleForm).then(() => {
							ElMessage.success('功能定义类型修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					} else {
						api.model.functionadd(state.ruleForm).then(() => {
							ElMessage.success('功能定义类型添加成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					}
				}
			});
		};

		return {
			editOptionRef,
			editOptionOutRef,
			getOptionData,
			getOptionDataOut,
			openDialog,
			deljson,
			deljsonOut,
			addEnum,
			delEnum,
			addJson,
			addJsonOut,
			seletChange,
			seletChanges,
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
.input-box {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 10px;
}

.input-option {
	line-height: 30px;
	padding-top: 5px;
	width: 140px;
}

.input-option i {
	margin: 0px 5px;
	border: 1px solid #c3c3c3;
	font-size: 16px;
}

.input-options {
	display: flex;
	align-items: center;
	color: #409eff;
	cursor: pointer;
}

.jslist {
	width: 100%;
	border: 1px solid #e8e8e8;
	padding: 10px;
	margin-bottom: 10px;
}

.jsonlist {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.jsonoption {}

.jsonoption a {
	margin: 0px 10px;
}
</style>
