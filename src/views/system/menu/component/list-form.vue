<template>
  <el-dialog v-model="showDialog" :title="`${formData.id?'编辑显示列':'新增显示列'}`" width="500px" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px">
      <el-form-item label="上级" prop="parentId">
        <el-cascader :options="parentData" :props="{ label: 'name',value: 'id',checkStrictly: true,emitPath: false }" placeholder="请选择上级菜单" clearable class="w100" v-model="formData.parentId"></el-cascader>
      </el-form-item>
      <el-form-item label="字段名称" prop="name">
        <el-input v-model="formData.name" placeholder="输入名称" />
      </el-form-item>
      <el-form-item label="字段key" prop="code">
        <el-input v-model="formData.code" placeholder="输入编码" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="说明" prop="description">
        <el-input v-model="formData.description" type="textarea" :rows="6" />
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
import { ref, reactive, PropType } from 'vue';
import api from '/@/api/system';
import { MenuListRow } from '/@/api/model/system/menu';
import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

defineProps({
	parentData: Array as PropType<MenuListRow[]>,
});

const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();

const baseForm: MenuListRow = {
	parentId: -1,
	menuId: 0,
	name: '',
	code: '',
	description: '',
	status: 1,
};

const formData = reactive<MenuListRow>({
	...baseForm,
});

const ruleForm = {
	name: [ruleRequired('字段名称不能为空')],
	code: [ruleRequired('字段key不能为空')],
};

const onSubmit = async () => {
	await formRef.value.validate();

	if (!formData.parentId) {
		formData.parentId = -1;
	}

	const theApi = formData.id ? api.menu.list.edit : api.menu.list.add;

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
	Object.assign(formData, { ...row });
	showDialog.value = true;
	// console.log(row);
};

defineExpose({ open });
</script>
