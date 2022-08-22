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
					<div>
						<span>经度：{{ ruleForm.lnt ? `${ruleForm.lnt}，` : '' }}</span>
						<span style="margin-left: 10px">纬度：{{ ruleForm.lat }}</span>
					</div>
					<div class="mb10" style="width: 100%">
						<el-input v-model="keyword" @change="onLocalChange" placeholder="请输入关键字进行搜索" clearable style="width: 100%;"></el-input>
					</div>
					<div style="width: 100%; height: 300px" id="map-container"></div>
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
import { reactive, toRefs, defineComponent, ref, unref, nextTick, onMounted } from 'vue';
import api from '/@/api/heatStation';
import { ElMessage } from 'element-plus';
import { Console } from 'console';
import { loadBMap } from '/@/utils/loadMap.js'
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
			map: null,
			ruleForm: {
				id: 0,
				parentId: '',
				name: '',
				position: '',
				lnt: '',
				lat: '',
				principal: '',
				types: 1,
				status: 1
			},
			keyword: '',
			rules: {
				name: [{ required: true, message: '换热站名称不能为空', trigger: 'blur' }],
				position: [{ required: true, message: '换热站位置不能为空', trigger: 'blur' }],
				principal: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
				status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
			},
			treeData: [],
			mapResult: [], // 地图搜索点结果
			mapLocal: null as any
		})
		// 打开弹窗
		const openDialog = (row: any, tree: any) => {
			resetForm()
			state.treeData = tree

			if (row) {
				state.ruleForm = {
					...row,
					parentId: row.parentId === -1 ? '' : row.parentId
				}
			}
			nextTick(() => {
				initMap()
				// let BMap = (window as any).BMap
				// if (BMap) {
				// 	let geolocation = new BMap.Geolocation();//返回用户当前的位置
				// 	geolocation.getCurrentPosition(function(r: any) {
				// 		console.log(r)
						
				// 		initMap(r.longitude, r.latitude)
				// 		// state.center.lat = r.latitude
				// 		// state.center.lng = r.longitude
				// 		// latitude: 22.322230460245
				// 		// longitude: 114.1808934593
				// 	});
				// }
			}) 
			state.dialogVisible = true
		}
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				parentId: '',
				name: '',
				position: '',
				lnt: '',
				lat: '',
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
			state.keyword = ''
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
		const initMap = () => {
			let BMapGL = (window as any).BMapGL
			let map = new BMapGL.Map("map-container");
			// 116.404, 39.915
			let point = new BMapGL.Point(state.ruleForm.lnt || 116.404, state.ruleForm.lat || 39.915);
			let zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
			let cityCtrl = new BMapGL.CityListControl()
			map.centerAndZoom(point, 15); 
			map.enableScrollWheelZoom(true); // 开启滚轮缩放
			map.addControl(zoomCtrl);
			map.addControl(cityCtrl);
			if (state.ruleForm.lnt && state.ruleForm.lat) {
				let marker = new BMapGL.Marker(new BMapGL.Point(state.ruleForm.lnt, state.ruleForm.lat));
				// 在地图上添加点标记
				map.addOverlay(marker);
			}

			state.mapLocal = new BMapGL.LocalSearch(map, {
				renderOptions:{map: map}
			})

			map.addEventListener('click', (e: any) => {
				console.log('map--click', e)
				let point = e.latlng
				state.ruleForm.lnt = point.lng
				state.ruleForm.lat = point.lat
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
			// onMapClick,
			// onMarkersset,
			// mapReady,
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
