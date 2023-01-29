<template>
	<el-dialog
		class="api-edit"
		v-model="showDialog"
		:title="`${formData.id ? '编辑接口' : '新增接口'}`"
		width="600px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px" @keyup.enter="onSubmit">
			<el-form-item label="选择类型" prop="types">
				<el-radio-group v-model="formData.types">
					<el-radio-button :label="2">接口</el-radio-button>
					<el-radio-button :label="1">分类</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<template v-if="formData.types === 1">
				<el-form-item label="上级分类" prop="parentId">
					<el-cascader
						:options="[
							{
								id: -1,
								name: '根节点',
								children: typeData,
							},
						]"
						:props="{ checkStrictly: true, multiple: false, emitPath: false, value: 'id', label: 'name' }"
						placeholder="请选择关联页面"
						clearable
						class="w100"
						v-model="formData.parentId"
					></el-cascader>
				</el-form-item>
				<el-form-item label="分类名称" prop="name">
					<el-input v-model="formData.name" placeholder="输入接口名称" />
				</el-form-item>
			</template>
			<template v-else>
				<el-form-item label="上级分类" prop="parentId">
					<el-cascader
						:options="typeData"
						:props="{ checkStrictly: true, multiple: false, emitPath: false, value: 'id', label: 'name' }"
						placeholder="请选择关联页面"
						clearable
						class="w100"
						v-model="formData.parentId"
					></el-cascader>
				</el-form-item>
				<el-form-item label="关联页面" prop="menuIds">
					<el-cascader
						:options="menuData"
						:props="{ checkStrictly: false, multiple: true, emitPath: false, value: 'id', label: 'title' }"
						placeholder="请选择关联页面"
						clearable
						class="w100"
						v-model="formData.menuIds"
					></el-cascader>
				</el-form-item>
				<el-form-item label="接口名称" prop="name">
					<el-input v-model="formData.name" placeholder="输入接口名称" />
				</el-form-item>
				<el-form-item label="接口地址" prop="address">
					<el-input v-model="formData.address" placeholder="接口地址" />
				</el-form-item>
				<el-form-item label="访问类型" prop="method">
					<el-select v-model="formData.method" placeholder="请选择访问类型">
						<el-option v-for="item in methodOptions" :key="item.value" :label="item.key" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
				</el-form-item>
			</template>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="formData.remark" type="textarea" :rows="3" />
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
import apiDatahub from '/@/api/datahub';

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
