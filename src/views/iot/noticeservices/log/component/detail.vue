<template>
	<div class="system-edit-dic-container">
		<el-dialog title="日志详情" v-model="isShowDialog" width="769px">
			<el-form  ref="formRef"  size="default" label-width="110px">
				<el-form-item label="内容">
					<div v-html="content"></div>

				</el-form-item>
				
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref } from 'vue';



interface DicState {
	isShowDialog: boolean;
	content: string;
}

export default defineComponent({
	name: 'Edit',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			content: '',
		});
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			state.content=row.content;
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
			formRef,
			...toRefs(state),
		};
	},
});
</script>

