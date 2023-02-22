<template>
	<div class="system-edit-dic-container">
		<el-dialog title="设置聚合" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="分组节点" prop="GroupNodeKey">
					<el-select v-model="ruleForm.GroupNodeKey" filterable placeholder="请选择分组节点" class="w100">
						<el-option v-for="item in sourceData" :key="item.id" :label="item.name" :value="item.key">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; font-size: 13px">{{ item.key }}</span>
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="时间窗口节点" prop="TimeNodeKey">
					<el-select v-model="ruleForm.TimeNodeKey" filterable placeholder="请选择时间窗口节点" class="w100">
						<el-option v-for="item in sourceData" :key="item.id" :label="item.name" :value="item.key">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; font-size: 13px">{{ item.key }}</span>
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="时间值" prop="Duration">
					<el-input v-model="ruleForm.Duration" placeholder="请输入时间值" class="w-35" />
					<el-select v-model="ruleForm.TimeUnit" placeholder="请选择单位">
						<el-option v-for="item in unitData" :key="item.value" :label="item.label" :value="item.value" />
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

interface RuleFormState {
	id?: number;
	GroupNodeKey: string;
	TimeNodeKey: string;
	Duration: string;
	TimeUnit: string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: {};
	unitData: [];
}

export default defineComponent({
	name: 'Edit',

	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);

		const state = reactive<DicState>({
			isShowDialog: false,
			sourceData: [],
			unitData: [
				{
					label: '秒',
					value: 1,
				},
				{
					label: '分',
					value: 2,
				},
				{
					label: '时',
					value: 3,
				},
				{
					label: '天',
					value: 4,
				},
			],
			ruleForm: {
				id: 0,
				GroupNodeKey: '',
				TimeNodeKey: '',
				Duration: '',
				TimeUnit: '',
			},
			rules: {
				GroupNodeKey: [{ required: true, message: '分组节点key不能为空', trigger: 'blur' }],
				TimeNodeKey: [{ required: true, message: '时间窗口节点key不能为空', trigger: 'blur' }],
				Duration: [{ required: true, message: '时间值不能为空', trigger: 'blur' }],
				TimeUnit: [{ required: true, message: '时间单位不能为空', trigger: 'blur' }],
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();

			if (row) {
				state.ruleForm.id = row.id;
				api.template.aggregate_from(row.id).then((res: any) => {
					api.node.getList({ sourceId: res.id }).then((res: any) => {
						state.sourceData = res.list;
						state.ruleForm.GroupNodeKey = row.groupNodeKey;
						state.ruleForm.TimeNodeKey = row.timeNodeKey;
						state.ruleForm.Duration = row.duration;
						state.ruleForm.TimeUnit = row.timeUnit;
					});
				});
			}
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				GroupNodeKey: '',
				TimeNodeKey: '',
				Duration: '',
				TimeUnit: '',
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
					api.template.aggregate(state.ruleForm).then(() => {
						ElMessage.success('设置成功');
						closeDialog(); // 关闭弹窗
						emit('typeList');
					});
				}
			});
		};

		return {
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

