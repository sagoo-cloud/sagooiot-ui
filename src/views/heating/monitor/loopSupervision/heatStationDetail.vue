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
    <el-row :gutter="15" class="home-card-one mt15">
      <el-col :span="24">
        <div class="home-card-item p20">
          <div class="home-card-item-title" style="display: flex;justify-content:space-between;">
            <span>热网总能耗</span>

            <el-button type="text" @click="goDetail()">更多 &gt;</el-button>
            <!-- <el-select @change="getStatisticsLineChartData()" v-model="rangeValue" placeholder="请选择查询范围" size="mini">
							<el-option
							v-for="item in [10, 30, 60]"
							:key="item"
							:label="'近'+item+'天'"
							:value="item"
							/>
						</el-select> -->
          </div>
          <div style="height: 300px" ref="homeLineRef"></div>
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
import apiDatahub from '/@/api/datahub';

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
          contentTitle3: '供热负荷',
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
      lineName: '换热站监测',
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
      inTemperatureEchart: [], // 供水温度
      outTemperatureEchart: [], // 回水温度
      isIsDark: false
    });

    const getNumDetail = () => {
      api.getLoopRegulationDetail({
        QueryType: 'num',
        types: 'station',
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
        types: 'station',
        code: route.query.code
      }).then((res: any) => {
        state.inTemperatureEchart = res.inTemperatureEchart.map((item: any) => item.value)
        state.outTemperatureEchart = res.outTemperatureEchart.map((item: any) => item.value)
        state.xAxisData = res.inTemperatureEchart.map((item: any) => item.time)

        nextTick(() => {
          initLineChart();
        });
      })
    }

    const goDetail = () => {
      router.push({
        path: '/heating-monitor/loopSupervision/heatStationHistory',
        query: {
          code: route.query.code
        }
      })
    }

    // 折线图
    const initLineChart = () => {
      if (!global.dispose.some((b: any) => b === global.homeCharThree)) global.homeCharThree.dispose();
      global.homeCharThree = <any>echarts.init(homeLineRef.value, state.charts.theme);
      const option = {
        backgroundColor: state.charts.bgColor,
        tooltip: { trigger: 'axis' },
        legend: {},
        grid: { top: 40, right: 40, bottom: 40, left: 40 },
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
        series: [
          {
            name: '供水温度',
            type: 'line',
            data: state.inTemperatureEchart
          },
          {
            name: '回水温度',
            type: 'line',
            data: state.outTemperatureEchart
          },
          // {
          // 	name: '室外温度',
          // 	type: 'line',
          // 	data: [3, 0, 4, 7, 5, 7, 5]
          // }
        ]
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
          state.isIsDark = store.state.themeConfig.themeConfig.isIsDark
          state.charts.theme = isIsDark ? 'transparent' : '';
          state.charts.bgColor = isIsDark ? 'transparent' : '';
          state.charts.color = isIsDark ? '#dadada' : '#303133';
          setTimeout(() => {
            initLineChart();
          }, 1000);
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

// :deep(.el-form-item--default) {
// 	margin-bottom: 0;
// }
</style>