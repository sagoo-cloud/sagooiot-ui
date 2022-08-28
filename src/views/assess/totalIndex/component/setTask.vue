<template>
	<div class="system-add-user-container">
		<el-dialog title="数据源配置接口" v-model="isShowDialog" width="569px">
			<el-form :model="ruleForm" ref="ruleFormRef" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="指标名称:">
							{{ruleForm.target}}
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
						<el-form-item label="取值周期:" prop="get_time">
							<el-input v-model="ruleForm.get_time" placeholder="请输入取值周期" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="是否启用:">
							  <el-radio-group v-model="ruleForm.state" class="ml-4">
								<el-radio size="large" :label="1">启用</el-radio>
								<el-radio size="large" :label="2">禁用</el-radio>
							</el-radio-group>
							 <el-button style="margin-left: 20px;" size="small" type="primary">检测</el-button>
						</el-form-item>
					</el-col>
				</el-row>



			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">保 存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
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
}

export default defineComponent({
	name: 'systemAddUser',
	setup() {
		const state = reactive<ItemState>({
			isShowDialog: false,
			ruleForm: {
				target: '',// 指标名称
				uri: '', // URL
				state: 1, // 是否启用
				object: '', // 取值项
				get_time: '', // 取值周期
			},
		});
		const formSize = ref('default')
		const ruleFormRef = ref<FormInstance>()
		const rules = reactive<FormRules>({
			uri: [
				{ required: true, message: '请输入URL', trigger: 'blur' },
			],
			object: [
				{ required: true, message: '请输入取值项', trigger: 'blur' },
			],
			get_time: [
				{ required: true, message: '请输入取值周期', trigger: 'blur' },
			]
		})
		const onSubmit = async (formEl: FormInstance | undefined) => {
			if (!formEl) return
			await formEl.validate((valid, fields) => {
				console.log(valid)
				if (valid) {
				console.log('submit!')
				} else {
				console.log('error submit!', fields)
				}
			})
		}
		// 打开弹窗
		const openDialog = (row: RuleFormRow, item_code: string) => {
			// state.ruleForm = row;
			state.isShowDialog = true;
			getDataSourceInfo(row, item_code)
		};
		// 获取数据源配置数据
		const getDataSourceInfo = (row: any, item_code: string) => {
			let params = {
				item_code: item_code,
				target_name: row.name
			}
			api.getDataSourceInfo(params).then((res:any) => {
				console.log(res)
				if(res) {
					// 编辑
					state.ruleForm = res
					// data_code: "17216f21isrc5lpgppsjr8o100z8jlwv"
					// get_time: "*/30 * * * * *"
					// item_code: "17216f2f0k0c5jee0vdn08g100u6rfhd"
					// object: "Data.0.TemperatureHigh"
					// state: 1
					// target: "device"
					// uri: "https://api.gugudata.com/weather/weatherinfo/demo"
				}else {
					// 新增
					state.ruleForm = {
						target: row.name,// 指标名称
						uri: '', // URL
						state: 1, // 是否启用
						object: '', // 取值项
						get_time: '', // 取值周期
					}
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
		// 新增
		// const onSubmit = () => {
		// 	closeDialog();
		// };
		// 初始化部门数据
		const initTableData = () => {
			
		};
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
			...toRefs(state),
			formSize,
			ruleFormRef
		};
	},
});
</script>

<style lang="scss" scoped>
</style>
