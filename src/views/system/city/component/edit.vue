<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '城市'" v-model="dialogVisible" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="所属城市" prop="">
					<el-tree-select v-model="ruleForm.parentId" :data="treeData" :props="{
						label: 'name',
						children: 'children'
					}" node-key="id" :clearable="true" check-strictly style="width: 100%;" :render-after-expand="true" />
				</el-form-item>
				<el-form-item label="城市名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入城市名称" />
				</el-form-item>
				<el-form-item label="城市编号" prop="code">
					<el-input v-model="ruleForm.code" placeholder="请输入城市编号" />
				</el-form-item>
				<el-form-item label="排序" prop="code">
					<el-input v-model.number="ruleForm.sort" placeholder="请输入序号" />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio v-model="ruleForm.status" :label="1">启用</el-radio>
					<el-radio v-model="ruleForm.status" :label="0">禁用</el-radio>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/system';
import datahubApi from '/@/api/datahub';
import { ElMessage } from 'element-plus';
import { useStore } from '/@/store/index';
interface RuleFormState {
	id: number;
	parentId: number | string;
	name: string;
	code: string;
	sort: string;
	status: number;
}

export default defineComponent({
	name: 'headStationLoop',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive({
			dialogVisible: false,
			map: null,
			ruleForm: {
				id: 0,
				parentId: '',
				name: '',
				code: '',
				sort: 0,
				status: 1
			},
			keyword: '',
			rules: {
				name: [{ required: true, message: '城市名称不能为空', trigger: 'blur' }],
				code: [{ required: true, message: '城市编码不能为空', trigger: 'blur' }],
				status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
			},
			treeData: [],
			dataHubList: [],
			mapLocal: null as any
		})
		const store = useStore();
		// 打开弹窗
		const openDialog = (row: any, tree: any) => {
			resetForm()
			queryDataHubList()
			state.treeData = tree

			if (row) {
				(state.ruleForm as any).id = row.id
				getDetail()
			}
			state.dialogVisible = true
		}

		const queryDataHubList = () => {
			datahubApi.template.allList({})
				.then((res: any) => {
					state.dataHubList = res.list || [];
				});
		};
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				parentId: '',
				name: '',
				code: '',
				sort: 0
			}
		}
		// 关闭弹窗
		const closeDialog = () => {
			state.dialogVisible = false
		}
		// 取消
		const onCancel = () => {
			closeDialog()
			state.keyword = ''
		}
		const getDetail = () => {
			api.city.detail(state.ruleForm.id)
				.then((res: any) => {
					state.ruleForm = {
						...res,
						parentId: res.parentId === -1 ? '' : res.parentId
					}
				})
		}
		// 新增
		const onSubmit = () => {
			const formWrap = unref(formRef) as any
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					let params = { ...state.ruleForm };
					(params.parentId as any) = params.parentId || -1
					if (state.ruleForm.id) {
						//修改
						api.city.edit(params).then(() => {
							ElMessage.success('城市修改成功')
							emit('queryList')
							closeDialog() // 关闭弹窗
						})
					} else {
						//添加
						api.city.add(params).then(() => {
							ElMessage.success('城市添加成功')
							emit('queryList')
							closeDialog() // 关闭弹窗
						})
					}
				}
			})
		}

		const onLocalChange = () => {
			state.mapLocal.search(state.keyword)
		}

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			formRef,
			onLocalChange,
			...toRefs(state)
		}
	}
})
</script>

<style scoped lang="scss">
.mb10 {
	margin-bottom: 10px;
}

.mr10 {
	margin-right: 10px;
}
</style>
