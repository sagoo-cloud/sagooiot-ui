<!-- 物联网卡-详情 -->
<template>
  <div>
    <el-card shadow="nover">
       <el-descriptions
        class="margin-top"
        title="基本信息"
        :column="3"
        :size="size"
        border
      >
        <!-- <template #extra>
          <el-button type="primary">编辑</el-button>
        </template> -->
        <!-- 卡号 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <user />
              </el-icon>
              卡号
            </div>
          </template>
          {{sim.accNumber}}
        </el-descriptions-item>

        <!-- ICCID -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <iphone />
              </el-icon>
              ICCID
            </div>
          </template>
          {{sim.iccid}}
        </el-descriptions-item>

        <!-- 绑定设备 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <iphone />
              </el-icon>
              绑定设备
            </div>
          </template>
          {{sim.bindDeviceName}}
        </el-descriptions-item>

        <!-- 平台类型 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <iphone />
              </el-icon>
              平台类型
            </div>
          </template>
          {{sim.platTypes}}
        </el-descriptions-item>

        <!-- 	平台名称 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              平台名称
            </div>
          </template>
          {{sim.platName}}
        </el-descriptions-item>

        <!-- 运营商 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              运营商
            </div>
          </template>
          {{formatOperator(sim.types)}}
        </el-descriptions-item>

        <!-- 	类型 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              类型
            </div>
          </template>
          {{formatType(sim.simTypes)}}
        </el-descriptions-item>
        
        <!-- 	激活日期 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              激活日期
            </div>
          </template>
          {{sim.activationTime}}
        </el-descriptions-item>

        <!-- 更新时间 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              更新时间
            </div>
          </template>
          {{sim.updatedAt}}
        </el-descriptions-item>


        <!-- 总流量 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              总流量
            </div>
          </template>
          {{sim.totalFlow}}
        </el-descriptions-item>

        <!-- 使用流量 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              使用流量
            </div>
          </template>
          {{sim.usedFlow}}
        </el-descriptions-item>

        <!-- 剩余流量 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <location />
              </el-icon>
              剩余流量
            </div>
          </template>
          {{sim.leaveFlow}}
        </el-descriptions-item>

        <!-- 状态 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <tickets />
              </el-icon>
              状态
            </div>
          </template>
          <el-tag size="small">{{formatStatus(sim.simStatus)}}</el-tag>
        </el-descriptions-item>

        <!-- 说明 -->
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon :style="iconStyle">
                <office-building />
              </el-icon>
              说明
            </div>
          </template>
          {{sim.iccid}}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <div class="statistics-wrap gap-3">
      <el-card shadow="nover" class="left-wrap">
        <div class="top-title-wrap">
            <div class="title">流量统计</div>
            <div class="operate-wrap">
              <el-button-group>
                <el-button @click="changeDate(1)" :type="activeIndex == 1 ?  'primary' : ''">昨日</el-button>
                <el-button @click="changeDate(2)" :type="activeIndex == 2 ?  'primary' : ''">近一周</el-button>
                <el-button @click="changeDate(3)" :type="activeIndex == 3 ?  'primary' : ''">近一月</el-button>
                <el-button @click="changeDate(4)" :type="activeIndex == 4 ?  'primary' : ''">近一年</el-button>
              </el-button-group>
                <el-date-picker
                  class="date-picker-wrap"
                  v-model="dateRange"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  date-format="YYYY/MM/DD"
                  time-format="hh:mm:ss"
                />
            </div>
        </div>
        <div style="height: 460px;" ref="flowLine"></div>
      </el-card>

      <el-card shadow="nover" class="right-wrap">
        <div class="title">数据统计</div>
        <div class="line-wrap flow-line-wrap">
          <div class="text-wrap">
            <div class="text">昨日流量消耗</div>
            <div>{{formatSize(statisticsData.yesterdayTotal * 1024 * 1024)}}</div>
          </div>
          <div class="line-inner-wrap" ref="yesterdayLine"></div>
        </div>
        <div class="line-wrap flow-line-wrap">
          <div class="text-wrap">
            <div class="text">当月流量消耗</div>
            <div>{{formatSize(statisticsData.monthTotal * 1024 * 1024)}}</div>
          </div>
          <div class="line-inner-wrap" ref="monthLine"></div>
        </div>

        <div class="line-wrap flow-line-wrap">
          <div class="text-wrap">
            <div class="text">本年流量消耗</div>
            <div>{{formatSize(statisticsData.yearTotal * 1024 * 1024)}}</div>
          </div>
          <div class="line-inner-wrap" ref="yearLine"></div>
        </div>
        
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watch, markRaw } from "vue";
import { formatSize } from "/@/utils/common";
import api from '/@/api/iotCard';
import { useSearch } from "/@/hooks/useCommon";
import { useStore } from '/@/store/index';
import { useRoute } from 'vue-router';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const store = useStore();
const route = useRoute();
const sim = ref({
  accNumber: "",// 卡号
  iccid: "",// ICCID
  bindDeviceName: "",// 绑定设备
  platName: "",// 平台对接
  types: "",// 运营商
  simTypes: "",// 类型
  totalFlow: "",// 总流量
  usedFlow: "",// 使用流量
  leaveFlow: "",// 剩余流量
  activationTime: "",// 激活日期
  updatedAt: "",// 更新时间
  simStatus: "",// 状态
  remark: ""// 说明
})

