<template>
	<div class="system-dic-container data-overview">
		<div v-if="$route.query.name" style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 10px">{{ $route.query.name }}</div>
		<el-row :gutter="15" class="home-card-one">
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

		<el-card shadow="hover" class="mt-4">
			<div class="search">
				<el-form :model="params" :inline="true" ref="queryRef">
					<el-form-item label="" prop="dataTypes">
						<el-radio-group v-model="params.dataTypes" size="default">
							<el-radio-button label="hour">时</el-radio-button>
							<el-radio-button label="day">日</el-radio-button>
							<el-radio-button label="month">月</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="" prop="date">
						<el-date-picker
							v-if="params.dataTypes === 'hour'"
							v-model="date"
							type="datetimerange"
							format="YYYY-MM-DD HH:mm:ss"
							value-format="YYYY-MM-DD HH:mm:ss"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							:clearable="false"
						/>
						<el-date-picker
							v-else-if="params.dataTypes === 'day'"
							v-model="date"
							type="daterange"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-DD"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							:clearable="false"
						/>
						<el-date-picker
							v-else-if="params.dataTypes === 'month'"
							v-model="date"
							type="monthrange"
							format="YYYY-MM-DD"
							value-format="YYYY-MM-01"
							range-separator="-"
							start-placeholder="开始月份"
							end-placeholder="结束月份"
							:clearable="false"
						/>
					</el-form-item>
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="getList(1)">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button size="default" @click="exportData">
							<el-icon>
								<ele-Download />
							</el-icon>
							导出
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table
				:data="tableData"
				style="width: 100%"
				v-loading="loadingTable"
				row-key="id"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column type="index" label="序号" width="70" align="center" />
				<el-table-column prop="time" label="时间" align="center"></el-table-column>
				<el-table-column :label="`供热量(${unitMap['单日供热单耗']})`" prop="unitConsumption" align="center" />
				<el-table-column :label="`供热负荷(${unitMap['供热负荷']})`" prop="heatDemand" align="center" />
				<el-table-column :label="`平均供热负荷(${unitMap['平均供热负荷']})`" prop="heatDemandAvg" align="center" />
				<el-table-column :label="`失水量(${unitMap['日失水单耗']})`" prop="flowLoss" align="center" />
			</el-table>
		</el-card>

		<el-row :gutter="15" class="home-card-one mt15" v-if="$route.query.code">
			<el-col :span="24">
				<div class="home-card-item p20" v-loading="loading">
					<!-- <el-tabs>
						<el-tab-pane label="环路监测"> -->
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
					<!-- </el-tab-pane>
						<el-tab-pane label="流程图" lazy>
							<div class="iframe-wrapper">
								<iframe :src="'/plugin/topo/?bgColor=000#/name/' + $route.query.code" height="400" width="100%" frameborder="0" class="mt15"></iframe>
								<div class="jump" @click="jump('/plugin/topo/?bgColor=000#/name/' + $route.query.code)">
									<img src="/@/assets/open.svg" />
								</div>
							</div>
						</el-tab-pane>
					</el-tabs> -->
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, nextTick, watch } from 'vue';
import { FormInstance } from 'element-plus';
import * as echarts from 'echarts';
import api from '/@/api/loopSupervision';
import apiDatahub from '/@/api/datahub';
import dayjs from 'dayjs';
import downloadFile from '/@/utils/download';

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
import { useSearch } from '/@/hooks/useCommon';

let global: any = {
	homeCharThree: null,
	dispose: [null, '', undefined],
};

