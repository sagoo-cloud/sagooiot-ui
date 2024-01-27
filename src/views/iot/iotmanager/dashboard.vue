<template>
	<div class="home-container">
		<el-row :gutter="15" class="home-card-one mb15">
			<el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(v, k) in homeOne" :key="k" :class="{ 'home-media home-media-lg': k > 1, 'home-media-sm': k === 1 }">
				<div class="home-card-item ">
					<div>{{ v.num3 }}</div>
					<div class="flex-margin flex w100" :class="` home-one-animation${k}`">
						<div class="flex-auto">
							<span class="font30">{{ v.allnum }}</span>
						</div>
						<div class="home-card-item-icon flex">
							<img :src="'/imgs/' + v.icoimg" class="icoimg">
						</div>
					</div>
					<div class="flex" style="font-weight: bold;">
						<div class="flex font14">
							<div class="title_status" :style="{ backgroundColor: v.title1_bgcolor }"></div> {{ v.title1 }} {{ v.num1 }}
						</div>
						<div class="flex ml20 font14">
							<div class="title_status" :style="{ backgroundColor: v.title2_bgcolor }"></div>{{ v.title2 }} {{ v.num2 }}
						</div>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-two mb15">
			<el-col :xs="24" :sm="14" :md="14" :lg="16" :xl="16">
				<div class="home-card-item">
					<div style="height: 100%" ref="homeLineRef"></div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="10" :md="10" :lg="8" :xl="8" class="home-media">
				<div class="home-card-item">
					<div style="height: 100%" ref="homePieRef"></div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="15" class="home-card-three">
			<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
				<div class="home-card-item" style="height: auto;">
					<div class="home-card-item-title">
						<span>告警信息列表</span>
						<el-button size="small" text type="primary" @click="toMore()">更多信息</el-button>
					</div>
					<el-table :data="tableData.data" style="width: 100%" v-loading="loading">
						<el-table-column label="ID" align="center" prop="id" width="100" v-col="'ID'" />
						<el-table-column label="告警类型" width="120" prop="type" align="center" show-overflow-tooltip v-col="'type'">
							<template #default="scope">
								<span v-if="scope.row.type == 1">规则告警</span>
								<span v-else>设备自主告警</span>
							</template>
						</el-table-column>
						<el-table-column label="规则级别" width="120" align="center" prop="alarmLevel.name" show-overflow-tooltip v-col="'alarmLevel'" />
						<el-table-column label="规则名称" prop="ruleName" show-overflow-tooltip v-col="'ruleName'" />
						<el-table-column label="产品标识" prop="productKey" show-overflow-tooltip v-col="'productKey'" />
						<el-table-column label="设备标识" prop="deviceKey" show-overflow-tooltip v-col="'deviceKey'" />

						<el-table-column prop="status" label="告警状态" width="100" align="center" v-col="'status'">
							<template #default="scope">
								<el-tag type="success" size="small" v-if="scope.row.status">已处理</el-tag>
								<el-tag type="info" size="small" v-else>未处理</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="createdAt" label="告警时间" align="center" width="170" v-col="'createdAt'"></el-table-column>
						<el-table-column label="操作" width="130" align="center" fixed="right" v-col="'handle'">
							<template #default="scope">
								<el-button v-auth="'detail'" size="small" text type="primary" @click="onOpenDetailDic(scope.row)">详情</el-button>
								<el-button v-auth="'edit'" size="small" text type="warning" @click="onOpenEditDic(scope.row)" v-if="scope.row.status == 0">处理</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-col>
		</el-row>

		<EditDic ref="editDicRef" @dataList="getAlarmList" />
		<DetailDic ref="detailRef" @dataList="getAlarmList" />
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, onMounted, ref, watch, nextTick, onActivated, getCurrentInstance } from 'vue';
import * as echarts from 'echarts';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '/@/store/index';

import api from '/@/api/datahub';
import dayjs from 'dayjs';

import EditDic from '../alarm/log/component/edit.vue';
import DetailDic from '../alarm/log/component/detail.vue';

