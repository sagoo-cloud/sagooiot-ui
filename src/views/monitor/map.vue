<template>
  <div class="page page-full">
    <div class="map flex1 mt-2" ref="mapRef"></div>
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const mapRef = ref();

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
});
</script>

<style scoped lang="scss">
.page {
}
</style>