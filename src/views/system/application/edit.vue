<template>
	<el-dialog class="api-edit" v-model="showDialog" :title="`${formData.id ? '编辑应用' : '新增应用'}`" width="600px"
		:close-on-click-modal="false" :close-on-press-escape="false">
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px">
			<el-form-item label="应用标识" prop="appId" v-if="formData.id">
				<el-input v-model="formData.appId" placeholder="请输入应用标识"  disabled/>
			</el-form-item>
			<el-form-item label="应用名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入应用名称" />
			</el-form-item>
			<el-form-item label="应用图标" prop="icon">
				<uploadVue :img="formData.icon" @set-img="handleAvatarSuccess"></uploadVue>
			</el-form-item>
			<el-form-item label="AK" prop="accessKey">
				<el-input v-model="formData.accessKey" placeholder="请输入ak，应用接入认证" />
			</el-form-item>
			<el-form-item label="SK" prop="secureKey">
				<el-input v-model="formData.secureKey" placeholder="请输入sk，应用接入认证" />
			</el-form-item>
			<el-form-item label="组织" prop="orgId">
				<el-cascader :options="deptData"
					:props="{ checkStrictly: true, emitPath: false, value: 'deptId', label: 'deptName' }"
					placeholder="请选择组织" clearable class="w100" v-model="formData.orgId
						">
					<template #default="{ node, data }">
						<span>{{ data.deptName }}</span>
						<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
					</template>
				</el-cascader>
			</el-form-item>
			<el-form-item label="应用描述" prop="desc">
				<el-input v-model="formData.desc" type="textarea" :rows="3" />
			</el-form-item>
			<!-- <el-form-item label="应用类型" prop="name">
				<el-input v-model="formData.name" placeholder="请输入应用类型" />
			</el-form-item> -->
			<el-form-item label="应用状态" prop="status">
				<el-radio-group v-model="formData.status">
					<el-radio :label="1">启用</el-radio>
					<el-radio :label="0">未启用</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<el-form-item label="回调地址" prop="callbackUri">
			<el-input v-model="formData.callbackUri" placeholder="请输入回调地址" />
		</el-form-item>
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
import api from '/@/api/application'
import { ruleRequired } from '/@/utils/validator';
import { ElMessage, UploadProps } from 'element-plus';
import uploadVue from '/@/components/upload/index.vue'
const emit = defineEmits(['getList']);
const showDialog = ref(false);
const formRef = ref();
const props = defineProps({
	deptData: {
		type: Array,
		default: () => [],
	},
})
const baseForm = {
	id: undefined,
	appId:'',
	name: '',
	icon: '',
	accessKey: '',
	secureKey: '',
	orgId: '',
	roleId: '',
	desc: '',
	status: 1,
	callbackUri:''
};
const formData = reactive({
	...baseForm,
});
const ruleForm = {
	name: [ruleRequired('应用名称不能为空')],
	icon: [ruleRequired('应用图标不能为空')],
	accessKey: [ruleRequired('AK不能为空')],
	secureKey: [ruleRequired('SK不能为空')],
	orgId: [ruleRequired('组织不能为空')],
	roleId: [ruleRequired('角色不能为空')],
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
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
	formData.icon = response
}
const resetForm = async () => {
	Object.assign(formData, { ...baseForm });
	formRef.value && formRef.value.resetFields();
};

const open = async (row: any) => {
	resetForm();
	showDialog.value = true;
	nextTick(() => {
		Object.assign(formData, { ...row });
		console.log(formData);

	});
};

defineExpose({ open });
</script>
<style>
.vertical-form-item {
	display: block;
	margin-bottom: 10px;
	/* 可选，设置间距 */
}</style>