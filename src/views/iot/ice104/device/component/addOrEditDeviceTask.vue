<!-- 添加或者修改设备 -->
<template>
	<el-dialog
		:title="isEdit ? '修改设备任务' : '添加设备任务'"
		v-model="dialogVisible"
		width="600px"
		:before-close="closeDialog"
		:close-on-click-modal="false"
	>
		<el-form ref="formRef" :rules="formRules" :model="ruleForm" label-position="left" label-width="120px" style="width: 90%; margin: 0 auto">
			<el-form-item label="设备任务名称" prop="title">
				<el-input v-model="ruleForm.title" placeholder="请输入设备任务名称" />
			</el-form-item>
            <el-form-item label="执行间隔" prop="interval">
				<el-input type="number" :min="0" v-model.number="ruleForm.interval" placeholder="请输入执行间隔" />
			</el-form-item>
			<el-form-item label="任务类型" prop="jobType">
				<el-select v-model="ruleForm.jobType" placeholder="请选择任务类型" class="width100">
					<el-option v-for="dict in device_job_types" :key="dict.value" :label="dict.label" :value="dict.value"> </el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button v-auth="'cancelTask'" @click="closeDialog()"> 取 消 </el-button>
			<el-button v-auth="'addTask'" :loading="btnLoading" type="primary" @click="submitData"> 保 存 </el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, onMounted, getCurrentInstance } from 'vue';
import api from '/@/api/ice104/index';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonIce104';
import apiDevice from '/@/api/device';
import { useRoute } from 'vue-router';

const route = useRoute();

const { proxy } = getCurrentInstance() as any;
const { params, tableData, getList, loading } = useSearch(api.template.getAll, 'data', { title: '' });
const { device_job_types } = proxy.useDict('device_job_types');
getList();


const dialogVisible = ref(false);
const btnLoading = ref(false);
const emit = defineEmits(['updateList']);
const formRef = ref();
const ruleForm = ref({
    number: 0,
	title: '',
    deviceNumber: route.params && route.params.id,
    interval: 0,
    jobType: ''
})
const isEdit = ref(false);

const formRules = computed(() => ({
	title: [{ required: true, trigger: 'blur', message: '请输入设备任务名称' }],
	interval: [{ required: true, trigger: 'blur', message: '请输入执行间隔' }],
	jobType: [{ required: true, trigger: 'blur', message: '请选择任务类型' }],
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
			api.job.editItem({
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
            ruleForm.value.number = getRandom(10);
			api.job.addItem(ruleForm.value)
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
	number: 0,
	title: '',
    deviceNumber: route.params && route.params.id,
    interval: 0,
    jobType: ''
  }
}


const open = async (row: any) => {
	dialogVisible.value = true
	if (row && row.number.toString()) {
        row.jobType = row.jobType.toString();
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
