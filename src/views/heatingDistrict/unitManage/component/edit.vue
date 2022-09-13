<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '单元'" v-model="dialogVisible" width="550px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="所属组织" prop="organizationId">
					<el-tree-select
						v-model="ruleForm.organizationId"
						:data="orgList"
						:props="{
							label: 'name',
							children: 'children'
						}"
						node-key="id"
						:clearable="true"
						check-strictly
						style="width: 100%;"
						:render-after-expand="true"
					/>
				</el-form-item>
				<!-- heatStaId -->
				<el-form-item label="所属换热站" prop="">
					<el-tree-select
						v-model="ruleForm.heatStaId"
						:data="heatList"
						:props="{
							label: 'name',
							children: 'children'
						}"
						node-key="id"
						:clearable="true"
						check-strictly
						style="width: 100%;"
						:render-after-expand="true"
					/>
				</el-form-item>
				<el-form-item label="小区名称" prop="plotId">
					<el-select v-model="ruleForm.plotId" @change="onPlotChange" placeholder="选择小区名称" filterable clearable size="default" style="width: 100%">
						<el-option
							v-for="item in plotList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="楼宇名称" prop="floorId">
					<el-select v-model="ruleForm.floorId" placeholder="选择楼宇名称" filterable clearable size="default" style="width: 100%">
						<el-option
							v-for="item in floorList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
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
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" :rows="8" v-model="ruleForm.remark" placeholder="请输入备注" />
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
        organizationId: '',
        plotId: '',
        floorId: '',
        heatStaId: '',
        number: '',
        remark: '',
				status: 1
			},
			rules: {
				name: [{ required: true, message: '单元名称不能为空', trigger: ['blur', 'change'] }],
				organizationId: [{ required: true, message: '所属组织不能为空', trigger: ['blur', 'change'] }],
				plotId: [{ required: true, message: '小区名称不能为空', trigger: ['blur', 'change'] }],
				floorId: [{ required: true, message: '楼宇名称不能为空', trigger: ['blur', 'change'] }],
				heatStaId: [{ required: true, message: '所属换热站不能为空', trigger: ['blur', 'change'] }],
				number: [{ required: true, message: '楼号不能为空', trigger: ['blur', 'change'] }],
			},
			orgList: [],
			plotList: [],
			floorList: [],
			heatList: []
		})
		// 打开弹窗
		const openDialog = (row: any) => {
			resetForm()
			queryTree()
			if (row) {
				(state.ruleForm as any).id = row.id;
				(state.ruleForm as any).plotId = row.plotId;
				getDetail()
				getFloorList()
			}
			state.dialogVisible = true
		}
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				name: '',
        organizationId: '',
        plotId: '',
        floorId: '',
        heatStaId: '',
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
		const queryTree = () => {
			heatApi.heatStation.getList({
					name: '',
					code: '',
					status: -1
				})
				.then((res: any) => {
					state.heatList = res || [];
				});
		};
		const getDetail = () => {
			api.unit.detail(state.ruleForm.id)
				.then((res: any) => {
					state.ruleForm = {
						...res
					}
				})
		}
		const onPlotChange = () => {
			state.floorList = []
			state.ruleForm.floorId = ''
			if (state.ruleForm.plotId) {
				getFloorList()
			}
		}
		// 获取楼宇
		const getFloorList = () => {
			api.floor.allList({ plotId: state.ruleForm.plotId })
				.then((res: any) => {
					state.floorList = res.Info || []
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
			onPlotChange,
			...toRefs(state)
		}
	}
})
</script>
