<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '参数'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="120px">
				<el-form-item label="参数标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入参数标识" :disabled="ruleForm.id !== 0 ? true : false" />
				</el-form-item>
				<el-form-item label="参数名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入参数名称" />
				</el-form-item>

				<el-form-item label="数据类型" prop="type">
					<el-select v-model="valueType.type" placeholder="请选择数据类型" @change="seletChange">
						<el-option-group v-for="group in typeData" :key="group.label" :label="group.label">
							<el-option v-for="item in group.options" :key="item.type" :label="item.title" :value="item.type" :disabled="item.type == 'object'" />
						</el-option-group>
					</el-select>
				</el-form-item>

				<!--根据数据类型输出不同表单-->

				<el-form-item label="精度" prop="decimals" v-if="type == 'float' || type == 'double'">
					<el-input v-model="valueType.decimals" placeholder="请输入精度" />
				</el-form-item>

				<el-form-item label="单位" prop="unit" v-if="type == 'int' || type == 'long' || type == 'float' || type == 'double'">
					<el-input v-model="valueType.unit" placeholder="请输入单位" />
				</el-form-item>

				<el-form-item label="最大长度" prop="maxLength" v-if="type == 'string'">
					<el-input v-model="valueType.maxLength" placeholder="请输入最大长度" />
				</el-form-item>

				<el-form-item label="时间格式" prop="maxLength" v-if="type == 'date'">
					<el-input v-model="valueType.maxLength" placeholder="请输入时间格式" />
				</el-form-item>

				<el-form-item label="布尔值" prop="maxLength" v-if="type == 'boolean'">
					<div class="input-box">
						<el-input v-model="valueType.trueText" placeholder="请输入布尔值" value="是" /><span style="margin: 0px 10px">~</span>
						<el-input v-model="valueType.trueValue" placeholder="请输入布尔值" value="true" />
					</div>

					<div class="input-box">
						<el-input v-model="valueType.falseText" placeholder="请输入布尔值" value="否" /> <span style="margin: 0px 10px">~</span>
						<el-input v-model="valueType.falseValue" placeholder="请输入布尔值" value="false" />
					</div>
				</el-form-item>

				<el-form-item label="枚举项" prop="maxLength" v-if="type == 'enum'">
					<div class="input-box" v-for="(item, index) in enumdata" :key="index">
						<el-input v-model="item.text" placeholder="请输入枚举文本" /><span style="margin: 0px 10px"><el-icon>
								<Right />
							</el-icon></span>
						<el-input v-model="item.value" placeholder="请输入枚举值" />
						<div class="input-option">
							<el-icon @click="addEnum" v-if="index == 0">
								<Plus />
							</el-icon>
							<el-icon @click="delEnum(index)" v-if="index != 0">
								<Minus />
							</el-icon>
						</div>
					</div>
				</el-form-item>

				<el-form-item label="JSON对象" prop="maxLength" v-if="type == 'object'">
					<div class="input-options" @click="addJson">
						<el-icon>
							<Plus />
						</el-icon>
						<div>添加参数</div>
					</div>
				</el-form-item>


				<div v-if="type == 'array'">
					<el-form-item label="元素类型" prop="type">
						<el-select v-model="elementType.type" placeholder="请选择元素类型" @change="seletChanges">
							<el-option-group v-for="group in typeData" :key="group.label" :label="group.label">
								<el-option v-for="item in group.options" :key="item.type" :label="item.title" :value="item.type" :disabled="item.type == 'array'" />
							</el-option-group>
						</el-select>
					</el-form-item>


					<el-form-item label="精度" prop="decimals" v-if="types == 'float' || types == 'double'">
						<el-input v-model="elementType.decimals" placeholder="请输入精度" />
					</el-form-item>

					<el-form-item label="单位" prop="unit" v-if="types == 'int' || types == 'long' || types == 'float' || types == 'double'">
						<el-input v-model="elementType.unit" placeholder="请输入单位" />
					</el-form-item>

					<el-form-item label="最大长度" prop="maxLength" v-if="types == 'string'">
						<el-input v-model="elementType.maxLength" placeholder="请输入最大长度" />
					</el-form-item>

					<el-form-item label="时间格式" prop="maxLength" v-if="types == 'date'">
						<el-input v-model="elementType.maxLength" placeholder="请输入时间格式" />
					</el-form-item>

					<el-form-item label="布尔值" prop="maxLength" v-if="types == 'boolean'">
						<div class="input-box">
							<el-input v-model="elementType.trueText" placeholder="请输入布尔值" value="是" /><span style="margin: 0px 10px">~</span>
							<el-input v-model="elementType.trueValue" placeholder="请输入布尔值" value="true" />
						</div>

						<div class="input-box">
							<el-input v-model="elementType.falseText" placeholder="请输入布尔值" value="否" /> <span style="margin: 0px 10px">~</span>
							<el-input v-model="elementType.falseValue" placeholder="请输入布尔值" value="false" />
						</div>
					</el-form-item>

					<el-form-item label="枚举项" prop="maxLength" v-if="types == 'enum'">
						<div class="input-box" v-for="(item, index) in enumdata" :key="index">
							<el-input v-model="item.text" placeholder="请输入枚举值" /><span style="margin: 0px 10px"><el-icon>
									<Right />
								</el-icon></span>
							<el-input v-model="item.value" placeholder="请输入枚举文本" />
							<div class="input-option">
								<el-icon @click="addEnum" v-if="index == 0">
									<Plus />
								</el-icon>
								<el-icon @click="delEnum(index)" v-if="index != 0">
									<Minus />
								</el-icon>
							</div>
						</div>
					</el-form-item>
				</div>

				<!--根据数据类型输出不同表单-->

				<el-form-item label="参数描述	" prop="desc">
					<el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入参数描述"></el-input>
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
import api from '/@/api/device';
import { Plus, Minus, Right } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

