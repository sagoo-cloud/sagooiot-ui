<template>
	<el-dialog
		class="api-edit"
		v-model="showDialog"
		:title="`${formData.id ? '编辑升级包' : '新增升级包'}`"
		width="768px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="160px">
			<el-form-item label="升级包类型" prop="typo">
				<el-radio-group v-model="formData.typo">
					<el-radio label="1">整包</el-radio>
					<el-radio label="2">差分</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="升级包名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入升级包名称" />
			</el-form-item>
			<el-form-item label="所属产品" prop="productId">
				<el-select v-model="formData.productId" filterable placeholder="请选择产品" @change="seletChange">
					<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()" value-key="id"> </el-option>
				</el-select>
			</el-form-item>
			<div>
				<el-form-item label="升级包模块" prop="module">
					<el-select v-model="formData.module" filterable placeholder="请选择产品">
						<el-option v-for="item in moduleData" :key="item.id" :label="item.name" :value="item.id.toString()" value-key="id"> </el-option>
				</el-select>
				</el-form-item>
			</div>
			<el-form-item label="升级包版本号" prop="version" v-if="formData.typo == '1'">
				<el-input v-model="formData.version" placeholder="请输入待升级包版本号" />
			</el-form-item>

			<el-form-item label="待升级版本号" prop="waitVersion" v-if="formData.typo == '2'">
				<el-input v-model="formData.waitVersion" placeholder="请输入待升级版本号" />
			</el-form-item>

			<el-form-item label="升级后版本号" prop="afterVersion" v-if="formData.typo == '2'">
				<el-input v-model="formData.afterVersion" placeholder="请输入升级后版本号" />
			</el-form-item>

			<el-form-item label="算法签名" prop="are">
				<el-select v-model="formData.are" filterable placeholder="请选择算法签名">
					<el-option v-for="item in areType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="选择升级包" prop="url">
				<el-upload :accept="['.bin','.tar','.gz','.tar.xz','.zip','.gzip','.apk','.dav','.pack']" :show-file-list="false" :limit="1" :headers="headers" :action="uploadUrl" :on-success="updateImg">
					<el-button type="Default">上传升级包</el-button>
				</el-upload>
				<div v-if="url_name" style="color: green;margin-left: 10px;">{{url_name}}，上传成功</div>

			</el-form-item>

			<el-form-item label="升级包是否验证" prop="check">
				<el-radio-group v-model="formData.check">
					<el-radio :label="1">是</el-radio>
					<el-radio :label="2">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="升级包描述" prop="describe">
				<el-input v-model="formData.describe" type="textarea" :rows="3" />
			</el-form-item>

			<el-form-item label="推送设备的自定义消息" prop="info">
				<el-input v-model="formData.info" type="textarea" :rows="3" />
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
import getOrigin from '/@/utils/origin';


const emit = defineEmits(['getList'])

const showDialog = ref(false)
const formRef = ref()
const uploadUrl: string = getOrigin(import.meta.env.VITE_API_URL + "/common/singleFile");
const headers = {
		Authorization: 'Bearer ' + localStorage.token,
};
const areType = ref([
	{
		label: 'MD5',
		value: 'MD5',
	},
	{
		label: 'SHA256',
		value: 'SHA256',
	},
])
const productData = ref([
	{
		id: '',
		name: '',
	},
])
const moduleData = ref([
	{
		id: '',
		name: '',
	},
])
const baseForm = {
	id: undefined,
	typo: '1',
	name: '',
	productId: '',
	module: '',
	version: '',
	are: 'MD5',
	url: '',
	check: 1,
	describe: '',
	info: '',
	afterVersion: '',
	waitVersion: '',
}

const url_name=ref();

const formData = reactive({
	...baseForm,
})

const ruleForm = {
	typo: [ruleRequired('请选择升级包类型')],
	name: [ruleRequired('升级包名称不能为空')],
	productId: [ruleRequired('请选择所属产品')],
	module: [ruleRequired('请选择升级包模块')],
	version: [ruleRequired('升级包版本号不能为空')],
	are: [ruleRequired('算法签名不能为空')],
	check: [ruleRequired('升级包是否验证不能为空')],
	// url: [ruleRequired('升级包不能为空')],
	afterVersion: [ruleRequired('待升级版本号不能为空')],
	waitVersion: [ruleRequired('升级后版本号不能为空')],
}

const updateImg = (res: any) => {
			if (res.code === 0) {
				formData.url=res.data.full_path
				url_name.value=res.data.name
				ElMessage.success('上传成功');
			} else {
				ElMessage.error(res.message);
			}
		};

const onSubmit = async () => {
	await formRef.value.validate()

	const theApi = formData.id ? api.manage.edit : api.manage.add

	await theApi(formData)

	ElMessage.success('操作成功')
	resetForm()
	showDialog.value = false
	emit('getList')
}

const seletChange = (val: Number) => {
	formData.module='';
	getModuleList(val);
};

const getModuleList = (productID: Number) => {
	api.module.getList({productID:productID}).then((res: any) => {
		let productDataList = res.Data
		moduleData.value = productDataList
	})
}

const getProductList = () => {
	api.module.getSubList().then((res: any) => {
		let productDataList = res.product
		productData.value = productDataList
	})
}
getProductList()

const resetForm = async () => {
	Object.assign(formData, { ...baseForm })
	formRef.value && formRef.value.resetFields()
}

const open = async (row: any) => {
	resetForm()
	showDialog.value = true
	nextTick(() => {
		Object.assign(formData, { ...row })
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