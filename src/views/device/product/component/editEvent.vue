<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '事件定义'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="120px">
				<el-form-item label="事件定义标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入事件定义标识" />
				</el-form-item>
				<el-form-item label="事件定义名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入事件定义名称" />
				</el-form-item>

                <el-form-item label="事件级别" prop="level">
					<el-radio-group v-model="ruleForm.level" >
						<el-radio label="0">普通</el-radio>

						<el-radio label="1">警告</el-radio>
						<el-radio label="2">紧急</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="输出参数" prop="type" required>
					<el-select v-model="valueType.type" placeholder="请选择数据类型" @change="seletChange">
						<el-option-group v-for="group in typeData" :key="group.label" :label="group.label">
							<el-option v-for="item in group.options" :key="item.type" :label="item.title" :value="item.type" />
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

				<el-form-item label="布尔值" prop="trueText" v-if="type == 'boolean'">
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
						<el-input v-model="item.text" placeholder="请输入枚举值" /><span style="margin: 0px 10px"
							><el-icon><Right /></el-icon
						></span>
						<el-input v-model="item.value" placeholder="请输入枚举文本" />
						<div class="input-option">
							<el-icon @click="addEnum" v-if="index == 0"><Plus /></el-icon>
							<el-icon @click="delEnum(index)" v-if="index != 0"><Minus /></el-icon>
						</div>
					</div>
				</el-form-item>

				<el-form-item label="JSON对象" prop="maxLength" v-if="type == 'object'">
					<div v-for="(item, index) in jsondata" :key="index" class="jslist">
						<div class="jsonlist">
							<div>参数名称：</div>
							<div style="width: 60%">{{ item.name }}</div>
							<div class="jsonoption">
								<!-- <el-link type="primary">编辑</el-link> -->
								<el-link type="primary" @click="deljson(index)">删除</el-link>
							</div>
						</div>
					</div>

					<div style="display: block; width: 100%">
						<div class="input-options" @click="addJson">
							<el-icon><Plus /></el-icon>
							<div>添加参数</div>
						</div>
					</div>
				</el-form-item>

				<div v-if="type == 'array'">
					<el-form-item label="元素类型" prop="types">
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
							<el-input v-model="item.text" placeholder="请输入枚举值" /><span style="margin: 0px 10px"
								><el-icon><Right /></el-icon
							></span>
							<el-input v-model="item.value" placeholder="请输入枚举文本" />
							<div class="input-option">
								<el-icon @click="addEnum" v-if="index == 0"><Plus /></el-icon>
								<el-icon @click="delEnum(index)" v-if="index != 0"><Minus /></el-icon>
							</div>
						</div>
					</el-form-item>
				</div>

				
				<el-form-item label="JSON对象" prop="maxLength" v-if="types == 'object'">
					<div v-for="(item, index) in jsondata" :key="index" class="jslist">
						<div class="jsonlist">
							<div>参数名称：</div>
							<div style="width: 60%">{{ item.data.name }}</div>
							<div class="jsonoption">
								<el-link type="primary">编辑</el-link>
								<el-link type="primary">删除</el-link>
							</div>
						</div>
					</div>

					<div style="display: block; width: 100%">
						<div class="input-options" @click="addJson">
							<el-icon><Plus /></el-icon>
							<div>添加参数</div>
						</div>
					</div>
				</el-form-item>

				<!--根据数据类型输出不同表单-->

			
				<el-form-item label="事件定义描述	" prop="desc">
					<el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入事件定义描述"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
		<EditOption ref="editOptionRef" @typeList="getOptionData" />
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
	level: number;
	name: string;
	dictType: string;
	valueType: Object;
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
		const state = reactive<DicState>({
			isShowDialog: false,
			typeData: [], //
			type: '',
			types: '',
			productId:0,
			valueType: {
				type: '',
				maxLength: '',
				trueText:'是',
				trueValue:'true',
				falseText:'否',
				falseValue:'false',
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

			ruleForm: {
				id:0,
				productId:0,
                level:0,
				name: '',
				key: '',
				status: 1,
				valueType: {
					type: '',
					maxLength: '',
				},

				desc: '',
			},
			rules: {
				name: [{ required: true, message: '事件定义名称不能为空', trigger: 'blur' }],
				key: [{ required: true, message: '事件定义标识不能为空', trigger: 'blur' }],
				level: [{ required: true, message: '请选择事件级别', trigger: 'blur' }],
				type: [{ required: true, message: '请选择数据类型', trigger: 'blur' }],
				
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null,productId:number | null) => {
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
				console.log(row);
				console.log(productId);
				state.typeData = datat || [];
			});
			state.ruleForm = row;
			if (row.valueType) {	
				state.ruleForm = row;

				state.productId=productId;
				state.valueType = row.valueType;
				state.ruleForm.valueType.type = row.valueType.type;
				state.ruleForm.type = row.valueType.type;
				state.type = row.valueType.type ;
			}
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				name: '',
				key: '',
				accessMode: '0',
				status: 1,
				valueType: {
					type: '',
					maxLength: '',
				},

				desc: '',
			};
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

		const deljson = (index) => {
			state.jsondata.splice(index, 1);
		}

		const addJson = () => {
			editOptionRef.value.openDialog({ product_id: 0, id: 0 });
		};
		const getOptionData = (data) => {
			state.jsondata.push(data);

			console.log(state.jsondata);
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
						if (state.type == 'enum') {
							state.valueType.elements = state.enumdata;
						}

						if (state.type == 'object') {
							state.valueType.properties = state.jsondata;
						}

						if (state.type == 'array') {
							state.valueType.elementType = state.elementType;
						}

						console.log(state.valueType);

						state.ruleForm.valueType = state.valueType;
						state.ruleForm.productId = state.productId
						api.model.eventedit(state.ruleForm).then(() => {
							ElMessage.success('事件定义类型修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					} else {
						//添加
						if (state.type == 'enum') {
							state.valueType.elements = state.enumdata;
						}

						if (state.type == 'object') {
							state.valueType.properties = state.jsondata;
						}

						if (state.type == 'array') {
							state.valueType.elementType = state.elementType;
						}

						console.log(state.valueType);

						state.ruleForm.valueType = state.valueType;
						api.model.eventadd(state.ruleForm).then(() => {
							ElMessage.success('事件定义类型添加成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					}
				}
			});
		};

		return {
			editOptionRef,
			getOptionData,
			openDialog,
			deljson,
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
.jsonoption {
}
.jsonoption a {
	margin: 0px 10px;
}
</style>
