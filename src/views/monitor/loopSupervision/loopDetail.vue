<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search">
        <el-form :model="searchParams" ref="queryRef" :inline="true" label-width="100px">
          <el-form-item label="环路名称" prop="name">
            <el-input v-model="searchParams.name" placeholder="环路名称" clearable size="default"></el-input>
          </el-form-item>
          <el-form-item label="环路编号" prop="name">
						<el-input v-model="searchParams.name" placeholder="环路编号" clearable size="default"></el-input>
          </el-form-item>
          <el-form-item label="所属换热站" prop="name">
						<el-input v-model="searchParams.name" placeholder="所属换热站" clearable size="default"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
		<el-row :gutter="15" class="home-card-one mt15">
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
import { toRefs, reactive, onMounted, ref, defineComponent, nextTick } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import * as echarts from 'echarts';
import api from '/@/api/device';

import ele from '/@/assets/img/ele.svg';
import ele1 from '/@/assets/img/ele1.svg';
import fire from '/@/assets/img/fire.svg';
import fire1 from '/@/assets/img/fire1.svg';
import map from '/@/assets/img/map.svg';
import map1 from '/@/assets/img/map1.svg';
import water from '/@/assets/img/water.svg';
import water1 from '/@/assets/img/water1.svg';
import { useRouter } from 'vue-router';

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
		const state = reactive({
			dataOne: [
				{
					icon: map,
					iconDark: map1,
					title: '供热面积',
					contentTitle1: '供热面积',
					val1: '2112.12',
					unit1: '㎡',
					contentTitle2: '总面积',
					val2: '2312.12',
					unit2: '㎡',
				},
				{
					icon: fire,
					iconDark: fire1,
					title: '热量',
					contentTitle1: '总耗热',
					val1: '4500',
					unit1: 'GJ',
					contentTitle2: '总单耗',
					val2: '0.34',
					unit2: 'GJ/㎡',
				},
				{
					icon: ele,
					iconDark: ele1,
					title: '电量',
					contentTitle1: '总耗电',
					val1: '5200',
					unit1: 'KW.h',
					contentTitle2: '总单耗',
					val2: '0.22',
					unit2: 'KW.h/㎡',
				},
				{
					icon: water,
					iconDark: water1,
					title: '水量',
					contentTitle1: '总耗水',
					val1: '4500',
					unit1: 'T',
					contentTitle2: '总单耗',
					val2: '0.23',
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
			}
		});

		const goDetail = () => {
			router.push('/monitor/loopSupervision/list/loopHistory')
		}

		// 折线图
		const initLineChart  = () => {
			if (!global.dispose.some((b: any) => b === global.homeCharThree)) global.homeCharThree.dispose();
			global.homeCharThree = <any>echarts.init(homeLineRef.value, state.charts.theme);
			const option = {
				backgroundColor: state.charts.bgColor,
				tooltip: { trigger: 'axis' },
				legend: {  },
				grid: { top: 40, right: 40, bottom: 40, left: 40 },
				xAxis: [
					{
						type: 'category',
						data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
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
						data: [10, 11, 13, 11, 12, 12, 9]
					},
					{
						name: '回水温度',
						type: 'line',
						data: [1, -2, 2, 5, 3, 2, 0]
					},
					{
						name: '室外温度',
						type: 'line',
						data: [3, 0, 4, 7, 5, 7, 5]
					}
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

		// 页面加载时
		onMounted(() => {
			
			initLineChart();
			initEchartsResize();
		});

		
		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			// typeList();
		};

		return {
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
	
	&-title {
		font-size: 15px;
		font-weight: bold;
		height: 30px;
		align-items: center;
	}
}

// :deep(.el-form-item--default) {
	// margin-bottom: 0;
// }
</style>