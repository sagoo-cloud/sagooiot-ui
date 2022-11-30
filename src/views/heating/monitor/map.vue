<template>
  <div class="page page-full">
    <div style="position: relative; flex: 1;">
      <div class="map" ref="mapRef" style="height: 100%"></div>

      <!-- 显示弹层区域 -->
      <div class="view">
        <div class="view-div" v-for="(item, index) in viewList" :key="index">
          <div class="view-div-head">
            <div class="title">{{ item.name }}环路</div>
            <div class="info">
              <div class="">
                环路编号：{{ item.code }}
              </div>
              <div class="ml-4">
                所属换热站：{{ item.stationInfo.name }}
              </div>
            </div>
          </div>
          <div class="view-div-content">
            <div>路线信息</div>
            <div class="mt-1 pl-4">
              <p v-for="(point, index) in item.loopViaPointInfo" :key="index">
                {{ point.position }}
              </p>
            </div>
            <div class="mt-1">实时温度</div>
            <el-table :data="[{
							outTemperature1: item.outTemperature1,
							inTemperature1: item.inTemperature1,
							outTemperature2: item.outTemperature2,
							inTemperature2: item.inTemperature2
						}]" :border="true" class="mt-1">
              <el-table-column label="一网供水温度" prop="outTemperature1" :show-overflow-tooltip="true" />
              <el-table-column label="一网回水温度" prop="inTemperature1" :show-overflow-tooltip="true" />
              <el-table-column label="二网供水温度" prop="outTemperature2" :show-overflow-tooltip="true" />
              <el-table-column label="二网回水温度" prop="inTemperature2" :show-overflow-tooltip="true" />
            </el-table>
            <div class="mt-1">实时压力(MPa)</div>
            <el-table :data="[{
							outPressure1: item.outPressure1,
							inPressure1: item.inPressure1,
							outPressure2: item.outPressure2,
							inPressure2: item.inPressure2,
						}]" :border="true" class="mt-1">
              <el-table-column label="一网供水压力" prop="outPressure1" :show-overflow-tooltip="true" />
              <el-table-column label="一网回水压力" prop="inPressure1" :show-overflow-tooltip="true" />
              <el-table-column label="二网供水压力" prop="outPressure2" :show-overflow-tooltip="true" />
              <el-table-column label="二网回水压力" prop="inPressure2" :show-overflow-tooltip="true" />
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import api from '/@/api/heatStation';
import { setMarker, setLine } from '/@/utils/map';
import { useStore } from '/@/store/index';

const router = useRouter()

const mapRef = ref();
const store = useStore();
const heatList = ref([]);
const viewList = ref<any[]>([]);

let BMapGL = (window as any).BMapGL;
let map: any = null;
let getThemeConfig: any = null
let points: any = []
let loops: any = []

// 地图弹窗点击去环路详情，进行跳转
window.mapToDetail = (code: string) => {
  router.push('/heating/monitor/loopSupervision/list/loopDetail?code=' + code)
}