interface RuleFormState {
	id: number;
	name: string;
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
	components: { Plus, Minus, Right },
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);

		const state = reactive<DicState>({
			isShowDialog: false,
			typeData: [], //
			type: '',
			types: '',
			valueType: {
				type: '',
				maxLength: '',
			},
			elementType: {
				type: '',
				maxLength: '',
			},
			enumdata: [
				{
					'text': '',
					'value': '',
				},
			],

			ruleForm: {
				id: 0,
				name: '',
				key: '',
				transportProtocol: '',
				accessMode: '0',
				status: 1,
				valueType: {
					type: '',
					maxLength: '',
				},

				desc: '',
			},
			rules: {
				name: [{ required: true, message: '参数名称不能为空', trigger: 'blur' }],
				key: [{ required: true, message: '参数标识不能为空', trigger: 'blur' }],
				accessMode: [{ required: true, message: '请选择是否只读', trigger: 'blur' }],
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();

			api.product.getDataType({ status: -1 }).then((res: any) => {
				const datat = Object.values(res.dataType);
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

			if (row) {
				// api.dict.getType(row.dictId).then((res:any)=>{
				//   state.ruleForm = res.data.dictType
				// }
				state.ruleForm = row;
			}
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				name: '',
				desc: '',
			};
			state.valueType = {};
			state.enumdata = [{
				'text': '',
				'value': '',
			}];
			state.elementType = {};
		};

		const seletChange = (val) => {
			state.type = val;
		};
		const seletChanges = (val) => {
			state.types = val;
		};

		const addEnum = () => {
			state.enumdata.push({
				'text': '',
				'value': '',

			});
		};
		const delEnum = (index) => {
			state.enumdata.splice(index, 1);
		}

		const addJson = () => {

		}
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
						api.product.edit(state.ruleForm).then(() => {
							ElMessage.success('参数类型修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					} else {
						//添加
						if (state.type == 'enum') {
							state.valueType.elements = state.enumdata;
						}

						state.ruleForm.valueType = state.valueType;
						ElMessage.success('参数类型添加成功');
						closeDialog(); // 关闭弹窗
						emit('typeList', state.ruleForm, state.ruleForm.type_data);
					}
				}
			});
		};

		return {
			openDialog,
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
	cursor: pointer
}</style>
