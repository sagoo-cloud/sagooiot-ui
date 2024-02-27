<template>
	<el-dialog class="api-edit" v-model="showDialog" title="批量绑定接口" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px" @keyup.enter="onSubmit">
			<el-form-item label="选择接口" prop="apiIds">
				<el-cascader :options="menuData" :props="{ checkStrictly: false, multiple: true, emitPath: false, value: 'id', label: 'name' }" placeholder="请选择关联页面" filterable clearable class="w100" v-model="formData.apiIds"></el-cascader>
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
import { ref, reactive } from 'vue';
import api from '/@/api/system';
import { ApiRow } from '/@/api/model/system/menu';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['getList']);

const showDialog = ref(false);
const menuId = ref();
const formRef = ref();
const menuData = ref<any[]>([]);

const baseForm: any = {
	apiIds: [],
};

const formData = reactive<any>({
	...baseForm,
});

const ruleForm = {};

const onSubmit = async () => {
	await formRef.value.validate();

	await api.menu.api.add({
		menuId: menuId.value,
		apiIds: formData.apiIds
	});

	ElMessage.success('操作成功');
	resetForm();
	showDialog.value = false;
	emit('getList');
};

const resetForm = async () => {
	Object.assign(formData, { apiIds: [] });
	formRef.value && formRef.value.resetFields();
};

const open = async (idsArr: any, id: number) => {
	menuId.value = id
	resetForm();
	// 加载菜单列表
	api.api.getList({ types: -1, status: -1 }).then((res: any) => {
		menuData.value = res.Info || [];
	});
	formData.apiIds = idsArr;
	showDialog.value = true;
};

defineExpose({ open });
</script>
