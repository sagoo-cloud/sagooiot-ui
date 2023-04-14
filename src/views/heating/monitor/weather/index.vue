<template>
  <div class="monitor-weather">
    <div class="left" :style="{width: isCollapse?'384px':'40px',minWidth: isCollapse?'384px':'40px'}">
      <SvgIcon class="collapse" :name="isCollapse ? 'ele-Expand' : 'ele-Fold'" :size="16" @click="changeCollapse" />
      <div class="city-weather-data-overview-wrap" v-if="isCollapse">
        <section class="title">
          <span>城市</span>
          <span>风力</span>
          <span>日照时长</span>
        </section>
        <section style="cursor: pointer" :class="currentcityId == item.id ? 'active' : ''" @click="currentcityId = item.id, currentcityName = item.name" v-for="(item, index) in cityList" :key="index">
          <span>{{ item.name }}</span>
          <span>{{ item.windpower }}</span>
          <span>{{ item.sunshineDuration }}</span>
        </section>
      </div>
    </div>
    <div class="right">
      <el-row :gutter="15" class="home-card-two mb15">
        <el-col>
          <div class="weather-info">
            <section v-if="oneCityInfo.weather" style="display: flex;justify-content: space-between;">
              <div>
                <span class="temperature">{{ oneCityInfo.Temperature }}℃</span>
                <img :src="`/imgs/weather/${oneCityInfo.weather}.svg`" alt="">
                <span class="weather">{{ oneCityInfo.weather }}</span>
                <span>{{ oneCityInfo.reporttime }}更新</span>
              </div>
              <div class="history" @click="$router.push('/heating-monitor/weather-history/' + oneCityInfo.id)">历史数据 &gt;</div>
            </section>
            <section>
              <span style="margin-right: 20px;">地点：{{ currentcityName }}</span>
              <img src="/@/assets/img/windPowerIcon.svg" alt="">
              <span>风力: {{ oneCityInfo.winddirection + oneCityInfo.windpower }}</span>
              <img class="sunset-sunrise" src="/@/assets/img/sunset.svg" alt="">
              <span class="sunset">日出时间: {{ oneCityInfo.sunrise }}</span>
              <span>日落时间: {{ oneCityInfo.sunset }}</span>
            </section>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="15" class="home-card-two mb15">
        <el-col>
          <div class="home-card-item">
            <div class="home-card-item-title">
              <span>温度 监测图表</span>
              <el-select @change="getTemperatureEchartById(currentcityId)" v-model="temperatureType" placeholder="请选择查询范围" size="mini">
                <el-option v-for="item in ranges" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <div style="height: 100%" ref="homeTemLineRef"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="15" class="home-card-three">
        <el-col>
          <div class="home-card-item">
            <div class="home-card-item-title">
              <span>风力 监测图表</span>
              <el-select @change="getWindpowerEchartById(currentcityId)" v-model="windpowerType" placeholder="请选择查询范围" size="mini">
                <el-option v-for="item in ranges" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <div style="height: 100%" ref="homeWindLineRef"></div>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, onMounted, ref, watch, nextTick, onActivated } from 'vue';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';

import api from '/@/api/datahub';

let global: any = {
  homeChartOne: null,
  homeChartTwo: null,
  homeCharThree: null,
  dispose: [null, '', undefined]
};

