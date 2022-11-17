<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.nodeId !== 0 ? '修改' : '添加') + '数据节点'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="数据节点标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入数据节点名称" :disabled="detail.lockKey==1 && ruleForm.nodeId !== 0" />
				</el-form-item>
				<el-form-item label="数据节点名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入数据节点名称" />
				</el-form-item>

				<el-form-item label="是否主键" prop="isPk">
					<el-radio-group v-model="ruleForm.isPk">
						<el-radio :label="0">否</el-radio>
						<el-radio :label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="数据类型" prop="dataType" v-if="detail.from == 1 || detail.from == 2">
					<el-select v-model="ruleForm.dataType" filterable placeholder="请选择数据类型">
						<el-option v-for="item in tabData" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item label="取值项" prop="value" v-if="detail.from == 1">
					<el-input v-model="ruleForm.value" placeholder="请输入取值项" class="w-35" /><el-button type="success" @click="onTest">选择值</el-button>
				</el-form-item>


				<el-form-item label="取值项" prop="value" v-if="detail.from == 4">
					<el-select v-model="ruleForm.value" filterable placeholder="请选择数取值项" @change="getNodeList">
						<el-option v-for="item in propertyData" :key="item.key" :label="item.name" :value="item.key">
							<span style="float: left">{{ item.key }}</span>
							<span style="float: right; font-size: 13px">{{ item.name }}</span>
						</el-option>
					</el-select>
				</el-form-item>


				<el-form-item label="取值项" prop="value" v-if="detail.from == 2">
					<el-select v-model="ruleForm.value" filterable placeholder="请选择数取值项" @change="getDbList">
						<el-option v-for="item in dbData" :key="item.Name" :label="item.Comment" :value="item.Name">
							<span style="float: left">{{ item.Name }}</span>
							<span style="float: right; font-size: 13px">{{ item.Comment }}</span>
						</el-option>
					</el-select>
				</el-form-item>



				<el-divider content-position="left">规则表达式</el-divider>

				<div v-for="(item, index) in rule" :key="index">
					<el-form-item label="正则表达式">
						<el-input v-model="item.expression" placeholder="请输入规则表达式" />
					</el-form-item>

					<el-form-item label="替换内容">
						<el-input v-model="item.replace" placeholder="请输入替换内容" class="w-35" />
						<!-- <el-input v-model="rule[index].params.name" placeholder="请输入键值" class="w-35" />
						<el-input v-model="rule[index].params.value" placeholder="请输入值" class="w-35" /> -->
						<div class="conicon">
							<el-icon @click="delRule(index)" v-if="index > 0"><Delete /></el-icon>
						</div>
					</el-form-item>
				</div>
				<div style="padding: 10px">
					<el-button type="primary" class="addbutton" @click="addRule">增加</el-button>
				</div>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.nodeId !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>

		<el-dialog v-model="dialogVisible" title="点击蓝色key值进行选择" width="40%">
			<jsontree :data="jsonPathData" @handlePath="handlePath"></jsontree>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">关闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/datahub';
import 'vue3-json-viewer/dist/index.css';
import jsontree from '/@/components/jsontree/index.vue';

import { ElMessage } from 'element-plus';
import { Delete, Minus, Right } from '@element-plus/icons-vue';

interface RuleFormState {
	nodeId: number;
	name: string;
	from: number;
	isPk: number;
	key: string;
	dataType: string;
	value: string;
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
	components: { Delete, Minus, Right, jsontree },

