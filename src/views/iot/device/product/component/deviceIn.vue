<template>
	<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px" @keyup.enter="onSubmit">
		<!-- <el-form-item label="上级分类" prop="parentId">
			<el-cascader :options="typeData" :props="{ checkStrictly: true, multiple: false, emitPath: false, value: 'id', label: 'name' }" placeholder="请选择关联页面" clearable class="w100" v-model="formData.parentId"></el-cascader>
		</el-form-item>
		<el-form-item label="关联页面" prop="menuIds">
			<el-cascader :options="menuData" :props="{ checkStrictly: false, multiple: true, emitPath: false, value: 'id', label: 'title' }" placeholder="请选择关联页面" clearable class="w100" v-model="formData.menuIds"></el-cascader>
		</el-form-item>
		<el-form-item label="接口名称" prop="name">
			<el-input v-model="formData.name" placeholder="输入接口名称" />
		</el-form-item>
		<el-form-item label="接口地址" prop="address">
			<el-input v-model="formData.address" placeholder="接口地址" />
		</el-form-item> -->
	</el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watch } from 'vue';
import api from '/@/api/system';
import { ApiRow } from '/@/api/model/system/menu';
import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';
import apiDatahub from '/@/api/datahub';

// TODO 这个页面还没开始开发

const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();
const menuData = ref<any[]>([]);
const typeData = ref<any[]>([]);
const methodOptions = ref<any[]>([]);

const baseForm: ApiRow = {
	menuIds: [],
	id: undefined,
	parentId: undefined,
	name: '',
	types: 2,
	address: '',
	method: '',
	remark: '',
	status: 1,
};

const formData = reactive<ApiRow>({
	...baseForm,
});

// 切换分类时清空上级分类的选择。因为接口里不能选择跟分类节点
watch(
	() => formData.types,
	() => {
		formData.parentId = undefined;
	}
);

const ruleForm = {
	parentId: [ruleRequired('上级分类不能为空', 'change')],
	menuIds: [ruleRequired('关联页面不能为空', 'change')],
	method: [ruleRequired('请求方式不能为空', 'change')],
	name: [ruleRequired('接口名称不能为空')],
	address: [ruleRequired('接口地址不能为空')],
};

apiDatahub.template.getDictData({ DictType: 'api_methods' }).then((res: any) => {
	methodOptions.value = res.values;
});

// 加载菜单列表
api.menu.getList({ status: -1 }).then((res: any[]) => {
	menuData.value = res;
});

const onSubmit = async () => {
	await formRef.value.validate();

	const theApi = formData.id ? api.api.edit : api.api.add;

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
	api.api.getList({ types: 1, status: -1 }).then((res: any) => {
		typeData.value = res.Info;
	});
	nextTick(() => {
		Object.assign(formData, { method: methodOptions.value.length ? methodOptions.value[0].value : '', ...row });
	});
};

defineExpose({ open });
</script>
