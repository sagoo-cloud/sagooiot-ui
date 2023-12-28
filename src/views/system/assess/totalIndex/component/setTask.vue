<template>
	<div class="system-add-user-container">
		<el-dialog title="数据源配置接口" v-model="isShowDialog" width="650px">
			<el-form :model="ruleForm" ref="ruleFormRef" :rules="rules" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="指标名称:">
							{{ ruleForm.target }}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="URL:" prop="uri">
							<el-input v-model="ruleForm.uri" placeholder="请输入URL" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="取值项:" prop="object">
							<el-input v-model="ruleForm.object" placeholder="请输入取值项" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item class="inline-row" label="取值周期:" prop="get_time">
							<el-input v-model="ruleForm.get_time" placeholder="请输入取值周期" clearable></el-input>
							<div class="tip" @click="isShow = !isShow">
								<span v-if="!isShow" class="ico_down"></span>
								<span v-else class="ico_up"></span>
								帮助
							</div>
						</el-form-item>
					</el-col>
					<div class="help-wrap" v-if="isShow">
						<div class="help-item">
							<div class="help-item-label">CRON表达式</div>
							<div class="help-item-content">取值周期填写说明 eg:0 0 0 1 * * 每月一号执行一次</div>
						</div>
						<div class="help-item">
							<div class="help-item-label">CRON字段</div>
							<div class="help-item-content">
								<div class="ant-row">
									<div class="ant-col ant-col-6">字段</div>
									<div class="ant-col ant-col-6">允许值</div>
									<div class="ant-col ant-col-6">允许特殊字符</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-6">-------------------</div>
									<div class="ant-col ant-col-6">-------------------</div>
									<div class="ant-col ant-col-6">-------------------</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-6">Seconds</div>
									<div class="ant-col ant-col-6">0-59</div>
									<div class="ant-col ant-col-6">* / , -</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-6">Minutes</div>
									<div class="ant-col ant-col-6">0-59</div>
									<div class="ant-col ant-col-6">* / , -</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-6">Hours</div>
									<div class="ant-col ant-col-6">0-23</div>
									<div class="ant-col ant-col-6">* / , -</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-6">Day</div>
									<div class="ant-col ant-col-6">1-31</div>
									<div class="ant-col ant-col-6">* / , - ?</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-6">Month</div>
									<div class="ant-col ant-col-6">1-12 or JAN-DEC</div>
									<div class="ant-col ant-col-6">* / , -</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-6">Week</div>
									<div class="ant-col ant-col-6">0-6 or SUN-SAT</div>
									<div class="ant-col ant-col-6">* / , - ?</div>
								</div>
							</div>
						</div>
						<div class="help-item">
							<div class="help-item-label">特殊字符</div>
							<div class="help-item-content">
								"*"：当前字段所有的值   eg：第二字段*表示每分钟<br />"/"：描述范围的增量    eg：第二字段0-59/15表示每15分钟<br />","：分隔列表的项目  &nbsp;
								eg：第五字段1,3表示每周1,3执行<br />"-":连字符用于定义范围 &nbsp; eg：第三字段1-3表每天1到3点（含3点）<br />"?":设置当前字段为空<br />
							</div>
						</div>
						<div class="help-item">
							<div class="help-item-label">预定义</div>
							<div class="help-item-content">
								<div class="ant-row">
									<div class="ant-col ant-col-8">字段</div>
									<div class="ant-col ant-col-16">说明</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-8">----------------------------</div>
									<div class="ant-col ant-col-16">---------------------------</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-8">@yearly or @annually</div>
									<div class="ant-col ant-col-16">每年1月1日午夜运行一次</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-8">@monthly</div>
									<div class="ant-col ant-col-16">每月一次，每月午夜运行一次</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-8">@weekly</div>
									<div class="ant-col ant-col-16">每周运行一次，在星期六/星期日之间的午夜</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-8">@daily or @midnight</div>
									<div class="ant-col ant-col-16">每天半夜运行</div>
								</div>
								<div class="ant-row">
									<div class="ant-col ant-col-8">@hourly</div>
									<div class="ant-col ant-col-16">每小时运行一次</div>
								</div>
							</div>
						</div>
					</div>


					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="是否启用:">
							<el-radio-group v-model="ruleForm.state" class="ml-4">
								<el-radio size="large" :label="1">启用</el-radio>
								<el-radio size="large" :label="2">禁用</el-radio>
							</el-radio-group>
							<el-button v-if="ruleForm.uri && ruleForm.object" @click="test" style="margin-left: 20px" size="small" type="primary">检测</el-button>
						</el-form-item>
					</el-col>
					<el-col v-if="testRes || testRes.toString()" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="测试结果:">
							<span>数据源返回数据值:{{ testRes }}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleFormRef)">保 存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';

import api from '/@/api/assess';

