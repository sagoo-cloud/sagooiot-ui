<template>
	<el-dialog
		:title="isEdit ? '修改设备' : '添加设备'"
		v-model="dialogVisible"
		width="600px"
		:before-close="closeDialog"
		:close-on-click-modal="false"
	>
		<el-form ref="formRef" :rules="formRules" :model="ruleForm" label-position="left" label-width="120px" style="width: 90%; margin: 0 auto">
			<el-form-item label="设备编码" prop="number">
				<el-input :disabled="isEdit" v-model="ruleForm.number" placeholder="请输入设备编码" />
			</el-form-item>
			<el-form-item label="名称">
				<el-input v-model="ruleForm.title" placeholder="请输入名称" />
			</el-form-item>
			<el-form-item label="设备通用地址">
				<el-input type="number" v-model.number="ruleForm.commonAddr" placeholder="请输入设备通用地址" />
			</el-form-item>
			<el-form-item label="mac地址">
				<el-input v-model="ruleForm.subCode" placeholder="请输入mac地址" />
			</el-form-item>
			<el-form-item label="模版编号">
				<el-select v-model="ruleForm.templateNumber" placeholder="请选择模版编号" class="width100">
					<el-option :label="item.title" :value="item.number" v-for="(item, index) in tableData" :key="index" />
				</el-select>
			</el-form-item>
			<el-form-item label="产品key">
				<el-select @change="handleProductChange" v-model="ruleForm.productKey" placeholder="请选择产品key" class="width100">
					<el-option :label="item.name" :value="item.key" v-for="(item, index) in productList" :key="index" />
				</el-select>
			</el-form-item>
			<el-form-item label="设备key" v-if="ruleForm.productKey">
				<el-select v-model="ruleForm.deviceKey" placeholder="请选择设备key" class="width100">
					<el-option :label="item.name" :value="item.key" v-for="(item, index) in deviceList" :key="index" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button v-auth="'cancelSaveDevice'" @click="closeDialog()"> 取 消 </el-button>
			<el-button v-auth="'saveDevice'" :loading="btnLoading" type="primary" @click="submitData"> 保 存 </el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from 'vue';
import api from '/@/api/ice104/index';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonIce104';
import apiDevice from '/@/api/device';

const { params, tableData, getList, loading } = useSearch(api.template.getAll, 'data', { title: '' });
getList();

const dialogVisible = ref(false);
const btnLoading = ref(false);
const productList = ref([]);
const deviceList = ref([]);
const emit = defineEmits(['updateList']);
const formRef = ref();
const ruleForm = ref({
	number: '',
	title: '',
	commonAddr: '',
	subCode: '',
	templateNumber: '',
	productKey: '',
	deviceKey: '',
})
const isEdit = ref(false);

const formRules = computed(() => ({
	number: [{ required: true, trigger: 'change', message: '请输入设备编码' }],
}));

const submitData = async () => {
	formRef.value.validate((valid: boolean) => {
		if (!valid) return
		btnLoading.value = true
		if (isEdit.value) {
			// 修改
			api.device.editItem({
				...ruleForm.value,
			})
			.then(() => {
				ElMessage({ type: 'success', message: '修改成功' })
				emit('updateList')
				closeDialog()
			})
			.finally(() => (btnLoading.value = false))
		} else {
			// 新增
			api.device.addItem(ruleForm.value)
			.then(() => {
				ElMessage({ type: 'success', message: '添加成功' })
				emit('updateList')
				closeDialog()
			})
			.finally(() => (btnLoading.value = false))
		}
	})
}

const handleProductChange = (data:any) => {
	ruleForm.value.deviceKey = "";
	let findItem:any = productList.value.find((v: any) => v.key === data);
	getDeviceList(findItem.id)
}

const getDeviceList = (id:number) => {
	apiDevice.device.allList({productId: id}).then((res: any) => {
		deviceList.value = res.device
	})
}

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  dialogVisible.value = false;
  ruleForm.value = {
	number: '',
	title: '',
	commonAddr: '',
	subCode: '',
	templateNumber: '',
	productKey: '',
	deviceKey: ''
  }
}


const open = async (row: any) => {
	dialogVisible.value = true
	if (row && row.number.toString()) {
		ruleForm.value = row;
		isEdit.value = true;
	}else {
		isEdit.value = false;
	}
}


const getDeviceProduct = () => {
	apiDevice.product.getLists({}).then((res: any) => {
		productList.value = res.product
	})
}

// 页面加载时
onMounted(() => {
	getDeviceProduct();
});

defineExpose({ open })
</script>

<style lang="scss" scoped>
.width100 {
	width: 100%;
}
</style>
