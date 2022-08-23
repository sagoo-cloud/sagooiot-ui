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
					<el-tree-select
						v-model="ruleForm.stationId"
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
          <el-input v-model="ruleForm.decade" placeholder="请输入环路年代" />
        </el-form-item>
        <el-form-item label="编辑路线信息" prop="">
					<div class="mb10">
						<el-button type="primary">添加途经点</el-button>
					</div>
					<div class="mb10" style="width: 100%">
						<el-input v-model="keyword" @change="onLocalChange" placeholder="请输入关键字进行搜索" clearable style="width: 100%;"></el-input>
					</div>
					<div style="width: 100%; height: 300px" id="loop-map-container"></div>
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
import { reactive, toRefs, defineComponent, ref, unref, nextTick } from 'vue';
import api from '/@/api/heatStation';
import { ElMessage } from 'element-plus';
interface Point {
	sort?: number;
	lnt: number;
	lat: number
}
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
	viaPoint: Array<Point>;
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
				viaPoint: [],
        status: 1
			},
			rules: {
				name: [{ required: true, message: '环路名称不能为空', trigger: 'blur' }],
				code: [{ required: true, message: '环路编号不能为空', trigger: 'blur' }],
				stationId: [{ required: true, message: '所属换热站不能为空', trigger: 'blur' }],
				loopTypes: [{ required: true, message: '环路类型不能为空', trigger: 'blur' }],
				status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
			},
			treeData: [],
			keyword: '', // 地图关键字
			mapLocal: null as any
		})
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm()
			queryTree()
			nextTick(() => {
				initMap()
			})
			if (row) {
				(state.ruleForm as any) = row
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
				viaPoint: [],
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
			state.keyword = ''
		}
		const queryTree = () => {
			api.heatStation.getList({
					name: '',
					code: '',
					status: -1
				})
				.then((res: any) => {
					state.treeData = res || [];
				});
		};
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
		
		const initMap = () => {
			let BMapGL = (window as any).BMapGL
			let map = new BMapGL.Map("loop-map-container");
			// 116.404, 39.915
			let point = new BMapGL.Point(116.404, 39.915);
			let zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
			let cityCtrl = new BMapGL.CityListControl()
			map.centerAndZoom(point, 15); 
			map.enableScrollWheelZoom(true); // 开启滚轮缩放
			map.addControl(zoomCtrl);
			map.addControl(cityCtrl);
			// if (state.ruleForm.lnt && state.ruleForm.lat) {
			// 	let marker = new BMapGL.Marker(new BMapGL.Point(state.ruleForm.lnt, state.ruleForm.lat));
			// 	// 在地图上添加点标记
			// 	map.addOverlay(marker);
			// }

			state.mapLocal = new BMapGL.LocalSearch(map, {
				renderOptions:{map: map}
			})

			map.addEventListener('click', (e: any) => {
				console.log('map--click', e)
				let point = e.latlng
				// state.ruleForm.lnt = point.lng
				// state.ruleForm.lat = point.lat
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
