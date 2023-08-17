<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.jobId ? '修改' : '添加' ) + '任务'" v-model="isShowDialog" width="650px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="100px">
				<el-form-item label="任务名称" prop="jobName">
					<el-input v-model="ruleForm.jobName" placeholder="请输入任务名称" />
				</el-form-item>
				<el-form-item label="任务描述" prop="remark">
					<el-input v-model="ruleForm.remark" placeholder="请输入任务描述" type="textarea" />
				</el-form-item>
				<el-form-item label="任务分组" prop="jobGroup">
					<el-select v-model="ruleForm.jobGroup" placeholder="请选择">
						<el-option v-for="dict in sys_job_group" :key="dict.value" :label="dict.label" :value="dict.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="invokeTarget">
					<template #label>
						<div class="flex align-center">
							调用方法
							<el-tooltip class="item" effect="dark" content="示例：demo1" placement="top">
								<el-icon>
									<ele-QuestionFilled />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-input v-model="ruleForm.invokeTarget" placeholder="请输入调用方法" />
				</el-form-item>
				<el-form-item prop="jobParams">
					<template #label>
						<div class="flex align-center">
							执行参数
							<el-tooltip class="item" effect="dark" placement="top">
								<template #content>
									以|分隔多个参数 示例：param1|param1
									<br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
								</template>
								<el-icon>
									<ele-QuestionFilled />
								</el-icon>
							</el-tooltip>
						</div>
					</template>
					<el-input v-model="ruleForm.jobParams" placeholder="请输入执行参数" />
				</el-form-item>
				<el-form-item label="cron表达式" prop="cronExpression">
					<el-input v-model="ruleForm.cronExpression" placeholder="请输入cron表达式" />
					<ul style="list-style: none;">
						<li>
							<el-icon>
								<ele-WarningFilled />
							</el-icon> */5 * * * * ? : 每隔5秒执行一次
						</li>
						<li>
							<el-icon>
								<ele-WarningFilled />
							</el-icon> 20 */1 * * * ? : 每隔1分钟执行一次
						</li>
						<li>
							<el-icon>
								<ele-WarningFilled />
							</el-icon> 30 0 23 * * ? : 每天23点执行一次
						</li>
						<li>
							<el-icon>
								<ele-WarningFilled />
							</el-icon> 0 0 1 * * ? : 每天凌晨1点执行一次
						</li>
						<li>
							<el-icon>
								<ele-WarningFilled />
							</el-icon> 0 0 1 1 * ? : 每月1号凌晨1点执行一次
						</li>
					</ul>
				</el-form-item>
				<el-form-item label="执行策略" prop="misfirePolicy">
					<el-radio v-model="ruleForm.misfirePolicy" :label="1">重复执行</el-radio>
					<el-radio v-model="ruleForm.misfirePolicy" :label="0">执行一次</el-radio>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio v-model="ruleForm.status" :label="1">正常</el-radio>
					<el-radio v-model="ruleForm.status" :label="0">暂停</el-radio>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.jobId ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import api from '/@/api/system';
interface RuleFormState {
	jobName: string;
	jobParams: string;
	jobGroup: string;
	invokeTarget: string;
	cronExpression: string;
	remark: string;
	misfirePolicy: number;
	status: number;
	jobId?: number;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: {};
}

export default defineComponent({
	name: 'systemEditDicData',
	props: {
		sysYesNoOptions: {
			type: Array,
			default: () => [],
		},
		// sysJobGroup: {
		// 	type: Array,
		// 	default: () => [],
		// },
	},
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const { proxy } = getCurrentInstance() as any;
		const state = reactive<DicState>({
			isShowDialog: false,
			ruleForm: {
				jobName: '',
				jobParams: '',
				jobGroup: '',
				invokeTarget: '',
				cronExpression: '',
				remark: '',
				misfirePolicy: 1,
				status: 0
			},
			rules: {
				jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
				invokeTarget: [{ required: true, message: '执行方法不能为空', trigger: 'blur' }],
				cronExpression: [{ required: true, message: 'cron表达式不能为空', trigger: 'blur' }],
			},
		});
		let { sys_job_group } = proxy.useDict('sys_job_group')
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();
			if (row) {
				api.task.detail(row.jobId).then((res: any) => {
					const data: RuleFormState = res;
					state.ruleForm = data;
				});
				state.ruleForm = row;
			}
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				jobName: '',
				jobParams: '',
				jobGroup: '',
				invokeTarget: '',
				cronExpression: '',
				remark: '',
				misfirePolicy: 1,
				status: 0
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
					if (state.ruleForm.jobId) {
						//修改
						api.task.edit(state.ruleForm).then(() => {
							ElMessage.success('任务修改成功');
							closeDialog(); // 关闭弹窗
							emit('dataList');
						});
					} else {
						//添加
						api.task.add(state.ruleForm).then(() => {
							ElMessage.success('任务添加成功');
							closeDialog(); // 关闭弹窗
							emit('dataList');
						});
					}
				}
			});
		};
		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			formRef,
			sys_job_group,
			...toRefs(state),
		};
	},
});
</script>


<style scoped lang="scss">
.flex {
	display: flex;
}

.align-center {
	align-items: center;
}
</style>