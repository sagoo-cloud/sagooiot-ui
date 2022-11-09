<template>
  <div class="page-container">
    <el-card shadow="hover">
      <!-- <el-checkbox-group v-model="checkList">
				<el-checkbox label="一网供水温度" />
				<el-checkbox label="一网回水温度" />
				<el-checkbox label="一网供水压力" />
				<el-checkbox label="一网回水压力" />
				<el-checkbox label="二网供水温度" />
				<el-checkbox label="二网回水温度" />
				<el-checkbox label="二网供水压力" />
				<el-checkbox label="二网回水压力" />
			</el-checkbox-group> -->

      <div style="height: 600px" ref="lineChartRef"></div>
      <!-- <ChartDom :height="400" :option="lineChartOptions"/> -->
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';
import heatApi from '/@/api/heatStation';
import datahubApi from '/@/api/datahub';

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
  heatList: [],
  lineChartXAxis: [],
  inPressure1: [],
  inPressure2: [],
  inTemperature1: [],
  inTemperature2: [],
  outPressure1: [],
  outPressure2: [],
  outTemperature1: [],
  outTemperature2: [],
})
const lineChartRef = ref()
const checkList = ref([])


// 获取供热监测数据
const getStatisticsChartData = () => {
  datahubApi.statistics.getStatisticsChartData({ tableNo: 17 }).then((res: any) => {
    console.log(res)
    const data = res.Info
    // "huanLuNo": "D00140-4", //换热站编号
    // "huanLuName": "8#楼高区", //换热站名称
    // "inPressure1": 0, //一网供水压力
    // "inPressure2": 0, //二网供水压力
    // "inTemperature1": 0, //一网供水温度
    // "inTemperature2": 0, //二网供水温度
    // "outPressure1": 0, //一网回水压力
    // "outPressure2": 0, //二网回水压力
    // "outTemperature1": 0, //一网回水温度
    // "outTemperature2": 0 //二网回水温度
    state.inPressure1 = []
    state.inPressure2 = []
    state.inTemperature1 = []
    state.inTemperature2 = []
    state.outPressure1 = []
    state.outPressure2 = []
    state.outTemperature1 = []
    state.outTemperature2 = []

    data.forEach((item: any) => {
      state.lineChartXAxis.push(item.huanLuName);
      state.inPressure1.push(item.inPressure1);
      state.inPressure2.push(item.inPressure2);
      state.inTemperature1.push(item.inTemperature1);
      state.inTemperature2.push(item.inTemperature2);
      state.outPressure1.push(item.outPressure1);
      state.outPressure2.push(item.outPressure2);
      state.outTemperature1.push(item.outTemperature1);
      state.outTemperature2.push(item.outTemperature2);
    });

    nextTick(() => {
      initLineChart();
    });
  });
};
const queryTree = () => {
  heatApi.heatStation.getList({
    name: '',
    code: '',
    status: -1
  })
    .then((res: any) => {
      state.heatList = res || [];
    });
};

// 初始化图标
const initLineChart = () => {
  if (!global.dispose.some((b: any) => b === global.lineChart)) global.lineChart.dispose();
  global.lineChart = <any>echarts.init(lineChartRef.value, state.charts.theme);
  const option = {
    backgroundColor: state.charts.bgColor,
    grid: { top: 70, right: 20, bottom: 30, left: 30 },
    tooltip: { trigger: 'axis' },
    legend: {},
    xAxis: {
      data: state.lineChartXAxis,
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
      },
    ],
    series: [
      { name: '一网供水压力', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.inPressure1 },
      { name: '二网供水压力', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.inPressure2 },
      { name: '一网供水温度', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.inTemperature1 },
      { name: '二网供水温度', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.inTemperature2 },
      { name: '一网回水压力', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.outPressure1 },
      { name: '二网回水压力', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.outPressure2 },
      { name: '一网回水温度', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.outTemperature1 },
      { name: '二网回水温度', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.outTemperature2 }
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
  // queryTree()
  getStatisticsChartData()
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
      // setTimeout(() => {
      // 	initLineChart();
      // }, 500);
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
