<template>
	<el-dialog
		class="api-edit"
		v-model="showDialog"
		:title="`${formData.id ? '编辑批次' : '新增批次'}`"
		width="768px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="160px">

			<el-form-item label="批次名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入批次名称" />
			</el-form-item>
			<el-form-item label="待升级版本号" prop="waitVersion" >
				<el-input v-model="formData.waitVersion" placeholder="请输入待升级版本号" />
			</el-form-item>

			<el-form-item label="协议方式" prop="method">
				<el-radio-group v-model="formData.method">
					<el-radio label="1">http</el-radio>
					<el-radio label="2">https</el-radio>
					<el-radio label="3">mqtt</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="所属设备" prop="devices" v-if="formData.method=='3'">
				<el-select v-model="formData.devices" filterable placeholder="请选择设备" >
					<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()" value-key="id"> </el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="升级方式" prop="stratege">
				<el-radio-group v-model="formData.stratege">
					<el-radio label="1">静态升级</el-radio>
					<el-radio label="2">动态升级</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="主动推送" prop="push">
				<el-radio-group v-model="formData.push">
					<el-radio label="1">是</el-radio>
					<el-radio label="2">否</el-radio>
				</el-radio-group>
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
import api from '/@/api/ota'
import { ruleRequired } from '/@/utils/validator'
import { ElMessage } from 'element-plus'


const emit = defineEmits(['getList'])

const showDialog = ref(false)
const formRef = ref()

const productData = ref([
	{
		id: '',
		name: '',
	},
])
const baseForm = {
	id: undefined,
	method: '1',
	push: '1',
	name: '',
	devices: '',
	stratege: '1',
	waitVersion: '',
	devOtaFirewareId: '',
	productId:'',
}

const formData = reactive({
	...baseForm,
})

const ruleForm = {
	method: [ruleRequired('请选择批次类型')],
	name: [ruleRequired('批次名称不能为空')],
	productId: [ruleRequired('请选择所属产品')],
	devices: [ruleRequired('请选择批次模块')],
	stratege: [ruleRequired('批次版本号不能为空')],
	waitVersion: [ruleRequired('升级后版本号不能为空')],
}


const onSubmit = async () => {
	await formRef.value.validate()

	const theApi = formData.id ? api.batch.edit : api.batch.add
	await theApi(formData)
	ElMessage.success('操作成功')
	resetForm()
	showDialog.value = false
	emit('getList')
}

const getProductList = () => {
	api.batch.getDeviceList({productId:formData.productId}).then((res: any) => {
		let productDataList = res.device
		productData.value = productDataList
	})
}

const resetForm = async () => {
	Object.assign(formData, { ...baseForm })
	formRef.value && formRef.value.resetFields()
}

const open = async (row: any) => {
	resetForm()
	showDialog.value = true
	nextTick(() => {
		Object.assign(formData, { ...row })
		getProductList()

	})
}

defineExpose({ open })
</script>
<style>
.vertical-form-item {
	display: block;
	margin-bottom: 10px;
	/* 可选，设置间距 */
}
</style>