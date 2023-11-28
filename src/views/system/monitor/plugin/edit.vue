<template>
	<el-dialog class="api-edit" v-model="showDialog" title="编辑插件内容" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="110px" @keyup.enter="onSubmit">
			<el-form-item label="插件类型" prop="types">
				<el-input v-model="formData.types" placeholder="输入接口名称" />
			</el-form-item>
			<el-form-item label="功能类型" prop="handleType">
				<el-input v-model="formData.handleType" placeholder="输入功能类型" />
			</el-form-item>
			<el-form-item label="名称" prop="name">
				<el-input v-model="formData.name" placeholder="输入名称" />
			</el-form-item>
			<el-form-item label="标题" prop="title">
				<el-input v-model="formData.title" placeholder="输入标题" />
			</el-form-item>
			<el-form-item label="说明" prop="description">
				<el-input v-model="formData.description" placeholder="输入名称" />
			</el-form-item>
			<el-form-item label="版本" prop="version">
				<el-input v-model="formData.version" placeholder="输入版本" />
			</el-form-item>
			<el-form-item label="作者" prop="author">
				<el-input v-model="formData.author" placeholder="输入作者" />
			</el-form-item>
			<el-form-item label="插件图标" prop="icon">
				<!-- <el-input v-model="formData.icon" placeholder="输入插件图标" /> -->
				<uploadVue :width-host="false" :img="formData.icon" @set-img="setImage"></uploadVue>
			</el-form-item>
			<el-form-item label="插件网址" prop="link">
				<el-input v-model="formData.link" placeholder="输入插件网址" />
			</el-form-item>
			<el-form-item label="运行指令" prop="command">
				<el-input v-model="formData.command" placeholder="输入运行指令" />
			</el-form-item>
			<el-form-item label="指令参数" prop="args">
				<el-input v-model="formData.args" placeholder="输入指令参数" />
			</el-form-item>
			<el-form-item label="有无插件页面" prop="frontendUi">
				<el-switch v-model="formData.frontendUi" :active-value="1" :inactive-value="0" />
			</el-form-item>
			<el-form-item label="插件页面地址" v-if="formData.frontendUi" prop="frontendUrl">
				<el-input v-model="formData.frontendUrl" placeholder="输入插件页面地址" />
			</el-form-item>
			<el-form-item label="显示配置页面" prop="frontendConfiguration">
				<el-switch v-model="formData.frontendConfiguration" :active-value="1" :inactive-value="0" />
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
import { ref, reactive, nextTick } from 'vue'
import api from '/@/api/system'
import { ruleRequired } from '/@/utils/validator'
import { ElMessage } from 'element-plus'
import uploadVue from '/@/components/upload/index.vue'

const emit = defineEmits(['getList'])

const showDialog = ref(false)
const formRef = ref()

const baseForm = {
	id: '',
	types: '',
	handleType: '',
	name: '',
	title: '',
	description: '',
	version: '',
	author: '',
	icon: '',
	link: '',
	command: '',
	args: [],
	frontendUi: 0,
	frontendUrl: '',
	frontendConfiguration: '',
}

const formData = reactive({
	...baseForm,
})

const ruleForm = {
	types: [ruleRequired('插件类型不能为空')],
	handleType: [ruleRequired('处理方式类型不能为空')],
	name: [ruleRequired('名称不能为空')],
	title: [ruleRequired('标题不能为空')],
	// version: [ruleRequired('版本不能为空')],
	// author: [ruleRequired('作者不能为空')],
	// icon: [ruleRequired('插件图标不能为空')],
	// command: [ruleRequired('运行指令不能为空')],
	// args: [ruleRequired('指令参数不能为空')],
}

const setImage = (data:string) => {
	formData.icon = data
}

const onSubmit = async () => {
	await formRef.value.validate()

	await api.plugin.edit(formData)

	ElMessage.success('操作成功')
	resetForm()
	showDialog.value = false
	emit('getList')
}

const resetForm = async () => {
	Object.assign(formData, { ...baseForm })
	formRef.value && formRef.value.resetFields()
}

const open = async (row: any) => {
	resetForm()
	showDialog.value = true
	nextTick(() => {
		Object.assign(formData, row)
		formData.author = JSON.parse(row.author).join(",");
	})
}

defineExpose({ open })
</script>
