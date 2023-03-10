<template>
	<div class="data-overview">
		<el-row :gutter="15" class="home-card-one mb15">
			<el-col
				:xs="24"
				:sm="12"
				:md="12"
				:lg="6"
				:xl="6"
				v-for="(v, k) in dataOne"
				:key="k"
				:class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }"
			>
				<div class="home-card-item">
					<div class="item-header">
						<img :src="isIsDark ? v.iconDark : v.icon" alt="" />
						<span>{{ v.title }}</span>
					</div>
					<div class="item-content w100" :class="` home-one-animation${k}`">
						<p>
							<span class="text-no-wrap">{{ v.contentTitle1 }}</span>
							<span>{{ v.val1 }} {{ unitMap[v.contentTitle1] }}</span>
						</p>
						<p>
							<span class="text-no-wrap">{{ v.contentTitle2 }}</span>
							<span
								>{{ v.val2 }}
								{{ unitMap[v.title + '：' + v.contentTitle2] ? unitMap[v.title + '：' + v.contentTitle2] : unitMap[v.contentTitle2] }}</span
							>
						</p>
						<p style="height: 30px">
							<template v-if="v.contentTitle3">
								<span class="text-no-wrap">{{ v.contentTitle3 || ' ' }}</span>
								<span
									>{{ v.val3 || ' ' }}
									{{ unitMap[v.title + '：' + v.contentTitle3] ? unitMap[v.title + '：' + v.contentTitle3] : unitMap[v.contentTitle3] }}</span
								>
							</template>
						</p>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-two mb15">
			<div class="home-card-item" style="height: auto">
				<div class="home-card-item-title">总耗热</div>
				<div style="height: 200px" ref="homeLineRef1"></div>
			</div>
		</el-row>
		<el-row :gutter="15" class="home-card-two mb15">
			<div class="home-card-item" style="height: auto">
				<div class="home-card-item-title">总失水量</div>
				<div style="height: 200px" ref="homeLineRef3"></div>
			</div>
		</el-row>
		<el-row :gutter="15" class="home-card-two mb15">
			<div class="home-card-item" style="height: auto">
				<div class="home-card-item-title">平均供热负荷</div>
				<div style="height: 200px" ref="homeLineRef4"></div>
			</div>
		</el-row>
		<!-- <el-col :xs="24" :sm="10" :md="12" :lg="8" :xl="8" class="home-media">
				<div class="home-card-item">
					<div class="bar-header">
						<p class="home-card-item-title">环路回温/热用户室温占比</p>
					</div>
					<div style="height: 256px" ref="homePieRef"></div>
				</div>
			</el-col> -->
		<!-- <el-row :gutter="15" class="home-card-three mb15">
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
		</el-row> -->
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, onMounted, ref, watch, nextTick, onActivated } from 'vue';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';
import apiDatahub from '/@/api/datahub';

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
		const homeLineRef3 = ref();
		const homeLineRef4 = ref();
		const homePieRef = ref();
		const homeBarRef = ref();
		const homeFourBarRef = ref();
		const unitMap = ref<any>({});
		const store = useStore();

		// 统计信息的单位的字典
		apiDatahub.template.getDictData({ DictType: 'overview_unit' }).then((res: any) => {
			res.values.forEach((v: any) => {
				unitMap.value[v.value] = v.key;
			});
		});

		const state = reactive({
			checkList: ['一网供水温度'],
			rangeValue: 10,
			isIsDark: false,
			dataOne: [
				{
					icon: map,
					iconDark: map1,
					title: '供热面积',
					contentTitle1: '联网面积',
					val1: '',
					contentTitle2: '实供面积',
					val2: '',
					contentTitle3: '供热率',
					val3: '',
				},
				{
					icon: fire,
					iconDark: fire1,
					title: '热量',
					contentTitle1: '总耗热',
					val1: '',
					contentTitle2: '总单耗',
					val2: '',
				},
				{
					icon: ele,
					iconDark: ele1,
					title: '负荷',
					contentTitle1: '供热负荷',
					val1: '0',
					contentTitle2: '平均供热负荷',
					val2: '0',
				},
				{
					icon: water,
					iconDark: water1,
					title: '水量',
					contentTitle1: '总耗水',
					val1: '',
					contentTitle2: '小时补水量',
					val2: '',
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
			heatDemandData: [],
			pieData: [],
			pieType: '1',
			pressureXAxisData: [],
			inPressureData: [],
			outPressureData: [],
			diffPressureData: [],
		});

		// 获取顶部总数据
		const getStatisticsTotalData = () => {
			api.statistics.getStatisticsOverview({ queryType: 'num' }).then((res: any) => {
				const { flowLoss, flowLossTotal, forRealArea, heatingArea, unitConsumption, unitConsumptionTotal, heatRate, heatDemandAvg, heatDemand } =
					res.data;
				state.dataOne[0].val1 = forRealArea;
				state.dataOne[0].val2 = heatingArea;
				state.dataOne[0].val3 = heatRate;

				state.dataOne[1].val1 = unitConsumptionTotal;
				state.dataOne[1].val2 = unitConsumption;

				state.dataOne[2].val1 = heatDemand;
				state.dataOne[2].val2 = heatDemandAvg;

				state.dataOne[3].val1 = flowLossTotal;
				state.dataOne[3].val2 = flowLoss;
			});
		};

		// 获取热网总能耗数据
		const getStatisticsLineChartData = () => {
			if (!state.rangeValue) return;
			api.statistics.getStatisticsOverview({ queryType: 'energy' }).then((res: any) => {
				const { flowLoss, elctricConsumption, unitConsumption, heatDemand } = res.data;
				// calorie：总热耗  electric：总电耗  water：总失水量 heatDemand: 供热负荷
				state.chartXAxisData = flowLoss.map((item: any) => item.date);
				state.flowLossData = flowLoss.map((item: any) => item.total);
				state.unitConsumptionData = unitConsumption.map((item: any) => item.total);
				state.heatDemandData = heatDemand.map((item: any) => item.total);
				if (state.rangeValue == 10) return;
				nextTick(() => {
					initLineChart('homeLineRef1');
					initLineChart('homeLineRef3');
					initLineChart('homeLineRef4');
				});
			});
		};
		// 折线图
		const initLineChart = (ref: string) => {
			if (!global.dispose.some((b: any) => b === global.homeCharThree)) global.homeCharThree.dispose();

			let dom: any;
			let data: any;
			let unit: any;
			// 总耗热：GJ
			// 日失水量：T
			// 平均供热负荷： W/m²
			if (ref === 'homeLineRef1') {
				dom = homeLineRef1.value;
				data = state.flowLossData;
				unit = 'GJ';
			} else if (ref === 'homeLineRef3') {
				dom = homeLineRef3.value;
				data = state.unitConsumptionData;
				unit = 'T';
			} else {
				dom = homeLineRef4.value;
				data = state.heatDemandData;
				unit = 'W/m²';
			}

			const chart = <any>echarts.init(dom, state.charts.theme);

			const common = {
				type: 'line',
				smooth: true,
				showSymbol: true,
				symbolSize: 12,
				yAxisIndex: 0,
			};
			const option = {
				backgroundColor: state.charts.bgColor,
				tooltip: { trigger: 'axis' },
				grid: { top: 30, right: 40, bottom: 30, left: 25, containLabel: true },
				xAxis: [
					{
						type: 'category',
						data: state.chartXAxisData,
						boundaryGap: true,
						axisTick: { show: false },
					},
				],
				yAxis: [
					{
						type: 'value',
						name: unit,
					},
				],
				dataZoom: [
					{
						type: 'inside',
						start: 0,
						end: 30,
					},
					{
						start: 0,
						end: 30,
					},
				],
				series: [
					{
						...common,
						data,
					},
				],
			};
			chart.setOption(option);
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
			getStatisticsLineChartData();
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
				state.isIsDark = store.state.themeConfig.themeConfig.isIsDark;
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
					// if(!isIsDark) return
					state.charts.theme = isIsDark ? 'transparent' : '';
					state.charts.bgColor = isIsDark ? 'transparent' : '';
					state.charts.color = isIsDark ? '#dadada' : '#303133';
					setTimeout(() => {
						initLineChart('homeLineRef1');
						initLineChart('homeLineRef3');
						initLineChart('homeLineRef4');
					}, 1000);
				});
			},
			{
				deep: true,
				immediate: true,
			}
		);
		return {
			unitMap,
			tabName,
			homeLineRef1,
			homeLineRef3,
			homeLineRef4,
			homePieRef,
			homeBarRef,
			homeFourBarRef,
			// changePieType,
			getStatisticsLineChartData,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.home-card-item-title {
	margin-left: 12px;
	margin-top: 3px;
}

.data-overview {
	overflow: hidden;

	// .home-card-one,
	.home-card-two,
	.home-card-three,
	.home-card-four {
		.home-card-item,
		.home-card-top {
			width: 100%;
			height: 100px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 10px;
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
			padding: 16px;

			p {
				display: flex;
				justify-content: space-between;
				align-content: center;

				span:nth-child(1) {
					line-height: 30px;
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

			p:nth-child(2),
			p:nth-child(3) {
				margin-top: 5px;
			}
		}
	}

	.home-card-two,
	.home-card-three,
	.home-card-four {
		.home-card-item {
			height: 300px;
		}

		.home-card-top {
			height: 200px;

			.box-card {
				padding: 15px 20px 20px 10px;

				p {
					margin-bottom: 10px;
				}

				&-item {
					margin-bottom: 10px;
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
