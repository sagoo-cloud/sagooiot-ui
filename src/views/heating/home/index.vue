<template>
  <div class="data-overview">
    <el-row :gutter="15" class="home-card-one mb15">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(v, k) in dataOne" :key="k" :class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }">
        <div class="home-card-item">
          <div class="item-header">
            <img :src="isIsDark ? v.iconDark : v.icon" alt="">
            <span>{{ v.title }}</span>
          </div>
          <div class="item-content w100" :class="` home-one-animation${k}`">
            <p>
              <span>{{ v.contentTitle1 }}</span>
              <span>{{ v.val1 + v.unit1 }}</span>
            </p>
            <p>
              <span>{{ v.contentTitle2 }}</span>
              <span>{{ v.val2 + v.unit2 }}</span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-two mb15">
      <el-col :xs="24" :sm="10" :md="14" :lg="16" :xl="16">
        <div class="home-card-item">
          <div class="home-card-item-title" style="display: flex;justify-content:space-between;">
            <span>热网总能耗</span>
          </div>
          <el-tabs v-model="tabName" @tab-click="tabChange">
            <el-tab-pane label="总热耗" name="homeLineRef1">
              <div style="height: 380px" ref="homeLineRef1"></div>
            </el-tab-pane>
            <el-tab-pane label="总电耗" name="homeLineRef2">
              <div style="height: 380px" ref="homeLineRef2"></div>
            </el-tab-pane>
            <el-tab-pane label="总失水量" name="homeLineRef3">
              <div style="height: 380px" ref="homeLineRef3"></div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8" class="home-media">
        <div class="home-card-item">
          <div class="bar-header">
            <p class='home-card-item-title'>环路回温/热用户室温占比</p>
            <!-- <div class="lable-group1">
							<div @click="changePieType('1')" :class="pieType == '1' ? 'active' : ''">环路</div>
							<div @click="changePieType('2')" :class="pieType == '2' ? 'active' : ''">热用户</div>
						</div> -->
          </div>
          <div style="height: 90%" ref="homePieRef"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-three mb15">
      <el-col>
        <div class="home-card-item">
          <div style="height: 100%" ref="homeBarRef"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="home-card-four">
      <el-col>
        <div class="home-card-item">
          <div style="height: 100%" ref="homeFourBarRef"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, onMounted, ref, watch, nextTick, onActivated } from 'vue';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';

import ele from '/@/assets/img/ele.svg';
import ele1 from '/@/assets/img/ele1.svg';

import fire from '/@/assets/img/fire.svg';
import fire1 from '/@/assets/img/fire1.svg';

import map from '/@/assets/img/map.svg';
import map1 from '/@/assets/img/map1.svg';

import water from '/@/assets/img/water.svg';
import water1 from '/@/assets/img/water1.svg';


import api from '/@/api/datahub';

let global: any = {
  homeChartOne: null,
  homeChartTwo: null,
  homeCharThree: null,
  homeCharFour: null,
  dispose: [null, '', undefined],
};

