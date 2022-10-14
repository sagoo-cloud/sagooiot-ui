<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="state.tableData.param" ref="queryRef" :inline="true" label-width="100px">
          <el-form-item label="表名称" prop="tableName">
            <el-input v-model="state.tableData.param.tableName" placeholder="请输入表名称" clearable size="default" @keyup.enter="queryList" />
          </el-form-item>
		  		<el-form-item label="表描述" prop="tableComment">
            <el-input v-model="state.tableData.param.tableComment" placeholder="请输入表描述" clearable size="default" @keyup.enter="queryList" />
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
          </el-form-item>
        </el-form>
      </div>
			
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="ID" align="center" prop="tableId" width="60" />
	    	<el-table-column label="表名称" prop="tableName" min-width="120" :show-overflow-tooltip="true" />
	    	<el-table-column label="表描述" prop="tableComment" min-width="120" :show-overflow-tooltip="true" />
	    	<el-table-column label="模型名称" prop="className" min-width="120" :show-overflow-tooltip="true" />
	    	<el-table-column label="创建时间" prop="createTime" width="180"/>
	    	<el-table-column label="更新时间" prop="updateTime" width="180"/>
				<el-table-column label="操作" width="280" align="center" fixed="right">
          <template #default="scope">
			 			<el-button size="small" text type="primary" @click="operate('preview', scope.row)">预览</el-button>
            <el-button size="small" text type="primary" @click="operate('editParams', scope.row)">参数编辑</el-button>
            <el-button size="small" text type="primary" @click="operate('', scope.row)">代码生成</el-button>
            <el-button size="small" text type="primary" @click="operate('buildConfig', scope.row)">生成配置</el-button>
            <el-button size="small" text type="danger" @click="operate('delete', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
				v-show="state.tableData.total>0"
				:total="state.tableData.total"
				v-model:page="state.tableData.param.pageNum"
				v-model:limit="state.tableData.param.pageSize"
				@pagination="queryList"
			/>
    </el-card>
    <!-- <EditDic ref="editDicRef" :treeData="tableData.data" @queryList="queryList" />
    <Detail ref="detailRef"  /> -->
		<Preview ref="previewRef"/>
		<EditParams ref="editParamsRef"/>
		<BuildConfig ref="buildConfigRef"/>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import Detail from './component/detail.vue';
import Preview from './component/preview.vue';
import EditParams from './component/editParams.vue';
import BuildConfig from './component/buildConfig.vue';
import api from '/@/api/heatStation';

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	name: string;
	code: string;
	stationId: string;
	loopTypes: number;
	energyTypes: number;
	heatingObject: number;
	heatingTypes: number;
	heatingArea: string;
	forRealArea: string;
	decade: string;
	status: number;
}
interface TableDataState {
	ids: number[];
	tableData: {
		data: Array<TableDataRow>;
		loading: boolean;
		param: {
			name: string;
			code: string;
			status: number;
		};
	};
}

const addDicRef = ref();
const editDicRef = ref();
const detailRef = ref();
const previewRef = ref();
const editParamsRef = ref();
const buildConfigRef = ref();
const queryRef = ref();
const state = reactive({
	ids: [],
	tableData: {
		data: [{
			"tableId": 3,
			"tableName": "log_opers",
			"tableComment": "LogOpers",
			"className": "LogOpers",
			"tplCategory": "crud",
			"packageName": "admin",
			"moduleName": "log-opers",
			"businessName": "logOpers",
			"functionName": "LogOpers",
			"functionAuthor": "panda",
			"options": "",
			"remark": "",
			"pkColumn": "oper_id",
			"pkGoField": "OperId",
			"pkJsonField": "operId",
			"columns": null,
			"createTime": "2022-01-06 15:02:45",
			"updateTime": "2022-01-06 15:02:45"
		}],
		loading: false,
		param: {
			tableName: '',
			tableComment: '',
			status: -1
		},
	},
});
// 初始化表格数据
const initTableData = () => {
	queryList();
};
const queryList = () => {
	// state.tableData.loading = true
	// api.heatStation.getList(state.tableData.param)
	// 	.then((res: any) => {
	// 		state.tableData.data = res || [];
	// 		state.tableData.loading = false
	// 	});
};

// 页面加载时
onMounted(() => {
	initTableData();
});
/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	queryList();
};

const operate = (type: string, row: any) => {
	switch(type) {
		case 'preview':
			console.log(previewRef.value)
			previewRef.value.openDialog(row)
			break
		case 'editParams':
			editParamsRef.value.openDialog(row)
			break
		case 'buildConfig':
			buildConfigRef.value.openDialog(row)
			break
		case 'delete':
			ElMessageBox.confirm(`是否确认删除TABLE编号为"${row.tableId}"的数据项?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					// api.heatStation.del(row.id).then(() => {
					// 	ElMessage.success('删除成功');
					// 	queryList();
					// });
				})
				.catch(() => {});
			break
	}
}
</script>
