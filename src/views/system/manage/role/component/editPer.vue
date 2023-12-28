<template>
	<el-dialog custom-class="custom-dialog" title="分配数据权限" v-model="isShowDialog" width="500px">
		<el-form ref="formRef" :model="ruleForm" label-width="90px">
			<el-form-item label="角色名称" prop="name">
				<el-input v-model.trim="ruleForm.name" disabled placeholder="请输入角色名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="权限范围" prop="dataScope">
				<el-select v-model="ruleForm.dataScope" placeholder="请选择" clearable class="w100">
					<el-option label="全部数据权限" :value="1" />
					<el-option label="自定数据权限" :value="2" />
					<el-option label="本组织数据权限" :value="3" />
					<el-option label="本组织及以下数据权限" :value="4" />
				</el-select>
			</el-form-item>
			<el-form-item label="数据权限" prop="deptIds" v-if="ruleForm.dataScope === 2">
				<div class="tree">
					<el-tree ref="treeRef" :data="deptData" show-checkbox default-expand-all node-key="deptId" highlight-current :props="defaultProps" check-on-click-node :expand-on-click-node="false" />
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="onCancel">取 消</el-button>
				<el-button type="primary" @click="onSubmit">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, nextTick } from 'vue';
import api from '/@/api/system';
import { ElMessage } from 'element-plus';

interface DialogRow {
	id?: number;
	name: string;
	dataScope: 1 | 2 | 3 | 4; // 数据范围（1：全部数据权限 2：自定数据权限 3：本组织数据权限 4：本组织及以下数据权限）
	deptIds: number[]; // 组织id
}

const baseForm: DialogRow = {
	id: undefined,
	name: '',
	dataScope: 1,
	deptIds: [],
};

export default defineComponent({
	props: {
		deptData: {
			type: Array,
			default: () => [],
		},
	},
	setup() {
		const postList = ref([]);
		const formRef = ref<HTMLElement | null>(null);
		const defaultProps = {
			children: 'children',
			label: 'deptName',
		};
		const treeRef = ref();
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				...baseForm,
			},
		});
		// 打开弹窗
		const openDialog = async (row?: any) => {
			resetForm();
			const { id, name, dataScope, deptIds } = await api.role.getRole(row.id);
			state.ruleForm = { id, name, dataScope, deptIds: deptIds || [] };
			state.isShowDialog = true;
			nextTick(() => {
				if (deptIds && deptIds.length) {
					treeRef.value.setCheckedKeys(deptIds);
				}
			});
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
			if (state.ruleForm.dataScope === 2) {
				state.ruleForm.deptIds = treeRef.value.getCheckedKeys(true);
			} else {
				state.ruleForm.deptIds = [];
			}

			api.role.dataScope(state.ruleForm).then(() => {
				ElMessage.success('设置数据权限成功');
				closeDialog();
			});
		};
		const resetForm = () => {
			state.ruleForm = {
				...baseForm,
			};
		};
		return {
			openDialog,
			closeDialog,
			defaultProps,
			treeRef,
			onCancel,
			onSubmit,
			postList,
			formRef,
			...toRefs(state),
		};
	},
});
</script>

<style lang="scss" scoped>
.tree {
	width: 100%;
	max-height: 50vh;
	overflow: auto;
	padding-bottom: 5px;
}
</style>
