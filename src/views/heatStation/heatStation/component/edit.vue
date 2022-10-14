<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '换热站'" v-model="dialogVisible" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="所属换热站" prop="">
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
				<el-form-item label="换热站位置" prop="position">
					<el-input v-model="ruleForm.position" placeholder="请输入换热站位置" />
				</el-form-item>
				<el-form-item label="负责人" prop="principal">
					<!-- <el-input v-model="ruleForm.principal" placeholder="请输入负责人" /> -->
					<el-select v-model="ruleForm.principal" clearable style="width: 100%;" placeholder="请选择">
						<el-option
							v-for="item in userList"
							:key="item.id"
							:label="item.userNickname"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio v-model="ruleForm.status" :label="1">在线</el-radio>
					<el-radio v-model="ruleForm.status" :label="0">不在线</el-radio>
				</el-form-item>
				<!-- <el-form-item label="数据模型" prop="dataTemplateIds">
					<el-select v-model="ruleForm.dataTemplateIds" multiple clearable style="width: 100%;" placeholder="请选择">
						<el-option
							v-for="item in dataHubList"
							:key="item.id"
							:label="item.name"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item> -->
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
import userApi from '/@/api/system';
import datahubApi from '/@/api/datahub';
import { ElMessage } from 'element-plus';
import { useStore } from '/@/store/index';
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
			dataHubList: [],
			userList: [],
			mapLocal: null as any
		})
		const store = useStore();
		// 打开弹窗
		const openDialog = (row: any, tree: any) => {
			resetForm()
			// queryDataHubList()
			queryUserList()
			state.treeData = tree

			if (row) {
				(state.ruleForm as any).id = row.id
				getDetail()
			}
			nextTick(() => {
				initMap()
			}) 
			state.dialogVisible = true
		}
		
		// const queryDataHubList = () => {
		// 	datahubApi.template.allList({})
		// 		.then((res: any) => {
		// 			state.dataHubList = res.list || [];
		// 		});
		// };
		const queryUserList = () => {
			userApi.user.getAllList({})
				.then((res: any) => {
					state.userList = res || [];
				});
		};
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
		const getDetail = () => {
			api.heatStation.detail(state.ruleForm.id)
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
						api.heatStation.edit(params).then(() => {
							ElMessage.success('换热站修改成功')
							emit('queryList')
							closeDialog() // 关闭弹窗
						})
					} else {
						//添加
						api.heatStation.add(params).then(() => {
							ElMessage.success('换热站添加成功')
							emit('queryList')
							closeDialog() // 关闭弹窗
						})
					}
				}
			})
		}
		const initMap = () => {
			let BMapGL = (window as any).BMapGL
			let map = new BMapGL.Map("map-container");
			// 获取布局配置信息
			let getThemeConfig =  store.state.themeConfig.themeConfig;
			// 116.404, 39.915
			let point = new BMapGL.Point(state.ruleForm.lnt || 116.404, state.ruleForm.lat || 39.915);
			let zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
			let cityCtrl = new BMapGL.CityListControl()
			if(getThemeConfig.isIsDark) {
				map.setMapStyleV2({     
					styleId: 'b8d841ee37fd5bd41e742049b6fcd0f5'
				});
			}

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
