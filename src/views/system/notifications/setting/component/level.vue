<template>
	<div class="system-edit-dept-container">
		<el-dialog title="设置告警级别" v-model="isShowDialog" width="769px">
			<el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-for="(item, index) in levelData" :key="index">
						<el-form-item :label="'级别' + item.level" prop="name">
							<el-input v-model="item.name" placeholder="请输入分类名称"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">设置</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/alarm';
import { ElMessage } from 'element-plus';

interface RuleFormState {
	level: number;
	name: string;
}
interface DeptSate {
	isShowDialog: boolean;
	levelData: RuleFormState[];
}

export default defineComponent({
	name: 'level',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DeptSate>({
			isShowDialog: false,
			levelData: [],
		});

		// 打开弹窗
		const openDialog = () => {
			api.common.level_all(1).then((res: any) => {
				state.levelData = res.list || [];
			});

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
		// 新增
		const onSubmit = () => {
			api.common.level_edit({ list: state.levelData }).then(() => {
				ElMessage.success('修改成功');
				closeDialog(); // 关闭弹窗
			});
		};

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			formRef,
			...toRefs(state),
		};
	},
});
</script>
