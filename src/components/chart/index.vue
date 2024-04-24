<template>
  <div class="echart" :class="{ bg, noPadding }" :style="{ height }" ref="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref, watch } from 'vue'
// import * as chartOptions from './options.js'
import { useStore } from '/@/store/index'
const store = useStore()

const loadingOption = {
	// maskColor: 'rgba(255, 255, 255, 0.1)'
	maskColor: 'rgba(255, 255, 255, 0)',
	text: '',
	color: '#409eff',
	// textColor: '#000',
	// zlevel: 0,
	// fontSize: 12,
	// showSpinner: true,
	spinnerRadius: 18,
	lineWidth: 2,
	// fontWeight: 'normal',
	// fontStyle: 'normal',
	// fontFamily: 'sans-serif'
}

const props = defineProps({
	bg: Boolean,
	noPadding: Boolean,
	auto: {
		type: Boolean,
		default: false,
	},
	autoLoading: {
		type: Boolean,
		default: true ,
	},
	height: {
		type: String,
		default: '100%',
	},
	type: {
		type: String,
		default: 'Bar',
	},
	option: {
		type: Object,
		default: () => {
			return {}
		},
	},
})

let myChart: any = null
let optionCache: any = null
const chart = ref()

// 绘制图形
const draw = (option?: object) => {
	myChart && myChart.dispose()
	myChart = echarts.init(chart.value)
	myChart.hideLoading()
	if (option) {
		optionCache = option
		myChart.setOption(option)
	} else {
		// myChart.setOption(chartOptions[`get${props.type}Option`]({ ...props.option }))
	}
}

const loading = () => {
	myChart?.setOption({}, { notMerge: true })
	myChart?.showLoading(loadingOption)
}

const getChart = () => {
	return myChart
}

const download = (name: string = 'chart picture') => {
	const picInfo = myChart.getDataURL({
		type: 'png',
		pixelRatio: 2,
		backgroundColor: '#fff',
	})
	let elink = document.createElement('a')
	elink.download = name
	elink.style.display = 'none'
	elink.href = picInfo
	document.body.appendChild(elink)
	elink.click()
	URL.revokeObjectURL(elink.href)
	document.body.removeChild(elink)
}

// 配置变化 重绘
watch(
	() => props.option,
	() => {
		draw()
	}
)
watch(
	() => store.state.global.resize,
	() => {
		draw(optionCache)
	}
)

onMounted(() => {
	myChart = echarts.init(chart.value)
	props.autoLoading && loading()
	props.auto && draw()
})

defineExpose({ draw, loading, download, getChart })
</script>

<style scoped lang="scss">
.echart {
	height: 100%;
	width: 100%;
	// margin: 1vh 0;
	padding: 2px;
}

.bg {
	background: #444;
}
</style>