const flowLine = ref();
const yesterdayLine = ref();
const monthLine = ref();
const yearLine = ref();

const dateRange = ref<any>([
  dayjs(new Date()).subtract(6, 'day'),
  dayjs(new Date()),
])
const activeIndex= ref(2);

const flowLineXAxisData = ref<any>([]);
const flowLineData = ref<any>([]);

const yearLineXAxisData = ref<any>([]);
const yearLineData = ref<any>([]);

const monthLineXAxisData = ref<any>([]);
const monthLineData = ref<any>([]);

const yesterdayLineXAxisData = ref<any>([dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')]);
const yesterdayLineData = ref<any>([]);

const statisticsData = ref({
	monthTotal: 0,
	yearTotal: 0,
	yesterdayTotal: 0
})

const state = reactive({
	global: {
		yesterdayLine: null,
    monthLine: null,
    yearLine: null,
		dispose: [null, '', undefined],
	} as any,
	myCharts: [],
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
});

const getDetailInfo = async () => {
  const res = await api.simCard.detailItem({ id: route.params.id });
  sim.value = res.sim;
  statisticsData.value = {
    monthTotal: res.monthFlow,
    yearTotal: res.yearFlow,
    yesterdayTotal: res.yesterdayFlow
  }
  await getFlowDataByDateRange();
  res.yearDataList.reverse().forEach((item:any) => {
    yearLineXAxisData.value.push(item.date);
    yearLineData.value.push(item.value);
  })
  res.monthDataList.reverse().forEach((item:any) => {
    monthLineXAxisData.value.push(item.date);
    monthLineData.value.push(item.value);
  })
  yesterdayLineData.value = [res.yearFlow];
  iniFlowLineChart();
  initYesterdayLineChart();
  initMonthLineChart();
  initYearLineChart();
}


getDetailInfo();


const getFlowDataByDateRange = async () => {
  const simFlowRes = await api.simCard.getFlowDataByDateRange({
    sdate: activeIndex.value !== 1 ? dateRange.value[0].format('YYYY-MM-DD HH:mm:ss') : dateRange.value[0],
    edate: activeIndex.value !== 1 ? dateRange.value[1].format('YYYY-MM-DD HH:mm:ss') : dateRange.value[1],
    accNumber: sim.value.accNumber,
    types: sim.value.types
  })
  simFlowRes.data.reverse().forEach((item:any) => {
    flowLineXAxisData.value.push(item.date);
    flowLineData.value.push(item.value);
  })
  iniFlowLineChart();
}

const changeDate = (key:number) => {
  // 1 昨天 2近一周 3近一月 4近一年
  activeIndex.value = key;
  if(key === 1) {
    // 昨天
    const yesterday = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
    dateRange.value = [
      yesterday + " 00:00:00",
      yesterday + " 23:59:59"
    ]
  }else if(key === 2) {
    // 近一周
    dateRange.value = [
      dayjs(new Date()).subtract(6, 'day'),
      dayjs(new Date()),
    ]
  }else if(key === 3) {
    // 近一月
    dateRange.value = [
      dayjs(new Date()).subtract(1, 'month'),
      dayjs(new Date()),
    ]
  }else if(key === 4) {
    // 近一年
    dateRange.value = [
      dayjs(new Date()).subtract(1, 'year'),
      dayjs(new Date()),
    ]
  }
  flowLineXAxisData.value = [];
  flowLineData.value = [];
  getFlowDataByDateRange();

}

const formatOperator = (val:any) => {
  // 1电信,2联通,3移动
  if(val == 1) {
    return "电信"
  }else if(val == 2) {
    return "联通"
  }else if(val == 3) {
    return "移动"
  }
}

const formatType = (val:any) => {
  // 1月卡，2季卡，3年卡，4其他
  if(val == 1) {
    return "月卡"
  }else if(val == 2) {
    return "季卡"
  }else if(val == 3) {
    return "年卡"
  }else if(val == 4) {
    return "其他"
  }
}

const formatStatus = (val:any) => {
  // 1：可激活 2：测试激活 3：测试去激活 4：在用5：停机6：运营商管理状态
  if(val == 1) {
    return "可激活"
  }else if(val == 2) {
    return "测试激活"
  }else if(val == 3) {
    return "测试去激活"
  }else if(val == 4) {
    return "在用"
  }else if(val == 5) {
    return "停机"
  }else if(val == 6) {
    return "运营商管理状态"
  }
}

// 折线图 - 昨日流量消耗
const initYesterdayLineChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.yesterdayLine)) state.global.yesterdayLine.dispose();
	state.global.yesterdayLine = markRaw(echarts.init(yesterdayLine.value, state.charts.theme));
  const option = {
    backgroundColor: state.charts.bgColor,
    xAxis: {
      data: yesterdayLineXAxisData.value,
      show: false,
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        show: false,
        splitLine: { show: false, lineStyle: { type: 'dashed', color: '#f5f5f5' } }
      },
    ],
    tooltip: { 
			trigger: 'axis',
			formatter: function (params:any) {
					var relVal = params[0].name
					let circle = `<i style="margin-right:4px;display: inline-block;width: 10px;height: 10px;border-radius: 50%;background-color:${params[0].color}"></i>`
					relVal += '<br/>' + circle + ' 流量: ' + formatSize(params[0].value*1024*1024)
					return relVal;
				}
		},
    grid: { top: 10, right: 10, bottom: 10, left: 10 },
    series: [
      {
        name: '流量',
        type: 'line',
        smooth: true,
        data: yesterdayLineData.value,
        lineStyle: { color: '#fe9a8b' },
        itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' }
      }
    ],
  };
  (<any>state.global.yesterdayLine).setOption(option);
  (<any>state.myCharts).push(state.global.yesterdayLine);
};


