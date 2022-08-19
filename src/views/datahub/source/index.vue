<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" >
          <el-form-item label="数据源名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入数据源名称" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
          </el-form-item>
		  <el-form-item label="数据源类型" prop="types">
            <el-input v-model="tableData.param.types" placeholder="请输入数据源类型" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
          </el-form-item>
          <el-form-item label="数据源地址" prop="host">
            <el-input v-model="tableData.param.host" placeholder="请输入数据源地址" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
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
            <el-button size="default" type="success" class="ml10" @click="onOpenAdd">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增数据源
            </el-button>
      
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" width="80" />
        <el-table-column label="数据源名称" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="类型" prop="types" :show-overflow-tooltip="true" />
        <el-table-column label="地址" prop="host" :show-overflow-tooltip="true" />
        <el-table-column label="端口" prop="port" :show-overflow-tooltip="true" />
       
        
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status==1">启用</el-tag>
            <el-tag type="info" size="small" v-if="scope.row.status==0">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
		   			 <el-button size="small" text type="primary" @click="onOpenDetail(scope.row)">详情</el-button>

            <el-button size="small" text type="warning" @click="onOpenEdit(scope.row)">修改</el-button>
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
import api from '/@/api/datahub';
import Detail from './component/detail.vue';

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
		const queryRef = ref();
		const detailRef=ref();
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
					types: '',
					status:'-1',
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			typeList();
		};
		const typeList = () => {
			api.common.getList(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.total;
			});
		};
		// 打开新增产品弹窗
		const onOpenAdd = () => {
			editDicRef.value.openDialog();
		};
		// 打开修改产品弹窗
		const onOpenEdit = (row: TableDataRow) => {
			editDicRef.value.openDialog(row);
		};
		// 删除产品
		const onRowDel = (row: TableDataRow) => {

			let msg = '你确定要删除所选数据？';
			msg = `此操作将永久删除数据源：“${row.name}”，是否继续?`;
			
			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.common.delete(row.id).then(() => {
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
		//查看详情
		const onOpenDetail=(row: TableDataRow)=>{
			detailRef.value.openDialog(row);
		}
		return {
			addDicRef,
			editDicRef,
			queryRef,
			detailRef,
			onOpenAdd,
			onOpenDetail,
			onOpenEdit,
			onRowDel,
			typeList,
			resetQuery,
			handleSelectionChange,
			...toRefs(state),
		};
	},
});
</script>
