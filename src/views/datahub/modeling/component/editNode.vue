<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.nodeId !== 0 ? '修改' : '添加') + '字段节点'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="字段节点标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入字段节点名称" />
				</el-form-item>
				<el-form-item label="字段节点名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入字段节点名称" />
				</el-form-item>


					
			<el-form-item label="数据类型" prop="dataType">
					<el-select v-model="ruleForm.dataType" filterable placeholder="请选择数据类型" >
						<el-option
						v-for="item in tabData"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						/>
					</el-select>
				</el-form-item>

				<el-form-item label="取值项" prop="value">
					<el-input v-model="ruleForm.value" placeholder="请输入取值项" />
				</el-form-item>

		

				<el-divider content-position="left">规则表达式</el-divider>

				<div v-for="(item, index) in rule" :key="index">
					<el-form-item label="表达式" >
						<el-input v-model="item.expression" placeholder="请输入规则表达式" />
					</el-form-item>

					<el-form-item label="参数" >
						<el-input v-model="rule[index].params.name" placeholder="请输入键值" class="w-35" />
						<el-input v-model="rule[index].params.value" placeholder="请输入值" class="w-35" />
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
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/datahub';
import { ElMessage } from 'element-plus';
import { Delete, Minus, Right } from '@element-plus/icons-vue';

interface RuleFormState {
	nodeId: number;
	name: string;
	from: number;
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
	components: { Delete, Minus, Right },

	setup(prop, { emit }) {
		const editDicRef = ref();
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			
			isShowDialog: false,
			config: {},
			tabData:[{
				label: 'varchar',
				value: 'varchar',
			},{
				label: 'string',
				value: 'string',
			},{
				label: 'int',
				value: 'int',
			},{
				label: 'bigint',
				value: 'bigint',
			},{
				label: 'tinyint',
				value: 'tinyint',
			},{
				label: 'float',
				value: 'float',
			},{
				label: 'double',
				value: 'double',
			},{
				label: 'text',
				value: 'text',
			},{
				label: 'datetime',
				value: 'datetime',
			},{
				label: 'timestamp',
				value: 'timestamp',
			}],
			ruledata:  [
				{
					expression: '',
					params: {
						name: '',
						value: '',
					},
				},
			],
			rule: [
				{
					expression: '',
					params: {
						name: '',
						value: '',
					},
				},
			],
			
		

		
			ruleForm: {
				nodeId: 0,
				name: '',
				key: '',
				dataType:'',
				value:'',
				rule: [],
				
				description: '',
			},
			rules: {
				key: [{ required: true, message: '字段节点标识不能为空', trigger: 'blur' }],
				name: [{ required: true, message: '字段节点名称不能为空', trigger: 'blur' }],
				dataType: [{ required: true, message: '字段节点类型不能为空', trigger: 'blur' }],
				value: [{ required: true, message: '字段节点取值项不能为空', trigger: 'blur' }],
			
			},
		});
		

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

			if (row?.nodeId) {

				  state.ruleForm = row

				 var data=JSON.parse(row.rule)
           			 console.log(data);

					data.forEach((item, index) => {
						state.rule[index].expression = item.expression;
						state.rule[index].params.name =Object.keys(item.params) ;
						state.rule[index].params.value = item.params[Object.keys(item.params)];
					});
			}

			state.ruleForm = row;
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				nodeId: 0,
				name: '',
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
					state.rule.forEach((item, index) => {
						item.params[item.params.name] = item.params.value;
						delete item.params.name;
						delete item.params.value;
					});

					state.ruleForm.rule = state.rule;

					if (state.ruleForm.nodeId !== 0) {
						//修改
						api.node.edit(state.ruleForm).then(() => {
							ElMessage.success('字段节点类型修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					} else {
						//添加

						api.node.add(state.ruleForm).then(() => {
							ElMessage.success('字段节点类型添加成功');
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