// 折线图 - 当月流量消耗
const initMonthLineChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.monthLine)) state.global.monthLine.dispose();
	state.global.monthLine = markRaw(echarts.init(monthLine.value, state.charts.theme));
  const option = {
    backgroundColor: state.charts.bgColor,
    xAxis: {
      data: monthLineXAxisData.value,
      show: false,
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        show: false,
        splitLine: { show: false, lineStyle: { type: 'dashed', color: '#f5f5f5' } }
      },
    ],
    tooltip: { 
			trigger: 'axis',
			formatter: function (params:any) {
					var relVal = params[0].name
					let circle = `<i style="margin-right:4px;display: inline-block;width: 10px;height: 10px;border-radius: 50%;background-color:${params[0].color}"></i>`
					relVal += '<br/>' + circle + ' 流量: ' + formatSize(params[0].value*1024*1024)
					return relVal;
				}
		},
    grid: { top: 10, right: 10, bottom: 10, left: 10 },
    series: [
      {
        name: '流量',
        type: 'line',
        smooth: true,
        data: monthLineData.value,
        lineStyle: { color: '#9E87FF' },
        itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
      }
    ],
  };
  (<any>state.global.monthLine).setOption(option);
  (<any>state.myCharts).push(state.global.monthLine);
};

// 折线图 - 本年流量消耗
const initYearLineChart = () => {
  if (!state.global.dispose.some((b: any) => b === state.global.yearLine)) state.global.yearLine.dispose();
	state.global.yearLine = markRaw(echarts.init(yearLine.value, state.charts.theme));
  const option = {
    backgroundColor: state.charts.bgColor,
    xAxis: {
      data: yearLineXAxisData.value,
      show: false,
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        show: false,
        splitLine: { show: false, lineStyle: { type: 'dashed', color: '#f5f5f5' } }
      },
    ],
    tooltip: { 
			trigger: 'axis',
			formatter: function (params:any) {
					var relVal = params[0].name
					let circle = `<i style="margin-right:4px;display: inline-block;width: 10px;height: 10px;border-radius: 50%;background-color:${params[0].color}"></i>`
					relVal += '<br/>' + circle + ' 流量: ' + formatSize(params[0].value*1024*1024)
					return relVal;
				}
		},
    grid: { top: 10, right: 10, bottom: 10, left: 10 },
    series: [
      {
        name: '流量',
        type: 'line',
        smooth: true,
        data: yearLineData.value,
        lineStyle: { color: '#fe9a8b' },
        itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' }
      }
    ],
  };
  (<any>state.global.yearLine).setOption(option);
  (<any>state.myCharts).push(state.global.yearLine);
};

