<template>
	<div class="system-add-user-container">
		<el-dialog title="数据源配置接口" v-model="isShowDialog" width="569px">
			<el-form :model="ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="指标名称">
							{{ruleForm.userName}}
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="URL" required>
							<el-input v-model="ruleForm.userName" placeholder="请输入URL" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="取值项" required>
							<el-input v-model="ruleForm.dataType" placeholder="请输入取值项" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="取值周期" required>
							<el-input v-model="ruleForm.num" placeholder="请输入取值周期" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="是否启用">
							  <el-radio-group v-model="ruleForm.isUse" class="ml-4">
								<el-radio size="small" label="1">启用</el-radio>
								<el-radio size="small" label="2">禁用</el-radio>
							</el-radio-group>
							 <el-button style="margin-left: 20px;" size="small" type="primary">检测</el-button>
						</el-form-item>
					</el-col>
				</el-row>



			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">新 增</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent } from 'vue';
import { ElMessage } from 'element-plus';

// 定义接口来定义对象的类型
interface RuleFormRow {
	userName: string;
	isUse: string;
	dataType: string;
	num: string;
	description: any;
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
				userName: '', // 指标名称
				isUse: "1", // 是否启用
				dataType: '', // 数据项
				num: '', // 权重(%)
				description: '', // 取值范围
			},
		});
		// 打开弹窗
		const openDialog = (row: RuleFormRow) => {
			state.ruleForm = row;
			state.ruleForm.isUse = "1"
			state.isShowDialog = true;
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
			closeDialog();
		};
		// 初始化部门数据
		const initTableData = () => {
			
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			...toRefs(state),
		};
	},
});
</script>

<style lang="scss" scoped>
</style>
