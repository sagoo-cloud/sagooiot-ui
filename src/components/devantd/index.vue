<template>
	<div :id="antdid"></div>
</template>

<script lang="ts" setup>
import { TinyArea } from '@antv/g2plot';
import { onMounted, watch } from 'vue';

let tinyArea: any = null

const props = defineProps({
	json: {
		type: Object,
		required: true,
	},
	antdid: {
		type: String,
		required: true,
	}
});

// 数据更新之后更新图形
watch(() => props.json, (data) => {
	tinyArea && tinyArea.changeData(data.reverse());
})

onMounted(() => {
	tinyArea = new TinyArea(props.antdid, {
		height: 40,
		autoFit: true,
		data: props.json.reverse(),
		smooth: true,
		areaStyle: {
			fill: '#873bf4',
		},
	});

	tinyArea.render();
});
</script>
