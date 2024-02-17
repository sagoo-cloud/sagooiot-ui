<template>
	<div class="system-edit-dic-container">
		<el-dialog v-model="isShowDialog" :show-close="false" width="850px" :fullscreen="dialogFullScreen">
			<template #header="{ close, titleId, titleClass }">
				<div class="my-header">
					<h4 :id="titleId" :class="titleClass">数据记录</h4>

					<div>
						<i class="iconfont " :class="!dialogFullScreen ? 'icon-fullscreen' : 'icon-tuichuquanping'" @click="quanping" style="font-size: 22px;cursor: pointer;"></i>
						<i class="el-icon" @click="close" style="font-size: 22px;cursor: pointer;    margin-left: 10px; position: relative; top: 3px;"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa="">
								<path fill="currentColor"
									d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z">
								</path>
							</svg></i>

					</div>
				</div>
			</template>

			<el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
				<el-table-column label="时间" prop="ts" align="center" width="180" />
				<el-table-column label="属性值" prop="value" align="center" show-overflow-tooltip />
			</el-table>
			<pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref } from 'vue';
import { Close } from '@element-plus/icons-vue';
import api from '/@/api/device';

export default defineComponent({
	name: 'deviceEditPro',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive({
			isShowDialog: false,
			dialogFullScreen: false,
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					deviceKey: '',
					propertyKey: '',
				},
			},
		});
		// 打开弹窗
		const openDialog = (row: any, deviceKey: string) => {
			resetForm();
			if (row) {
				state.tableData.param.deviceKey = deviceKey;
				state.tableData.param.propertyKey = row.key
				typeList();

			}
			state.isShowDialog = true;
		};

		const typeList = () => {
			state.tableData.loading = true;
			api.instance.getLogDetail(state.tableData.param).then((res: any) => {
				state.tableData.data = res.List;
				state.tableData.total = res.Total;
				//state.ruleForm = res.data.dictType
			}).finally(() => (state.tableData.loading = false));

		};
		const resetForm = () => {
			state.tableData = {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					deviceKey: '',
					propertyKey: '',
				},
			}
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		const quanping = () => {
			state.dialogFullScreen = state.dialogFullScreen ? false : true;
		}
		// 取消
		const onCancel = () => {
			closeDialog();
		};

		return {
			Close,
			quanping,
			typeList,
			openDialog,
			closeDialog,
			onCancel,
			formRef,
			...toRefs(state),
		};
	},
});
</script>
<style scoped>
.my-header {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
</style>