	setup(prop, { emit }) {
		const editDicRef = ref();
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			dialogVisible: false,
			jsonPathData: [],
			jsonData: '',
			propertyData: [],
			dbData: [],
			config: {},
			detail: {},
			tabData: [
				{
					label: 'int',
					value: 'int',
				},
				{
					label: 'long',
					value: 'long',
				},
				{
					label: 'float',
					value: 'float',
				},
				{
					label: 'double',
					value: 'double',
				},
				{
					label: 'string',
					value: 'string',
				},
				{
					label: 'boolean',
					value: 'boolean',
				},
				{
					label: 'date',
					value: 'date',
				},
			],
			ruledata: [
				{
					expression: '',
					replace: '',
					// params: {
					// 	name: '',
					// 	value: '',
					// },
				},
			],
			rule: [
				{
					expression: '',
					replace: '',
					// params: {
					// 	name: '',
					// 	value: '',
					// },
				},
			],

			ruleForm: {
				nodeId: 0,
				isPk: 0,
				name: '',
				key: '',
				dataType: '',
				value: '',
				rule: [],

				description: '',
			},
			rules: {
				key: [{ required: true, message: '数据节点标识不能为空', trigger: 'blur' }],
				name: [{ required: true, message: '数据节点名称不能为空', trigger: 'blur' }],
				isPk: [{ required: true, message: '请选择是否主键', trigger: 'blur' }],
				dataType: [{ required: true, message: '数据节点类型不能为空', trigger: 'blur' }],
				value: [{ required: true, message: '数据节点取值项不能为空', trigger: 'blur' }],
			},
		});

		const onTest = () => {
			if (state.detail.from == 1) {
				api.common.api(state.detail.sourceId).then((res: any) => {
					state.jsonData = JSON.parse(res.data);

					var jsonstr = jsonPath([], state.jsonData, '');
					state.jsonPathData = jsonstr;
					state.dialogVisible = true;
				});
			} else if (state.detail.from == 4) {
				api.common.devapi(state.detail.sourceId).then((res: any) => {
					state.jsonData = JSON.parse(res.data);

					var jsonstr = jsonPath([], state.jsonData, '');
					state.jsonPathData = jsonstr;
					state.dialogVisible = true;
				});
			}
		};

		const handlePath = (path) => {
			let data = path.slice(1);

			state.ruleForm.value = data;
			state.dialogVisible = false;
		};

		const delRule = (index) => {
			state.rule.splice(index, 1);
		};

		const addRule = () => {
			state.rule.push({
				expression: '',
				replace: '',
				// params: {
				// 	name: '',
				// 	value: '',
				// },
			});
		};
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();

			if (row?.nodeId) {
				state.ruleForm = row;

				var data = JSON.parse(row.rule);
				console.log(data);
				data.forEach((item, index) => {
					state.rule[index].expression = item.expression;
					state.rule[index].replace = item.replace;
					// state.rule[index].params.name = Object.keys(item.params);
					// state.rule[index].params.value = item.params[Object.keys(item.params)];
				});
			}

			api.common.detail(row.sourceId).then((res: any) => {
				state.detail = res.data;
				if (res.data.from == 4) {
					//propertyData
					api.node.getpropertyList({ key: res.data.deviceConfig.productKey }).then((re: any) => {
						state.propertyData = re;
					});
				}
				if (res.data.from == 2) {
					//propertyData
					api.common.getfields(row.sourceId).then((re: any) => {
						state.dbData = re.data;
					});
				}
			});

			state.ruleForm = row;
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				nodeId: 0,
				name: '',
				isPk: 0,
				from: 1,
				key: '',
				rule: [],

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
					// state.rule.forEach((item, index) => {
					// 	item.params[item.params.name] = item.params.value;
					// 	delete item.params.name;
					// 	delete item.params.value;
					// });

					state.ruleForm.rule = state.rule;

					if (state.ruleForm.nodeId !== 0) {
						//修改
						api.node.edit(state.ruleForm).then(() => {
							ElMessage.success('数据节点类型修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					} else {
						//添加

						api.node.add(state.ruleForm).then(() => {
							ElMessage.success('数据节点类型添加成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					}
				}
			});
		};

		const getNodeList = (e) => {
			state.propertyData.forEach((item, index) => {
				if (item.key === e) {
					state.ruleForm.dataType = item.valueType.type;
				}
			});
		};

		const getDbList = (e)=>{
			state.ruleForm.dataType = state.dbData[e].Type;
		}

		const onKeyclick = (e) => {
			//console.log(e);
			// if (e.target.innerText && e.target.className == 'jv-key') {
			// 	let str = e.target.innerText;
			// 	str = str.substr(0, str.length - 1);
			// 	state.ruleForm.value = str;
			// 	state.dialogVisible = false;
			// 	var con = {
			// 		...state.jsonData,
			// 	};
			// 	// var jsonstr = getOrgIdArr([], str, con);
			// 	// state.ruleForm.value = jsonstr.join('.');
			// }
		};

		const jsonPath = (arr, json, basePath) => {
			// 生成jsonpath
			const type = validateType(json);

			if (type === 'object') {
				for (let key in json) {
					const item = {
						key,
						path: `${basePath}.${key}`,
					};
					const childType = validateType(json[key]);
					item.type = childType;
					if (childType === 'object' || childType === 'array') {
						item.leaf = true;
						item.children = [];
						jsonPath(item.children, json[key], item.path);
					} else {
						item.leaf = false;
						item.value = json[key];
					}
					arr.push(item);
				}
			} else if (type === 'array') {
				json.forEach((item, index) => {
					const childType = validateType(item);
					const obj = {
						key: index,
					};
					obj.type = childType;
					obj.path = `${basePath}.${index}`;
					if (childType === 'object' || childType === 'array') {
						(obj.leaf = true), (obj.children = []);
						jsonPath(obj.children, item, obj.path);
					} else {
						obj.value = item;
						obj.leaf = false;
					}
					arr.push(obj);
				});
			}

			return arr;
		};

		// 校验JSON数据类型
		const validateType = (val) => {
			let type = typeof val;
			if (type === 'object') {
				if (Array.isArray(val)) {
					return 'array';
				} else if (val === null) {
					return 'null';
				} else {
					return 'object';
				}
			} else {
				switch (type) {
					case 'boolean':
						return 'boolean';
					case 'string':
						return 'string';
					case 'number':
						return 'number';
					default:
						return 'error';
				}
			}
		};

		const getOrgIdArr = (parents, childNode, treeData) => {
			for (var key in treeData) {
				// 父节点查询条件
				if (key === childNode) {
					// 如果找到结果,保存当前节点
					parents.push(key);
					break;
				} else {
					if (treeData[key] instanceof Object) {
						// console.log(treeData[key]);
						parents.push(key);

						//没找到，遍历该节点的子节点
						getOrgIdArr(parents, childNode, treeData[key]);
					}
				}
			}

			return parents;
		};

		return {
			jsonPath,
			handlePath,
			validateType,
			getNodeList,
			getDbList,
			onKeyclick,
			getOrgIdArr,
			addRule,
			onTest,
			delRule,
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
.jv-key {
	cursor: pointer;
	color: #0034f1;
}
</style>
