<template>
	<div class="system-edit-dic-container">
		<el-dialog title="日志详情" v-model="isShowDialog" width="769px">
			<el-form ref="formRef" label-width="110px">
				<el-form-item label="内容">
					<div v-html="content"></div>

        </el-form-item>

        <el-form-item label="调试">
          <div v-html="failMsg"></div>
        </el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
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
  failMsg: string;
}

export default defineComponent({
	name: 'Edit',
	setup() {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			content: '',
      failMsg: '',
		});
		// 打开弹窗
		const openDialog = (row: any) => {
			state.content = row.content;
      state.failMsg = row.failMsg;
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

