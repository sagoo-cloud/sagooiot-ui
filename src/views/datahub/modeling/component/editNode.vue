<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '字段节点'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="类型" prop="from">
					<el-radio-group v-model="ruleForm.from">
						<el-radio :label="1">自定义</el-radio>
						<el-radio :label="2">数据源</el-radio>
					</el-radio-group>
				</el-form-item>

				<div v-if="ruleForm.from == 2">
					<el-form-item label="数据源" prop="sourceId">
						<el-select v-model="ruleForm.sourceId" filterable placeholder="请选择数据源" @change="getNodeList">
							<el-option v-for="item in sourceData" :key="item.sourceId" :label="item.key" :value="item.sourceId">
								<span style="float: left">{{ item.key }}</span>
								<span style="float: right; font-size: 13px">{{ item.name }}</span>
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="数据源节点" prop="nodeId">
						<el-select v-model="ruleForm.nodeId" filterable placeholder="请选择数据源" @change="setNode">
							<el-option v-for="item in nodeData" :key="item.nodeId" :label="item.key" :value="item.nodeId">
								<span style="float: left">{{ item.key }}</span>
								<span style="float: right; font-size: 13px">{{ item.name }}</span>
							</el-option>
						</el-select>
					</el-form-item>
				</div>

				<el-form-item label="字段节点标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入字段节点名称"  :disabled="ruleForm.from==2"/>
				</el-form-item>
				<el-form-item label="字段节点名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入字段节点名称" :disabled="ruleForm.from==2"/>
				</el-form-item>





				<el-form-item label="数据类型" prop="dataType">
					<el-select v-model="ruleForm.dataType" filterable placeholder="请选择数据类型">
						<el-option v-for="item in tabData" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item label="取值方式" prop="method" v-if="ruleForm.dataType=='int' || ruleForm.dataType=='bigint' || ruleForm.dataType=='float' || ruleForm.dataType=='double'">
					<el-select v-model="ruleForm.method"  placeholder="请选择数据类型">
						<el-option v-for="item in methodData" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>


				<el-form-item label="默认值" prop="default" v-if="ruleForm.from==1">
					<el-input v-model="ruleForm.default" placeholder="请输入取值项" />
				</el-form-item>

				<el-form-item label="是否主键" prop="isPk">
					<el-radio-group v-model="ruleForm.isPk" >
						<el-radio :label="0">否</el-radio>
						<el-radio :label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="是否排序" prop="isSorting">
					<el-radio-group v-model="ruleForm.isSorting" >
						<el-radio :label="0">否</el-radio>
						<el-radio :label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>


				<el-form-item label="排序方式" prop="isDesc">
					<el-radio-group v-model="ruleForm.isDesc" >
						<el-radio :label="0">倒序</el-radio>
						<el-radio :label="1">正序</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="描述" prop="desc">
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
wa1
<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/datahub';
import { ElMessage } from 'element-plus';
import { Delete, Minus, Right } from '@element-plus/icons-vue';

interface RuleFormState {
	id: number;
	name: string;
	from: number;
	sourceId: number;
	nodeId: number;
	key: string;
	dataType: string;
	default: string;
	isSorting: number;
	isDesc: number;
	isPk: number;
	desc: string;
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
			methodData:[
				{
					label: 'max',
					value: 'max',
				},{
					label: 'min',
					value: 'min',
				},{
					label: 'avg',
					value: 'avg',
				}
			],
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

			sourceData: [],
			nodeData: [],

			ruleForm: {
				id: 0,
				sourceId: 0,
				nodeId: 0,
				name: '',
				key: '',
				from: 1,
				isSorting: 0,
				isDesc: 0,
				isPk: 0,
				default: '',
				desc: '',
			},
			rules: {
				key: [{ required: true, message: '字段节点标识不能为空', trigger: 'blur' }],
				name: [{ required: true, message: '字段节点名称不能为空', trigger: 'blur' }],
				dataType: [{ required: true, message: '字段节点类型不能为空', trigger: 'blur' }],
				value: [{ required: true, message: '字段节点取值项不能为空', trigger: 'blur' }],
				method: [{ required: true, message: '请选择取值方式', trigger: 'blur' }],
				isSorting: [{ required: true, message: '请选择是否参与排序', trigger: 'blur' }],
				isDesc: [{ required: true, message: '请选择排序方式', trigger: 'blur' }],
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();

			if (row?.id) {
				state.ruleForm = row;
				console.log(state.ruleForm);
			}

			if (row.sourceId) {
				getNodeList(row.sourceId);
			}
			state.ruleForm = row;
			state.isShowDialog = true;

			getSouData();
		

		};

		const getSouData = () => {
			api.common
				.getLists({
					
				})
				.then((res: any) => {
					state.sourceData = res.list;
				});
		};

		const getNodeList = (event) => {
			api.node
				.getList({
					pageNum: 1,
					pageSize: 50,
					sourceId: event,
				})
				.then((res: any) => {
					state.nodeData = res.list;
				});
		};
		const setNode = (event) => {
			state.nodeData.forEach((item, index) => {
				if (item.nodeId == event) {
					state.ruleForm.name = item.name;
					state.ruleForm.key = item.key;
					state.ruleForm.dataType = item.dataType;
				}
			});
		};
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				name: '',
				sourceId: 0,
				nodeId: 0,
				key: '',
				from: 1,
				isSorting: 0,
				isDesc: 0,
				isPk: 0,
				default: '',
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
						api.tnode.edit(state.ruleForm).then(() => {
							ElMessage.success('字段节点类型修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					} else {
						//添加

						api.tnode.add(state.ruleForm).then(() => {
							ElMessage.success('字段节点类型添加成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					}
				}
			});
		};

		return {
			getSouData,
			getNodeList,
			setNode,
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

