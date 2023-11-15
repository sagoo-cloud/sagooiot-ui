<!--
 * @Author: yukai
 * @Date: 2023-09-18 13:15:34
 * @LastEditors: 
 * @LastEditTime: 2023-11-02 10:36:07
 * @Description: 请填写简介
-->
<template>
	<el-dialog
		class="api-edit"
		v-model="showDialog"
		:title="`${formData.id ? '编辑场景' : '新增场景'}`"
		width="600px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px">
			<el-form-item label="场景名称" prop="name">
				<el-input v-model.trim="formData.name" placeholder="请输入场景名称" />
			</el-form-item>
      <el-form-item label="触发方式" prop="sceneType">
        <el-radio-group v-model="formData.sceneType">
          <el-radio label="device" >设备触发</el-radio>
          <el-radio label="manual" >手动触发</el-radio>
          <el-radio label="timer" >定时触发</el-radio>
        </el-radio-group>
      </el-form-item>
			<el-form-item label="场景描述" prop="description">
				<el-input v-model="formData.description" type="textarea" :rows="3" />
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
import { ref, reactive, nextTick} from 'vue';
import api from '/@/api/scene';
import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();

const baseForm = {
	id: undefined,
	name: '',
	sceneType:"device",
	description: '',
};

const formData = reactive({
	...baseForm,
});

const ruleForm = {
	name: [ruleRequired('场景名称不能为空')],
};

const onSubmit = async () => {
	await formRef.value.validate();

	const theApi = formData.id ? api.manage.edit : api.manage.add;

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
