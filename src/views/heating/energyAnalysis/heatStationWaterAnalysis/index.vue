<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="panel">
        <div class="left-panel">
          <el-input v-model="filterText" clearable placeholder="请输入" />
          <div class="list">
            <el-tree ref="treeRef" class="filter-tree" :data="state.heatList" :props="{
                label: 'name',
                children: 'loopInfo'
              }" default-expand-all :expand-on-click-node="false" :filter-node-method="filterNode" @node-click="onNodeClick">
              <template #default="{ data }">
                <span class="custom-tree-node" :class="{ active: data.code === curNode }">
                  <span class="name" :title="data.name">{{ data.name }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </div>
        <div class="right-panel">
          <div class="title">供回水对比图</div>
          <div style="height: 300px" v-loading="state.tableData.loading" ref="barChartRef"></div>
          <div class="title mt-2">失水量曲线</div>
          <div style="height: 300px" v-loading="state.tableData.loading" ref="lineChartRef"></div>
          <div class="title mt-2">数据列表</div>

          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column type="index" width="55" label="序号" align="center" />
            <el-table-column label="日期" v-col="'key'" prop="datetime" min-width="120" :show-overflow-tooltip="true" />
            <el-table-column label="环路名称" prop="huanLuName" min-width="120" :show-overflow-tooltip="true" />
            <el-table-column label="供水流量" prop="supplyWater" min-width="120" :show-overflow-tooltip="true" />
            <el-table-column label="回水流量" prop="returnWater" min-width="120" :show-overflow-tooltip="true" />
            <el-table-column label="失水量" prop="waterLoss" min-width="120" :show-overflow-tooltip="true" />
          </el-table>
          <pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, onMounted, ref, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';
import api from '/@/api/energyAnalysis';
import heatApi from '/@/api/heatStation';
import { formatDate } from '/@/utils/formatTime';
import { useSearch } from '/@/hooks/useCommon';

const { params, tableData, getList, loading } = useSearch<any[]>(api.getEnergyHuanluWaterLossLineChartPage, 'list', { loopCode: '' });

let global: any = {
  barChart: null,
  lineChart: null,
  dispose: [null, '', undefined],
};

const queryRef = ref();
const barChartRef = ref();
const lineChartRef = ref();
const store = useStore();
const state = reactive({
  myCharts: [],
  charts: {
    theme: '',
    bgColor: '',
    color: '#303133',
  },
  param: {
    stationId: '',
    principal: '',
    interval: '',
    flow: ''
  },
  heatList: [],
  barChartXAxis: [],
  barChartSeries1: [],
  barChartSeries2: [],
  lineChartXAixs: [],
  lineChartSeries: [],
  tableData: {
    data: [],
    loading: false
  }
});

const treeRef = ref()
const filterText = ref('')
const curNode = ref('')
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.name.includes(value)
}

const onNodeClick = (data: any) => {
  curNode.value = data.code
  params.loopCode = data.code
  queryLineChart()
}

const queryTree = () => {
  heatApi.heatStation.getAllStaAndLoop({})
    .then((res: any) => {
      state.heatList = res || [];
      if (state.heatList.length) {
        curNode.value = state.heatList[0].code
        params.loopCode = state.heatList[0].code
      }
      queryLineChart()
    });
};

const queryLineChart = () => {
  getList()
  state.tableData.loading = true
  api.getEnergyWaterLossLineChart({ loopCode: curNode.value })
    // api.getEnergyWaterLossLineChart({ loopCode: 'D00107-1' })
    .then((res: any) => {
      console.log(res);
      let data = res.list || []

      state.lineChartXAixs = []
      state.lineChartSeries = []
      state.barChartXAxis = []
      state.barChartSeries1 = []
      state.barChartSeries2 = []

      data.forEach((item: any) => {
        state.lineChartXAixs.push(formatDate(new Date(item.datetime), 'HH:MM'));
        state.barChartXAxis.push(formatDate(new Date(item.datetime), 'HH:MM'));
        state.lineChartSeries.push(item.waterLoss);
        state.barChartSeries1.push(item.supplyWater);
        state.barChartSeries2.push(item.returnWater);
      });
      state.tableData.data = data
      state.tableData.loading = false

      nextTick(() => {
        initLineChart();
        initBarChart();
      });
    });
};
// 页面加载时
onMounted(() => {
  queryTree()
});

// 初始化图表
const initBarChart = () => {
  if (!global.dispose.some((b: any) => b === global.barChart)) global.barChart.dispose();
  global.barChart = <any>echarts.init(barChartRef.value, state.charts.theme);
  const option = {
    tooltip: { trigger: 'axis' },
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
        data: state.barChartXAxis
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '供水流量',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.barChartSeries1
      },
      {
        name: '回水流量',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.barChartSeries2
      }
    ]
  };
  (<any>global.barChart).setOption(option);
  (<any>state.myCharts).push(global.barChart);
}
// 初始化图标
const initLineChart = () => {
  if (!global.dispose.some((b: any) => b === global.lineChart)) global.lineChart.dispose();
  global.lineChart = <any>echarts.init(lineChartRef.value, state.charts.theme);
  const option = {
    backgroundColor: state.charts.bgColor,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: { trigger: 'axis' },
    legend: { data: ['失水量'] },
    xAxis: {
      data: state.lineChartXAixs,
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
      },
    ],
    series: [
      {
        name: '失水量',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: state.lineChartSeries
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
      state.charts.theme = isIsDark ? 'transparent' : '';
      state.charts.bgColor = isIsDark ? 'transparent' : '';
      state.charts.color = isIsDark ? '#dadada' : '#303133';
      setTimeout(() => {
        // initBarChart();
        initLineChart();
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

.panel {
	display: grid;
	grid-template-columns: 250px 1fr;
	.left-panel {
		.list {
			max-height: 625px;
			overflow-y: auto;
		}
	}
	.right-panel {
		padding: 16px;
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
</style>