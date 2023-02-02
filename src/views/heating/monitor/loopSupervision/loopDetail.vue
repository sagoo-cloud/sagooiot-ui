<template>
  <div class="system-dic-container data-overview">
    <el-row :gutter="15" class="home-card-one">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(v, k) in dataOne" :key="k" :class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }">
        <div class="home-card-item">
          <div class="item-header">
            <img :src="isIsDark ? v.iconDark : v.icon" alt="">
            <span>{{ v.title }}</span>
          </div>
          <div class="item-content w100" :class="` home-one-animation${k}`">
            <p>
              <span>{{ v.contentTitle1 }}</span>
              <span>{{ v.val1 }} {{ unitMap[v.contentTitle1]}}</span>
            </p>
            <p>
              <span>{{ v.contentTitle2 }}</span>
              <span>{{ v.val2 }} {{unitMap[v.title + '：' + v.contentTitle2]? unitMap[v.title + '：' + v.contentTitle2]: unitMap[v.contentTitle2]}}</span>
            </p>
            <p style="height:30px">
              <template v-if="v.contentTitle3">
                <span>{{ v.contentTitle3  || ' '}}</span>
                <span>{{ v.val3 || ' ' }}
                  {{ unitMap[v.title + '：' + v.contentTitle3] ? unitMap[v.title + '：' + v.contentTitle3] : unitMap[v.contentTitle3] }}</span>
              </template>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 拓扑图 -->

    <el-row :gutter="15" class="home-card-one mt15" v-if="$route.query.code">
      <el-col :span="24">
        <div class="home-card-item p20">
          <el-tabs>
            <el-tab-pane label="环路监测">
              <div class="flex-row">
                <el-tabs v-model="tabName" @tab-change="initLineChart">
                  <el-tab-pane label="温度" :name="0"></el-tab-pane>
                  <el-tab-pane label="压力" :name="1"></el-tab-pane>
                  <el-tab-pane label="流量" :name="2"></el-tab-pane>
                  <el-tab-pane label="失水量" :name="3"></el-tab-pane>
                </el-tabs>
                <el-button type="text" @click="goDetail()">更多 &gt;</el-button>
              </div>
              <div style="height: 300px" ref="homeLineRef"></div>
            </el-tab-pane>
            <el-tab-pane label="流程图" lazy>
              <div class="iframe-wrapper">
                <iframe :src="'/plugin/topo/?bgColor=000#/name/'+ $route.query.code" height="400" width="100%" frameborder="0" class="mt15"></iframe>
                <div class="jump" @click="jump('/plugin/topo/?bgColor=000#/name/'+ $route.query.code)">
                  <img src="/@/assets/open.svg">
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, nextTick, watch } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import * as echarts from 'echarts';
import api from '/@/api/loopSupervision';
import apiDatahub from '/@/api/datahub';

import ele from '/@/assets/img/ele.svg';
import ele1 from '/@/assets/img/ele1.svg';
import fire from '/@/assets/img/fire.svg';
import fire1 from '/@/assets/img/fire1.svg';
import map from '/@/assets/img/map.svg';
import map1 from '/@/assets/img/map1.svg';
import water from '/@/assets/img/water.svg';
import water1 from '/@/assets/img/water1.svg';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '/@/store/index';

let global: any = {
  homeCharThree: null,
  dispose: [null, '', undefined],
};

