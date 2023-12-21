<template>
	<el-dialog
		class="api-edit"
		v-model="showDialog"
		:title="`${formData.id ? '编辑设备档案属性' : '新增设备档案属性'}`"
		width="800px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<el-form class="inline-form" ref="formRef" :model="formData" :rules="ruleForm" label-width="120px">
			<el-form-item label="所属产品" prop="productKey">
				<el-select v-model="formData.productKey" placeholder="请选择产品" class="w100" disabled>
					<el-option v-for="item in productData" :key="item.key" :label="item.name" :value="item.key">
						<span style="float: left">{{ item.name }}</span>
						<span style="float: right; font-size: 13px">{{ item.key }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="字段名称" prop="name">
				<el-input v-model.trim="formData.name" placeholder="请输入字段名称" />
			</el-form-item>
			<el-form-item label="字段标题" prop="title">
				<el-input v-model.trim="formData.title" placeholder="请输入字段标题" />
			</el-form-item>
			<el-form-item label="字段类型" prop="types">
						<el-select v-model="formData.types" placeholder="请字段类型" class="w100" clearable>
							<el-option v-for="item in typesData" :key="item.value" :label="item.name" :value="item.value">
						</el-option>
						</el-select>
					</el-form-item>

			<el-form-item label="字段描述" prop="desc">
				<el-input v-model.trim="formData.desc" placeholder="请输入字段描述" />
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
import api from '/@/api/device'
import { ruleRequired } from '/@/utils/validator'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['getList'])

const showDialog = ref(false)
const formRef = ref()
const productData=ref();
const typesData = ref([{
	value:'input',
	name:'输入框',
},{
	value:'textarea',
	name:'文本框',
},{
	value:'date',
	name:'日期',
},{
	value:'file',
	name:'上传图片',
}])
const baseForm = {
	id: undefined,
	name: '',
	productKey: '',
	title: '',
	types: '',
	desc: '',
}

const formData = reactive({
	...baseForm,
})

const ruleForm = {
	name: [ruleRequired('字段名称不能为空')],
	title: [ruleRequired('字段标题不能为空')],
	productKey: [ruleRequired('所属产品不能为空')],
	types: [ruleRequired('字段类型不能为空')],
}


const onSubmit = async () => {
	await formRef.value.validate()

	const theApi = formData.id ? api.dev_asset_metadata.edit : api.dev_asset_metadata.add

	await theApi(formData)

	ElMessage.success('操作成功')
	resetForm()
	showDialog.value = false
	emit('getList')
}

const resetForm = async () => {
	Object.assign(formData, { ...baseForm })
	formRef.value && formRef.value.resetFields()
}

const open = async (row: any, productInfo: any) => {
	resetForm()
	showDialog.value = true
	nextTick(() => {
		Object.assign(formData, { ...row })

		//获取 所有的产品
		api.product.getLists({}).then((res: any) => {
			productData.value = res.product
		})
	
		formData.productKey = productInfo.key
	})
}

defineExpose({ open })
</script>
<style scoped lang="scss">
.demo-form-inline .el-input {
	--el-input-width: 320px;
}
</style>