// 定义接口来定义对象的类型
interface RuleFormRow {
	target: string;
	uri: string;
	state: number;
	object: string;
	get_time: string;

}
interface ItemState {
	isShowDialog: boolean;
	ruleForm: RuleFormRow;
	status: number;
	item_code: string;
	isShow: boolean;
	testRes: string;
}

export default defineComponent({
	name: 'systemAddUser',
	setup() {
		const state = reactive<ItemState>({
			isShowDialog: false,
			ruleForm: {
				target: '', // 指标名称
				uri: '', // URL
				state: 1, // 是否启用
				object: '', // 取值项
				get_time: '', // 取值周期
			},
			status: 0,
			item_code: '',
			isShow: false,
			testRes: ''
		});
		const formSize = ref('default');
		const ruleFormRef = ref<FormInstance>();
		const rules = reactive<FormRules>({
			uri: [{ required: true, message: '请输入URL', trigger: 'blur' }],
			object: [{ required: true, message: '请输入取值项', trigger: 'blur' }],
			get_time: [{ required: true, message: '请输入取值周期', trigger: 'blur' }],
		});
		const onSubmit = async (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			await formEl.validate((valid) => {
				if (valid) {
					if (state.status === 1) {
						// 编辑
						editataSourceInfo(state.ruleForm);
					} else {
						// 新增
						let params = {
							...state.ruleForm,
							item_code: state.item_code,
						};
						addDataSourceInfo(params);
					}
				}
			});
		};
		// 新增数据
		const addDataSourceInfo = (params: any) => {
			api.addDataSourceInfo(params).then(() => {
				ElMessage.success('数据提交成功');
				closeDialog();
				state.isShow = false
			});
		};
		// 编辑数据
		const editataSourceInfo = (params: any) => {
			api.editataSourceInfo(params).then((res: any) => {
				ElMessage.success('数据提交成功');
				closeDialog();
				state.isShow = false
			});
		};
		// 打开弹窗
		const openDialog = (row: RuleFormRow, item_code: string) => {
			// state.ruleForm = row;
			state.isShowDialog = true;
			state.testRes = ''
			getDataSourceInfo(row, item_code);
		};
		// 检测
		const test = () => {
			let params = {
				uri: state.ruleForm.uri,
				object: state.ruleForm.object
			}
			api.testDataSource(params).then((res: any) => {
				state.testRes = res
			});
		};
		// 获取数据源配置数据
		const getDataSourceInfo = (row: any, item_code: string) => {
			let params = {
				item_code: item_code,
				target_name: row.name,
			};
			state.item_code = item_code;
			api.getDataSourceInfo(params).then((res: any) => {
				if (res) {
					// 编辑
					state.ruleForm = res;
					state.status = 1;
				} else {
					// 新增
					state.ruleForm = {
						target: row.name, // 指标名称
						uri: '', // URL
						state: 1, // 是否启用
						object: '', // 取值项
						get_time: '', // 取值周期
					};
					state.status = 2;
				}
			});
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		// 初始化组织数据
		const initTableData = () => { };
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			rules,
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			getDataSourceInfo,
			addDataSourceInfo,
			editataSourceInfo,
			test,
			...toRefs(state),
			formSize,
			ruleFormRef,
		};
	},
});
</script>

<style lang="scss" scoped>
.inline-row {
	::v-deep .el-form-item__content {
		display: flex;

		.el-input {
			width: calc(100% - 100px);
		}

		.tip {
			width: 100px;
			// background-color: pink;
			display: flex;
			justify-content: center;
			align-items: center;
			color: var(--el-color-primary);
			font-size: 12px;
			cursor: pointer;

			.ico_up {
				width: 0;
				height: 0;
				border: 5px solid transparent;
				border-bottom-color: var(--el-color-primary);
				margin-right: 8px;
				margin-top: -7px;
			}

			.ico_down {
				width: 0;
				height: 0;
				border: 5px solid transparent;
				border-top-color: var(--el-color-primary);
				margin-right: 8px;
				margin-top: 7px;
			}
		}
	}
}

.help-wrap {
	width: 540px;
	margin: 0 auto;

	// background-color: pink;
	.help-item:nth-child(1) {
		border-top: 1px var(--el-border-color) var(--el-border-style);
	}

	.help-item {
		display: flex;

		border-bottom: 1px var(--el-border-color) var(--el-border-style);
		border-left: 1px var(--el-border-color) var(--el-border-style);
		border-right: 1px var(--el-border-color) var(--el-border-style);

		.help-item-label,
		.help-item-content {
			padding: 12px;

		}

		.help-item-label {
			background-color: #f3f3f3;
			width: 110px;
		}

		.help-item-content {
			width: 430px;
			font-size: 12px;

			.ant-row {
				display: flex;
				width: 100%;

				// justify-content: space-between;
				.ant-col-6 {
					width: 33%;
				}

				.ant-col-6:not(:nth-child(1)) {
					text-align: center;
				}

				.ant-col-8 {
					width: 40%;
				}

				.ant-col-16 {
					width: 60%;
				}
			}
		}
	}
}</style>
