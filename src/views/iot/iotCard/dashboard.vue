<!-- 物联网卡-详情 -->
<template>
  <div class="page">
		<el-card shadow="nover" class="page-full-part">
      <div shadow="nover" class="top-wrap">
        <div class="title flex">
          数据统计
          <div class="select-wrap">
            <el-select v-model="types" placeholder="请选择" style="width: 120px" @change="typeChange()">
              <!-- 1电信,2联通,3移动 -->
              <el-option label="电信" :value="1" />
              <el-option label="联通" :value="2" />
              <el-option label="移动" :value="3" />
            </el-select>
          </div>
        </div>
        <div class="top-inner-wrap">
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
              <div>{{formatSize(statisticsData.realMonthTotal * 1024 * 1024)}}</div>
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
        </div>

        
      </div>
			<div class="statistics-wrap">
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
										v-model="dateTimeRange"
										:disabled-date="disabledDate"
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
					<div style="height: 508px;" ref="flowLine"></div>
				</el-card>

				<el-card shadow="nover" class="right-wrap">
					<div class="top-title-wrap">
						<div class="title">流量使用TOP10</div>
						<el-date-picker
							class="date-picker-wrap"
							v-model="dateRange"
							:disabled-date="disabledDate"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							format="YYYY-MM-DD"
							date-format="YYYY/MM/DD"
						/>
					</div>
					<div class="ranking-list">
						<div class="rank-item" v-for="(item, index) in rankList" :key="index">
							<div :class="`number-item-${++index}`" class="number">{{index++}}</div>
							<div class="card-num">{{item.accessNumber}}</div>
							<el-progress class="progress-wrap" :text-inside="true" :stroke-width="16" :percentage="totalNum ? (item.value / totalNum * 100).toFixed(2) : 0" />
							<div class="flow-num">{{formatSize(item.value * 1024 * 1024)}}</div>
						</div>
					</div>
					
				</el-card>
			</div>
		</el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watch, markRaw } from "vue"
import { formatSize } from "/@/utils/common";
import api from '/@/api/iotCard';
import { useStore } from '/@/store/index';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const store = useStore();

const types = ref(1);
const statisticsData = ref({
	realMonthTotal: 0,
	yearTotal: 0,
	yesterdayTotal: 0
})

const flowLine = ref();
const yesterdayLine = ref();
const monthLine = ref();
const yearLine = ref();

const dateRange = ref<any>([
  dayjs(new Date()).subtract(1, 'month'),
  dayjs(new Date()),
])


const dateTimeRange = ref<any>([
  dayjs(new Date()).subtract(6, 'day'),
  dayjs(new Date()),
])

const totalNum = ref(0);

const activeIndex= ref(2);

const rankList = ref([]);

const flowLineXAxisData = ref<any>([]);
const flowLineData = ref<any>([]);

const yearLineXAxisData = ref<any>([]);
const yearLineData = ref<any>([]);

const monthLineXAxisData = ref<any>([]);
const monthLineData = ref<any>([]);

