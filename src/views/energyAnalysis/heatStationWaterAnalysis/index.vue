<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="searchParams" ref="queryRef" :inline="true" label-width="120px">
          <el-form-item label="环路名称" prop="plotId">
            <el-select v-model="searchParams.plotId" placeholder="选择环路名称" filterable clearable size="default">
							<el-option
								v-for="item in []"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
          </el-form-item>
					<el-form-item label="所属换热站" prop="heatStaId">
						<el-tree-select
							v-model="searchParams.heatStaId"
							:data="state.heatList"
							:props="{
								label: 'name',
								children: 'children'
							}"
							node-key="id"
							:clearable="true"
							check-strictly
							size="default"
							style="width: 100%;"
							placeholder="请选择"
							:render-after-expand="true"
						/>
					</el-form-item>
          <el-form-item label="负责人" prop="plotId">
            <el-select v-model="searchParams.plotId" placeholder="选择负责人" filterable clearable size="default">
							<el-option
								v-for="item in []"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
          </el-form-item>
          <el-form-item label="时间间隔(秒)" prop="plotId">
            <el-input-number v-model="searchParams.xx"></el-input-number>
          </el-form-item>
          <el-form-item label="流量限值" prop="plotId">
            <el-input-number v-model="searchParams.xx"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="queryList">
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
            <el-button size="default" type="success" class="ml10" @click="onOpenDialog()">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              导入
            </el-button>
          </el-form-item>
        </el-form>
      </div>

			<div style="height: 300px" ref="barChartRef"></div>
			<div style="height: 300px" ref="lineChartRef"></div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, onMounted, ref, watch, nextTick } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';
import api from '/@/api/heatingDistrict';
import heatApi from '/@/api/heatStation';

let global: any = {
	barChart: null,
	lineChart: null,
	dispose: [null, '', undefined],
};

const queryRef = ref();
const barChartRef = ref();
const lineChartRef = ref();
const searchParams = ref({

})
const store = useStore();
const state = reactive({
	myCharts: [],
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
	
	heatList: []
});

const queryTree = () => {
	heatApi.heatStation.getList({
			name: '',
			code: '',
			status: -1
		})
		.then((res: any) => {
			state.heatList = res || [];
		});
};
// 页面加载时
onMounted(() => {
	queryTree()
});
/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	// queryList();
};


// 初始化图表
const initBarChart = () => {
	if (!global.dispose.some((b: any) => b === global.barChart)) global.barChart.dispose();
	global.barChart = <any>echarts.init(barChartRef.value, state.charts.theme);
	const option =  {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
			}
		],
		yAxis: [
			{
				type: 'value'
			}
		],
		series: [
			{
				name: '供水流量',
				type: 'bar',
				emphasis: {
					focus: 'series'
				},
				data: [320, 332, 301, 334, 390, 330, 320]
			},
			{
				name: '回水流量',
				type: 'bar',
				stack: 'Ad',
				emphasis: {
					focus: 'series'
				},
				data: [120, 132, 101, 134, 90, 230, 210]
			}
		]
	};
	(<any>global.barChart).setOption(option);
	(<any>state.myCharts).push(global.barChart);
}
// 初始化图标
const initLineChart = () => {
	if (!global.dispose.some((b: any) => b === global.lineChart)) global.lineChart.dispose();
	global.lineChart = <any>echarts.init(lineChartRef.value, state.charts.theme);
	const option = {
		backgroundColor: state.charts.bgColor,
		grid: { top: 70, right: 20, bottom: 30, left: 30 },
		tooltip: { trigger: 'axis' },
		legend: { data: ['一网回水压力', '一网供水压力'] },
		xAxis: {
			data: ['环路1', '环路2', '环路3', '环路4', '环路5'],
		},
		yAxis: [
			{
				type: 'value',
				name: '条数',
				splitLine: { show: true, lineStyle: { type: 'dashed', color: '#f5f5f5' } },
			},
		],
		series: [
			{
				name: '一网回水压力',
				type: 'line',
				symbolSize: 6,
				symbol: 'circle',
				smooth: true,
				data: [41.1, 30.4, 65.1, 53.3, 53.3],
				lineStyle: { color: '#fe9a8b' },
				itemStyle: { color: '#fe9a8b', borderColor: '#fe9a8b' }
			},
			{
				name: '一网供水压力',
				type: 'line',
				symbolSize: 6,
				symbol: 'circle',
				smooth: true,
				data: [24.1, 7.2, 15.5, 42.4, 42.4],
				lineStyle: { color: '#9E87FF' },
				itemStyle: { color: '#9E87FF', borderColor: '#9E87FF' }
			}
		]
	};
	(<any>global.lineChart).setOption(option);
	(<any>state.myCharts).push(global.lineChart);
}

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
});

// 监听 vuex 中是否开启深色主题
watch(
	() => store.state.themeConfig.themeConfig.isIsDark,
	(isIsDark) => {
		nextTick(() => {
			state.charts.theme = isIsDark ? 'dark' : '';
			state.charts.bgColor = isIsDark ? 'transparent' : '';
			state.charts.color = isIsDark ? '#dadada' : '#303133';
			setTimeout(() => {
				initBarChart();
				initLineChart();
			}, 500)
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>
