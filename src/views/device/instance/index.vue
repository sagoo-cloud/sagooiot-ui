<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入产品名称" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
          </el-form-item>
		  <el-form-item label="设备标识" prop="key">
            <el-input v-model="tableData.param.key" placeholder="请输入产品名称" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
          </el-form-item>

          <el-form-item label="状态" prop="status" style="width: 200px;">
            <el-select v-model="tableData.param.status" placeholder="状态" clearable size="default" style="width: 240px">
              <el-option label="在线" :value="2" />
              <el-option label="离线" :value="1" />
              <el-option label="未启用" :value="0" />
            </el-select>
          </el-form-item>

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
            <el-button size="default" type="success" class="ml10" @click="onOpenAddDic">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增设备
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" width="60" />
	    <el-table-column label="标识" prop="key" :show-overflow-tooltip="true" />
        <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="产品名称" prop="productName" :show-overflow-tooltip="true" />
        <el-table-column label="部门" prop="deptName" :show-overflow-tooltip="true" />


        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag type="info" size="small" v-if="scope.row.status==1">离线</el-tag>
            <el-tag type="success" size="small" v-if="scope.row.status==2">在线</el-tag>
            <el-tag type="info" size="small" v-if="scope.row.status==0">未启用</el-tag>
          </template>
        </el-table-column>
         <el-table-column prop="registryTime" label="激活时间" align="center" width="150"></el-table-column>
         <el-table-column prop="lastOnlineTime" label="最后上线时间" align="center" width="150"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">

			 <el-button size="small" text type="primary" @click="onOpenDetail(scope.row)">详情</el-button>
            <el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)">修改</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
    </el-card>
    <EditDic ref="editDicRef" @typeList="typeList" />
    <Detail ref="detailRef"  />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import Detail from './component/detail.vue';
import api from '/@/api/device';

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	name: string;
	key: string;
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
			key: string;
			status: string;
			dateRange: string[];
		};
	};
}

export default defineComponent({
	name: 'deviceInstance',
	components: { EditDic,Detail },
	setup() {
		const addDicRef = ref();
		const editDicRef = ref();
		const detailRef=ref();
		const queryRef = ref();
		const state = reactive<TableDataState>({
			ids: [],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					name: '',
					key: '',
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
			api.instance.getList(state.tableData.param).then((res: any) => {
				console.log(res);
				state.tableData.data = res.device;
				state.tableData.total = res.total;
			});
		};

		//查看详情
		const onOpenDetail=(row: TableDataRow)=>{
			detailRef.value.openDialog(row);
		}
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
				msg = `此操作将永久删除设备：“${row.name}”，是否继续?`;
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
					api.instance.del(ids).then(() => {
						ElMessage.success('删除成功');
						typeList();
					});
				})
				.catch(() => {});
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			typeList();
		};
		// 多选框选中数据
		const handleSelectionChange = (selection: TableDataRow[]) => {
			state.ids = selection.map((item) => item.id);
		};
		return {
			addDicRef,
			editDicRef,
			detailRef,
			queryRef,
			onOpenDetail,
			onOpenAddDic,
			onOpenEditDic,
			onRowDel,
			typeList,
			resetQuery,
			handleSelectionChange,
			...toRefs(state),
		};
	},
});
</script>
