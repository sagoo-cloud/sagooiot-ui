<template>
	<div class="system-edit-dic-container">
		<el-dialog title="换热站详情" v-model="state.isShowDialog" width="1000px">
			<el-form :model="state.ruleForm" ref="formRef" size="default" label-width="110px">
				<el-form-item label="换热站名称" prop="name">
					{{ state.ruleForm.name }}
				</el-form-item>
				<el-form-item label="换热站位置" prop="position">
					{{ state.ruleForm.position }}
				</el-form-item>
				<el-form-item label="负责人" prop="principalInfo.userNickname">
					{{ state.ruleForm.principalInfo.userNickname }}
				</el-form-item>
				<el-form-item label="状态" prop="status">
					{{ state.ruleForm.status === 1 ? '启用' : '禁用' }}
				</el-form-item>
				<el-form-item label="地图展示" prop="">
					<div>
						<span>经度：{{ state.ruleForm.lnt ? `${state.ruleForm.lnt}，` : '' }}</span>
						<span style="margin-left: 10px">纬度：{{ state.ruleForm.lat }}</span>
					</div>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import api from '/@/api/heatStation';
// import { ElMessage } from 'element-plus';

const state = reactive({
	isShowDialog: false,
	ruleForm: {} as any,
});
// 打开弹窗
const openDialog = (row: any) => {
	if (row) {
		state.ruleForm = row;
		api.heatStation
			.stationDetail({
				stationId: row.id,
				pageNum: 1,
				pageSize: 10,
			})
			.then((res: any) => {
				console.log(res);
			});
	}
	state.isShowDialog = true;
};

// 关闭弹窗
const closeDialog = () => {
	state.isShowDialog = false;
};

defineExpose({ openDialog });
</script>
