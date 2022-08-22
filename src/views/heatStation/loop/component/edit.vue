<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '环路'" v-model="dialogVisible" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="环路名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入环路名称" />
				</el-form-item>
				<el-form-item label="环路编号" prop="code">
					<el-input v-model="ruleForm.code" placeholder="请输入环路编号" />
				</el-form-item>
				<el-form-item label="所属换热站" prop="stationId">
					<el-input v-model="ruleForm.stationId" placeholder="请输入所属换热站" />
				</el-form-item>
        <el-form-item label="环路类型" prop="loopTypes">
          <el-select v-model="ruleForm.loopTypes" placeholder="请选择环路类型" clearable size="default" style="width: 100%">
            <el-option label="一网" :value="1" />
            <el-option label="二网" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="节能类型" prop="energyTypes">
          <el-select v-model="ruleForm.energyTypes" placeholder="请选择节能类型" clearable size="default" style="width: 100%">
            <el-option label="节能" :value="1" />
          </el-select>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="供暖对象" prop="heatingObject">
              <el-select v-model="ruleForm.heatingObject" placeholder="请选择供暖对象" clearable size="default" style="width: 100%">
                <el-option label="公建" :value="1" />
                <el-option label="居民" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供暖类型" prop="heatingTypes">
              <el-select v-model="ruleForm.heatingTypes" placeholder="请选择供暖类型" clearable size="default" style="width: 100%">
                <el-option label="地暖" :value="1" />
                <el-option label="暖气片" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="供暖面积" prop="heatingArea">
					    <el-input v-model="ruleForm.heatingArea" placeholder="请输入供暖面积" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际面积" prop="forRealArea">
					    <el-input v-model="ruleForm.forRealArea" placeholder="请输入实际面积" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="环路年代" prop="decade">
          <el-input v-model="ruleForm.name" placeholder="请输入环路年代" />
        </el-form-item>
        <el-form-item label="编辑路线信息" prop="decade">
          <baidu-map class="map" :center="{ lng: 116.404, lat: 39.915 }" :zoom="15" style="width: 100%; height: 300px">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          </baidu-map>
        </el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio v-model="ruleForm.status" :label="1">在线</el-radio>
					<el-radio v-model="ruleForm.status" :label="0">不在线</el-radio>
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
import api from '/@/api/heatStation';
import { ElMessage } from 'element-plus';
interface RuleFormState {
	id: number;
	name: string;
	code: string;
	stationId: string;
	loopTypes: string;
	energyTypes: string;
	heatingObject: string;
	heatingTypes: string;
	heatingArea: string;
	forRealArea: string;
	decade: string;
	status: number;
}

export default defineComponent({
	name: 'headStationLoop',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive({
			dialogVisible: false,
			ruleForm: {
				id: 0,
				name: '',
        code: '',
        stationId: '',
        loopTypes: '',
        energyTypes: '',
        heatingObject: '',
        heatingTypes: '',
        heatingArea: '',
        forRealArea: '',
        decade: '',
        status: 1
			},
			rules: {
				name: [{ required: true, message: '环路名称不能为空', trigger: 'blur' }],
				code: [{ required: true, message: '环路编号不能为空', trigger: 'blur' }],
				stationId: [{ required: true, message: '所属换热站不能为空', trigger: 'blur' }],
				loopTypes: [{ required: true, message: '环路类型不能为空', trigger: 'blur' }],
				status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
			}
		})
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm()

			// api.product.getLists({ status: 1 }).then((res: any) => {
			// 	state.productData = res.product || [];
			// });
			// api.dept.getList({ status: -1 }).then((res: any) => {
			// 	state.deptData = res || [];
			// });

			if (row) {
				state.ruleForm = row
			}
			state.dialogVisible = true
		}
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				name: '',
        code: '',
        stationId: '',
        loopTypes: '',
        energyTypes: '',
        heatingObject: '',
        heatingTypes: '',
        heatingArea: '',
        forRealArea: '',
        decade: '',
        status: 1
			}
		}
		// 关闭弹窗
		const closeDialog = () => {
			state.dialogVisible = false
		}
		// 取消
		const onCancel = () => {
			closeDialog()
		}
		// 新增
		const onSubmit = () => {
			const formWrap = unref(formRef) as any
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					if (state.ruleForm.id) {
						//修改
						api.loop.edit(state.ruleForm).then(() => {
							ElMessage.success('环路修改成功')
							closeDialog() // 关闭弹窗
							emit('querylist')
						})
					} else {
						//添加
						api.loop.add(state.ruleForm).then(() => {
							ElMessage.success('环路添加成功')
							closeDialog() // 关闭弹窗
							emit('querylist')
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