export default defineComponent({
  name: 'deviceproduct',
  setup() {
    const addDicRef = ref();
    const editDicRef = ref();
    const queryRef = ref();
    const homeLineRef = ref();
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const tabName = ref(0)
    const unitMap = ref<any>({});

    // 统计信息的单位的字典
    apiDatahub.template.getDictData({ DictType: 'overview_unit' }).then((res: any) => {
      res.values.forEach((v: any) => {
        unitMap.value[v.value] = v.key;
      });
    });

    const state = reactive({
      dataOne: [
        {
          icon: map,
          iconDark: map1,
          title: '供热面积',
          contentTitle1: '联网面积',
          val1: '0',
          unit1: '㎡',
          contentTitle2: '实供面积',
          val2: '0',
          unit2: '㎡',
          contentTitle3: '供热率',
          val3: '',
          unit3: '',
        },
        {
          icon: fire,
          iconDark: fire1,
          title: '热量',
          contentTitle1: '总耗热',
          val1: '0',
          unit1: 'GJ',
          contentTitle2: '总单耗',
          val2: '0',
          unit2: 'GJ/㎡',
          contentTitle3: '供热功率',
          val3: '-',
          unit3: 'W',
        },
        {
          icon: ele,
          iconDark: ele1,
          title: '电量',
          contentTitle1: '总耗电',
          val1: '0',
          unit1: 'KW.h',
          contentTitle2: '总单耗',
          val2: '0',
          unit2: 'KW.h/㎡',
        },
        {
          icon: water,
          iconDark: water1,
          title: '水量',
          contentTitle1: '总耗水',
          val1: '0',
          unit1: 'T',
          contentTitle2: '总单耗',
          val2: '0',
          unit2: 'T/㎡',
        },
      ],
      lineName: '环路监测',
      myCharts: [],
      charts: {
        theme: '',
        bgColor: '',
        color: '#303133',
      },
      searchParams: {
        name: ''
      },
      xAxisData: [],
      inTemperature1Echart: [], // 供水温度
      inTemperature2Echart: [],
      outTemperature1Echart: [],
      outTemperature2Echart: [],
      inPressure1Echart: [],
      inPressure2Echart: [],
      outPressure1Echart: [],
      outPressure2Echart: [],
      supplyWaterFlowEchart: [],
      secondWaterSupplyEchart: [],
      returnWaterFlowEchart: [],
      isIsDark: false
    });

    const getNumDetail = () => {
      api.getLoopRegulationDetail({
        QueryType: 'num',
        types: 'loop',
        code: route.query.code
      }).then((res: any) => {
        let data = res
        state.dataOne[0].val1 = data.forRealArea
        state.dataOne[0].val2 = data.heatingArea
        state.dataOne[0].val3 = data.heatRate
        state.dataOne[1].val1 = data.unitConsumptionTotal //总热耗
        state.dataOne[1].val2 = data.unitConsumption //热单耗
        state.dataOne[2].val1 = data.elctricConsumptionTotal //总电量
        state.dataOne[2].val2 = data.elctricConsumption //电单耗
        state.dataOne[3].val1 = data.flowLossTotal //总水量
        state.dataOne[3].val2 = data.flowLoss //水量单耗
      })
    }

    const getChartDetail = () => {
      api.getLoopRegulationDetail({
        QueryType: 'echart',
        types: 'loop',
        code: route.query.code
      }).then((res: any) => {
        state.inTemperature1Echart = res.inTemperature1Echart.map((item: any) => item.value)
        state.inTemperature2Echart = res.inTemperature2Echart.map((item: any) => item.value)
        state.outTemperature1Echart = res.outTemperature1Echart.map((item: any) => item.value)
        state.outTemperature2Echart = res.outTemperature2Echart.map((item: any) => item.value)
        state.inPressure1Echart = res.inPressure1Echart.map((item: any) => item.value)
        state.inPressure2Echart = res.inPressure2Echart.map((item: any) => item.value)
        state.outPressure1Echart = res.outPressure1Echart.map((item: any) => item.value)
        state.outPressure2Echart = res.outPressure2Echart.map((item: any) => item.value)
        state.supplyWaterFlowEchart = res.supplyWaterFlowEchart.map((item: any) => item.value)
        state.secondWaterSupplyEchart = res.secondWaterSupplyEchart.map((item: any) => item.value)
        state.returnWaterFlowEchart = res.returnWaterFlowEchart.map((item: any) => item.value)
        state.xAxisData = res.inTemperature1Echart.map((item: any) => item.time)

        nextTick(() => {
          initLineChart();
        });
      })
    }

    const goDetail = () => {
      router.push({
        path: '/heating-monitor/loopSupervision/loopHistory',
        query: {
          code: route.query.code
        }
      })
    }
    const jump = (iframeUrl: string) => {
      window.open(iframeUrl);
    }

    // 折线图
    const initLineChart = () => {
      if (!global.dispose.some((b: any) => b === global.homeCharThree)) global.homeCharThree.dispose();
      global.homeCharThree = <any>echarts.init(homeLineRef.value, state.charts.theme);

      const seriesList = [[
        { name: '一网供水温度', type: 'line', data: state.inTemperature1Echart },
        { name: '二网供水温度', type: 'line', data: state.inTemperature2Echart },
        { name: '一网回水温度', type: 'line', data: state.outTemperature1Echart },
        { name: '二网回水温度', type: 'line', data: state.outTemperature2Echart },
      ], [
        { name: '一网供水压力', type: 'line', data: state.inPressure1Echart },
        { name: '二网供水压力', type: 'line', data: state.inPressure2Echart },
        { name: '一网回水压力', type: 'line', data: state.outPressure1Echart },
        { name: '二网回水压力', type: 'line', data: state.outPressure2Echart },
      ], [
        { name: '供水流量', type: 'line', data: state.supplyWaterFlowEchart },
        { name: '二网供水流量', type: 'line', data: state.secondWaterSupplyEchart },
        { name: '回水流量', type: 'line', data: state.returnWaterFlowEchart },
      ]]

      const option = {
        backgroundColor: state.charts.bgColor,
        tooltip: {},
        legend: {},
        grid: {
          top: 40, right: 20, bottom: 20, left: 20,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: state.xAxisData,
            boundaryGap: true,
            axisTick: { show: false },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: seriesList[tabName.value] || []
      };
      (<any>global.homeCharThree).setOption(option);
      (<any>state.myCharts).push(global.homeCharThree);
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

    // 页面加载时
    onMounted(() => {
      getNumDetail()
      getChartDetail()

      initEchartsResize();
      // 获取布局配置信息
      state.isIsDark = store.state.themeConfig.themeConfig.isIsDark;
    });


    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      // typeList();
    };

    return {
      unitMap,
      jump,
      initLineChart,
      tabName,
      addDicRef,
      editDicRef,
      queryRef,
      homeLineRef,
      ...toRefs(state),
      resetQuery,
      goDetail
    };
  },
});
</script>


<style lang="scss" scoped>
$homeNavLengh: 8;

.iframe-wrapper {
	position: relative;
	.jump {
		position: absolute;
		top: 24px;
		right: 12px;
		z-index: 10;
		cursor: pointer;
		img {
			width: 40px;
			height: 40px;
			display: block;
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

	&.p20 {
		padding: 20px;
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
				// padding-top: 4px;
				line-height: 33px;
				font-size: 14px;
			}

			span:nth-child(2) {
				color: #101010;
				font-weight: bold;
				font-size: 22px;
			}
		}
		p:nth-child(2),
		p:nth-child(3) {
			margin-top: 5px;
		}
	}

	&-title {
		font-size: 15px;
		font-weight: bold;
		height: 30px;
		align-items: center;
	}
}
</style>