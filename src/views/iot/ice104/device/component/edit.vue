<template>
	<el-dialog
		:title="isEdit ? '修改设备' : '添加设备'"
		v-model="dialogVisible"
		width="600px"
		:before-close="clsoeDialog"
		:close-on-click-modal="false"
	>
		<el-form ref="formRef" :rules="formRules" :model="ruleForm" label-position="left" label-width="120px" style="width: 90%; margin: 0 auto">
			<el-form-item label="设备编码" prop="number">
				<el-input :disabled="isEdit" v-model="ruleForm.number" placeholder="请输入设备编码" />
			</el-form-item>
			<el-form-item label="名称">
				<el-input v-model="ruleForm.title" placeholder="请输入名称" />
			</el-form-item>
			<el-form-item label="设备通用地址">
				<el-input type="number" v-model.number="ruleForm.commonAddr" placeholder="请输入设备通用地址" />
			</el-form-item>
			<el-form-item label="mac地址">
				<el-input v-model="ruleForm.subCode" placeholder="请输入mac地址" />
			</el-form-item>
			<el-form-item label="模版编号">
				<el-select v-model="ruleForm.templateNumber" placeholder="请选择模版编号" class="width100">
					<el-option :label="item.title" :value="item.number" v-for="(item, index) in tableData" :key="index"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品key">
				<el-input v-model="ruleForm.productKey" placeholder="请输入产品key" />
			</el-form-item>
			<el-form-item label="设备key">
				<el-input v-model="ruleForm.deviceKey" placeholder="请输入设备key" />
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
import { useSearch } from '/@/hooks/useCommonIce104';

const { params, tableData, getList, loading } = useSearch(api.template.getAll, 'data', { title: '' });
getList();

const dialogVisible = ref(false);
const btnLoading = ref(false);
const emit = defineEmits(['updateList']);
const formRef = ref();
const ruleForm = ref({
	number: '',
	title: '',
	commonAddr: '',
	subCode: '',
	templateNumber: '',
	productKey: '',
	deviceKey: '',
})
const isEdit = ref(false);

const formRules = computed(() => ({
	number: [{ required: true, trigger: 'change', message: '请输入设备编码' }],
}));

const submitData = async () => {
	formRef.value.validate((valid: boolean) => {
		console.log(valid)
		if (!valid) return
		btnLoading.value = true
		if (isEdit.value) {
			// 修改
			api.device.editItem({
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
			api.device.addItem(ruleForm.value)
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
	id: '',
	number: '',
	title: '',
	commonAddr: '',
	subCode: '',
	templateNumber: '',
	productKey: '',
	deviceKey: ''
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
