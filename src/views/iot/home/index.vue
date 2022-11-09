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
						<img :src="isIsDark?v.iconDark:v.icon" alt="">
						<span>{{v.title}}</span>
					</div>
					<div class="item-content w100" :class="` home-one-animation${k}`">
						<p>
							<span>{{v.contentTitle1}}</span>
							<span>{{v.val1+v.unit1}}</span>
						</p>
						<p>
							<span>{{v.contentTitle2}}</span>
							<span>{{v.val2+v.unit2}}</span>
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
						<el-select @change="getStatisticsLineChartData()" v-model="rangeValue" placeholder="请选择查询范围" size="mini">
							<el-option
							v-for="item in [10, 30, 60]"
							:key="item"
							:label="'近'+item+'天'"
							:value="item"
							/>
						</el-select>
					</div>
					<div class="lable-group">
						<div @click="changeLineType('calorie', '总热耗')" :class="lineType == 'calorie' ? 'active' : ''">总热耗</div>
						<div @click="changeLineType('electric', '总电耗')" :class="lineType == 'electric' ? 'active' : ''">总电耗</div>
						<div @click="changeLineType('water', '总失水量')" :class="lineType == 'water' ? 'active' : ''">总失水量</div>
					</div>
					<div style="height: 100%" ref="homeLineRef"></div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8" class="home-media">
				<div class="home-card-item">
					<div class="bar-header">
						<p class='home-card-item-title'>环路回温/热用户室温占比</p>
						<div class="lable-group1">
							<div @click="changePieType('1')" :class="pieType == '1' ? 'active' : ''">环路</div>
							<div @click="changePieType('2')" :class="pieType == '2' ? 'active' : ''">热用户</div>
						</div>
					</div>
					<div style="height: 90%" ref="homePieRef"></div>
				</div>
			</el-col>
			<!-- <el-col :xs="24" :sm="14" :md="14" :lg="16" :xl="16" class="home-media">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeBarRef"></div>
				</div>
			</el-col> -->
		</el-row>
    <el-row :gutter="15" class="home-card-three">
      <el-col >
        <div class="home-card-item">
          <div style="height: 100%" ref="homeBarRef"></div>
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
	dispose: [null, '', undefined],
};

