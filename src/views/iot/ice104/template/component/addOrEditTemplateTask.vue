<!-- 添加或者修改设备 -->
<template>
	<el-dialog
		:title="isEdit ? '修改模版点位' : '添加模版点位'"
		v-model="dialogVisible"
		width="600px"
		:before-close="closeDialog"
		:close-on-click-modal="false"
	>
		<el-form ref="formRef" :rules="formRules" :model="ruleForm" label-position="left" label-width="120px" style="width: 90%; margin: 0 auto">
			<el-form-item label="点位名称" prop="title">
				<el-input v-model="ruleForm.title" placeholder="请输入点位名称" />
			</el-form-item>
			<el-form-item label="数据项编码" prop="dataAttribName">
				<el-input v-model="ruleForm.dataAttribName" placeholder="请输入数据项编码" />
			</el-form-item>
			<el-form-item label="数据项点位" prop="dataAddress">
				<el-input type="number" :min="0" v-model.number="ruleForm.dataAddress" placeholder="请输入数据项点位" />
			</el-form-item>
			<el-form-item label="倍率" prop="dataCoef">
				<el-input v-model="ruleForm.dataCoef" placeholder="请输入倍率" />
			</el-form-item>

		</el-form>
		<template #footer>
			<el-button v-auth="'cancelData'" @click="closeDialog()"> 取 消 </el-button>
			<el-button v-auth="'saveData'" :loading="btnLoading" type="primary" @click="submitData"> 保 存 </el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from 'vue';
import api from '/@/api/ice104/index';
import { ElMessage } from 'element-plus';
import apiDevice from '/@/api/device';
import { useRoute } from 'vue-router';

const route = useRoute();

const dialogVisible = ref(false);
const btnLoading = ref(false);
const emit = defineEmits(['updateList']);

const formRef = ref();
const ruleForm = ref({
    dtId: 0,
	title: '',
	templateNumber: route.params && route.params.id,
	dataAttribName: '',
	dataAddress: 0,
	DataCoef: ''
})
const isEdit = ref(false);

const formRules = computed(() => ({
	title: [{ required: true, trigger: 'blur', message: '请输入点位名称' }],
	dataAttribName: [{ required: true, trigger: 'blur', message: '请输入数据项编码' }],
	dataAddress: [{ required: true, trigger: 'blur', message: '请输入数据项点位' }],
	dataCoef: [{ required: true, trigger: 'blur', message: '请输入倍率' }],
}));
const getRandom = (num:number) =>{
    return Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,num-1));
}
const submitData = async () => {
	formRef.value.validate((valid: boolean) => {
		if (!valid) return
		btnLoading.value = true
		if (isEdit.value) {
			// 修改
			api.deviceTemplate.editItem({
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
            ruleForm.value.dtId = getRandom(10);
			api.deviceTemplate.addItem(ruleForm.value)
			.then(() => {
				ElMessage({ type: 'success', message: '添加成功' })
				emit('updateList')
				closeDialog()
			})
			.finally(() => (btnLoading.value = false))
		}
	})
}

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  dialogVisible.value = false;
  isEdit.value = false;
  ruleForm.value = {
    dtId: 0,
	title: '',
	templateNumber: route.params && route.params.id,
	dataAttribName: '',
	dataAddress: 0,
	DataCoef: ''
  }
}


const open = async (row: any) => {
	dialogVisible.value = true
	if (row && row.dtId.toString()) {
		row.DataCoef = row.dataCoef
		ruleForm.value = row;
		isEdit.value = true;
	}else {
		isEdit.value = false;
	}
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.width100 {
	width: 100%;
}
</style>