let global: any = {
	homeChartOne: null,
	homeChartTwo: null,
	homeCharThree: null,
	dispose: [null, '', undefined]
};

export default defineComponent({
	name: 'home',
	components: { EditDic, DetailDic },
	setup() {

		const { proxy } = getCurrentInstance() as any;
		const { alarm_type } = proxy.useDict('alarm_type');
		const alarmTypeMap: any = {}

		// 监听告警类型是否获取成功
		watch(() => alarm_type.value, (list) => {
			if (!list.length) return
			list.forEach((item: any) => {
				alarmTypeMap[item.value] = item.label
			});

			getChartData()

		}, {
			immediate: true
		})

		const editDicRef = ref();
		const detailRef = ref();
		const homeLineRef = ref();
		const homePieRef = ref();
		const homeBarRef = ref();
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const state = reactive({
			loading: false,
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					status: '',
					dateRange: [],
				},
			},
			homeOne: [
				{
					allnum: 0,
					num1: 0,
					num2: 0,
					num3: '产品',
					num4: 'icon-zidingyibuju',
					color1: '#6690F9',
					color2: '--el-color-warning-lighter',
					color3: '--el-color-warning',
					icoimg: 'index_product.svg',
					title1: '启用',
					title2: '停用',
					title1_bgcolor: '#3cd357',
					title2_bgcolor: '#c1bbbb',

				},
				{
					allnum: 0,
					num1: 0,
					num2: 0,
					num3: '在线设备',
					num4: 'icon-putong',
					color1: '#FF6462',
					color2: '--next-color-primary-lighter',
					color3: '--el-color-primary',
					icoimg: 'index_device.svg',
					title1: '启用',
					title2: '禁用',
					title1_bgcolor: '#3cd357',
					title2_bgcolor: '#c1bbbb',
				},
				{
					allnum: 0,
					num1: 0,
					num2: 0,
					num3: '设备消息',
					num4: 'icon-shidu',
					color1: '#6690F9',
					color2: '--el-color-success-lighter',
					color3: '--el-color-success',
					icoimg: 'index_sensor.svg',
					title1: '本月',
					title2: '今日',
					title1_bgcolor: '#c1bbbb',
					title2_bgcolor: '#18f3ff',
				},
				{
					allnum: 0,
					num1: 0,
					num2: 0,
					num3: '设备告警',
					num4: 'icon-zaosheng',
					color1: '#6690F9',
					color2: '--el-color-warning-lighter',
					color3: '--el-color-warning',
					icoimg: 'index_alarm.svg',
					title1: '本月',
					title2: '今日',
					title1_bgcolor: '#c1bbbb',
					title2_bgcolor: '#ff1818',
				},
			],
			myCharts: [],
			charts: {
				theme: '',
				bgColor: '',
				color: '#303133',
			},
			lineChartXAxisData: [],
			lineChartMsgTotalData: [],
			lineChartAlarmTotalData: [],
			pieChartLegend: [],
			pieChartLevel: [],
			pieChartData: []
		});
		// 折线图
		const initLineChart = () => {
			if (!global.dispose.some((b: any) => b === global.homeChartOne)) global.homeChartOne.dispose();
			global.homeChartOne = <any>echarts.init(homeLineRef.value, state.charts.theme);
			const option = {
				backgroundColor: state.charts.bgColor,
				title: {
					text: '设备消息',
					x: 'left',
					textStyle: { fontSize: '15', color: state.charts.color },
				},
				grid: { top: 70, right: 20, bottom: 30, left: 30 },
				tooltip: { trigger: 'axis' },
				legend: { data: ['消息量', '预警量'], right: 0 },
				xAxis: {
					data: state.lineChartXAxisData
				},
				yAxis: [
					{
						type: 'value',
						name: '条数',
						splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
						axisLabel: {
							margin: 2,
							formatter: function (value, index) {
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
						name: '消息量',
						type: 'line',
						symbolSize: 6,
						symbol: 'circle',
						smooth: true,
						data: state.lineChartMsgTotalData,
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
						name: '预警量',
						type: 'line',
						symbolSize: 6,
						symbol: 'circle',
						smooth: true,
						data: state.lineChartAlarmTotalData,
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
			(<any>global.homeChartOne).setOption(option);
			(<any>state.myCharts).push(global.homeChartOne);
		};
		// 饼图
		const initPieChart = () => {
			if (!global.dispose.some((b: any) => b === global.homeChartTwo)) global.homeChartTwo.dispose();
			global.homeChartTwo = <any>echarts.init(homePieRef.value, state.charts.theme);
			var getname = state.pieChartLegend;
			var getvalue = state.pieChartData;
			var data = [];

			for (var i = 0; i < getname.length; i++) {
				data.push({ name: getname[i], value: getvalue[i] });
			}

			const colorList = ['#FF0000', '#FEC279', '#968AF5', '#51A3FC', '#669',];
			const color = state.pieChartLevel.map(level => colorList[level - 1])

			const option = {
				color,
				backgroundColor: state.charts.bgColor,
				title: {
					text: '预警类型',
					x: 'left',
					textStyle: { fontSize: '15', color: state.charts.color },
				},
				tooltip: { trigger: 'item', formatter: '{b} <br/> {c}%' },
				graphic: {
					elements: [
						{
							type: 'image',
							z: -1,
							left: '16.5%',
							top: 'center',
						},
					],
				},
				legend: {
					type: 'scroll',
					orient: 'vertical',
					right: '0%',
					left: '65%',
					top: 'center',
					itemWidth: 14,
					itemHeight: 14,
					data: getname,
					textStyle: {
						rich: {
							name: {
								fontSize: 14,
								fontWeight: 400,
								width: 200,
								height: 35,
								padding: [0, 0, 0, 60],
								color: state.charts.color,
							},
							rate: {
								fontSize: 15,
								fontWeight: 500,
								height: 35,
								width: 40,
								padding: [0, 0, 0, 30],
								color: state.charts.color,
							},
						},
					},
				},
				series: [
					{
						type: 'pie',
						radius: ['70', '90'],
						center: ['32%', '50%'],
						itemStyle: {
							// color: function (params: any) {
							// 	console.log(params)
							// 	return colorList[params.dataIndex];
							// },
						},
						label: { show: false },
						labelLine: { show: false },
						data: data,
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
					}, i * 1000);
				}
			});
		};
		// 批量设置 echarts resize
		const initEchartsResize = () => {
			window.addEventListener('resize', initEchartsResizeFun);
		};

		// 定时获取设备，在线信息，告警数量更新
		function getLoopData() {
			// 产品数量
			api.iotManage.productCount().then((res: any) => {
				state.homeOne[0].allnum = res.total;
				state.homeOne[0].num1 = res.enable
				state.homeOne[0].num2 = res.disable
			})

			api.iotManage.deviceDataTotalCount('year').then((res: any) => {
				state.homeOne[2].allnum = res.number;
			})
			api.iotManage.deviceDataTotalCount('month').then((res: any) => {
				state.homeOne[2].num1 = res.number;
			})
			api.iotManage.deviceDataTotalCount('day').then((res: any) => {
				state.homeOne[2].num2 = res.number;
			})
			api.iotManage.deviceOnlineOfflineCount().then((res: any) => {
				// console.log(res)
				state.homeOne[1].allnum = res.online;
				state.homeOne[1].num1 = res.total - res.disable
				state.homeOne[1].num2 = res.disable
			})
			
			// 按告警级别统计
			api.iotManage.deviceAlarmLevelCount('year', dayjs().format('YYYY')).then((res: any) => {
				const list = (res.data || [])
				const total = list.reduce((a: any, b: any) => a + b.Value, 0)
				state.homeOne[3].allnum = total;
			})
			api.iotManage.deviceAlarmLevelCount('month', dayjs().format('M')).then((res: any) => {
				const total = (res.data || []).reduce((a: any, b: any) => a + b.Value, 0)
				state.homeOne[3].num1 = total;
			})
			api.iotManage.deviceAlarmLevelCount('day', dayjs().format('D')).then((res: any) => {
				const total = (res.data || []).reduce((a: any, b: any) => a + b.Value, 0)
				state.homeOne[3].num2 = total;
			})
		}

		// 获取告警告警数量和消息数量绘图
		function getChartData() {
			// 获取年度消息，年度告警数量
			Promise.all([api.iotManage.deviceDataCount('year'), api.iotManage.deviceAlertCountByYearMonth(dayjs().format('YYYY'))]).then(([msg, alarm]: any) => {
				const msgArr = msg?.data || []
				const alarmArr = alarm?.data || []
				// console.log(alarmArr)
				state.lineChartMsgTotalData = msgArr.map((item: any) => item.Value)
				state.lineChartXAxisData = msgArr.map((item: any) => item.Title)
				state.lineChartAlarmTotalData = alarmArr.map((item: any) => item.Value)
			})
			// 按告警级别统计 绘制饼图
			api.iotManage.deviceAlarmLevelCount('year', dayjs().format('YYYY')).then((res: any) => {
				const list = (res.data || [])
				state.pieChartLegend = list.map((item: any) => alarmTypeMap[item.Title])
				state.pieChartLevel = list.map((item: any) => item.Title)
				state.pieChartData = list.map((item: any) => item.Value)
			})
		}

		// 每隔3秒更新数据
		setInterval(() => {
			// 避免到其他页面也加载
			if (route.path === '/iotmanager/dashboard') {
				getLoopData()
			}
		}, 3000)

		// 每隔一分钟秒更新图形
		setInterval(() => {
			// 避免到其他页面也加载
			if (route.path === '/iotmanager/dashboard') {
				getChartData()
			}
		}, 60000)

		const getOverviewData = () => {
			getLoopData()
		};
		const getAlarmList = () => {
			api.iotManage.getAlarmList(state.tableData.param).then((res: any) => {
				state.tableData.data = res.list;
				state.tableData.total = res.Total;
			})
		}
		//打开详情页
		const onOpenDetailDic = (row: any) => {
			detailRef.value.openDialog(row);
		};
		// 打开修改产品弹窗
		const onOpenEditDic = (row: any) => {
			editDicRef.value.openDialog(row);
		};
		// 告警信息-更多信息
		const toMore = () => {
			router.push({ path: '/iotmanager/alarm/log' });
		};
		// 页面加载时
		onMounted(() => {
			initEchartsResize();
			getOverviewData();
			getAlarmList();
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
						initLineChart();
					}, 500);
					setTimeout(() => {
						initPieChart();
					}, 700);
				});
			},
			{
				deep: true,
				immediate: true,
			}
		);
		watch(
			() => state.lineChartMsgTotalData,
			() => {
				initLineChart();
			}
		);
		watch(
			() => state.pieChartData,
			() => {
				initPieChart();
			}
		);
		return {
			homeLineRef,
			homePieRef,
			homeBarRef,
			detailRef,
			editDicRef,
			toMore,
			onOpenEditDic,
			getAlarmList,
			onOpenDetailDic,
			getOverviewData,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
$homeNavLengh: 8;

.home-container {
	overflow: hidden;

	.home-card-one,
	.home-card-two,
	.home-card-three {
		.icoimg {
			width: 50px;
			height: 50px;
		}

		.title_status {
			width: 7px;
			height: 7px;
			background: #c1bbbb;
			border-radius: 50px;
			margin-right: 5px;
		}

		.home-card-item,
		.home-card-top {
			width: 100%;
			height: 130px;
			border-radius: 4px;
			transition: all ease 0.3s;
			padding: 10px 20px;
			overflow: hidden;
			background: var(--el-color-white);
			color: var(--el-text-color-primary);
			border: 1px solid var(--next-border-color-light);

			&:hover {
				// box-shadow: 0 2px 12px var(--next-color-dark-hover);
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

	.home-card-three {
		.home-card-item-title {
			display: flex;
			justify-content: space-between;
			// span:nth-child(2) {
			// 	color: #409eff;
			// }
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

	.home-card-two,
	.home-card-three {
		.home-card-item {
			height: 300px;
		}

		.home-card-top {
			height: 250px;

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
		list-style: none
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
