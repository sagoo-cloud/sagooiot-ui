<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="state.tableData.param" ref="queryRef" :inline="true" label-width="60px">
					<el-form-item label="类型" prop="type">
						<el-radio-group v-model="state.tableData.param.type" size="default" @change="queryList">
							<el-radio-button label="1">热单耗</el-radio-button>
							<el-radio-button label="2">电单耗</el-radio-button>
							<el-radio-button label="3">水单耗</el-radio-button>
						</el-radio-group>
					</el-form-item>
          <el-form-item label="top" prop="top">
            <el-select v-model="state.tableData.param.top" placeholder="top" filterable clearable size="default" @change="queryList">
							<el-option label="10" :value="10" />
							<el-option label="30" :value="30" />
							<el-option label="60" :value="60" />
						</el-select>
          </el-form-item>
        </el-form>
      </div>
			<div class="title mt20">能耗红榜</div>
			<div class="chart-grid">
				<div style="height: 300px" v-loading="state.tableData.loading" ref="redChartOneRef"></div>
			</div>
			<div class="title mt20">能耗黑榜</div>
			<div class="chart-grid">
				<div style="height: 300px" v-loading="state.tableData.loading" ref="blackChartOneRef"></div>
			</div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, onMounted, ref, watch, nextTick } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';
import energyApi from '/@/api/energyAnalysis';

let global: any = {
	redChartOneRef: null,
	blackChartOneRef: null,
	dispose: [null, '', undefined],
};

const queryRef = ref();
const redChartOneRef = ref();
const blackChartOneRef = ref();

const store = useStore();
const state = reactive({
	myCharts: [],
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
	chartTitle: '',
  redChartXAxis: [],
  redChartList: [],
  blackChartXAxis: [],
  blackChartList: [],
	tableData: {
		data: [],
		loading: false,
		total: 0,
		param: {
			type: 1,
			top: 10,
		}
	}
});

const queryList = () => {
	state.tableData.loading = true
	energyApi.getEnergyTop(state.tableData.param)
		.then(res => {
			console.log(res)
			let data = res.data
			let titleMap = {
				1: '热单耗',
				2: '水单耗',
				3: '电单耗'
			}
  		state.chartTitle = titleMap[state.tableData.param.type]
  		state.redChartXAxis = []
			state.redChartList = []
			state.blackChartXAxis = []
			state.blackChartList = []
			data.head.forEach((item: any) => {
				state.redChartXAxis.push(item.huanLuName)
				state.redChartList.push(item.value)
			})
			data.tail.forEach((item: any) => {
				state.blackChartXAxis.push(item.huanLuName)
				state.blackChartList.push(item.value)
			})
			state.tableData.loading = false

			nextTick(() => {
				initChart()
			})
		})
}
// 页面加载时
onMounted(() => {
	queryList()
});

const initChart = () => {
	initBarRedChart()
	initBarBlackChart()
}

// 初始化图表
const initBarRedChart = () => {
	if (!global.dispose.some((b: any) => b === global.redChartOneRef)) global.redChartOneRef.dispose();
	global.redChartOneRef = <any>echarts.init(redChartOneRef.value, state.charts.theme);
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				data: state.redChartXAxis
			}
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: [
			{
				name: state.chartTitle,
				type: 'bar',
				emphasis: {
					focus: 'series'
				},
				data: state.redChartList
			}
		]
	};
	(<any>global.redChartOneRef).setOption(option);
	(<any>state.myCharts).push(global.redChartOneRef);
}
const initBarBlackChart = () => {
	if (!global.dispose.some((b: any) => b === global.blackChartOneRef)) global.blackChartOneRef.dispose();
	global.blackChartOneRef = <any>echarts.init(blackChartOneRef.value, state.charts.theme);
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				data: state.blackChartXAxis
			}
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: [
			{
				name: state.chartTitle,
				type: 'bar',
				emphasis: {
					focus: 'series'
				},
				data: state.blackChartList
			}
		]
	};
	(<any>global.blackChartOneRef).setOption(option);
	(<any>state.myCharts).push(global.blackChartOneRef);
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
			state.charts.theme = isIsDark ? 'transparent' : '';
			state.charts.bgColor = isIsDark ? 'transparent' : '';
			state.charts.color = isIsDark ? '#dadada' : '#303133';
			setTimeout(() => {
				initChart();
			}, 500)
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>


<style lang="scss" scoped>
.title {
	font-size: 16px;
	font-weight: bold;
}
.chart-grid {
	// display: grid;
	// grid-template-columns: repeat(3, 1fr);
	// grid-column-gap: 10px;
}
.mt20 {
	margin-top: 20px;
}
</style>