const yesterdayLineXAxisData = ref<any>([dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')]);
const yesterdayLineData = ref<any>([]);



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

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const getFlowDataByDateRange = async (dateRangeData:any) => {
  const simFlowRes = await api.dashboard.getFlowDataByDateRange({
    sdate: dayjs(dateRangeData[0]).format('YYYY-MM-DD HH:mm:ss'),
    edate: dayjs(dateRangeData[1]).format('YYYY-MM-DD HH:mm:ss'),
    types: types.value
  })
	return simFlowRes.data;
}

const getYesterdayFlowData = async () => {
  const yesterday = dayjs(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
  const res = await getFlowDataByDateRange([
    yesterday + " 00:00:00",
    yesterday + " 23:59:59"
  ])
  yesterdayLineData.value = [res[0].value];
  initYesterdayLineChart();
}
const getMonthFlowData = async () => {
  monthLineXAxisData.value = [];
  monthLineData.value = [];
  const monthDay1 = dayjs(new Date()).startOf('month').format('YYYY-MM-DD');
  const monthDay2 = dayjs(new Date()).endOf('month').format('YYYY-MM-DD');
  const res = await getFlowDataByDateRange([monthDay1, monthDay2])
  res.reverse().forEach((item:any) => {
    monthLineXAxisData.value.push(item.date);
    monthLineData.value.push(item.value);
  })

  initMonthLineChart();
}
const getYearFlowData = async () => {
	yearLineXAxisData.value = [];
	yearLineData.value = [];
	const year = dayjs(new Date()).startOf('year').format('YYYY');
	const res = await getFlowDataByDateRange([
		year + '-01-01',
		year + '-12-31'
	])
	res.reverse().forEach((item:any) => {
		yearLineXAxisData.value.push(item.date);
		yearLineData.value.push(item.value);
	})
	initYearLineChart();
}

const getFlowData = async () => {
	flowLineXAxisData.value = [];
  flowLineData.value = [];
	const res = await getFlowDataByDateRange(dateTimeRange.value)
	res.reverse().forEach((item:any) => {
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
    dateTimeRange.value = [
      yesterday + " 00:00:00",
      yesterday + " 23:59:59"
    ]
  }else if(key === 2) {
    // 近一周
    dateTimeRange.value = [
      dayjs(new Date()).subtract(6, 'day'),
      dayjs(new Date()),
    ]
  }else if(key === 3) {
    // 近一月
    dateTimeRange.value = [
      dayjs(new Date()).subtract(1, 'month'),
      dayjs(new Date()),
    ]
  }else if(key === 4) {
    // 近一年
    dateTimeRange.value = [
      dayjs(new Date()).subtract(1, 'year'),
      dayjs(new Date()),
    ]
  }
  getFlowData();
}

const typeChange = () => {
	getYesterdayFlowData();
	getMonthFlowData();
	getYearFlowData();
	getFlowData();
	getTop10Data();
}

const getTop10Data = async () => {
  const top10Res = await api.dashboard.getTop10Data({
    sdate: dayjs(dateRange.value[0]).format('YYYY-MM-DD'),
    edate: dayjs(dateRange.value[1]).format('YYYY-MM-DD'),
    types: types.value
  })
	rankList.value = top10Res.data || [];
	totalNum.value = top10Res.data ? top10Res.data[0].value : 0;
}
const getFlowAllData = async () => {
  const res = await api.dashboard.getFlowData({
    types: types.value
  })
	statisticsData.value = res
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
        splitLine: { show: false, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
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
        itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fe9a8bb3' },
            { offset: 1, color: '#fe9a8b03' },
          ]),
        },
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
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#9E87FFb3' },
						{ offset: 1, color: '#9E87FF03' },
					]),
				},
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
			}
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
        itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#fe9a8bb3' },
						{ offset: 1, color: '#fe9a8b03' },
					]),
				},
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
          formatter: function (value:any) {
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

getFlowAllData();
getYesterdayFlowData();
getMonthFlowData();
getYearFlowData();
getFlowData();
getTop10Data();

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
.select-wrap {
	text-align: right;
}
.top-wrap {
	width: 100%;
  .flex {
    justify-content: space-between;
  }
	.top-inner-wrap {
		display: flex;
		margin-top: 10px;

	}
	.line-wrap {
		flex: 1;
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
			width: calc(100% - 150px);
			margin-left: 150px;
		}
	}
	.line-wrap:not(:nth-child(1)) {
		margin-left: 20px;
	}
}
.title {
	color: var(--el-text-color-primary);
	font-size: 16px;
	font-weight: 700;
}
.statistics-wrap {
  display: flex;
  justify-content: space-between;
  align-items: normal;
  margin-top: 20px;
  width: 100%;

  .left-wrap {
    width: 66.3%;
    .top-title-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      ::v-deep .el-date-editor.el-input__wrapper {
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
    width: calc(33.7% - 20px);
    margin-left: 20px;
		.top-title-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      ::v-deep .el-date-editor.el-input__wrapper {
        max-width: 220px!important;
      }
    }
		.ranking-list {
			width: 100%;
			.rank-item {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 24px;

        .number {
          flex: 0 0 24px;
          height: 24px;
          color: #fff;
          font-weight: 700;
          line-height: 24px;
          text-align: center;
          background-color: #d1d1d1;
        }
        .number-item-1 {
          color: #e50012;
          background-color: #e500121a;
        }
        .number-item-2 {
          color: #fba500;
          background-color: #fba5001a;
        }
        .number-item-3 {
          color: #597ef7;
          background-color: #597ef71a;
        }
				.card-num {
					width: 110px;
				}
				.progress-wrap {
					width: 32%;
				}
				.flow-num {
					width: 90px;
					text-align: right;
				}
			}
		}
  }
}
  
</style>