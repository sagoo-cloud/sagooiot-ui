<template>
	<el-dialog title="预览" v-model="state.dialogVisible" width="80%">
		<div class="mb-4">
			<el-button type="primary" size="small" plain v-for="tag in tagOption" :key="tag">{{ tag }}</el-button>
		</div>

		<div style="background: #000; color: #fff; height: 300px;">
			代码区域
		</div>
		
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="state.dialogVisible = false" size="default">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import api from '/@/api/device';
import { ElMessage } from 'element-plus';

const tagOption = ref(['api', 'editVue', 'entity', 'jsApi', 'listVue', 'router', 'service'])
const state = reactive({
	dialogVisible: false,
	ruleForm: {}
});
// 打开弹窗
const openDialog = (row: any) => {
	if (row) {
		state.ruleForm = row;
	}
	state.dialogVisible = true;
};

// 关闭弹窗
const closeDialog = () => {
	state.dialogVisible = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};


defineExpose({ openDialog });
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
	max-height: calc(90vh - 111px)!important;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>