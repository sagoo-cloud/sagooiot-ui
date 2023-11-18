<template>
	<el-dialog class="api-edit" v-model="showDialog" :title="`${formData.id ? '编辑大屏' : '新增大屏'}`" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px">
			<el-form-item label="大屏名称" prop="projectName">
				<el-input v-model.trim="formData.projectName" placeholder="输入大屏名称" />
			</el-form-item>
			<el-form-item label="说明" prop="remarks">
				<el-input v-model="formData.remarks" type="textarea" :rows="3" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="showDialog = false">取消</el-button>
				<el-button type="primary" @click="onSubmit">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import api from '/@/api/screen';
import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();

const baseForm = {
	id: undefined,
	indexImage: null,
	projectName: '',
	remarks: '',
};

const formData = reactive({
	...baseForm,
});

const ruleForm = {
	projectName: [ruleRequired('规则名称不能为空')],
};

const onSubmit = async () => {
	await formRef.value.validate();

	const theApi = formData.id ? api.edit : api.add;

	await theApi(formData);

	ElMessage.success('操作成功');
	resetForm();
	showDialog.value = false;
	emit('getList');
};

const resetForm = async () => {
	Object.assign(formData, { ...baseForm });
	formRef.value && formRef.value.resetFields();
};

const open = async (row: any) => {
	resetForm();
	showDialog.value = true;
	nextTick(() => {
		Object.assign(formData, { ...row });
	});
};

defineExpose({ open });
</script>
