<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '住户'" v-model="dialogVisible" width="550px">
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
				<el-form-item label="所属换热站" prop="">
					<el-tree-select
						v-model="ruleForm.heatId"
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
					<el-select v-model="ruleForm.floorId" @change="onFloorChange" placeholder="选择楼宇名称" filterable clearable size="default" style="width: 100%">
						<el-option
							v-for="item in floorList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="单元名称" prop="unitId">
					<el-select v-model="ruleForm.unitId" placeholder="选择单元名称" filterable clearable size="default" style="width: 100%">
						<el-option
							v-for="item in unitList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="住户姓名" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入住户姓名" />
				</el-form-item>
				<el-form-item label="楼层" prop="floorLevel">
					<el-input v-model="ruleForm.floorLevel" placeholder="请输入楼层" />
				</el-form-item>
				<el-form-item label="房间号" prop="roomNumber">
					<el-input v-model="ruleForm.roomNumber" placeholder="请输入房间号" />
				</el-form-item>
				<el-form-item label="电话号码" prop="phone">
					<el-input v-model="ruleForm.phone" placeholder="请输入电话号码" />
				</el-form-item>
				<el-form-item label="建筑面积" prop="buildingArea">
					<el-input v-model="ruleForm.buildingArea" placeholder="请输入建筑面积" />
				</el-form-item>
				<el-form-item label="实供面积" prop="forRealArea">
					<el-input v-model="ruleForm.forRealArea" placeholder="请输入实供面积" />
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
interface RuleFormState {
	id?: number;
	name: string;
	organizationId: string;
}

export default defineComponent({
	name: 'edit',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive({
			dialogVisible: false,
			ruleForm: {
				id: 0,
				organizationId: '',
				heatId: '',
				plotId: '',
				floorId: '',
				unitId: '',
				name: '',
				floorLevel: '',
				roomNumber: '',
				phone: '',
				buildingArea: '',
				forRealArea: '',
				remark: '',
				status: 1
			},
			rules: {
				name: [{ required: true, message: '住户名称不能为空', trigger: ['blur', 'change'] }],
				organizationId: [{ required: true, message: '所属组织不能为空', trigger: ['blur', 'change'] }],
				plotId: [{ required: true, message: '小区名称不能为空', trigger: ['blur', 'change'] }],
				floorId: [{ required: true, message: '楼宇名称不能为空', trigger: ['blur', 'change'] }],
				unitId: [{ required: true, message: '单元名称不能为空', trigger: ['blur', 'change'] }],
				heatId: [{ required: true, message: '所属换热站不能为空', trigger: ['blur', 'change'] }],
				floorLevel: [{ required: true, message: '楼层不能为空', trigger: ['blur', 'change'] }],
				roomNumber: [{ required: true, message: '房间号不能为空', trigger: ['blur', 'change'] }],
				phone: [{ required: true, message: '手机号码不能为空', trigger: ['blur', 'change'] }],
				forRealArea: [{ required: true, message: '实供面积不能为空', trigger: ['blur', 'change'] }],
				buildingArea: [{ required: true, message: '建筑面积不能为空', trigger: ['blur', 'change'] }],
			},
			orgList: [],
			plotList: [],
			floorList: [],
			unitList: [],
			heatList: []
		})
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm()
			queryTree()
			if (row) {
				(state.ruleForm as any).id = row.id
				getDetail()
			}
			state.dialogVisible = true
		}
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				organizationId: '',
				heatId: '',
				plotId: '',
				floorId: '',
				unitId: '',
				name: '',
				floorLevel: '',
				roomNumber: '',
				phone: '',
				buildingArea: '',
				forRealArea: '',
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
			api.floor.detail(state.ruleForm.id)
				.then((res: any) => {
					state.ruleForm = {
						...res
					}
				})
		}
		// 获取楼宇
		const getFloorList = () => {
			api.floor.allList({})
				.then((res: any) => {
					state.floorList = res.Info || []
				})
		}
		// 获取单元
		const getUnitList = () => {
			api.unit.getListByFloorId({ floorId: state.ruleForm.floorId })
				.then((res: any) => {
					(state.unitList as any) = res ? [res] : []
				})
		}
		const onPlotChange = () => { 
			state.floorList = []
			state.unitList = []
			state.ruleForm.floorId = ''
			state.ruleForm.unitId = ''
			if (state.ruleForm.plotId) {
				getFloorList()
			}
		}
		const onFloorChange = () => {
			state.unitList = []
			state.ruleForm.unitId = ''
			if (state.ruleForm.floorId) {
				getUnitList()
			}
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
						api.resident.edit(params).then(() => {
							ElMessage.success('单元修改成功')
							closeDialog() // 关闭弹窗
							emit('queryList')
						})
					} else {
						//添加
						api.resident.add(params).then(() => {
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
			onFloorChange,
			...toRefs(state)
		}
	}
})
</script>
