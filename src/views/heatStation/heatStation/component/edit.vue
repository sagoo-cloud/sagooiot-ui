<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '换热站'" v-model="dialogVisible" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="上级换热站" prop="">
					<el-tree-select
						v-model="ruleForm.parentId"
						:data="treeData"
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
				<el-form-item label="换热站名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入换热站名称" />
				</el-form-item>
				<!-- <el-form-item label="换热站编号" prop="code">
					<el-input v-model="ruleForm.code" placeholder="请输入换热站编号" />
				</el-form-item> -->
				<el-form-item label="换热站位置" prop="position">
					<el-input v-model="ruleForm.position" placeholder="请输入换热站位置" />
				</el-form-item>
				<el-form-item label="负责人" prop="principal">
					<el-input v-model="ruleForm.principal" placeholder="请输入负责人" />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio v-model="ruleForm.status" :label="1">在线</el-radio>
					<el-radio v-model="ruleForm.status" :label="0">不在线</el-radio>
				</el-form-item>
        <el-form-item label="地图展示" prop="decade">
					<div class="mb10" style="width: 100%">
						<el-input v-model="ruleForm.keyword" placeholder="请输入关键字进行搜索" clearable style="width: 100%;"></el-input>
						<!-- <span class="mr10">经度</span>
						<el-input v-model="ruleForm.lnt" style="width: 120px" class="mr10" placeholder="经度"></el-input>
						<span class="mr10">纬度</span>
						<el-input v-model="ruleForm.lat" style="width: 120px" placeholder="纬度"></el-input> -->
					</div>
          <baidu-map class="map" :center="{ lng: ruleForm.lnt, lat: ruleForm.lat }" :scroll-wheel-zoom="true" :zoom="15" style="width: 100%; height: 300px" @click="onMapClick">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
						<bm-local-search :keyword="ruleForm.keyword" :panel="false" :auto-viewport="true" @markersset="onMarkersset"></bm-local-search>
          </baidu-map>
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
import api from '/@/api/heatStation';
import { ElMessage } from 'element-plus';
import { Console } from 'console';
interface RuleFormState {
	id: number;
	parentId: number | string;
	name: string;
	position: string;
	lnt: number;
	lat: number;
	principal: string;
	types: number;
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
				parentId: '',
				name: '',
				position: '',
				lnt: 116.404,
				lat: 39.915,
				principal: '',
				types: 1,
				status: 1
			},
			rules: {
				name: [{ required: true, message: '换热站名称不能为空', trigger: 'blur' }],
				position: [{ required: true, message: '换热站位置不能为空', trigger: 'blur' }],
				principal: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
				status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
			},
			treeData: [],
			mapResult: [] // 地图搜索点结果
		})
		// 打开弹窗
		const openDialog = (row: any, tree: any) => {
			resetForm()
			state.treeData = tree
			// nextTick(() => {
			// 	let BMap = (window as any).BMap
			// 	if (BMap) {
			// 		let geolocation = new BMap.Geolocation();//返回用户当前的位置
			// 		geolocation.getCurrentPosition(function(r: any) {
			// 			console.log(r)
			// 			state.center.lat = r.latitude
			// 			state.center.lng = r.longitude
			// 			// latitude: 22.322230460245
			// 			// longitude: 114.1808934593
			// 		});
			// 	}
			// }) 

			if (row) {
				state.ruleForm = {
					...row,
					parentId: row.parentId === -1 ? '' : row.parentId
				}
			}
			state.dialogVisible = true
		}
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				parentId: '',
				name: '',
				// code: '',
				position: '',
				lnt: 116.404,
				lat: 39.915,
				principal: '',
				types: 1,
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
					let params = { ...state.ruleForm };
					(params.parentId as any) = params.parentId || -1
					if (state.ruleForm.id) {
						//修改
						api.heatStation.edit(params).then(() => {
							ElMessage.success('换热站修改成功')
							closeDialog() // 关闭弹窗
							emit('querylist')
						})
					} else {
						//添加
						api.heatStation.add(params).then(() => {
							ElMessage.success('换热站添加成功')
							closeDialog() // 关闭弹窗
							emit('querylist')
						})
					}
				}
			})
		}
		const onMapClick = (e: any) => {
			console.log('onMapClick', e)
			console.log('onMapClick', e.QA.K.title)
			console.log(state.mapResult.find((item: any) => item.marker.da) === e.currentTarget.da)
		}
		const onMarkersset = (e: any) => {
			console.log('onMarkersset', e)
			state.mapResult = e
		}

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			formRef,
			onMapClick,
			onMarkersset,
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