// 折线图 - 流量统计
const iniFlowLineChart = async () => {
  if (!state.global.dispose.some((b: any) => b === state.global.flowLine)) state.global.flowLine.dispose();
	state.global.flowLine = markRaw(echarts.init(flowLine.value, state.charts.theme));
  const option = {
    backgroundColor: state.charts.bgColor,
    grid: { top: 70, right: 20, bottom: 30, left: 30 },
    tooltip: { 
			trigger: 'axis',
			formatter: function (params:any) {
					var relVal = params[0].name
					let circle = `<i style="margin-right:4px;display: inline-block;width: 10px;height: 10px;border-radius: 50%;background-color:${params[0].color}"></i>`
					relVal += '<br/>' + circle + ' 流量: ' + params[0].value + 'MB'
					return relVal;
				}
		},
    xAxis: {
      data: flowLineXAxisData.value,
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
        axisLabel: {
          margin: 2,
          formatter: function (value:any, index:any) {
            if (value >= 10000 && value < 10000000) {
              value = value / 10000 + "W";
            } else if (value >= 10000000) {
              value = value / 10000000 + "KW";
            }
            return value;
          }
        },
      },
    ],
    series: [
      {
        name: '流量',
        type: 'line',
        symbolSize: 6,
        symbol: 'circle',
        smooth: true,
        data: flowLineData.value,
        lineStyle: { color: '#9E87FF' },
        itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#9E87FFb3' },
            { offset: 1, color: '#9E87FF03' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: '#9E87FF' },
                { offset: 0.4, color: '#9E87FF' },
                { offset: 0.5, color: '#fff' },
                { offset: 0.7, color: '#fff' },
                { offset: 0.8, color: '#fff' },
                { offset: 1, color: '#fff' },
              ],
            },
            borderColor: '#9E87FF',
            borderWidth: 2,
          },
        },
      },
    ],
  };
  (<any>state.global.flowLine).setOption(option);
  (<any>state.myCharts).push(state.global.flowLine);
};

// 监听 vuex 中是否开启深色主题
watch(
  () => store.state.themeConfig.themeConfig.isIsDark,
  (isIsDark) => {
    nextTick(() => {
      state.charts.theme = isIsDark ? 'dark' : '';
      state.charts.bgColor = isIsDark ? 'transparent' : '';
      state.charts.color = isIsDark ? '#dadada' : '#303133';
      setTimeout(() => {
        iniFlowLineChart();
        initYesterdayLineChart();
        initMonthLineChart();
        initYearLineChart();
      }, 500);
    });
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.statistics-wrap {
  display: flex;
  justify-content: space-between;
  align-items: normal;
  margin-top: 20px;
  .title {
    color: var(--el-text-color-primary);
    font-size: 16px;
    font-weight: 700;
  }
  .left-wrap {
    width: 66%;
    .top-title-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      :deep(.el-date-editor.el-input__wrapper) {
        width: 360px!important;
        margin-left: 12px;
      }
      .operate-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .right-wrap {
    width: 36%;
    .line-wrap {
      width: 100%;
      background-color: #fff;
      background: #fcfcfc;
      border: 1px solid #e0e4e8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      position: relative;
      .text-wrap {
        position: absolute;
        left: 20px;
        top: 40px;
        .text {
          font-size: 14px;
          color: #000000a3;
        }
        div:nth-child(2) {
          font-size: 32px;
          font-weight: 700;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .line-inner-wrap {
        height: 100px;
        width: calc(100% - 120px);
        margin-left: 120px;
      }
    }
    .line-wrap:not(:nth-child(1)) {
      margin-top: 20px;
    }
  }
}
</style>