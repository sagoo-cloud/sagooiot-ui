<template>
	<el-dialog class="api-edit" v-model="showDialog" title="批量关联菜单" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px" @keyup.enter="onSubmit">
			<el-form-item label="关联页面" prop="menuIds">
				<el-cascader :options="menuData" :props="{ checkStrictly: true, multiple: true, emitPath: false, value: 'id', label: 'title' }" placeholder="请选择关联页面" filterable clearable class="w100" v-model="formData.menuIds"></el-cascader>
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
import { ref, reactive, nextTick, watch } from 'vue';
import api from '/@/api/system';
import { ApiRow } from '/@/api/model/system/menu';
import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

const ids = ref<number[]>([])
const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();
const menuData = ref<any[]>([]);

const baseForm: any = {
	menuIds: [],
};

const formData = reactive<ApiRow>({
	...baseForm,
});

const ruleForm = {
	// menuIds: [ruleRequired('关联页面不能为空', 'change')],
};

// 加载菜单列表
api.menu.getList({ status: -1 }).then((res: any[]) => {
	menuData.value = res;
});

const onSubmit = async () => {
	await formRef.value.validate();

	await api.api.bindMenus(ids.value.map((id: number) => ({ id, menuIds: formData.menuIds })));

	ElMessage.success('操作成功');
	resetForm();
	showDialog.value = false;
	emit('getList');
};

const resetForm = async () => {
	Object.assign(formData, { menuIds: [] });
	formRef.value && formRef.value.resetFields();
};

const open = async (idsArr: any) => {
	resetForm();
	ids.value = idsArr;
	showDialog.value = true;
};

defineExpose({ open });
</script>
