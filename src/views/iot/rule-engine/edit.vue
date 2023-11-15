<template>
	<el-dialog
		class="api-edit"
		v-model="showDialog"
		:title="`${formData.id ? '编辑数据转发' : '新增数据转发'}`"
		width="600px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px">
			<el-form-item label="规则名称" prop="name">
				<el-input v-model="formData.name" placeholder="输入接口名称" />
			</el-form-item>
			<el-form-item label="说明" prop="expound">
				<el-input v-model="formData.expound" type="textarea" :rows="3" />
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
import api from '/@/api/rule';
import axios from 'axios';
import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['getList']);

const props = defineProps({
	types: {
		type: Number,
		default: 0, // 规则编排是0 数据转发是1
	},
});

const headers = {
	Authorization: 'Bearer ' + localStorage.token,
};
const flowsUrl = window.location.origin + '/rule-engine/flow';
// const flowsUrl = 'http://zhgy.sagoo.cn/rule-engine/flow';


const showDialog = ref(false);
const formRef = ref();

const baseForm = {
	id: undefined,
	name: '',
	types: props.types,
	// types: 0,
	flowId: '',
	expound: '',
};

const formData = reactive({
	...baseForm,
});

const ruleForm = {
	name: [ruleRequired('规则名称不能为空')],
};

const onSubmit = async () => {
	await formRef.value.validate();

	if (!formData.id) {
		const { data } = await axios.post(
			flowsUrl,
			{
				label: formData.name,
				disabled: true,
				info: '',
				env: [],
				nodes: [],
			},
			{
				headers,
			}
		);
		formData.flowId = data.id;
	} else {
		// 找到所有规则
		const { data: flows } = await axios.get(flowsUrl + 's', { headers });

		const flow = flows.find((item: any) => item.id === formData.flowId);

		if (!flow) {
			ElMessage.error('规则不存在');
			return;
		}

		flow.label = formData.name;

		// 设置规则状态
		await axios.post(flowsUrl + 's', flows, { headers });
	}

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