export default defineComponent({
	name: 'home',
	setup() {
		const homeLineRef = ref();
		const homePieRef = ref();
		const homeBarRef = ref();
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
					unit1: '㎡',
					contentTitle2: '总面积',
					val2: '',
					unit2: '㎡',
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
			inTemperature1: [],
			outTemperature1: [],
			lineType: 'calorie',
			lineName: '总热耗',
			lineData: [],
			xAxisData: [],
			calorieLineData: [],
			calorieXAxisData: [],
			electricLineData: [],
			electricXAxisData: [],
			waterLineData: [],
			waterXAxisData: [],
			pieData: [],
			pieType: '1'
		});

		// 获取顶部总数据
		const getStatisticsTotalData = () => {
			api.statistics.getStatisticsTotalData({tableNo:16}).then((res:any) => {
				const { allArea, area, calorie, cityNO, electric, singleCalorie, singleElectric, singleWater, water } = res.Info;
				// "cityNO": "C003", //城市编号
				// "area": 7876726.23, //供热面积
				// "allArea": 7876730, //总面积
				// "calorie": 0, //总耗热
				// "singleCalorie": 0, //总单耗
				// "electric": 0, //总耗电
				// "singleElectric": 0, //总单耗
				// "water": 0, //总耗水
				// "singleWater": 0 //总单耗
				state.dataOne[0].val1 = area;
				state.dataOne[0].val2 = allArea;

				state.dataOne[1].val1 = calorie;
				state.dataOne[1].val2 = singleWater;

				state.dataOne[2].val1 = electric;
				state.dataOne[2].val2 = singleElectric;

				state.dataOne[3].val1 = water;
				state.dataOne[3].val2 = singleWater;

			});
		};

		// 获取供热监测数据
		const getStatisticsChartData = () => {
			api.statistics.getStatisticsChartData({tableNo:17}).then((res:any) => {
				const data = res.Info
				// "huanLuNo": "D00140-4", //换热站编号
				// "huanLuName": "8#楼高区", //换热站名称
				// "inPressure1": 0, //一网供水压力
				// "inPressure2": 0, //二网供水压力
				// "inTemperature1": 0, //一网供水温度
				// "inTemperature2": 0, //二网供水温度
				// "outPressure1": 0, //一网回水压力
				// "outPressure2": 0, //二网回水压力
				// "outTemperature1": 0, //一网回水温度
				// "outTemperature2": 0 //二网回水温度

				// <el-checkbox label="一网供水温度" />
				// <el-checkbox label="一网回水温度" />
				// <el-checkbox label="二网供回水温差" />
				// <el-checkbox label="二网供回水压差" />
				// <el-checkbox label="压力值" />
				state.statisticsChartXAxisData = [];
				state.inTemperature1 = [];
				state.outTemperature1 = [];
				data.forEach((i:object) => {
					state.statisticsChartXAxisData.push(i.huanLuName);
					state.inTemperature1.push(i.inTemperature1);
					state.outTemperature1.push(i.outTemperature1);
				});

				// nextTick(() => {
				// 	initBarChart();
				// });

			});
		};
		// 柱状图
		const initBarChart = () => {
			if (!global.dispose.some((b: any) => b === global.homeChartOne)) global.homeChartOne.dispose();
			global.homeChartOne = <any>echarts.init(homeBarRef.value, state.charts.theme);
			const option = {
				tooltip: {
					trigger: 'axis'
				},
				title: {
					text: '供热监测',
					x: 'left',
					textStyle: { fontSize: '15', color: state.charts.color },
				},
				legend: {
					data: ['一网供水温度', '一网回水温度', '二网供回水温差', '二网供回水压差', '压力值'],
					top: 35
				},
				grid: { top: 80, bottom: 30 },
				// calculable: true,
				xAxis: [
					{ data: state.statisticsChartXAxisData }
				],
				yAxis: [
					{
						type: 'value'
					}
				],
				series: [
					{
						name: '一网供水温度',
						type: 'bar',
						data: state.inTemperature1,
						markLine: {
							data: [{ type: 'average', name: 'Avg' }]
						}
					},
					{
						name: '一网回水温度',
						type: 'bar',
						data: state.outTemperature1,
						markLine: {
							data: [{ type: 'average', name: 'Avg' }]
						}
					},
					{
						name: '二网供回水温差',
						type: 'bar',
						data: [],
						markLine: {
							data: [{ type: 'average', name: 'Avg' }]
						}
					},
					{
						name: '二网供回水压差',
						type: 'bar',
						data: [],
						markLine: {
							data: [{ type: 'average', name: 'Avg' }]
						}
					},
					{
						name: '压力值',
						type: 'bar',
						data: [],
						markLine: {
							data: [{ type: 'average', name: 'Avg' }]
						}
					},


				]
			};
			(<any>global.homeChartOne).setOption(option);
			(<any>state.myCharts).push(global.homeChartOne);
		};
		// 获取环路回温占比数据数据
		const getStatisticsPieData = () => {
			api.statistics.getStatisticsPieData({tableNo:21}).then((res:any) => {
				const data = res.Info
				// "huanLuNo": "D00140-4", //换热站编号
				// "huanLuName": "8#楼高区", //换热站名称
				// "inPressure1": 0, //一网供水压力
				// "inPressure2": 0, //二网供水压力
				// "inTemperature1": 0, //一网供水温度
				// "inTemperature2": 0, //二网供水温度
				// "outPressure1": 0, //一网回水压力
				// "outPressure2": 0, //二网回水压力
				// "outTemperature1": 0, //一网回水温度
				// "outTemperature2": 0 //二网回水温度

				// <el-checkbox label="一网供水温度" />
				// <el-checkbox label="一网回水温度" />
				// <el-checkbox label="二网供回水温差" />
				// <el-checkbox label="二网供回水压差" />
				// <el-checkbox label="压力值" />
				// state.statisticsChartXAxisData = [];
				// state.inTemperature1 = [];
				// state.outTemperature1 = [];
				data.forEach((i:object) => {
					// state.pieNameArr.push(i.temperatureRange);
					// state.pieData.push(i.rate);
					// state.outTemperature1.push(i.outTemperature1);
					state.pieData.push({name: i.temperatureRange, value: i.rate, num: i.num});
				});

				// nextTick(() => {
				// 	initPieChart();
				// });

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
				// title: {
				// 	// text: '环路回温/热用户室温占比',
				// 	x: 'left',
				// 	textStyle: { fontSize: '15', color: state.charts.color },
				// },
				//  '{b0}: {c0}<br />{b1}: {c1}',
				grid: { top: 80, bottom: 10 },
				tooltip: { trigger: 'item', formatter: '{b} <br/> {d}% <br/>' },
				// graphic: {
				// 	elements: [
				// 		{
				// 			type: 'image',
				// 			z: -1,
				// 			style: {
				// 				image: store.state.themeConfig.themeConfig.isIsDark
				// 					? ''
				// 					: 'data:image/png;base64,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',
				// 				width: 230,
				// 				height: 230,
				// 			},
				// 			left: '16.5%',
				// 			top: 'center',
				// 		},
				// 	],
				// },
				legend: {
					// type: 'scroll',
					// orient: 'vertical',
					// right: '0%',
					// left: '0',
					top: 35,
					// itemWidth: 14,
					// itemHeight: 14,
					// data: getname,
					// textStyle: {
					// 	rich: {
					// 		name: {
					// 			fontSize: 14,
					// 			fontWeight: 400,
					// 			width: 200,
					// 			height: 35,
					// 			padding: [0, 0, 0, 60],
					// 			color: state.charts.color,
					// 		},
					// 		rate: {
					// 			fontSize: 15,
					// 			fontWeight: 500,
					// 			height: 35,
					// 			width: 40,
					// 			padding: [0, 0, 0, 30],
					// 			color: state.charts.color,
					// 		},
					// 	},
					// },
				},
				series: [
					{
						type: 'pie',
						// radius: ['82', store.state.themeConfig.themeConfig.isIsDark ? '50' : '102'],
						// center: ['50%', '50%'],
						// itemStyle: {
						// 	color: function (params: any) {
						// 		return colorList[params.dataIndex];
						// 	},
						// },
						radius: [60, 100],
						center: ['50%', '50%'],
						// roseType: 'area',
						// avoidLabelOverlap: false,
						itemStyle: {
							borderRadius: 8,
							// borderColor: '#fff',
							// borderWidth: 2
						},
						label: {
							show: true,
							// position: 'center',
							formatter: '{b} {d}%'
						},
						// emphasis: {
						// 	label: {
						// 	show: true,
						// 	fontSize: '40',
						// 	fontWeight: 'bold'
						// 	}
						// },
						// labelLine: {
						// 	show: false
						// },
						data: state.pieData,


					},
				],
			};
			(<any>global.homeChartTwo).setOption(option);
			(<any>state.myCharts).push(global.homeChartTwo);
		};
		// 获取热网总能耗数据
		const getStatisticsLineChartData = () => {
			if(!state.rangeValue) return;
			api.statistics.getStatisticsLineChartData({tableNo:16, timeInterval: state.rangeValue}).then((res:any) => {
				const { calorie, electric, water } = res.Info
				// calorie：总热耗  electric：总电耗  water：总失水量
				state.lineType = 'calorie';
				state.lineName = '总热耗';
				state.calorieLineData = [];
				state.calorieXAxisData = [];
				state.electricLineData = [];
				state.electricXAxisData = [];
				state.waterLineData = [];
				state.waterXAxisData = [];
				calorie.forEach((i:any) => {
					state.calorieLineData.push(i.values)
					state.calorieXAxisData.push(i.accessDay)
				});
				electric.forEach((i:any) => {
					state.electricLineData.push(i.values)
					state.electricXAxisData.push(i.accessDay)
				});
				water.forEach((i:any) => {
					state.waterLineData.push(i.values)
					state.waterXAxisData.push(i.accessDay)
				});
				state.lineData = state.calorieLineData;
				state.xAxisData = state.calorieXAxisData;
				if(state.rangeValue == 10) return
				nextTick(() => {
					initLineChart();
				});

				// const data = res.Info
				// // "huanLuNo": "D00140-4", //换热站编号
				// // "huanLuName": "8#楼高区", //换热站名称
				// // "inPressure1": 0, //一网供水压力
				// // "inPressure2": 0, //二网供水压力
				// // "inTemperature1": 0, //一网供水温度
				// // "inTemperature2": 0, //二网供水温度
				// // "outPressure1": 0, //一网回水压力
				// // "outPressure2": 0, //二网回水压力
				// // "outTemperature1": 0, //一网回水温度
				// // "outTemperature2": 0 //二网回水温度

				// // <el-checkbox label="一网供水温度" />
				// // <el-checkbox label="一网回水温度" />
				// // <el-checkbox label="二网供回水温差" />
				// // <el-checkbox label="二网供回水压差" />
				// // <el-checkbox label="压力值" />
				// state.statisticsChartXAxisData = [];
				// state.inPressure1Data = [];
				// data.forEach((i:object) => {
				// 	state.statisticsChartXAxisData.push(i.huanLuName);
				// 	state.inPressure1Data.push(i.inPressure1);
				// });

				// console.log(state.statisticsChartXAxisData)
				// nextTick(() => {
				// 	initBarChart();
				// });

			});
		};
		// 折线图
		const initLineChart  = () => {
			if (!global.dispose.some((b: any) => b === global.homeCharThree)) global.homeCharThree.dispose();
			global.homeCharThree = <any>echarts.init(homeLineRef.value, state.charts.theme);
			const option = {
				backgroundColor: state.charts.bgColor,
				tooltip: { trigger: 'axis' },
				legend: { data: [state.lineName], top: 30 },
				grid: { top: 70, right: 40, bottom: 100, left: 40 },
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
						type: 'value'
					}
				],
				series: [
					{
						name: state.lineName,
						type: 'line',
						smooth: true,
						showSymbol: true,
						symbolSize: 12,
						yAxisIndex: 0,
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: 'rgba(22,132,252,0.3)' },
								{ offset: 1, color: 'rgba(22,132,252,0)' },
							]),
							shadowColor: 'rgba(22,132,252,0.2)',
							shadowBlur: 20,
						},
						itemStyle: { color: 'rgba(22, 132, 252, 1)' },
						data: state.lineData,
					}
				],
			};
			(<any>global.homeCharThree).setOption(option);
			(<any>state.myCharts).push(global.homeCharThree);
		};
		// 切换折线图类型
		const changeLineType = (type: string, name: string) => {
			state.lineType = type;
			state.lineName = name;
			let keyWord = type+'LineData'
			state.lineData = state[keyWord];
			nextTick(() => {
				initLineChart();
			});
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
			getStatisticsLineChartData();
			getStatisticsPieData();
			// 获取布局配置信息
			state.isIsDark =  store.state.themeConfig.themeConfig.isIsDark;
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
				state.isIsDark =  store.state.themeConfig.themeConfig.isIsDark
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

					}, 1000);

				});
			},
			{
				deep: true,
				immediate: true,
			}
		);
		return {
			homeLineRef,
			homePieRef,
			homeBarRef,
			changePieType,
			getStatisticsLineChartData,
			changeLineType,
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
	.home-card-three {
		.home-card-item,.home-card-top {
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
					height: 24px;;
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
						line-height: 33px;;
						font-size: 14px;
					}
					span:nth-child(2) {
						color: #101010;
						font-weight: bold;
						font-size: 22px;
					}
				}
				p:nth-child(2) {
					margin-top: 26px;
				}
			}
	}

	.home-card-two,
	.home-card-three {
    .home-card-item{
      height: 500px;
    }
    .home-card-top{
      height: 250px;
      .box-card{
        padding: 15px 20px 20px 20px;
        p{margin-bottom: 10px;}
        &-item{margin-bottom: 20px;}
      }
    }
		.home-card-item, .home-card-top{
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
  .text-info{color: #23c6c8;}
  .text-danger{color:#ed5565;}

  .git-res{
    margin-top: 20px;
  }
  .git-res .el-link{
    margin-right: 30px;
  }
  ul,li{ padding:0;margin:0;list-style:none}
  .product{
    margin-top: 50px;
    h3{margin-bottom: 15px;}
  }
  .product li{
    margin-bottom: 20px;
    float: left;
    width: 150px;
  }
  .box-card.xx{
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
	>div {
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
