<template>
    <div>
      <el-dialog title="地图选点" v-model="isShowDialog" width="900px" append-to-body>
        <div class="map-container">



          <div class="coordinate-search">


            <el-input v-model="searchKeyword" placeholder="搜索地名" />


            <el-input v-model="lng" placeholder="经度" />
            <div>-</div>
            <el-input v-model="lat" placeholder="纬度" />
            <el-button @click="searchByCoordinate" type="primary">搜索</el-button>
          </div>



          <div class="map" ref="mapContainer"></div>
          <!-- 地址解析结果 -->
          <div class="address-result" v-if="address">
            解析到地址：{{ address }}
            <el-button @click="confirmAddress" style="margin-left: 10px;" type="success">确认地址</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineEmits, defineExpose, nextTick, ref } from 'vue';
  
  const mapContainer = ref<HTMLElement | null>(null);
  const address = ref('');
  const lng = ref('');
  const lat = ref('');
  const returnlng = ref('');
  const returnlat = ref('');

  const searchKeyword = ref(''); // 搜索输入框的值

  const isShowDialog = ref(false);
  const marker = ref<BMapGL.Marker | null>(null);
  let map: BMapGL.Map | null = null;
  
  const openDialog = () => {
    isShowDialog.value = true;
  
    nextTick(() => {
      map = new BMapGL.Map(mapContainer.value!);
      map.centerAndZoom("沈阳市", 10);
      map.enableScrollWheelZoom(true);
      searchByCoordinate();
      map.addEventListener("click", (e: any) => {
        if(!searchKeyword.value){
          lng.value = e.latlng.lng.toFixed(5);
          lat.value = e.latlng.lat.toFixed(5);
        }
       
        returnlng.value = e.latlng.lng.toFixed(5);
        returnlat.value = e.latlng.lat.toFixed(5);

       
        setMarker(e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5));
        setAddressByCoordinate(e.latlng.lng.toFixed(5), e.latlng.lat.toFixed(5));

     
      });
    });

    lng.value="";
    lat.value="";
    searchKeyword.value="";



  };
  
  const confirmAddress = () => {
    isShowDialog.value = false;
    emit('updateMap', { lng: returnlng.value, lat: returnlat.value });
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
    map?.panTo(point);

  };
  
  const setAddressByCoordinate = (lng: string | number, lat: string | number) => {
  const point = new BMapGL.Point(lng, lat);
  const geocoder = new BMapGL.Geocoder();
  geocoder.getPoint(point, (pointResult: any) => {
    if (pointResult) {
      const locationPoint = new BMapGL.Point(pointResult.lng, pointResult.lat);
      geocoder.getLocation(locationPoint, (result: any) => {
        if (result) {
          console.log(result);
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
    }else if(searchKeyword.value){
      searchByKeyword(searchKeyword.value);
    }

  };

  const searchByKeyword = () => { // 搜索方法
  const local = new BMapGL.LocalSearch(map, {
    onSearchComplete(results: any) {
      if (local.getStatus() === BMAP_STATUS_SUCCESS) {
        if (results && results.getPoi(0)) {
          const point = results.getPoi(0).point;
          lng.value = point.lng.toFixed(5);
          lat.value = point.lat.toFixed(5);
          setMarker(lng.value, lat.value);
          setAddressByCoordinate(lng.value, lat.value);
          lng.value="";
          lat.value="";
        }
      }
     
    }
    
  });

  local.search(searchKeyword.value);
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
  
  .coordinate-search > div {
    margin-right: 10px;
  }
  
  .coordinate-search input {
    margin-right: 10px;
    width: 100px;
  }
  
  .address-result {
    margin-top: 20px;
  }
  </style>