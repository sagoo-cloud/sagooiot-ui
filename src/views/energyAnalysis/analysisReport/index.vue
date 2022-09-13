<template>
  <div class="page-container">
    <el-card shadow="hover">
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

			<div style="height: 400px" ref="lineChartRef"></div>
			<!-- <ChartDom :height="400" :option="lineChartOptions"/> -->
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/heatingDistrict';

let global: any = {
	lineChart: null,
	dispose: [null, '', undefined],
};

const store = useStore();
const state = reactive({
	myCharts: [],
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
})
const lineChartRef = ref()
const checkList = ref([])

// 初始化图标
const initLineChart = () => {
	if (!global.dispose.some((b: any) => b === global.lineChart)) global.lineChart.dispose();
	global.lineChart = <any>echarts.init(lineChartRef.value, state.charts.theme);
	const option = {
		backgroundColor: state.charts.bgColor,
		grid: { top: 70, right: 20, bottom: 30, left: 30 },
		tooltip: { trigger: 'axis' },
		legend: { data: ['一网回水压力', '一网供水压力'] },
		xAxis: {
			data: ['环路1', '环路2', '环路3', '环路4', '环路5'],
		},
		yAxis: [
			{
				type: 'value',
				name: '条数',
				splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
			},
		],
		series: [
			{
				name: '一网回水压力',
				type: 'line',
				symbolSize: 6,
				symbol: 'circle',
				smooth: true,
				data: [41.1, 30.4, 65.1, 53.3, 53.3],
				lineStyle: { color: '#fe9a8b' },
				itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' }
			},
			{
				name: '一网供水压力',
				type: 'line',
				symbolSize: 6,
				symbol: 'circle',
				smooth: true,
				data: [24.1, 7.2, 15.5, 42.4, 42.4],
				lineStyle: { color: '#9E87FF' },
				itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' }
			}
		]
	};
	(<any>global.lineChart).setOption(option);
	(<any>state.myCharts).push(global.lineChart);
}

// 批量设置 echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < state.myCharts.length; i++) {
			setTimeout(() => {
				(<any>state.myCharts[i]).resize();
			}, i * 1000);
		}
	});
};
// 批量设置 echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
	initEchartsResize();
});

// 监听 vuex 中是否开启深色主题
watch(
	() => store.state.themeConfig.themeConfig.isIsDark,
	(isIsDark) => {
		nextTick(() => {
			state.charts.theme = isIsDark ? 'dark' : '';
			state.charts.bgColor = isIsDark ? 'transparent' : '';
			state.charts.color = isIsDark ? '#dadada' : '#303133';
			setTimeout(() => {
				initLineChart();
			}, 500);
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>

<style scoped lang="scss">

</style>
