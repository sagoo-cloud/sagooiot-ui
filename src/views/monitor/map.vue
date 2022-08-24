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
    <div class="map flex1 mt-2" ref="mapRef"></div>
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import api from '/@/api/heatStation';
import { setMarker } from '/@/utils/map';

const mapRef = ref();
const checkList = ref([]);

let BMapGL = (window as any).BMapGL;
let map: any = null;

onMounted(() => {
	map = new BMapGL.Map(mapRef.value, {
		backgroundColor: '#ff9900',
	});
	const testPt = new BMapGL.Point(104.5, 38);
	map.centerAndZoom(testPt, 5);
	map.enableScrollWheelZoom();
	setTimeout(() => {
		document.querySelectorAll('.anchorBL')[1].remove();
		document.querySelectorAll('.anchorBL')[0].remove();
	}, 100);

	// 获取换热站列表
	api.heatStation.getAll().then((res:any) => {
		renderStation(res);
	});
	// 获取环路列表
	api.loop.getList({ pageSize: 50, status: 1 }).then((res) => {
		console.log(res);
	});
});

const renderStation = (list: any[]) => {
	setMarker(list, map);
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

	& > img {
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
.page {
}
</style>