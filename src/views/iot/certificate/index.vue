<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="state.tableData.param" ref="queryRef" :inline="true" label-width="60px">
          <el-form-item label="关键字" prop="keyWord">
            <el-input v-model="state.tableData.param.name" placeholder="请输入关键字" clearable size="default" @keyup.enter="queryList" />
          </el-form-item>
          <el-form-item>
            <el-button v-auth="'query'" size="default" type="primary" class="ml10" @click="queryList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button v-auth="'reset'" size="default" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
			<el-button v-auth="'add'" size="default" type="success" class="ml10" @click="operate('add')">
				<el-icon>
					<ele-FolderAdd />
				</el-icon>
				新增证书
			</el-button>
          </el-form-item>
        </el-form>
      </div>
			<!--  -->
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column v-col="'id'" label="ID" align="center" prop="id" width="60" />
	    	<el-table-column v-col="'name'" label="证书名称" prop="name" min-width="120" :show-overflow-tooltip="true" />
	    	<el-table-column v-col="'standard'" label="证书标准" prop="standard" min-width="120" :show-overflow-tooltip="true">
				<template #default="scope">
					{{filterStandard(scope.row.standard)}}
                <!-- <el-button size="small" text type="primary" @click="operate('editParams', scope.row)">编辑</el-button> -->
                <!-- <el-button size="small" text type="danger" @click="operate('delete', scope.row)">删除</el-button> -->
            	</template>
            </el-table-column>
			<el-table-column v-col="'description'" label="说明" prop="description" min-width="120" :show-overflow-tooltip="true" />
			<el-table-column v-col="'handle'"  label="操作" width="280" align="center" fixed="right">
            <template #default="scope">
                <el-button size="small" v-auth="'edit'" text type="primary" @click="operate('editParams', scope.row)">编辑</el-button>
                <el-button size="small" v-auth="'del'" text type="danger" @click="operate('delete', scope.row)">删除</el-button>
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
	<EditParams ref="editParamsRef" @update="queryList"/>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import Detail from './component/detail.vue';
import api from '/@/api/certificateManagement';
import EditParams from './component/editParams.vue';

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
const { proxy } = getCurrentInstance() as any;
const { network_certificate } = proxy.useDict('network_certificate');
console.log(network_certificate)

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
		data: [],
		loading: false,
		param: {
			pageNum: 1,
			PageSize: 10,
            status: -1,
			name: ""
		},
        total: 0
	},
});
// 初始化表格数据
const initTableData = () => {
	queryList();
};
const queryList = () => {
	state.tableData.loading = true
	api.certificateManagement.getList(state.tableData.param).then((res: any) => {
		console.log(res)
		state.tableData.data = res.Info || [];
		state.tableData.loading = false
		state.tableData.total = res.total
	});
};

const filterStandard = (type: any) => {
	console.log(network_certificate.value)
	let data  = network_certificate.value;
	let opt = network_certificate.value.filter((ele: any) => {
		return ele.value == type
	})
	return opt[0].label
	console.log(opt)
	// network_certificate.value.forEach((element: object) => {
	// 	console.log(element)
	// 	if(type == element.value) {
	// 		console.log(type)
	// 		return element.label
	// 	}
	// });
}

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
		case 'add':
			// console.log(previewRef.value)
			editParamsRef.value.openDialog()
			break
		case 'editParams':
			editParamsRef.value.openDialog(row)
			break
		case 'buildConfig':
			buildConfigRef.value.openDialog(row)
			break
		case 'delete':
			ElMessageBox.confirm(`是否确认删除编号为"${row.id}"的数据项?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.certificateManagement.del(row.id).then(() => {
						ElMessage.success('删除成功');
						queryList();
					});
				})
				.catch(() => {});
			break
	}
}
</script>