export default defineComponent({
  name: 'weather',
  setup() {
    const homeTemLineRef = ref();
    const homeWindLineRef = ref();
    const isCollapse = ref(true);
    const store = useStore();
    const state = reactive({
      city: '',
      cityList: [],
      oneCityInfo: {} as any,
      temperatureType: 1,
      windpowerType: 1,
      ranges: [
        {
          value: 1,
          label: "日数据"
        },
        {
          value: 2,
          label: "周数据"
        },
        {
          value: 3,
          label: "月数据"
        },
        {
          value: 4,
          label: "年数据"
        }
      ],
      xAxis: [],
      tem: [],
      averageTem: [],
      foreCastInfoTem: [],
      foreCastAvgInfoTem: [],
      xAxisWind: [],
      foreCastInfoWind: [],
      foreCastAvgInfoWind: [],
      temWind: [],
      averageTemWind: [],
      currentcityId: 0,
      currentcityName: '',
      myCharts: [],
      charts: {
        theme: '',
        bgColor: '',
        color: '#303133',
      },
    });
    // 获取左侧数据
    const getCityWeatherList = () => {
      api.weather.getCityWeatherList().then((res: any) => {
        state.cityList = res.Info;
        if (!res.Info.length) return;
        state.currentcityId = res.Info[0].id;
        state.currentcityName = res.Info[0].name;
      });
    };

    // 根据ID获取指定城市的风力图表
    const getWindpowerEchartById = (id: number) => {
      api.weather.getWindpowerEchartById({ id: id, types: state.windpowerType }).then((res: any) => {
        const { AvgInfo, Info, ForeCastInfo,  ForeCastAvgInfo} = res;
        state.xAxisWind = [];
        state.temWind = [];
        state.foreCastInfoWind = [];
        state.averageTemWind = [];
        state.foreCastAvgInfoWind = [];
        if (Info && Info.length) {
          state.xAxisWind = [];
          Info.forEach((i: any) => {
            state.xAxisWind.push(i.time);
            state.temWind.push(i.value);
            // state.foreCastInfoWind.push('-');
          })
        }
        if (AvgInfo && AvgInfo.length) {
          AvgInfo.forEach((i: any) => {
            state.averageTemWind.push(i.value)
            // state.foreCastAvgInfoWind.push('-');
          })
        }
        if([2, 3].indexOf(state.windpowerType) > -1) {
          // 周数据、月数据
          state.xAxisWind = [];
          ForeCastInfo.forEach((i: any) => {
            // state.xAxisWind.push(i.time);
            // state.temWind.push('-');
            state.foreCastInfoWind.push(i.value);
            state.xAxisWind.push(i.time);
          })
          ForeCastAvgInfo.forEach((i: any) => {
            state.foreCastAvgInfoWind.push(i.value);
          })
        }
        nextTick(() => {
          initWindLineChart();
        });
      });
    };

    // 根据ID获取指定城市的温度图表
    const getTemperatureEchartById = (id: number) => {
      api.weather.getTemperatureEchartById({ id: id, types: state.temperatureType }).then((res: any) => {
        const { AvgInfo, Info, ForeCastInfo, ForeCastAvgInfo } = res;
        state.xAxis = [];
        state.tem = [];
        state.foreCastInfoTem = [];
        state.averageTem = [];
        state.foreCastAvgInfoTem = [];
        if (Info && Info.length) {
          state.xAxis = [];
          Info.forEach((i: any) => {
            state.xAxis.push(i.time);
            state.tem.push(i.value);
            // state.foreCastInfoTem.push('-');
          })
        }
        if (AvgInfo && AvgInfo.length) {
          AvgInfo.forEach((i: any) => {
            state.averageTem.push(i.value)
            // state.foreCastAvgInfoTem.push('-');
          })
        }
        
        if([2, 3].indexOf(state.temperatureType) > -1) {
          // 周数据、月数据
          state.xAxis = [];
          ForeCastInfo.forEach((i:any) => {
            // state.xAxis.push(i.time);
            // state.tem.push('-');
            state.xAxis.push(i.time);
            state.foreCastInfoTem.push(i.value);
          })
          ForeCastAvgInfo.forEach((i: any) => {
            state.foreCastAvgInfoTem.push(i.value);
          })
        }
        console.log(state.xAxis)
        nextTick(() => {
          initTemLineChart();
        });
      });
    };

    // 获取顶部天气数据
    const getWhichCityWeather = (id: number) => {
      api.weather.getWhichCityWeather({ id: id }).then((res: any) => {
        state.oneCityInfo = res.Info
      });
    };

    // 温度折线图
    const initTemLineChart = () => {
      if (!global.dispose.some((b: any) => b === global.homeChartOne)) global.homeChartOne.dispose();
      global.homeChartOne = <any>echarts.init(homeTemLineRef.value, state.charts.theme);

      const option = {
        backgroundColor: state.charts.bgColor,
        grid: { top: 70, right: 40, bottom: 50, left: 40 },
        tooltip: { trigger: 'axis' },
        legend: { data: [2, 3].indexOf(state.temperatureType) > -1 ? ['气温（℃）', '平均气温（℃）', '预测气温（℃）', '预测平均气温（℃）'] : ['气温（℃）', '平均气温（℃）'], left: '0' },
        xAxis: {
          data: state.xAxis
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: "{value}℃"
            },
            splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
          },
        ],
        series: [
          {
            name: '气温（℃）',
            type: 'line',
            symbolSize: 6,
            symbol: 'circle',
            smooth: true,
            // data: [0, 41.1, 30.4, 65.1, 53.3, 53.3, 53.3, 41.1, 30.4, 65.1, 53.3, 10],
            data: state.tem,
            lineStyle: { color: '#fe9a8b' },
            itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#fe9a8bb3' },
                { offset: 1, color: '#fe9a8b03' },
              ]),
            },
          },
          {
            name: '预测气温（℃）',
            type: 'line',
            symbolSize: 6,
            symbol: 'circle',
            smooth: true,
            // data: [0, 41.1, 30.4, 65.1, 53.3, 53.3, 53.3, 41.1, 30.4, 65.1, 53.3, 10],
            data: state.foreCastInfoTem,
            lineStyle: { color: '#2b79ff' },
            itemStyle: { color: '#2b79ff', borderColor: '#2b79ff' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2b79ff' },
                { offset: 1, color: '#c5e3ed' },
              ]),
            },
          },
          {
            name: '平均气温（℃）',
            type: 'line',
            symbolSize: 6,
            symbol: 'circle',
            smooth: true,
            data: state.averageTem,
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
          {
            name: '预测平均气温（℃）',
            type: 'line',
            symbolSize: 6,
            symbol: 'circle',
            smooth: true,
            data: state.foreCastAvgInfoTem,
            lineStyle: { color: '#41b883' },
            itemStyle: { color: '#41b883', borderColor: '#41b883' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#41b883' },
                { offset: 1, color: '#ddf2eaab' },
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
      (<any>global.homeChartOne).setOption(option);
      (<any>state.myCharts).push(global.homeChartOne);
    };
    // 风力折线图
    const initWindLineChart = () => {
      if (!global.dispose.some((b: any) => b === global.homeChartTwo)) global.homeChartTwo.dispose();
      global.homeChartTwo = <any>echarts.init(homeWindLineRef.value, state.charts.theme);
      const option = {
        backgroundColor: state.charts.bgColor,
        grid: { top: 70, right: 40, bottom: 50, left: 40 },
        tooltip: { trigger: 'axis' },
        legend: { data: [2, 3].indexOf(state.windpowerType) > -1 ? ['风力（级）', '平均风力（级）', '预测风力（级）', '预测平均风力（级）'] : ['风力（级）', '平均风力（级）'], left: '0' },
        xAxis: {
          data: state.xAxisWind
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: "{value}级"
            },
            splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
          },
        ],
        series: [
          {
            name: '风力（级）',
            type: 'line',
            symbolSize: 6,
            symbol: 'circle',
            smooth: true,
            data: state.temWind,
            lineStyle: { color: '#fe9a8b' },
            itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#fe9a8bb3' },
                { offset: 1, color: '#fe9a8b03' },
              ]),
            },
          },
          {
            name: '预测风力（级）',
            type: 'line',
            symbolSize: 6,
            symbol: 'circle',
            smooth: true,
            data: state.foreCastInfoWind,
            lineStyle: { color: '#2b79ff' },
            itemStyle: { color: '#2b79ff', borderColor: '#2b79ff' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2b79ff' },
                { offset: 1, color: '#c5e3ed' },
              ]),
            },
          },
          {
            name: '平均风力（级）',
            type: 'line',
            symbolSize: 6,
            symbol: 'circle',
            smooth: true,
            data: state.averageTemWind,
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
          {
            name: '预测平均风力（级）',
            type: 'line',
            symbolSize: 6,
            symbol: 'circle',
            smooth: true,
            data: state.foreCastAvgInfoWind,
            lineStyle: { color: '#41b883' },
            itemStyle: { color: '#41b883', borderColor: '#41b883' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#41b883' },
                { offset: 1, color: '#ddf2eaab' },
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
      (<any>global.homeChartTwo).setOption(option);
      (<any>state.myCharts).push(global.homeChartTwo);
    };
    // 批量设置 echarts resize
    const initEchartsResizeFun = () => {
      nextTick(() => {
        for (let i = 0; i < state.myCharts.length; i++) {
          setTimeout(() => {
            (<any>state.myCharts[i]).resize();
          }, 0);
        }
      });
    };
    // 批量设置 echarts resize
    const changeCollapse = () => {
      isCollapse.value = !isCollapse.value;
      initEchartsResizeFun()
    };
    // 批量设置 echarts resize
    const initEchartsResize = () => {
      window.addEventListener('resize', initEchartsResizeFun);
    };
    // 页面加载时
    onMounted(() => {
      initEchartsResize();
      getCityWeatherList();
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
      (isIsDark) => {
        nextTick(() => {
          state.charts.theme = isIsDark ? 'dark' : '';
          state.charts.bgColor = isIsDark ? 'transparent' : '';
          state.charts.color = isIsDark ? '#dadada' : '#303133';
          setTimeout(() => {
            initTemLineChart();
          }, 500);
          setTimeout(() => {
            initWindLineChart();
          }, 700);
        });
      },
      {
        deep: true,
        immediate: true,
      }
    );
    watch(
      () => state.currentcityId,
      () => {
        getWhichCityWeather(state.currentcityId);
        getTemperatureEchartById(state.currentcityId);
        getWindpowerEchartById(state.currentcityId)
      }
    );
    return {
      changeCollapse,
      isCollapse,
      homeTemLineRef,
      homeWindLineRef,
      getWhichCityWeather,
      getCityWeatherList,
      getTemperatureEchartById,
      getWindpowerEchartById,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
$homeNavLengh: 8;
.history{
  font-weight: bold;
  cursor: pointer;
}
.monitor-weather {
	overflow: hidden;
	display: flex;
	background-color: #fff;
	padding: 20px;
	justify-content: space-between;

	.left {
		width: 384px;
		height: 500px;
		margin-right: 20px;
		position: relative;
		.collapse {
			position: absolute;
			top: 0;
			right: 0;
			z-index: 1;
			padding: 5px;
			width: 36px;
			height: 36px;
			cursor: pointer;
		}

		.city-weather-data-overview-wrap {
			border: 1px solid #f2f2f2;

			section.title {
				font-size: 18px;
				font-weight: bold;
				color: #1a1a1a;
				padding-top: 30px;
			}

			section {
				padding: 20px 0;

				span {
					display: inline-block;
					width: 33%;
					text-align: center;
				}

				span:nth-child(2) {
					border-left: 1px solid #f2f2f2;
					border-right: 1px solid #f2f2f2;
				}
			}

			section:nth-child(2n) {
				background-color: #fff;
			}

			section:nth-child(2n + 1) {
				background-color: #f8f8f8;
			}

			section.active {
				background: var(--el-color-primary-light-9);
			}
		}
	}

	.right {
		flex: 1;
		height: 100%;
		overflow: hidden;

		.weather-info {
			padding: 15px 30px 15px 30px;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);

			section:nth-child(1) {
				margin-bottom: 12px;
			}

			section {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.temperature {
					font-size: 50px;
					font-weight: bold;
				}

				img {
					margin: 0 10px 0 30px;
				}

				.weather {
					margin-right: 30px;
				}

				img {
					width: 24px;
				}

				.sunset-sunrise {
					margin: 0 8xpx 0 47px;
				}

				.sunset {
					margin-right: 40px;
				}
			}
		}
	}

	.home-card-two,
	.home-card-three {
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

	// .home-card-one {
	// 	@for $i from 0 through 3 {
	// 		.home-one-animation#{$i} {
	// 			opacity: 0;
	// 			animation-name: error-num;
	// 			animation-duration: 0.5s;
	// 			animation-fill-mode: forwards;
	// 			animation-delay: calc($i/10) + s;
	// 		}
	// 	}
	// }
	.home-card-item-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	// .home-card-one .home-card-item {
	// 		width: 100%;
	// 		border-radius: 4px;
	// 		transition: all ease 0.3s;
	// 		overflow: hidden;
	// 		background: var(--el-color-white);
	// 		color: var(--el-text-color-primary);
	// 		border: 1px solid var(--next-border-color-light);
	// 		&:hover {
	// 			box-shadow: 0 2px 12px var(--next-color-dark-hover);
	// 			transition: all ease 0.3s;
	// 		}
	// 		.item-header {
	// 			display: flex;
	// 			justify-content: center;
	// 			align-content: center;
	// 			color: #101010;
	// 			padding: 10px 0;
	// 			border-bottom: 1px solid var(--next-border-color-light);
	// 			font-size: 20px;
	// 			font-weight: bold;
	// 			img {
	// 				margin-right: 32px;
	// 				width: 24px;
	// 				height: 24px;;
	// 				margin-top: 3px;
	// 			}
	// 		}
	// 		.item-content {
	// 			padding: 26px;
	// 			p {
	// 				display: flex;
	// 				justify-content: space-between;
	// 				align-content: center;
	// 				span:nth-child(1) {
	// 					// padding-top: 4px;
	// 					line-height: 33px;;
	// 					font-size: 14px;
	// 				}
	// 				span:nth-child(2) {
	// 					color: #101010;
	// 					font-weight: bold;
	// 					font-size: 22px;
	// 				}
	// 			}
	// 			p:nth-child(2) {
	// 				margin-top: 26px;
	// 			}
	// 		}
	// }

	.home-card-two,
	.home-card-three {
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
</style>
