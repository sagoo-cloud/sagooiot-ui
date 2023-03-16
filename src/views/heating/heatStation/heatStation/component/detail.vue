<template>
	<div class="system-edit-dic-container">
		<el-dialog title="换热站详情" v-model="state.isShowDialog" width="1000px">
			<el-form :model="state.ruleForm" ref="formRef" size="default" label-width="110px">
				<el-form-item label="换热站名称" prop="name">
					{{ state.ruleForm.name }}
				</el-form-item>
				<el-form-item label="换热站位置" prop="position">
					{{ state.ruleForm.position }}
				</el-form-item>
				<el-form-item label="负责人" prop="principalInfo.userNickname">
					{{ state.ruleForm.principalInfo.userNickname }}
				</el-form-item>
				<el-form-item label="状态" prop="status">
					{{ state.ruleForm.status === 1 ? '启用' : '禁用' }}
				</el-form-item>
				<el-form-item label="地图展示" prop="">
					<div>
						<span>经度：{{ state.ruleForm.lnt ? `${state.ruleForm.lnt}` : '' }}</span>
						<span style="margin-left: 10px">纬度：{{ state.ruleForm.lat }}</span>
					</div>
				</el-form-item>
			</el-form>
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
// import { ElMessage } from 'element-plus';

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

const { params, tableData, getList, loading } = useSearch(api.heatStation.stationDetail, 'list', { stationId: '' });

// 打开弹窗
const openDialog = (row: any) => {
	if (row) {
		state.ruleForm = row;
		params.stationId = row.id;
		getList();
		// api.heatStation
		// 	.stationDetail({
		// 		stationId: row.id,
		// 		pageNum: 1,
		// 		pageSize: 10,
		// 	})
		// 	.then((res: any) => {
		// 		console.log(res);
		// 	});
	}
	state.isShowDialog = true;
};

// 关闭弹窗
const closeDialog = () => {
	state.isShowDialog = false;
};

defineExpose({ openDialog });
</script>

<style scoped>
.el-form-item {
	margin-bottom: 0;
}
</style>