export default defineComponent({
  name: 'heating-home',
  setup() {
    const tabName = ref('homeLineRef1');
    const homeLineRef1 = ref();
    const homeLineRef2 = ref();
    const homeLineRef3 = ref();
    const homePieRef = ref();
    const homeBarRef = ref();
    const homeFourBarRef = ref();
    const store = useStore();
    const state = reactive({
      checkList: ['一网供水温度'],
      rangeValue: 10,
      isIsDark: false,
      dataOne: [
        {
          icon: map,
          iconDark: map1,
          title: '供热面积',
          contentTitle1: '供热面积',
          val1: '',
          unit1: '万㎡',
          contentTitle2: '总面积',
          val2: '',
          unit2: '万㎡',
        },
        {
          icon: fire,
          iconDark: fire1,
          title: '热量',
          contentTitle1: '总耗热',
          val1: '',
          unit1: 'GJ',
          contentTitle2: '总单耗',
          val2: '',
          unit2: 'GJ/㎡',
        },
        {
          icon: ele,
          iconDark: ele1,
          title: '电量',
          contentTitle1: '总耗电',
          val1: '',
          unit1: 'KW.h',
          contentTitle2: '总单耗',
          val2: '',
          unit2: 'KW.h/㎡',
        },
        {
          icon: water,
          iconDark: water1,
          title: '水量',
          contentTitle1: '总耗水',
          val1: '',
          unit1: 'T',
          contentTitle2: '总单耗',
          val2: '',
          unit2: 'T/㎡',

        },
      ],
      myCharts: [],
      charts: {
        theme: '',
        bgColor: '',
        color: '#303133',
      },
      statisticsChartXAxisData: [],
      inTemperature: [],
      outTemperature: [],
      diffTemperature: [],
      chartXAxisData: [],
      flowLossData: [],
      elctricConsumptionData: [],
      unitConsumptionData: [],
      pieData: [],
      pieType: '1',
      pressureXAxisData: [],
      inPressureData: [],
      outPressureData: [],
      diffPressureData: []
    });

    // 获取顶部总数据
    const getStatisticsTotalData = () => {
      api.statistics.getStatisticsOverview({ queryType: 'num' }).then((res: any) => {
        const {
          elctricConsumption,
          elctricConsumptionTotal,
          flowLoss,
          flowLossTotal,
          forRealArea,
          heatingArea,
          unitConsumption,
          unitConsumptionTotal
        } = res.data;
        state.dataOne[0].val1 = heatingArea;
        state.dataOne[0].val2 = forRealArea;

        state.dataOne[1].val1 = unitConsumption;
        state.dataOne[1].val2 = unitConsumptionTotal;

        state.dataOne[2].val1 = elctricConsumption;
        state.dataOne[2].val2 = elctricConsumptionTotal;

        state.dataOne[3].val1 = flowLoss;
        state.dataOne[3].val2 = flowLossTotal;

      });
    };

    // 获取温度监测数据
    const getStatisticsChartData = () => {
      api.statistics.getStatisticsOverview({ queryType: 'temperature' }).then((res: any) => {
        const data = res.data
        state.statisticsChartXAxisData = [];
        state.inTemperature = [];
        state.outTemperature = [];
        state.diffTemperature = [];
        Object.values(data).forEach((i: object) => {
          state.statisticsChartXAxisData.push(i.name);
          state.inTemperature.push(i.inTemperature);
          state.outTemperature.push(i.outTemperature);
          state.diffTemperature.push(i.diff);
        });

        nextTick(() => {
          initBarChart();
        });
      });
    };
    // 获取压力监测数据
    const getStatisticsPressureChartData = () => {
      api.statistics.getStatisticsOverview({ queryType: 'pressure' }).then((res: any) => {
        const data = res.data
        state.pressureXAxisData = [];
        state.inPressureData = [];
        state.outPressureData = [];
        state.diffPressureData = [];
        Object.values(data).forEach((i: object) => {
          state.pressureXAxisData.push(i.name);
          state.inPressureData.push(i.inPressure);
          state.outPressureData.push(i.outPressure);
          state.diffPressureData.push(i.diff);
        });

        nextTick(() => {
          initBarFourChart();
        });
      });
    };
    // 温度检测
    const initBarChart = () => {
      if (!global.dispose.some((b: any) => b === global.homeChartOne)) global.homeChartOne.dispose();
      global.homeChartOne = <any>echarts.init(homeBarRef.value, state.charts.theme);
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        title: {
          text: '温度监测',
          x: 'left',
          textStyle: { fontSize: '15', color: state.charts.color },
        },
        legend: {
          data: ['二网供水温度', '二网回水温度', '二网供回水温差'],
          top: 35,
          textStyle: {
            color: state.charts.color
          },
        },
        grid: { top: 80, bottom: 30 },
        // calculable: true,
        xAxis: [
          { data: state.statisticsChartXAxisData }
        ],
        yAxis: [
          {
            name: '℃',
            type: 'value'
          }
        ],
        series: [
          {
            name: '二网供水温度',
            type: 'bar',
            data: state.inTemperature
          },
          {
            name: '二网回水温度',
            type: 'bar',
            data: state.outTemperature
          },
          {
            name: '二网供回水温差',
            type: 'bar',
            data: state.diffTemperature
          }
        ]
      };
      (<any>global.homeChartOne).setOption(option);
      (<any>state.myCharts).push(global.homeChartOne);
    };
    // 柱状图
    const initBarFourChart = () => {
      if (!global.dispose.some((b: any) => b === global.homeCharFour)) global.homeCharFour.dispose();
      global.homeCharFour = <any>echarts.init(homeFourBarRef.value, state.charts.theme);
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        title: {
          text: '压力监测',
          x: 'left',
          textStyle: { fontSize: '15', color: state.charts.color },
        },
        legend: {
          data: ['二网供水压力', '二网回水压力', '二网供回水压差'],
          top: 35,
          textStyle: {
            color: state.charts.color
          },
        },
        grid: { top: 80, bottom: 30 },
        xAxis: [
          { data: state.pressureXAxisData }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '二网供水压力',
            type: 'bar',
            data: state.inPressureData
          },
          {
            name: '二网回水压力',
            type: 'bar',
            data: state.outPressureData
          },
          {
            name: '二网供回水压差',
            type: 'bar',
            data: state.diffPressureData
          }
        ]
      };
      (<any>global.homeCharFour).setOption(option);
      (<any>state.myCharts).push(global.homeCharFour);
    };
    // 获取环路回温占比数据数据
    const getStatisticsPieData = () => {
      api.statistics.getStatisticsOverview({ queryType: 'ratio' }).then((res: any) => {
        const data = res.data
        const arr = Object.values(data)
        let sum = 0
        arr.forEach(item => {
          sum += item
        })
        Object.keys(data).forEach((key: string) => {
          state.pieData.push({ name: key, value: (data[key] / sum).toFixed(2) * 1, num: data[key] });
        });

        nextTick(() => {
          initPieChart();
        });
      });
    };
    // 饼图
    const initPieChart = () => {
      if (!global.dispose.some((b: any) => b === global.homeChartTwo)) global.homeChartTwo.dispose();
      global.homeChartTwo = <any>echarts.init(homePieRef.value, state.charts.theme);
      // var getname = ['提示', '建议', '警告', '严重警告', '故障'];
      // var getvalue = [34.2, 38.87, 17.88, 9.05, 2.05];
      // var data = [];
      // for (var i = 0; i < getname.length; i++) {
      // 	data.push({ name: getname[i], value: getvalue[i] });
      // }
      const colorList = ['#51A3FC', '#36C78B', '#FEC279', '#968AF5', '#FF0000'];
      const option = {
        backgroundColor: state.charts.bgColor,
        grid: { top: 80, bottom: 10 },
        tooltip: { trigger: 'item', formatter: '{b} <br/> {d}% <br/>' },
        legend: {
          top: 35,
          color: state.charts.color,
          textStyle: {
            color: state.charts.color,
          },
        },
        series: [
          {
            type: 'pie',
            radius: [60, 100],
            center: ['50%', '65%'],
            itemStyle: {
              borderRadius: 8,
            },
            label: {
              show: true,
              color: state.charts.color,
              formatter: '{b} {d}%'
            },
            data: state.pieData,
          },
        ],
      };
      (<any>global.homeChartTwo).setOption(option);
      (<any>state.myCharts).push(global.homeChartTwo);
    };
    // 获取热网总能耗数据
    const getStatisticsLineChartData = () => {
      if (!state.rangeValue) return;
      api.statistics.getStatisticsOverview({ queryType: 'energy' }).then((res: any) => {
        const { flowLoss, elctricConsumption, unitConsumption } = res.data
        // calorie：总热耗  electric：总电耗  water：总失水量
        state.chartXAxisData = [];
        state.flowLossData = [];
        state.elctricConsumptionData = [];
        state.unitConsumptionData = [];
        flowLoss.forEach((i: any) => {
          state.chartXAxisData.push(i.date)
          state.flowLossData.push(i.total)
        });
        elctricConsumption.forEach((i: any) => {
          state.elctricConsumptionData.push(i.total)
        });
        unitConsumption.forEach((i: any) => {
          state.unitConsumptionData.push(i.total)
        });
        if (state.rangeValue == 10) return
        nextTick(() => {
          initLineChart();
        });

      });
    };
    // 折线图
    const initLineChart = () => {
      if (!global.dispose.some((b: any) => b === global.homeCharThree)) global.homeCharThree.dispose();

      let dom: any
      let data: any
      if (tabName.value === 'homeLineRef1') {
        dom = homeLineRef1.value
        data = state.flowLossData
      } else if (tabName.value === 'homeLineRef2') {
        dom = homeLineRef2.value
        data = state.elctricConsumptionData
      } else {
        dom = homeLineRef3.value
        data = state.unitConsumptionData
      }

      global.homeCharThree = <any>echarts.init(dom, state.charts.theme);

      const common = {
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbolSize: 12,
        yAxisIndex: 0,
        // areaStyle: {
        // 	color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        // 		{ offset: 0, color: 'rgba(22,132,252,0.3)' },
        // 		{ offset: 1, color: 'rgba(22,132,252,0)' },
        // 	]),
        // 	shadowColor: 'rgba(22,132,252,0.2)',
        // 	shadowBlur: 20,
        // },
        // itemStyle: { color: 'rgba(22, 132, 252, 1)' },
      }
      const option = {
        backgroundColor: state.charts.bgColor,
        tooltip: { trigger: 'axis' },
        // legend: {
        //   data: ['总热耗', '总电耗', '总失水量'],
        //   top: 30, textStyle: { color: state.charts.color }
        // },
        grid: { top: 30, right: 20, bottom: 20, left: 20, containLabel: true },
        xAxis: [
          {
            type: 'category',
            data: state.chartXAxisData,
            boundaryGap: true,
            axisTick: { show: false }
          },
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            ...common,
            data,
          },
          // {
          //   name: '总电耗',
          //   ...common,
          //   data: state.elctricConsumptionData,
          // },
          // {
          //   name: '总失水量',
          //   ...common,
          //   data: state.unitConsumptionData,
          // }
        ],
      };
      (<any>global.homeCharThree).setOption(option);
      (<any>state.myCharts).push(global.homeCharThree);
    };

    // 切换图形
    const tabChange = (data: any) => {
      setTimeout(() => {
        initLineChart(data.paneName);
      }, 100)
    };
    // 切换饼图类型
    const changePieType = (type: string, name: string) => {
      state.pieType = type;
      nextTick(() => {
        initPieChart();
      });
    };
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
      getStatisticsTotalData();
      getStatisticsChartData();
      getStatisticsPressureChartData();
      getStatisticsLineChartData();
      getStatisticsPieData();
      // 获取布局配置信息
      state.isIsDark = store.state.themeConfig.themeConfig.isIsDark;
    });
    // 由于页面缓存原因，keep-alive
    onActivated(() => {
      initEchartsResizeFun();
    });
    // 监听 vuex 中的 tagsview 开启全屏变化，重新 resize 图表，防止不出现/大小不变等
    watch(
      () => store.state.tagsViewRoutes.isTagsViewCurrenFull,
      () => {
        initEchartsResizeFun();
      }
    );
    // 监听 vuex 中是否开启深色主题
    watch(
      () => store.state.themeConfig.themeConfig.isIsDark,
      () => {
        state.isIsDark = store.state.themeConfig.themeConfig.isIsDark
      },
      {
        deep: true,
        immediate: true,
      }
    );
    // 监听 vuex 中是否开启深色主题
    watch(
      () => store.state.themeConfig.themeConfig.isIsDark,
      (isIsDark) => {
        nextTick(() => {
          console.log(isIsDark)
          // if(!isIsDark) return
          state.charts.theme = isIsDark ? 'transparent' : '';
          state.charts.bgColor = isIsDark ? 'transparent' : '';
          state.charts.color = isIsDark ? '#dadada' : '#303133';
          setTimeout(() => {
            initLineChart();
            initPieChart();
            initBarChart();
            initBarFourChart();
          }, 1000);
        });
      },
      {
        deep: true,
        immediate: true,
      }
    );
    return {
      tabName,
      homeLineRef1,
      homeLineRef2,
      homeLineRef3,
      tabChange,
      homePieRef,
      homeBarRef,
      homeFourBarRef,
      changePieType,
      getStatisticsLineChartData,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.data-overview {
	overflow: hidden;

	// .home-card-one,
	.home-card-two,
	.home-card-three,
	.home-card-four {
		.home-card-item,
		.home-card-top {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);

			&:hover {
				box-shadow: 0 2px 12px var(--next-color-dark-hover);
				transition: all ease 0.3s;
			}

			&-icon {
				width: 70px;
				height: 70px;
				border-radius: 100%;
				flex-shrink: 1;

				i {
					color: var(--el-text-color-placeholder);
				}
			}

			&-title {
				font-size: 15px;
				font-weight: bold;
				height: 30px;
			}
		}
	}

	.home-card-one {
		@for $i from 0 through 3 {
			.home-one-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/10) + s;
			}
		}
	}

	.home-card-one .home-card-item {
		width: 100%;
		border-radius: 4px;
		transition: all ease 0.3s;
		overflow: hidden;
		background: var(--el-color-white);
		color: var(--el-text-color-primary);
		border: 1px solid var(--next-border-color-light);

		&:hover {
			box-shadow: 0 2px 12px var(--next-color-dark-hover);
			transition: all ease 0.3s;
		}

		.item-header {
			display: flex;
			justify-content: center;
			align-content: center;
			color: #101010;
			padding: 10px 0;
			border-bottom: 1px solid var(--next-border-color-light);
			font-size: 20px;
			font-weight: bold;

			img {
				margin-right: 32px;
				width: 24px;
				height: 24px;
				margin-top: 3px;
			}
		}

		.item-content {
			padding: 26px;

			p {
				display: flex;
				justify-content: space-between;
				align-content: center;

				span:nth-child(1) {
					line-height: 33px;
					font-size: 14px;
					flex: 0 0 60px;
				}

				span:nth-child(2) {
					color: #101010;
					font-weight: bold;
					font-size: 22px;
					word-wrap: break-word;
					word-break: break-all;
				}
			}

			p:nth-child(2) {
				margin-top: 26px;
			}
		}
	}

	.home-card-two,
	.home-card-three,
	.home-card-four {
		.home-card-item {
			height: 500px;
		}

		.home-card-top {
			height: 250px;

			.box-card {
				padding: 15px 20px 20px 20px;

				p {
					margin-bottom: 10px;
				}

				&-item {
					margin-bottom: 20px;
				}
			}
		}

		.home-card-item,
		.home-card-top {
			width: 100%;
			overflow: hidden;

			.home-monitor {
				height: 100%;

				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;

					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;

						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}

					@for $i from 0 through $homeNavLengh {
						.home-animation#{$i} {
							opacity: 0;
							animation-name: error-num;
							animation-duration: 0.5s;
							animation-fill-mode: forwards;
							animation-delay: calc($i/10) + s;
						}
					}
				}
			}
		}
	}

	.text-info {
		color: #23c6c8;
	}

	.text-danger {
		color: #ed5565;
	}

	.git-res {
		margin-top: 20px;
	}

	.git-res .el-link {
		margin-right: 30px;
	}

	ul,
	li {
		padding: 0;
		margin: 0;
		list-style: none;
	}

	.product {
		margin-top: 50px;

		h3 {
			margin-bottom: 15px;
		}
	}

	.product li {
		margin-bottom: 20px;
		float: left;
		width: 150px;
	}

	.box-card.xx {
		margin-top: 20px;
	}
}

.lable-group,
.lable-group1 {
	// background-color: pink;
	display: flex;
	width: 100%;
	margin-top: 20px;
	border: 1px solid rgba(22, 132, 252, 1);

	> div {
		cursor: pointer;
		width: 33%;
		text-align: center;
		padding: 6px 0;

		color: rgba(22, 132, 252, 1);
	}

	div:nth-child(2) {
		border-left: 1px solid rgba(22, 132, 252, 1);
		border-right: 1px solid rgba(22, 132, 252, 1);
	}

	.active {
		background-color: rgba(22, 132, 252, 1);
		color: #fff;
	}
}

.lable-group1 > div {
	width: 50%;
}
</style>
