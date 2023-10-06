<template>
	<el-dialog class="api-edit" v-model="showDialog" :title="`${formData.id ? '编辑模块' : '新增模块'}`" width="600px"
		:close-on-click-modal="false" :close-on-press-escape="false">
		<el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px">


		
			<el-form-item label="所属产品" prop="productId">
				<el-select v-model="formData.productId" filterable placeholder="请选择产品">
					<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()" value-key="id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="模块名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入模块名称" />
			</el-form-item>
			
			<el-form-item label="模块别名" prop="nameAs">
				<el-input v-model="formData.nameAs" placeholder="请输入模块别名" />
			</el-form-item>

			
			<el-form-item label="模块描述" prop="describe">
				<el-input v-model="formData.describe" type="textarea" :rows="3" />
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
import api from '/@/api/ota';
import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';
import uploadFile from '/@/components/upload/uploadFile.vue'


const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();
const productData=ref([{
	'id':'',
	'name':'',
}]);

const baseForm = {
	id: undefined,
	name: '',
	productId: '',
	nameAs: '',
	describe: '',
};

const formData = reactive({
	...baseForm,
});

const ruleForm = {
	name: [ruleRequired('模块名称不能为空')],
	productId: [ruleRequired('所属产品不能为空')],
};

const onSubmit = async () => {
	await formRef.value.validate();

	const theApi = formData.id ? api.module.edit : api.module.add;

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
const getProductList = () => {
			api.module.getSubList().then((res: any) => {
				let productDataList = res.product;
				productData.value = productDataList;
	
			});
		};
const open = async (row: any) => {
	getProductList();

	resetForm();
	showDialog.value = true;
	nextTick(() => {
		Object.assign(formData, { ...row });
	});
};

defineExpose({ open });
</script>
<style>
.vertical-form-item {
	display: block;
	margin-bottom: 10px;
	/* 可选，设置间距 */
}
</style>