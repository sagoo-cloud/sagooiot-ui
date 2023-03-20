<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="state.tableData.param" ref="queryRef" :inline="true" label-width="90px">
					<el-form-item label="年份" prop="year">
						<el-select v-model="state.tableData.param.year" placeholder="按照选择进行排名" filterable size="default">
							<el-option v-for="year in years" :label="year" :value="year" :key="year" />
						</el-select>
					</el-form-item>
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
							<el-option label="总耗水" :value="5" />
							<el-option label="小时补水量" :value="6" />
							<el-option label="供热负荷" :value="7" />
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
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="queryList">
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
						<el-button size="default" v-auth="'download'" @click="exportData()">
							<el-icon>
								<ele-Download />
							</el-icon>
							导出
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" align="center" width="80" />
				<el-table-column label="换热站名称" prop="stationName">
					<template #default="{ row }">
            <el-button text type="primary" @click="showDialog(row.stationId)">{{row.stationName}}</el-button>
          </template>
				</el-table-column>
				<el-table-column :label="`总耗热(${unitMap['总耗热']})`" prop="unitConsumptionTotal" />
				<el-table-column :label="`热单耗(${unitMap['总单耗']})`" prop="unitConsumption" />
				<el-table-column :label="`总耗水(${unitMap['总耗水']})`" prop="flowLossTotal" />
				<el-table-column :label="`小时补水量(${unitMap['小时补水量']})`" prop="flowLoss" />
				<el-table-column :label="`供热负荷(${unitMap['供热负荷']})`" prop="unitConsumptionDemand" />
				<!-- <el-table-column :label="`失水量(${unitMap['失水量']})`" prop="flowLossDemand" /> -->
			</el-table>

			<pagination
				v-show="state.tableData.total > 0"
				:total="state.tableData.total"
				v-model:page="state.tableData.param.pageNum"
				v-model:limit="state.tableData.param.pageSize"
				@pagination="queryList"
			/>
		</el-card>
		<detailDialog ref="detailDialogRef"></detailDialog>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { FormInstance } from 'element-plus';
import energyApi from '/@/api/energyAnalysis';
import downloadFile from '/@/utils/download';
import apiDatahub from '/@/api/datahub';
import detailDialog from './detail.vue';

const unitMap = ref<any>({});
// 统计信息的单位的字典
apiDatahub.template.getDictData({ DictType: 'overview_unit' }).then((res: any) => {
	res.values.forEach((v: any) => {
		unitMap.value[v.value] = v.key;
	});
});

const queryRef = ref();
const detailDialogRef = ref();
const years = ref([]);

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
			year: '',
			loopName: '',
			dateRange: [],
			pageNum: 1,
			pageSize: 10,
		},
	},
});

energyApi.history.historyYear().then((res: any) => {
	years.value = res.list || [];
	if (res.list.length) {
		state.tableData.param.year = res.list[0]
		queryList();
	}
});

const showDialog = (id: string) => {
	detailDialogRef.value.openDialog(id, state.tableData.param.year)
};

const exportData = () => {
	energyApi.history.performanceExportStation(state.tableData.param).then((res: any) => {
		downloadFile(res, '换热站绩效考核数据.xlsx');
	});
};

const queryList = () => {
	state.tableData.loading = true;
	energyApi.history.getEnergyPerformanceStation(state.tableData.param).then((res: any) => {
		state.tableData.data = res.list || [];
		state.tableData.total = res.Total;
	}).finally(() => {
		state.tableData.loading = false;
	})
};
/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	queryList();
};

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
