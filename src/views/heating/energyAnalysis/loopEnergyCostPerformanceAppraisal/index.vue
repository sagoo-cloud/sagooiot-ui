<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="state.tableData.param" ref="queryRef" :inline="true" label-width="90px">
					<el-form-item label="时间范围" prop="dateRange">
						<el-date-picker
							v-model="state.tableData.param.dateRange"
							size="default"
							style="width: 240px"
							value-format="YYYY-MM-DD"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="排序" prop="sort">
						<el-select v-model="state.tableData.param.sort" placeholder="按照选择进行排名" filterable clearable size="default">
							<el-option label="总耗热" :value="1" />
							<el-option label="热单耗" :value="2" />
							<el-option label="总耗电" :value="3" />
							<el-option label="电单耗" :value="4" />
							<el-option label="总耗水" :value="5" />
							<el-option label="水单耗" :value="6" />
						</el-select>
					</el-form-item>
					<el-form-item label="排序方式" prop="isdesc">
						<el-select v-model="state.tableData.param.isdesc" placeholder="按照选择进行排名" filterable clearable size="default">
							<el-option label="正序" :value="2" />
							<el-option label="倒序" :value="1" />
						</el-select>
					</el-form-item>
					<el-form-item label="换热站名称" prop="stationName">
						<el-input v-model="state.tableData.param.stationName" placeholder="输入" clearable size="default"> </el-input>
					</el-form-item>
					<el-form-item label="环路名称" prop="loopName">
						<el-input v-model="state.tableData.param.loopName" placeholder="输入" clearable size="default"> </el-input>
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
						<el-button size="default" v-auth="'reset'" @click="exportData()">
							<el-icon>
								<ele-Download />
							</el-icon>
							导出
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
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" align="center" width="60" />
				<el-table-column label="环路名称" prop="huanLuName" />
				<el-table-column label="所属换热站" prop="stationName" />
				<el-table-column :label="`总热耗(${unitMap['单日总热耗单位']})`" prop="unitConsumptionTotal" />
				<el-table-column :label="`热单耗(${unitMap['单日供热单耗']})`" prop="unitConsumption" />
				<el-table-column :label="`总耗电(${unitMap['单日总电耗']})`" prop="elctricConsumptionTotal" />
				<el-table-column :label="`电单耗(${unitMap['单日用电单耗']})`" prop="elctricConsumption" />
				<el-table-column :label="`总耗水(${unitMap['日总水耗单位']})`" prop="flowLossTotal" />
				<el-table-column :label="`水单耗(${unitMap['日失水单耗']})`" prop="flowLoss" />
			</el-table>

			<pagination
				v-show="state.tableData.total > 0"
				:total="state.tableData.total"
				v-model:page="state.tableData.param.pageNum"
				v-model:limit="state.tableData.param.pageSize"
				@pagination="queryList"
			/>
			<!-- <div class="title mt20">能耗红榜</div>
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
			</div> -->
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref, watch, nextTick } from 'vue';
import { FormInstance } from 'element-plus';
import * as echarts from 'echarts';
import { useStore } from '/@/store/index';
import energyApi from '/@/api/energyAnalysis';
import heatApi from '/@/api/heatStation';
import downloadFile from '/@/utils/download';
import apiDatahub from '/@/api/datahub';

let global: any = {
	redChartOneRef: null,
	redChartTwoRef: null,
	redChartThreeRef: null,
	blackChartOneRef: null,
	blackChartTwoRef: null,
	blackChartThreeRef: null,
	dispose: [null, '', undefined],
};

const unitMap = ref<any>({});
// 统计信息的单位的字典
apiDatahub.template.getDictData({ DictType: 'overview_unit' }).then((res: any) => {
	res.values.forEach((v: any) => {
		unitMap.value[v.value] = v.key;
	});
});

const queryRef = ref();
const redChartOneRef = ref();
const redChartTwoRef = ref();
const redChartThreeRef = ref();
const blackChartOneRef = ref();
const blackChartTwoRef = ref();
const blackChartThreeRef = ref();

const store = useStore();
const state = reactive({
	myCharts: [],
	charts: {
		theme: '',
		bgColor: '',
		color: '#303133',
	},
	heatList: [],
	tableData: {
		data: [],
		loading: false,
		total: 0,
		param: {
			sort: 1,
			isdesc: 2,
			stationName: '',
			loopName: '',
			dateRange: [],
			pageNum: 1,
			pageSize: 10,
		},
	},
});

const queryTree = () => {
	heatApi.heatStation
		.getList({
			name: '',
			code: '',
			status: -1,
		})
		.then((res: any) => {
			state.heatList = res || [];
		});
};

const exportData = () => {
	energyApi.performanceExport(state.tableData.param).then((res: any) => {
		downloadFile(res, '绩效考核数据.xlsx');
	});
};

const queryList = () => {
	state.tableData.loading = true;
	energyApi.getEnergyPerformance(state.tableData.param).then((res) => {
		state.tableData.data = res.list || [];
		state.tableData.total = res.Total;
		state.tableData.loading = false;
	});
};
// 页面加载时
onMounted(() => {
	// queryTree()
	queryList();
});
/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	queryList();
};

let chartArr = [
	{ globalKey: 'redChartOneRef', refKey: redChartOneRef },
	{ globalKey: 'redChartTwoRef', refKey: redChartTwoRef },
	{ globalKey: 'redChartThreeRef', refKey: redChartThreeRef },
	{ globalKey: 'blackChartOneRef', refKey: blackChartOneRef },
	{ globalKey: 'blackChartTwoRef', refKey: blackChartTwoRef },
	{ globalKey: 'blackChartThreeRef', refKey: blackChartThreeRef },
];

const initChart = () => {
	chartArr.forEach((item) => {
		initBarChart(item.globalKey, item.refKey);
	});
};

// 初始化图表
const initBarChart = (gk: string, refKey: any) => {
	if (!global.dispose.some((b: any) => b === global[gk])) global[gk].dispose();
	global[gk] = <any>echarts.init(refKey.value, state.charts.theme);
	const option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true,
		},
		xAxis: [
			{
				type: 'category',
				data: ['换热站1', '换热站2', '换热站3', '换热站4', '换热站5', '换热站6', '换热站7'],
			},
		],
		yAxis: [
			{
				type: 'value',
			},
		],
		series: [
			{
				name: '供水流量',
				type: 'bar',
				emphasis: {
					focus: 'series',
				},
				data: [320, 332, 301, 334, 390, 330, 320],
			},
		],
	};
	(<any>global[gk]).setOption(option);
	(<any>state.myCharts).push(global[gk]);
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
				// initChart();
			}, 500);
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
