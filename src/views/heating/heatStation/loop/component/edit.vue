<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '环路'" v-model="dialogVisible" width="950px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
        <el-form-item label="环路名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入环路名称" />
        </el-form-item>
        <!-- <el-form-item label="环路编号" prop="code">
					<el-input v-model="ruleForm.code" placeholder="请输入环路编号" />
				</el-form-item> -->
        <el-form-item label="所属换热站" prop="stationId">
          <el-tree-select v-model="ruleForm.stationId" :data="treeData" :props="{
							label: 'name',
							children: 'children'
						}" node-key="id" :clearable="true" filterable check-strictly style="width: 100%;" :render-after-expand="true" />
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
            <el-option label="非节能" :value="2" />
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
        <el-form-item label="状态" prop="status">
          <el-radio v-model="ruleForm.status" :label="1">启用</el-radio>
          <el-radio v-model="ruleForm.status" :label="0">禁用</el-radio>
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
        <el-form-item label="编辑路线信息" prop="">
          <div class="mb10">
            <el-button type="primary" @click="onAddPoint">添加途经点</el-button>
          </div>
          <!-- <div class="mb10" style="width: 100%">
            <div style="display: flex;" class="mb10" v-for="(item, index) in pointList" :key="index">
              <el-input v-model="item.position" :disabled="!item.editFalg" @change="onLocalChange(item, index)" placeholder="请输入关键字进行搜索" clearable style="flex: 1; margin-right: 10px"></el-input>
              <span>排序：</span>
              <el-input-number v-model="item.sort" :controls="false" :disabled="!item.editFalg" placeholder="排序" clearable style="width: 100px; margin-right: 10px"></el-input-number>

              <el-button type="primary" v-if="item.editFalg" @click="onSavePoint(item, index)">保存</el-button>
              <el-button type="primary" v-else @click="onEditChange(item, index)">修改</el-button>
              <el-button type="danger" @click="onRemovePoint(index)">删除</el-button>
            </div>
          </div> -->
          <div style="width: 100%; height: 300px" id="loop-map-container"></div>
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
import datahubApi from '/@/api/datahub';
import { ElMessage } from 'element-plus';
interface Point {
  sort?: number;
  lnt: number;
  lat: number
}
interface RuleFormState {
  id?: number;
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
    let map: any = null
    let BMapGL: any = null
    let polyline: any = null
    let startDraw = false

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
        name: [{ required: true, message: '环路名称不能为空', trigger: ['blur', 'change'] }],
        code: [{ required: true, message: '环路编号不能为空', trigger: ['blur', 'change'] }],
        stationId: [{ required: true, message: '所属换热站不能为空', trigger: ['blur', 'change'] }],
        loopTypes: [{ required: true, message: '环路类型不能为空', trigger: ['blur', 'change'] }],
        energyTypes: [{ required: true, message: '节能类型不能为空', trigger: ['blur', 'change'] }],
        heatingObject: [{ required: true, message: '供暖对象不能为空', trigger: ['blur', 'change'] }],
        heatingTypes: [{ required: true, message: '供暖类型不能为空', trigger: ['blur', 'change'] }],
        heatingArea: [{ required: true, message: '供暖面积不能为空', trigger: ['blur', 'change'] }],
        forRealArea: [{ required: true, message: '实际面积不能为空', trigger: ['blur', 'change'] }],
        decade: [{ required: true, message: '年代不能为空', trigger: ['blur', 'change'] }],
        status: [{ required: true, message: '状态不能为空', trigger: ['blur', 'change'] }]
      },
      treeData: [],
      mapLocal: null as any, // 地图搜索
      pointList: [] as any,
      pointIndex: -1,
      dataHubList: []
    })
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm()
      queryTree()
      // queryDataHubList()
      nextTick(() => {
        initMap()
      })
      if (row) {
        (state.ruleForm as any).id = row.id
        getDetail()
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
      state.pointList = [];
      (formRef.value as any).clearValidate()
    }
    // 取消
    const onCancel = () => {
      closeDialog()
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
    // const queryDataHubList = () => {
    // 	datahubApi.template.allList({})
    // 		.then((res: any) => {
    // 			state.dataHubList = res.list || [];
    // 		});
    // };
    const getDetail = () => {
      api.loop.detail(state.ruleForm.id)
        .then((res: any) => {
          state.ruleForm = {
            ...res
          }
          state.pointList = (state.ruleForm.viaPoint || []).map((item: any) => ({
            lat: item.lat,
            lng: item.lnt,
          }))

          // 绘制点线
          state.pointList.forEach((point: any) => map.addOverlay(new BMapGL.Marker(point)))
          setLine(state.pointList)
        })
    }
    // 新增
    const onSubmit = () => {
      const formWrap = unref(formRef) as any
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          if (!state.pointList.length) {
            ElMessage.warning('请选择途经点')
            return
          }
          for (let i = 0; i < state.pointList.length; i++) {
            let item = state.pointList[i]
            if (!item.lnt && !item.lat) {
              ElMessage.warning('途经点填错错误')
              return
            }
          }
          let params = { ...state.ruleForm }
          params.viaPoint = state.pointList.map((item: any, index: number) => ({
            sort: index + 1,
            lnt: item.lng,
            lat: item.lat,
            // position: item.position
          }))
          if (params.id) {
            //修改
            api.loop.edit(params).then(() => {
              ElMessage.success('环路修改成功')
              closeDialog() // 关闭弹窗
              emit('queryList')
            })
          } else {
            //添加
            api.loop.add(params).then(() => {
              ElMessage.success('环路添加成功')
              closeDialog() // 关闭弹窗
              emit('queryList')
            })
          }
        }
      })
    }
    // 新增途经点
    const onAddPoint = () => {
      startDraw = true
      state.pointList = []
      map.clearOverlays();

      // if (state.pointList.find((item: any) => item.editFalg)) {
      //   ElMessage.warning('请先保存途经点')
      //   return
      // }
      // state.pointList.push({
      //   sort: undefined,
      //   position: '',
      //   lnt: '',
      //   lat: '',
      //   editFalg: true
      // })
      // state.pointIndex = state.pointList.length - 1
    }
    // 修改途经点
    const onEditChange = (item: any, index: number) => {
      if (state.pointList.find((point: any) => point.editFalg && point !== item)) {
        ElMessage.warning('请先保存途经点')
        return
      }
      state.pointIndex = index
      item.editFalg = true
    }
    // 保存途经点
    const onSavePoint = (item: any, index: number) => {
      item.editFalg = false
    }
    // 移除途经点
    const onRemovePoint = (index: number) => {
      state.pointList.splice(index, 1)
    }

    const initMap = () => {
      BMapGL = (window as any).BMapGL
      map = new BMapGL.Map("loop-map-container");
      // 116.404, 39.915
      const point = new BMapGL.Point(124.383044, 40.124296);
      const zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
      const cityCtrl = new BMapGL.CityListControl()
      map.centerAndZoom(point, 15);
      map.enableScrollWheelZoom(true); // 开启滚轮缩放
      map.addControl(zoomCtrl);
      map.addControl(cityCtrl);

      // state.mapLocal = new BMapGL.LocalSearch(map, {
      //   renderOptions: { map: map }
      // })

      map.addEventListener('click', ({ latlng }: any) => {
        if (!startDraw) return

        state.pointList.push(latlng)

        let marker = new BMapGL.Marker(latlng);
        // 在地图上添加点标记
        map.addOverlay(marker);
        setLine(state.pointList)

        // let myGeo = new BMapGL.Geocoder
        // myGeo.getLocation(new BMapGL.Point(point.lng, point.lat), (result: any) => {
        //   if (result) {
        //     state.pointList[index].position = result.address
        //   }
        // })
      })
    }
    function setLine(pointList: any[]) {
      map.removeOverlay(polyline);
      polyline = new BMapGL.Polyline(pointList, { strokeColor: "blue", strokeWeight: 10, strokeOpacity: 0.5 });   //创建折线
      map.addOverlay(polyline);
    }

    // const onLocalChange = (item: any, index: number) => {
    //   state.mapLocal.search(item.position)
    //   state.pointIndex = index
    // }

    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      formRef,
      // onLocalChange,
      onAddPoint,
      onRemovePoint,
      onSavePoint,
      onEditChange,
      ...toRefs(state)
    }
  }
})
</script>
