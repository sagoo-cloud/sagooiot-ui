<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="创建时间" prop="dateRange">
            <el-date-picker v-model="tableData.param.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="typeList">
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
      <el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column label="日期" prop="key" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="环路名称" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="环路编号" prop="name" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网供水流量" prop="value" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网供水压力" prop="value" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网供水温度" prop="value" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网回水流量" prop="value" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网回水压力" prop="value" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网回水温度" prop="value" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网供水流量" prop="value" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网供水压力" prop="value" min-width="120" :show-overflow-tooltip="true" />

        <!-- <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status">已发布</el-tag>
            <el-tag type="info" size="small" v-else>未发布</el-tag>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
// import EditDic from './component/editPro.vue';
import api from '/@/api/device';

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	name: string;
	deviceType: string;
	status: number;
	desc: string;
	createBy: string;
}
interface TableDataState {
	ids: number[];
	tableData: {
		data: Array<TableDataRow>;
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			name: string;
			deviceType: string;
			status: string;
			dateRange: string[];
		};
	};
}

export default defineComponent({
	name: 'deviceproduct',
	setup() {
		const addDicRef = ref();
		const editDicRef = ref();
		const queryRef = ref();
		const state = reactive({
			tableData: {
				data: [{ name: '环路', key: '2022-10-25', value: 1 }],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					status: '',
					dateRange: [],
				},
			},
		});
		const typeList = () => {
			// state.tableData.loading = true;
			// api.product.getList(state.tableData.param).then((res: any) => {
			// 	state.tableData.data = res.product;
			// 	state.tableData.total = res.total;
			// }).finally(() => (state.tableData.loading = false));
		};
		// 页面加载时
		onMounted(() => {
			// initTableData();
		});
		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			typeList();
		};
		return {
			addDicRef,
			editDicRef,
			queryRef,
			typeList,
			resetQuery,
			...toRefs(state),
		};
	},
});
</script>
