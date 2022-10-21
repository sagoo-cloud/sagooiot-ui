<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '单元'" v-model="dialogVisible" width="550px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="单元名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入单元名称" />
				</el-form-item>
				<el-form-item label="单元号" prop="number">
					<el-input v-model="ruleForm.number" placeholder="请输入单元号" />
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
import { reactive, toRefs, defineComponent, ref, unref, nextTick } from 'vue';
import api from '/@/api/heatingDistrict';
import heatApi from '/@/api/heatStation';
import { ElMessage } from 'element-plus';

export default defineComponent({
	name: 'edit',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive({
			dialogVisible: false,
			ruleForm: {
				id: 0,
				name: '',
        nodeId: '',
        number: '',
        remark: '',
				status: 1
			},
			rules: {
				name: [{ required: true, message: '单元名称不能为空', trigger: ['blur', 'change'] }],
				number: [{ required: true, message: '单元号不能为空', trigger: ['blur', 'change'] }],
			}
		})
		// 打开弹窗
		const openDialog = (row: any, params: any) => {
			resetForm()
			if (params) {
				state.ruleForm = {
					...state.ruleForm,
					...params
				}
			}
			if (row) {
				(state.ruleForm as any).id = row.id;
				(state.ruleForm as any).plotId = row.plotId;
				getDetail()
			}
			state.dialogVisible = true
		}
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				name: '',
        nodeId: '',
        number: '',
        remark: '',
				status: 1
			}
		}
		// 关闭弹窗
		const closeDialog = () => {
			state.dialogVisible = false;
			(formRef.value as any).clearValidate()
		}
		// 取消
		const onCancel = () => {
			closeDialog()
		}
		const getDetail = () => {
			api.unit.detail(state.ruleForm.id)
				.then((res: any) => {
					state.ruleForm = {
						...res,
						heatStaId: res.heatStaId || ''
					}
				})
		}
		// 新增
		const onSubmit = () => {
			const formWrap = unref(formRef) as any
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					let params = { ...state.ruleForm }

					if (params.id) {
						//修改
						api.unit.edit(params).then(() => {
							ElMessage.success('单元修改成功')
							closeDialog() // 关闭弹窗
							emit('queryList')
						})
					} else {
						//添加
						api.unit.add(params).then(() => {
							ElMessage.success('单元添加成功')
							closeDialog() // 关闭弹窗
							emit('queryList')
						})
					}
				}
			})
		}

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			formRef,
			...toRefs(state)
		}
	}
})
</script>
