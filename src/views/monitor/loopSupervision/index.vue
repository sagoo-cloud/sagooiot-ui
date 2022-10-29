<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="" prop="">
            <el-radio-group v-model="radioValue" size="default">
              <el-radio-button label="换热站" />
              <el-radio-button label="环路" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="环路名称" prop="name">
            <el-select v-model="tableData.param.name" placeholder="环路名称" clearable size="default" style="width: 240px">
              <el-option label="已发布" :value="1" />
              <el-option label="未发布" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="环路编号" prop="name">
            <el-select v-model="tableData.param.name" placeholder="环路编号" clearable size="default" style="width: 240px">
              <el-option label="已发布" :value="1" />
              <el-option label="未发布" :value="0" />
            </el-select>
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
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column type="index" width="55" align="center" />
        <el-table-column label="日期" prop="key" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column :label="radioValue === '换热站' ? '换热站' : '环路名称'" prop="name" :show-overflow-tooltip="true">
          <template #default="{ row }">
            <el-button type="text" @click="goPage(row)">
              {{ radioValue === '换热站' ? '换热站' : '环路名称' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="radioValue === '换热站' ? '换热站编号' : '环路编号'" prop="name" min-width="120" :show-overflow-tooltip="true">
          <template #default>
            {{ radioValue === '换热站' ? '换热站编号' : '环路编号' }}
          </template>
        </el-table-column>
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
import { useRouter } from 'vue-router';

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
    const router = useRouter()
		const state = reactive({
      radioValue: '换热站',
			ids: [],
			tableData: {
				data: [{ name: '换热站', key: '2022-10-25', value: 1 }],
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
		// 初始化表格数据
		const initTableData = () => {
			typeList();
		};
		const typeList = () => {
			state.tableData.loading = true;
			api.product.getList(state.tableData.param).then((res: any) => {
				console.log(res);
				state.tableData.data = res.product;
				state.tableData.total = res.total;
			}).finally(() => (state.tableData.loading = false));
		};
		// 打开新增产品弹窗
		const onOpenAddDic = () => {
			editDicRef.value.openDialog();
		};
		// 打开修改产品弹窗
		const onOpenEditDic = (row: TableDataRow) => {
			editDicRef.value.openDialog(row);
		};
		// 删除产品
		const onRowDel = (row: TableDataRow) => {
			let msg = '你确定要删除所选数据？';
			let ids: number[] = [];
			if (row) {
				msg = `此操作将永久删除产品：“${row.name}”，是否继续?`;
				ids = [row.id];
			} else {
				ids = state.ids;
			}
			if (ids.length === 0) {
				ElMessage.error('请选择要删除的数据。');
				return;
			}
			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.product.delete(ids).then(() => {
						ElMessage.success('删除成功');
						typeList();
					});
				})
				.catch(() => {});
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
		// 多选框选中数据
		const handleSelectionChange = (selection: TableDataRow[]) => {
			// state.ids = selection.map((item) => item.id);
		};

    const goPage = (row: TableDataRow) => {
      if (state.radioValue === '换热站') {
        router.push('/monitor/loopSupervision/list/heatStationDetail')
      } else {
        router.push('/monitor/loopSupervision/list/loopDetail')
      }
    }
		return {
			addDicRef,
			editDicRef,
			queryRef,
			onOpenAddDic,
			onOpenEditDic,
			onRowDel,
			typeList,
			resetQuery,
			handleSelectionChange,
			...toRefs(state),
      goPage
		};
	},
});
</script>
