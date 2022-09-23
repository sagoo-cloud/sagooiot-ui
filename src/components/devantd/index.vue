<template>
	<div :id="antdid"></div>
</template>

<script lang="ts" setup>
import { TinyArea } from '@antv/g2plot';
import { onMounted } from 'vue';

const props = defineProps({
	json: {
		type: Object,
		required: true,
	},
	antdid:{
		type: String,
		required: true,
	}
});

onMounted(() => {
	const tinyArea = new TinyArea(props.antdid, {
		height: 60,
		autoFit: false,
		data: props.json,
		smooth: true,
		areaStyle: {
			fill: '#873bf4',
			
		},
	// 	tooltip: {
	// 		customContent: (title, data) => {
	// 			console.log(title,data);
	// 		//return "<div>"+data2[index]+"</div><div>"+
	// 	}
    // },
	});

	tinyArea.render();
});
</script>
