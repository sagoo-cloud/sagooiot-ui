<template>
	<div class="system-edit-dic-container">
		<el-dialog title="换热站详情" v-model="state.isShowDialog" width="1000px">
			<el-table :data="tableData" style="width: 100%" class="mt-6" v-loading="loading" border>
				<el-table-column prop="datetime" label="日期" align="center" />
				<el-table-column prop="unitConsumptionTotal" :label="`供水量(${unitMap['小时补水量']})`" align="center" />
				<el-table-column prop="flowLossTotal" :label="`失水量(${unitMap['小时补水量']})`" align="center" />
				<el-table-column prop="unitConsumptionDemand" :label="`供热负荷(${unitMap['供热负荷']})`" align="center" />
				<el-table-column prop="temperature" label="温度(℃)" align="center" />
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import api from '/@/api/heatStation';
import { useSearch } from '/@/hooks/useCommon';
import apiDatahub from '/@/api/datahub';

const state = reactive({
	isShowDialog: false,
	ruleForm: {} as any,
});

const unitMap = ref<any>({});
// 统计信息的单位的字典
apiDatahub.template.getDictData({ DictType: 'overview_unit' }).then((res: any) => {
	res.values.forEach((v: any) => {
		unitMap.value[v.value] = v.key;
	});
});

const { params, tableData, getList, loading } = useSearch(api.heatStation.stationDetailHistory, 'list', { stationId: '', year: '' });

// 打开弹窗
const openDialog = (id: string, year: number) => {
	console.log(year)
	params.stationId = id;
	params.year = year;
	getList();
	state.isShowDialog = true;
};

defineExpose({ openDialog });
</script>

<style scoped>
.el-form-item {
	margin-bottom: 0;
}
</style>