onMounted(() => {
  // 获取布局配置信息
  getThemeConfig = store.state.themeConfig.themeConfig;
  map = new BMapGL.Map(mapRef.value, {
  });

  map.addControl(new BMapGL.ScaleControl()); // 添加比例尺控件
  map.addControl(new BMapGL.ZoomControl()); // 添加缩放控件

  const testPt = new BMapGL.Point(124.383044, 40.124296);
  map.centerAndZoom(testPt, 5);
  map.enableScrollWheelZoom();
  if (getThemeConfig.isIsDark) {
    map.setMapStyleV2({
      styleId: 'b8d841ee37fd5bd41e742049b6fcd0f5'
    });
  }

  // 获取环路列表
  api.heatStation.getAll().then((res: any) => {
    loops = res
    const list = res.filter((item: any) => item.loopViaPointInfo?.length > 1)
    // console.log(list)
    setLine(list, map);
  });
  // 获取换热站列表
  api.heatStation.getList({
    status: 1
  }).then((res: any) => {
    heatList.value = res
    renderStation(res);
  });
  // 地图缩放事件	
  map.addEventListener('zoomend', (e: any) => {
    // console.log('zoomend', e)
    // console.log('zoomend', map.getZoom())
    let zoom = map.getZoom()
    if (zoom > 20.5 && points.length) {
      let arr: any = []
      let viewArrCache: any = []

      points.forEach((point: any) => {
        if (map.getBounds().containsPoint(point)) {
          arr.push(point)
        }
      })
      arr.forEach((point: any) => {
        // 查询环路列表中属于该站点的环路列表，进行显示
        const theLoops = loops.filter((item: any) => item.stationInfo.id === point.data.id)
        viewArrCache = viewArrCache.concat(theLoops)
      })
      viewList.value = viewArrCache
    } else {
      viewList.value = []
    }
  })
  // 获取当前视图内的点
  // map.getBounds().containsPoint({
  //   "lng": 124.41798,
  //   "lat": 40.149303
  // })

  // window._map = map
});
// 监听 vuex 中是否开启深色主题
watch(
  () => store.state.themeConfig.themeConfig.isIsDark,
  (isIsDark) => {
    nextTick(() => {
      setTimeout(() => {
        map.setMapStyleV2({
          styleId: isIsDark ? 'b8d841ee37fd5bd41e742049b6fcd0f5' : '48b5759a53d0d6f607c049543d4c92e4'
        });

      }, 500);
    });
  },
  {
    deep: true,
    immediate: true,
  }
);
const renderStation = (list: any[]) => {
  points = setMarker(list, map);
  // 控制标点显示在最佳视野内
  if (points && points.length) {
    map.setViewport(points)
  }
};
</script>

<style lang="scss">
.BMap_bubble_pop {
	width: 220px;
	padding: 0 !important;
	border: none !important;
	background: transparent !important;
	color: #fff !important;
	margin-top: 0;
	margin-left: -20px;
	// pointer-events: none;

	& > img {
		display: none !important;
	}
}

// .BMap_bubble_content,
// .BMap_bubble_center {
// 	height: 150px !important;
// }

.BMap_bubble_content {
	height: auto !important;
	background: rgba(0, 29, 122, 0.6) !important;
	border-radius: 3px;
}

.BMap_bubble_top,
.BMap_bubble_bottom {
	display: none !important;
}

.map-hover-box {
	color: #fff;
	font-size: 12px;
	padding: 10px 14px;

	.map-hover-title {
		line-height: 18px;
		font-size: 14px;
		font-weight: 500;
	}
	.map-hover-label {
		white-space: nowrap;
	}
	.map-hover-btn {
		white-space: nowrap;
		background: #67c23a;
		padding: 6px 12px;
		border-radius: 4px;
		cursor: pointer;
	}

	.map-hover-row-item {
		display: flex;
		align-items: flex-start;
		margin-top: 4px;
		line-height: 1.2;

		// gap: 20px;
		.map-hover-value {
			// font-size: 22px;
			color: #ffd228;
			font-weight: 500;
			word-break: break-all;
		}
	}
}
</style>
<style scoped lang="scss">
.view {
	position: absolute;
	top: 10px;
	right: 10px;
	z-index: 999;
	// display: flex;
	&-div {
		width: 350px;
		color: #000;
		background-color: #fff;
		font-size: 12px;
		&:not(:first-child) {
			margin-top: 10px;
		}
		&-head {
			background-color: #f2f2f2;
			padding: 5px 10px;
			.title {
				font-size: 13px;
				font-weight: bold;
			}
			.info {
				display: flex;
				align-items: center;
				margin-top: 4px;
			}
		}
		&-content {
			padding: 10px;
		}
	}
}

:deep(.el-table) {
	tr {
		th {
			background-color: #efefef;
		}
	}
}
:deep(.el-table__cell) {
	padding: 2px 0;
}
:deep(.cell) {
	padding: 0 2px;
	line-height: 14px;
	font-weight: 400;
	font-size: 12px;
	color: #000;
}
</style>