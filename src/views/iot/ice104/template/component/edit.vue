<template>
	<el-dialog
		:title="isEdit ? '修改模版' : '添加模版'"
		v-model="dialogVisible"
		width="600px"
		:before-close="clsoeDialog"
		:close-on-click-modal="false"
	>
		<el-form ref="formRef" :rules="formRules" :model="ruleForm" label-position="left" label-width="80px" style="width: 90%; margin: 0 auto">
			<el-form-item label="模版编码" prop="number">
				<el-input :disabled="isEdit" v-model="ruleForm.number" placeholder="请输入模版编码" />
			</el-form-item>
			<el-form-item label="名称">
				<el-input v-model="ruleForm.title" placeholder="请输入名称" />
			</el-form-item>
			<el-form-item label="状态">
				<el-switch
					v-model="ruleForm.status"
					inline-prompt
					active-text="开"
					inactive-text="关"
					:active-value="1"
					:inactive-value="0"
					width="80"
				/>
			</el-form-item>
			
			<el-form-item label="备注">
				<el-input type="textarea" v-model="ruleForm.remarks" placeholder="请输入备注信息" />
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="clsoeDialog()"> 取 消 </el-button>
			<el-button :loading="btnLoading" type="primary" @click="submitData"> 保 存 </el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import api from '/@/api/ice104/index';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';

const dialogVisible = ref(false);
const btnLoading = ref(false);
const emit = defineEmits(['updateList']);
const formRef = ref();
const ruleForm = ref({
	number: '',
	title: '',
	status: 1,
	remarks: "",
	mode: 0
})
const isEdit = ref(false);

const formRules = computed(() => ({
	number: [{ required: true, trigger: 'change', message: '请输入模版编码' }],
}));

const submitData = async () => {
	formRef.value.validate((valid: boolean) => {
		console.log(valid)
		if (!valid) return
		btnLoading.value = true
		if (isEdit.value) {
			// 修改
			api.template.editItem({
				...ruleForm.value,
			})
			.then(() => {
				ElMessage({ type: 'success', message: '修改成功' })
				emit('updateList')
				closeDialog()
			})
			.finally(() => (btnLoading.value = false))
		} else {
			// 新增
			api.template.addItem(ruleForm.value)
			.then(() => {
				ElMessage({ type: 'success', message: '添加成功' })
				emit('updateList')
				closeDialog()
			})
			.finally(() => (btnLoading.value = false))
		}
	})
}

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  dialogVisible.value = false;
  ruleForm.value = {
	number: '',
	title: '',
	status: 1,
	remarks: "",
	mode: 0
  }
}


const open = async (row: any) => {
	dialogVisible.value = true
	console.log(row)
	if (row && row.number.toString()) {
		console.log(row)
		ruleForm.value = row;
		isEdit.value = true;
	}else {
		isEdit.value = false;
	}
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.width100 {
	width: 100%;
}
</style>
