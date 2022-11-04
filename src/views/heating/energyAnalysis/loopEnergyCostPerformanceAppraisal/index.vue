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
          <el-form-item>
            <el-button size="default" type="primary" v-auth="'query'" class="ml10" @click="queryList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" v-auth="'reset'" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <!-- <el-button size="default" type="success" class="ml10" @click="onOpenDialog()">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              导入
            </el-button> -->
          </el-form-item>
        </el-form>
      </div>
			<div class="title">环路数据统计</div>
      <el-table :data="[]" style="width: 100%" >
        <el-table-column type="index" label="序号" align="center" width="60" />
	    	<el-table-column label="环路名称" prop="name" />
	    	<el-table-column label="区域负责人" prop="number" />
	    	<el-table-column label="总热耗" prop="number" />
	    	<el-table-column label="热单耗" prop="number" />
	    	<el-table-column label="总耗电" prop="number" />
	    	<el-table-column label="电单耗" prop="number" />
	    	<el-table-column label="总耗水" prop="number" />
	    	<el-table-column label="水单耗" prop="number" />
      </el-table>
			<div class="title mt20">能耗红榜</div>
			<div class="chart-grid">
				<div style="height: 250px" ref="redChartOneRef"></div>
				<div style="height: 250px" ref="redChartTwoRef"></div>
				<div style="height: 250px" ref="redChartThreeRef"></div>
			</div>
			<div class="title mt20">能耗黑榜</div>
			<div class="chart-grid">
				<div style="height: 250px" ref="blackChartOneRef"></div>
				<div style="height: 250px" ref="blackChartTwoRef"></div>
				<div style="height: 250px" ref="blackChartThreeRef"></div>
			</div>
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
	redChartOneRef: null,
	redChartTwoRef: null,
	redChartThreeRef: null,
	blackChartOneRef: null,
	blackChartTwoRef: null,
	blackChartThreeRef: null,
	dispose: [null, '', undefined],
};

const queryRef = ref();
const redChartOneRef = ref();
const redChartTwoRef = ref();
const redChartThreeRef = ref();
const blackChartOneRef = ref();
const blackChartTwoRef = ref();
const blackChartThreeRef = ref();
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

let chartArr = [
	{ globalKey: 'redChartOneRef', refKey: redChartOneRef },
	{ globalKey: 'redChartTwoRef', refKey: redChartTwoRef },
	{ globalKey: 'redChartThreeRef', refKey: redChartThreeRef },
	{ globalKey: 'blackChartOneRef', refKey: blackChartOneRef },
	{ globalKey: 'blackChartTwoRef', refKey: blackChartTwoRef },
	{ globalKey: 'blackChartThreeRef', refKey: blackChartThreeRef }
]

const initChart = () => {
	chartArr.forEach((item) => {
		initBarChart(item.globalKey, item.refKey)
	})
}

// 初始化图表
const initBarChart = (gk: string, refKey: any) => {
	if (!global.dispose.some((b: any) => b === global[gk])) global[gk].dispose();
	global[gk] = <any>echarts.init(refKey.value, state.charts.theme);
	const option = {
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
				data: ['换热站1', '换热站2', '换热站3', '换热站4', '换热站5', '换热站6', '换热站7']
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
			}
		]
	};
	(<any>global[gk]).setOption(option);
	(<any>state.myCharts).push(global[gk]);
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
			state.charts.theme = isIsDark ? 'transparent' : '';
			state.charts.bgColor = isIsDark ? 'transparent' : '';
			state.charts.color = isIsDark ? '#dadada' : '#303133';
			setTimeout(() => {
				initChart();
			}, 500)
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>


<style lang="scss" scoped>
.title {
	font-size: 16px;
	font-weight: bold;
}
.chart-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-column-gap: 10px;
}
.mt20 {
	margin-top: 20px;
}
</style>