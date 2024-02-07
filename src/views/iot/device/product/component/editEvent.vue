<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '事件定义'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="120px">
				<el-form-item label="事件定义标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入事件定义标识" :disabled="ruleForm.id !== 0 ? true : false" />
				</el-form-item>
				<el-form-item label="事件定义名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入事件定义名称" />
				</el-form-item>

				<el-form-item label="事件类型" prop="level">
					<el-radio-group v-model="ruleForm.level">
						<el-radio :label="0">信息</el-radio>
						<el-radio :label="1">告警</el-radio>
						<el-radio :label="2">故障</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="输出参数" prop="maxLength">
					<div v-for="(item, index) in outputsdata" :key="index" class="jslist">
						<div class="jsonlist">
							<div>参数标识：{{ item.key }}</div>
							<div>参数名称：{{ item.name }}</div>
							<div>数据类型：{{ item.valueType.type }}</div>
							<div class="jsonoption">
								<el-link type="primary" @click="editjson(index, 'fun')">编辑</el-link>
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

				<el-form-item label="事件定义描述	" prop="desc">
					<el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入事件定义描述"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
		<EditOption ref="editOptionRef" @typeList="getOptionData" />
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/device';
import { Plus, Minus, Right } from '@element-plus/icons-vue';
import EditOption from './editOption.vue';
import { validateNoSpace } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

interface RuleFormState {
	id?: number;
	productKey: string;
	level: number | null;
	key: string;
	type: string;
	name: string;
	outputs: any[];
	status: number;
	desc: string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	type: string;
	types: string;
	productKey: string;
	typeData: any[];
	jsondata: any[];
	enumdata: any[];
	outputsdata: any[];
	elementType: any;
	rules: any;
}

const form = {
	productKey: '',
	type: '',
	name: '',
	level: null,
	key: '',
	status: 1,
	outputs: [],
	desc: '',
}

export default defineComponent({
	name: 'deviceEditPro',
	components: { Plus, Minus, Right, EditOption },
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const editOptionRef = ref();
		const state = reactive<DicState>({
			isShowDialog: false,
			typeData: [], //
			type: '',
			types: '',
			productKey: '',
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
			outputsdata: [],
			ruleForm: JSON.parse(JSON.stringify(form)),
			rules: {
				name: [
					{ required: true, message: '事件定义名称不能为空', trigger: 'blur' },
					{ max: 32, message: '事件定义名称不能超过32个字符', trigger: 'blur' },
					{ validator: validateNoSpace, message: '事件定义名称不能包含空格', trigger: 'blur' }
				],
				key: [{ required: true, message: '事件定义标识不能为空', trigger: 'blur' }],
				type: [{ required: true, message: '请选择数据类型', trigger: 'blur' }],
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState, productKey: string) => {
			resetForm();

			api.product.getDataType({ status: -1 }).then((res: any) => {
				const datat: any[] = Object.values(res.dataType);
				datat.forEach((item, index) => {
					if (index == 0) {
						datat[index]['label'] = '基础类型';
						datat[index]['options'] = item;
					} else {
						datat[index]['label'] = '扩展类型';
						datat[index]['options'] = item;
					}
				});
				state.typeData = datat || [];
			});

			state.ruleForm = row;
			if (row.outputs) {
				state.ruleForm = row;
				state.productKey = productKey;
				state.outputsdata = row.outputs;
			}
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = JSON.parse(JSON.stringify(form))
			state.type = '';
			state.types = '';
			state.outputsdata = [];
			state.elementType = [];
		};

		const seletChange = (val: string) => {
			state.type = val;
			state.ruleForm.type = val;
		};
		const seletChanges = (val: string) => {
			state.types = val;
		};

		const addEnum = () => {
			state.enumdata.push({
				text: '',
				value: '',
			});
		};
		const delEnum = (index: number) => {
			state.enumdata.splice(index, 1);
		};

		const deljson = (index: number, type: string) => {
			if (type == 'fun') {
				state.outputsdata.splice(index, 1);
			} else {
				state.jsondata.splice(index, 1);
			}
		};
		const editjson = (index: number, type: string) => {
			if (type == 'fun') {
				editOptionRef.value.openDialog(state.outputsdata[index]);
			} else {
				editOptionRef.value.openDialog(state.jsondata[index]);

			}
		}

		const addJson = (type: string) => {
			editOptionRef.value.openDialog({ productKey: '', id: 0, type_data: type });
		};
		const getOptionData = (data: any, type_data: any) => {
			if (type_data == 'fun') {
				state.outputsdata.push(data);
			} else {
				state.jsondata.push(data);
			}
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
					state.ruleForm.outputs = state.outputsdata;

					const theApi = state.ruleForm.id !== 0 ? api.model.eventedit : api.model.eventadd;

					if (state.ruleForm.id !== 0) {
						state.ruleForm.productKey = state.productKey;
					}

					theApi(state.ruleForm).then(() => {
						ElMessage.success('事件定义类型操作成功');
						closeDialog(); // 关闭弹窗
						emit('typeList');
					});
				}
			});
		};

		return {
			editOptionRef,
			getOptionData,
			openDialog,
			deljson,
			editjson,
			addEnum,
			delEnum,
			addJson,
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
<style scoped>
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
