<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="panel">
        <div class="left-panel">
          <el-input v-model="filterText" clearable placeholder="请输入" />
          <div class="list">
            <el-tree ref="treeRef" class="filter-tree" :data="state.heatList" :props="{
                label: 'name',
                children: 'loopInfo'
              }" default-expand-all :filter-node-method="filterNode" :expand-on-click-node="false" @node-click="onNodeClick">
              <template #default="{ data }">
                <span class="custom-tree-node" :class="{ active: data.code === curNode }">
                  <span class="name" :title="data.name">{{ data.name }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </div>
        <div class="right-panel">
          <el-form :model="state.tableData.param" ref="queryRef" :inline="true" label-width="68px">
            <el-form-item label="时间范围" prop="dateRange">
              <el-date-picker v-model="state.tableData.param.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="default" type="primary" @click="getChartData">
                <el-icon>
                  <ele-Search />
                </el-icon>
                查询
              </el-button>
              <!-- <el-button size="default" @click="resetQuery(queryRef)">
                <el-icon>
                  <ele-Refresh />
                </el-icon>
                重置
              </el-button> -->
            </el-form-item>
          </el-form>
          <div class="chart" style="height: 400px" v-loading="state.tableData.loading" ref="lineChartRef"></div>
          <div class="title" style="margin-top:20px">数据列表</div>
          <el-table :data="tableData" v-loading="loading" style="width: 100%">
            <el-table-column label="ID" align="center" prop="id" width="60" />
            <el-table-column label="环路编号" prop="huanLuNo" :show-overflow-tooltip="true" />
            <el-table-column label="环路名称" prop="huanLuName" :show-overflow-tooltip="true" />
            <el-table-column label="一网供水温度" prop="inTemperature1" :show-overflow-tooltip="true" />
            <el-table-column label="一网回水温度" prop="outTemperature1" :show-overflow-tooltip="true" />
            <el-table-column label="二网供水温度" prop="inTemperature2" :show-overflow-tooltip="true" />
            <el-table-column label="二网回水温度" prop="outTemperature2" :show-overflow-tooltip="true" />
            <el-table-column label="一网供水压力" prop="inPressure1" :show-overflow-tooltip="true" />
            <el-table-column label="一网回水压力" prop="outPressure1" :show-overflow-tooltip="true" />
            <el-table-column label="二网供水压力" prop="inPressure2" :show-overflow-tooltip="true" />
            <el-table-column label="二网回水压力" prop="outPressure2" :show-overflow-tooltip="true" />
            <el-table-column label="一网供水流量" prop="supplyWaterFlow" :show-overflow-tooltip="true" />
            <el-table-column label="一网回水流量" prop="returnWaterFlow" :show-overflow-tooltip="true" />
            <el-table-column label="二网供水流量" prop="supplyWaterFlow2" :show-overflow-tooltip="true" />
            <el-table-column label="二网回水流量" prop="returnWaterFlow2" :show-overflow-tooltip="true" />
            <el-table-column label="阀门开度" prop="supplyValve" :show-overflow-tooltip="true" />
            <!-- <el-table-column label="室内温度" prop="" :show-overflow-tooltip="true" />
            <el-table-column label="室外温度" prop="" :show-overflow-tooltip="true" /> -->
          </el-table>
          <pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick, onMounted } from 'vue';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';
import heatApi from '/@/api/heatStation';
import energyApi from '/@/api/energyAnalysis';
import { formatDate } from '/@/utils/formatTime'
import { useSearch } from '/@/hooks/useCommon';
import { stat } from 'fs';


const { params, tableData, getList, loading } = useSearch<any[]>(energyApi.getEnergyLoopdataPage, 'list', {
  loopCode: '',
  dateRange: [
    formatDate(new Date(), 'YYYY-mm-dd'),
    formatDate(new Date(), 'YYYY-mm-dd')
  ]
})

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
  tableData: {
    data: [],
    loading: false,
    param: {
      dateRange: [
        formatDate(new Date(), 'YYYY-mm-dd'),
        formatDate(new Date(), 'YYYY-mm-dd')
      ]
    }
  }
})



const lineChartRef = ref()
const checkList = ref([])
const treeRef = ref()
const filterText = ref('')
const curNode = ref('')
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
watch(() => state.tableData.param.dateRange, (val) => {
  params.dateRange = val
})
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.name.includes(value)
}

const queryTree = () => {
  heatApi.heatStation.getAllStaAndLoop({})
    .then((res: any) => {
      state.heatList = res || [];
      if (state.heatList.length) {
        curNode.value = state.heatList[0].code
        params.loopCode = state.heatList[0].code
      }
      getChartData()
    });
};
// 
const getChartData = () => {
  getList();
  state.tableData.loading = true
  energyApi.getEnergyLoopdata({
    loopCode: curNode.value,
    dateRange: state.tableData.param.dateRange
  }).then((res: any) => {
    const data = res.list || []
    state.tableData.data = data

    state.lineChartXAxis = []
    state.inPressure1 = []
    state.inPressure2 = []
    state.inTemperature1 = []
    state.inTemperature2 = []
    state.outPressure1 = []
    state.outPressure2 = []
    state.outTemperature1 = []
    state.outTemperature2 = []

    data.forEach((item: any) => {
      state.lineChartXAxis.push(item.datetime);
      state.inPressure1.push(item.inPressure1);
      state.inPressure2.push(item.inPressure2);
      state.inTemperature1.push(item.inTemperature1);
      state.inTemperature2.push(item.inTemperature2);
      state.outPressure1.push(item.outPressure1);
      state.outPressure2.push(item.outPressure2);
      state.outTemperature1.push(item.outTemperature1);
      state.outTemperature2.push(item.outTemperature2);
    });
    state.tableData.loading = false
    nextTick(() => {
      initLineChart();
    });
  })
}
const onNodeClick = (data: any) => {
  curNode.value = data.code
  params.loopCode = data.code
  getChartData()
}

// 初始化图表
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
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 30
      },
      {
        start: 0,
        end: 30
      }
    ],
    series: [
      // { name: '一网供水压力', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.inPressure1 },
      // { name: '二网供水压力', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.inPressure2 },
      { name: '一网供水温度', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.inTemperature1 },
      { name: '二网供水温度', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.inTemperature2 },
      // { name: '一网回水压力', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.outPressure1 },
      // { name: '二网回水压力', type: 'line', symbolSize: 6, symbol: 'circle', smooth: true, data: state.outPressure2 },
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
      }, i * 100);
    }
  });
};
// 批量设置 echarts resize
const initEchartsResize = () => {
  window.addEventListener('resize', initEchartsResizeFun);
};
// 页面加载时
onMounted(() => {
  queryTree()
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
.title {
	font-size: 16px;
	font-weight: bold;
}
.panel {
	display: flex;
	justify-content: space-between;
	.left-panel {
		width: 250px;
		min-width: 250px;
		.list {
			max-height: 625px;
			overflow-y: auto;
		}
	}
	.right-panel {
		flex: 1;
		padding: 16px;
		overflow-x: hidden;
		.chart {
			width: 100%;
		}
	}
}

.custom-tree-node {
	.name {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&.active {
		color: var(--el-color-primary);
		// background: var(--el-color-primary-light-9);
	}
}

:deep(.el-form-item) {
	// margin-bottom: 0;
}
</style>
