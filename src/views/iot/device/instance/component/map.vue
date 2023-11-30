<template>
  <div>
    <el-dialog title="地图选点" v-model="isShowDialog" width="900px" append-to-body>
      <div class="map-container">
        <div class="coordinate-search">
          <el-tooltip class="box-item" effect="dark" content="点击放大镜或回车按键检索地址" placement="top-start">
            <el-input v-model="searchKeyword" placeholder="搜索地名" @keyup.enter.native="searchByKeyword(searchKeyword)">
              <template #append>
                <el-button :icon="Search" @click="searchByKeyword(searchKeyword)" />
              </template>
            </el-input>
          </el-tooltip>
          <el-input v-model="lng" placeholder="经度" />
          <div>-</div>
          <el-input v-model="lat" placeholder="纬度" />
           <el-button @click="searchByCoordinate" type="primary">搜索</el-button>
        </div>

        <div class="map" ref="mapContainer"></div>
        <!-- 地址解析结果 -->
        <div class="address-result" v-if="address">
<!--          解析到地址：{{ address }}-->
          <el-form-item label="经度" prop="lng" class="input-item">
            <el-input v-model="lng" />
          </el-form-item>
          <el-form-item label="纬度" prop="lat" class="input-item">
            <el-input v-model="lat" />
          </el-form-item>
          <el-form-item label="详细地址" prop="address" class="input-item">
            <el-input v-model="address" />
          </el-form-item>
          <el-button @click="confirmAddress" style="margin-left: 10px;" type="success">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineExpose, nextTick, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';

const mapContainer = ref<HTMLElement | null>(null);
const address = ref('');
const lng = ref('');
const lat = ref('');

const searchKeyword = ref(''); // 搜索输入框的值

const isShowDialog = ref(false);
const marker = ref<BMapGL.Marker | null>(null);
let map: BMapGL.Map | null = null;

const openDialog = () => {
  isShowDialog.value = true;
  nextTick(() => {
    map = new BMapGL.Map(mapContainer.value!);
    map.centerAndZoom('沈阳市', 10);
    map.enableScrollWheelZoom(true);
    searchByCoordinate();
    map.addEventListener('click', (e: any) => {
      lng.value = e.latlng.lng.toFixed(5);
      lat.value = e.latlng.lat.toFixed(5);

      setMarker(e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5));
      setAddressByCoordinate(e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5));
      return false; // 阻止事件的冒泡和默认行为
    });
    map.addEventListener('zoomend', () => {
      const point = new BMapGL.Point(lng.value, lat.value);
      const marker = new BMapGL.Marker(point);

      // 获取标记位置
      const position = marker.getPosition();
      map?.setCenter(position); // 将标点设置为地图中心
    });
  });

  lng.value = "";
  lat.value = "";
  searchKeyword.value = "";
};

const confirmAddress = () => {
  isShowDialog.value = false;
  emit('updateMap', { lng: lng.value, lat: lat.value, address: address.value });
};

const setMarker = (lng: string, lat: string) => {
  // 删除之前的标记
  if (marker.value) {
    map?.removeOverlay(marker.value);
  }
  // 创建新的标记
  const point = new BMapGL.Point(lng, lat);
  marker.value = new BMapGL.Marker(point);
  map?.addOverlay(marker.value);
  // 移动地图中心到选点位置
  map?.setCenter(point);
};

const setAddressByCoordinate = (lng: string | number, lat: string | number) => {
  const point = new BMapGL.Point(lng, lat);
  const geocoder = new BMapGL.Geocoder();
  geocoder.getPoint(point, (pointResult: any) => {
    if (pointResult) {
      const locationPoint = new BMapGL.Point(pointResult.lng, pointResult.lat);
      geocoder.getLocation(locationPoint, (result: any) => {
        if (result) {
          const formattedAddress = result.address;
          address.value = formattedAddress;
        }
      });
    }
  });
};

const searchByCoordinate = () => {
  if (lng.value && lat.value) {
    setMarker(lng.value, lat.value);
    setAddressByCoordinate(lng.value, lat.value);
  } else if (searchKeyword.value) {
    lng.value = "";
    lat.value = "";
    searchByKeyword(searchKeyword.value);

  }
};

const searchByKeyword = (keyword?: string) => {
  if (keyword) {
    const localSearch = new BMapGL.LocalSearch(map);
    localSearch.setSearchCompleteCallback((searchResult) => {
      if (searchResult) {
        const poi = searchResult.getPoi(0);
        if (poi) {
          lng.value = poi.point.lng.toFixed(5);
          lat.value = poi.point.lat.toFixed(5);
          setMarker(poi.point.lng.toFixed(5), poi.point.lat.toFixed(5));
          setAddressByCoordinate(poi.point.lng.toFixed(5), poi.point.lat.toFixed(5));
        }
      }
    });
    localSearch.search(keyword ? keyword : searchKeyword.value);
  }
};

const emit = defineEmits(['updateMap']);

defineExpose({ openDialog });
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map {
  width: 100%;
  height: 50vh;
}

.coordinate-search {
  display: flex;
  margin-bottom: 20px;
}

.coordinate-search>div {
  margin-right: 10px;
}

.coordinate-search input {
  margin-right: 10px;
  width: 100px;
}

.input-item {
  margin-right: 10px;
}

.address-result {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
</style>