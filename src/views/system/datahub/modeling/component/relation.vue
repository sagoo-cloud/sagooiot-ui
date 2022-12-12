<template>
	<div class="system-edit-dic-container">
		<el-dialog title="设置主源、关联字段" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">

				<el-form-item label="数据源节点" prop="mainSourceId">
						<el-select v-model="ruleForm.mainSourceId" filterable placeholder="请选择数据源" @change="setNode">
							<el-option v-for="item in data" :key="item.sourceId" :label="item.key" :value="item.sourceId">
								<span style="float: left">{{ item.key }}</span>
								<span style="float: right; font-size: 13px">{{ item.name }}</span>
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="数据源节点" prop="sourceNodeKey">
						<el-select v-model="ruleForm.sourceNodeKey" filterable placeholder="请选择数据源" >
							<el-option v-for="item in nodeData" :key="item.nodeId" :label="item.key" :value="item.key">
								<span style="float: left">{{ item.key }}</span>
								<span style="float: right; font-size: 13px">{{ item.name }}</span>
							</el-option>
						</el-select>
					</el-form-item>

			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">设置</el-button>
				</span>
			</template>
		</el-dialog>

	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/datahub';
import { ElMessage } from 'element-plus';
import { stat } from 'fs';

interface RuleFormState {
	id?: number;
	mainSourceId: string;
	sourceNodeKey: string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: {};
	data: {};
	nodeData:{};
}

export default defineComponent({
	name: 'relation',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			data:[],
			nodeData:[],
			ruleForm: {
				id: 0,
				mainSourceId: '',
				sourceNodeKey: '',
			},
			rules: {
				mainSourceId: [{ required: true, message: '请选择数据源', trigger: 'blur' }],
				sourceNodeKey: [{ required: true, message: '请选择数据源节点', trigger: 'blur' }],
				
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();
			api.template.source_list(row.id).then((res: any) => {
				state.data = res.List;
				
			});

			if (row) {
				state.ruleForm = row;
			}
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				mainSourceId: '',
				sourceNodeKey: '',
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

		const setNode = (event) => {
			// state.data.forEach((item, index) => {
			// 	if (item.sourceId == event) {
			// 		state.ruleForm.sourceNodeKey = item.key;
			// 	}
			// });
			getNodeList(event);
		};
		// 新增
		const onSubmit = () => {
			const formWrap = unref(formRef) as any;
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					api.template.relation(state.ruleForm).then(() => {
						ElMessage.success('设置成功');
						closeDialog(); // 关闭弹窗
						emit('typeList');
					});
				}
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
	

		return {
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

