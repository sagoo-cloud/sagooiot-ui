<template>
	<div class="page page-full">
		<el-checkbox-group v-model="checkList">
			<el-checkbox label="一网供水温度" />
			<el-checkbox label="一网回水温度" />
			<el-checkbox label="一网供水压力" />
			<el-checkbox label="一网回水压力" />
			<el-checkbox label="二网供水温度" />
			<el-checkbox label="二网回水温度" />
			<el-checkbox label="二网供水压力" />
			<el-checkbox label="二网回水压力" />
		</el-checkbox-group>
		<div class="flex1 mt-2" style="position: relative;">
			<div class="map" ref="mapRef" style="height: 100%"></div>

			<!-- 显示弹层区域 -->
			<div class="view">
				<div class="view-div" v-for="(item, index) in viewList" :key="index">
					<div class="view-div-item">
						<div class="label">环路名称：</div>
						<div class="text">{{ item.name }}</div>
					</div>
					<div class="view-div-item">
						<div class="label">所属换热站：</div>
						<div class="text">SJIWW786</div>
					</div>
					<div class="view-div-item">
						<div class="label">环路编号：</div>
						<div class="text">**换热站1</div>
					</div>
					<div class="view-div-item">
						<div class="label">一网供水温度：</div>
						<div class="text"></div>
					</div>
					<div class="view-div-item">
						<div class="label">一网回水温度：</div>
						<div class="text">24℃</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import api from '/@/api/heatStation';
import { setMarker } from '/@/utils/map';
import { useStore } from '/@/store/index';

const mapRef = ref();
const checkList = ref([]);
const store = useStore();
const heatList = ref([]);
const viewList = ref([]);

let BMapGL = (window as any).BMapGL;
let map: any = null;
let getThemeConfig: any = null
let points: any = []

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

	// 获取换热站列表
	api.heatStation.getAll().then((res: any) => {
		heatList.value = res
		renderStation(res);
	});
	// 获取环路列表
	api.loop.getList({ pageSize: 50, status: 1 }).then((res: any) => {
		console.log(res);
	});
	// 地图缩放事件	
	// map.addEventListener('zoomstart', (e: any) => {
	// 	console.log('zoomstart', e)
	// })
	map.addEventListener('zoomend', (e: any) => {
		// console.log('zoomend', e)
		console.log('zoomend', map.getZoom())
		let zoom = map.getZoom()
		if (zoom > 20.5 && points.length) {
			let arr: any = []
			let viewArr: any = []
			points.forEach((point: any) => {
				if (map.getBounds().containsPoint(point)) {
					arr.push(point)
				}
			})
			console.log(arr)
			arr.forEach((point: any) => {
				let item = heatList.value.find((item: any) => (point.lat === item.lat && point.lng === item.lnt))
				console.log(item)
				viewArr.push(item)
			})
			viewList.value = viewArr
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
	margin-top: 20px;
	margin-left: -20px;
	// pointer-events: none;

	&>img {
		display: none !important;
	}
}

.BMap_bubble_content,
.BMap_bubble_center {
	height: 150px !important;
}

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

	.map-hover-row-item {
		display: flex;
		align-items: center;
		margin-top: 4px;
		line-height: 1.2;

		// gap: 20px;
		.map-hover-value {
			// font-size: 22px;
			color: #ffd228;
			font-weight: 500;
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
	display: flex;
	&-div {
		width: 200px;
		padding: 10px;
		background-color: #fff;
		&:not(:first-child) {
			margin-left: 10px;
		}
		&-item {
			display: flex;
			align-items: center;
			.label {
				width: 100px;
			}
			.text {
				flex: 1;
			}
		}
	}
}
</style>