export default defineComponent({
	name: 'deviceproduct',
	setup() {
		const addDicRef = ref();
		const loading = ref(false);
		const editDicRef = ref();
		const queryRef = ref();
		const homeLineRef = ref();
		const router = useRouter();
		const route = useRoute();
		const store = useStore();
		const tabName = ref(0);
		const unitMap = ref<any>({});

		const date = ref([dayjs().format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD HH:mm:ss')]);

		const {
			params,
			tableData,
			getList,
			loading: loadingTable,
		} = useSearch(api.getLoopRegulationDetail, 'Report', {
			queryType: 'report',
			dataTypes: 'hour',
			beginTime: date.value[0],
			endTime: date.value[1],
			code: route.query.code,
		});

		function exportData() {
			api.loopReportExport(params).then((res: any) => {
				downloadFile(res, route.query.name + '环路报表数据导出.xlsx');
			});
		}

		watch(date, (date) => {
			console.log(date);
			params.beginTime = date[0];
			params.endTime = date[1];
		});

		watch(
			() => params.dataTypes,
			(dataTypes) => {
				switch (dataTypes) {
					case 'hour':
						date.value = [dayjs().format('YYYY-MM-DD 00:00:00'), dayjs().format('YYYY-MM-DD HH:mm:ss')];
						break;
					case 'day':
						date.value = [dayjs().subtract(7, 'days').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')];
						break;
					case 'month':
						date.value = [dayjs().subtract(7, 'months').format('YYYY-MM-01'), dayjs().format('YYYY-MM-01')];
						break;
				}
			}
		);

		getList();

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
					contentTitle2: '实供面积',
					val2: '0',
					contentTitle3: '供热率',
					val3: '',
				},
				{
					icon: fire,
					iconDark: fire1,
					title: '热量',
					contentTitle1: '总耗热',
					val1: '0',
					contentTitle2: '总单耗',
					val2: '0',
				},
				{
					icon: ele,
					iconDark: ele1,
					title: '负荷',
					contentTitle1: '供热负荷',
					val1: '0',
					contentTitle2: '平均供热负荷',
					val2: '-',
				},
				{
					icon: water,
					iconDark: water1,
					title: '水量',
					contentTitle1: '总耗水',
					val1: '0',
					contentTitle2: '小时补水量',
					val2: '0',
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
				name: '',
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
			waterLossEchart: [],
			isIsDark: false,
		});

		const getNumDetail = () => {
			api
				.getLoopRegulationDetail({
					QueryType: 'num',
					types: 'loop',
					code: route.query.code,
				})
				.then((res: any) => {
					const { flowLoss, flowLossTotal, forRealArea, heatingArea, unitConsumption, unitConsumptionTotal, heatRate, heatDemandAvg, heatDemand } =
						res.Data;
					state.dataOne[0].val1 = heatingArea;
					state.dataOne[0].val2 = forRealArea;
					state.dataOne[0].val3 = heatRate;

					state.dataOne[1].val1 = unitConsumptionTotal;
					state.dataOne[1].val2 = unitConsumption;

					state.dataOne[2].val1 = heatDemand;
					state.dataOne[2].val2 = heatDemandAvg || '-';

					state.dataOne[3].val1 = flowLossTotal;
					state.dataOne[3].val2 = flowLoss;
				});
		};

		const getChartDetail = () => {
			loading.value = true;
			api
				.getLoopRegulationDetail({
					QueryType: 'echart',
					types: 'loop',
					code: route.query.code,
				})
				.then((res: any) => {
					res = res.Data
					state.inTemperature1Echart = res.inTemperature1Echart.map((item: any) => item.value);
					state.inTemperature2Echart = res.inTemperature2Echart.map((item: any) => item.value);
					state.outTemperature1Echart = res.outTemperature1Echart.map((item: any) => item.value);
					state.outTemperature2Echart = res.outTemperature2Echart.map((item: any) => item.value);
					state.inPressure1Echart = res.inPressure1Echart.map((item: any) => item.value);
					state.inPressure2Echart = res.inPressure2Echart.map((item: any) => item.value);
					state.outPressure1Echart = res.outPressure1Echart.map((item: any) => item.value);
					state.outPressure2Echart = res.outPressure2Echart.map((item: any) => item.value);
					state.supplyWaterFlowEchart = res.supplyWaterFlowEchart.map((item: any) => item.value);
					state.secondWaterSupplyEchart = res.secondWaterSupplyEchart.map((item: any) => item.value);
					state.returnWaterFlowEchart = res.returnWaterFlowEchart.map((item: any) => item.value);
					state.waterLossEchart = res.waterLossEchart.map((item: any) => item.value);
					state.xAxisData = res.inTemperature1Echart.map((item: any) => item.time);

					nextTick(() => {
						initLineChart();
					});
				})
				.finally(() => {
					loading.value = false;
				});
		};

		const goDetail = () => {
			router.push({
				path: '/heating-monitor/loopSupervision/loopHistory',
				query: {
					code: route.query.code,
				},
			});
		};
		const jump = (iframeUrl: string) => {
			window.open(iframeUrl);
		};

		// 折线图
		const initLineChart = () => {
			if (!global.dispose.some((b: any) => b === global.homeCharThree)) global.homeCharThree.dispose();
			global.homeCharThree = <any>echarts.init(homeLineRef.value, state.charts.theme);

			const seriesList = [
				[
					{ name: '一网供水温度', type: 'line', data: state.inTemperature1Echart },
					{ name: '二网供水温度', type: 'line', data: state.inTemperature2Echart },
					{ name: '一网回水温度', type: 'line', data: state.outTemperature1Echart },
				],
				[
					{ name: '一网供水压力', type: 'line', data: state.inPressure1Echart },
					{ name: '二网供水压力', type: 'line', data: state.inPressure2Echart },
					{ name: '一网回水压力', type: 'line', data: state.outPressure1Echart },
					{ name: '二网回水压力', type: 'line', data: state.outPressure2Echart },
				],
				[
					{ name: '供水流量', type: 'line', data: state.supplyWaterFlowEchart },
					{ name: '二网供水流量', type: 'line', data: state.secondWaterSupplyEchart },
					{ name: '回水流量', type: 'line', data: state.returnWaterFlowEchart },
				],
				[{ name: '失水量', type: 'line', data: state.waterLossEchart }],
			];

			const units = ['°C', 'Mpa', 'T/h', 'T'];

			const option = {
				backgroundColor: state.charts.bgColor,
				tooltip: {},
				legend: {},
				grid: {
					top: 40,
					right: 20,
					bottom: 20,
					left: 20,
					containLabel: true,
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
						scale: true,
						axisLabel: {
							formatter: '{value} ' + units[tabName.value],
						},
					},
				],
				series: seriesList[tabName.value] || [],
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
			getNumDetail();
			getChartDetail();

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
			exportData,
			loading,
			initLineChart,
			tabName,
			addDicRef,
			editDicRef,
			queryRef,
			homeLineRef,
			...toRefs(state),
			resetQuery,
			goDetail,
			params,
			tableData,
			getList,
			loadingTable,
			date,
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
