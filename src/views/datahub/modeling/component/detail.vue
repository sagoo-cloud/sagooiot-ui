<template>
	<div class="system-edit-dic-container">
		<el-dialog title="数据记录" v-model="isShowDialog" width="75%">
			<el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column v-for="(item, index) in jData" :key="item" :label="item" :prop="item" show-overflow-tooltip align="center">
				</el-table-column>
			</el-table>
			<pagination
				v-show="tableData.total > 0"
				:total="tableData.total"
				v-model:page="tableData.param.pageNum"
				v-model:limit="tableData.param.pageSize"
				@pagination="typeList"
			/>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/datahub';
import { ElMessage } from 'element-plus';

interface DicState {
	isShowDialog: boolean;
}

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	name: string;
	key: string;

	createBy: string;
}
interface TableDataState {
	ids: number[];
	tableData: {
		data: Array<TableDataRow>;
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			id: number;
		};
	};
}

export default defineComponent({
	name: 'deviceEditPro',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			jsonsData: [],
			jData: [],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					id: 0,
				},
			},
		});
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();
			if (row) {
				state.tableData.param.id = row.id;
				typeList();

			}
			state.isShowDialog = true;
		};

		const typeList = () => {
			console.log(state.tableData.param);
			api.template.getdata(state.tableData.param).then((res: any) => {
				const jsonData = JSON.parse(res.data);
				state.tableData.data = jsonData;
				state.jData = Object.keys(jsonData[0]);
				console.log(jsonData);
				state.jData.forEach((item, index) => {
					state.jsonsData[index] = jsonData[item];
				});

				state.tableData.total = res.Total;
				//state.ruleForm = res.data.dictType
			});
		};
		const resetForm = () => {
			state.jsonsData = [];
			state.jData = [];
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
