<template>
	<div class="system-edit-dic-container">
		<el-dialog title="换热站详情" v-model="isShowDialog" width="575px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="换热站名称" prop="name">
					{{ ruleForm.name }}
				</el-form-item>
				<el-form-item label="换热站位置" prop="position">
					{{ ruleForm.position }}
				</el-form-item>
				<el-form-item label="负责人" prop="principal">
					{{ ruleForm.principal }}
				</el-form-item>
				<el-form-item label="状态" prop="status">
					{{ ruleForm.status === 1 ? '在线' : '不在线' }}
				</el-form-item>
        <el-form-item label="地图展示" prop="">
					<div>
						<span>经度：{{ ruleForm.lnt ? `${ruleForm.lnt}，` : '' }}</span>
						<span style="margin-left: 10px">纬度：{{ ruleForm.lat }}</span>
					</div>
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
