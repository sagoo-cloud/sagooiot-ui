<template>
	<div class="system-edit-dic-container">
		<el-dialog title="查看设备" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="设备标识" prop="key">
					{{ ruleForm.key }}
				</el-form-item>
				<el-form-item label="设备名称" prop="name">
					{{ ruleForm.name }}
				</el-form-item>

				<el-form-item label="所属产品" prop="productId">
					{{ ruleForm.productName }}
				</el-form-item>

				<el-form-item label="所属部门" prop="deptId">
					{{ ruleForm.deptName }}
				</el-form-item>

				<el-form-item label="设备证书" prop="certificate">
					{{ ruleForm.certificate }}
				</el-form-item>

				<el-form-item label="设备秘钥" prop="secureKey">
					{{ ruleForm.secureKey }}
				</el-form-item>

				<el-form-item label="固件版本号" prop="version">
					{{ ruleForm.version }}
				</el-form-item>

				<el-form-item label="备注" prop="desc">
					{{ ruleForm.desc }}
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/device';
import { ElMessage } from 'element-plus';


export default defineComponent({
	name: 'deviceEditPro',
	setup(prop, { emit }) {
		const state = reactive({
			isShowDialog: false,
			ruleForm: {}
		});
		// 打开弹窗
		const openDialog = (row: any) => {
			if (row) {
				state.ruleForm = row;
			}
			state.isShowDialog = true;
		};

		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		return {
			openDialog,
			closeDialog,
			onCancel,
			...toRefs(state),
		};
	},
});
</script>
