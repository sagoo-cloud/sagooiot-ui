<template>
	<div class="system-dic-container">
		<div class="content">
			<div class="cont_box">
				<div class="title">数据表名：{{ detail.name }}</div>
				<div class="title">数据表表名：{{ detail.name }}</div>
		
			</div>
		</div>

		<div class="content-box">


                        <div class="wu-box">
						 <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="字段标题" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入产品名称" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
          </el-form-item>
          <el-form-item label="字段名称" prop="deviceType">
            <el-input v-model="tableData.param.deviceType" placeholder="请输入设备类型" clearable size="default" style="width: 240px" @keyup.enter.native="typeList" />
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
              新增字段
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
                       

                         <el-table :data="tableData.data" style="width: 100%" >
        <el-table-column label="ID" align="center" prop="nodeId" width="80" />
        <el-table-column label="字段标题" prop="key" :show-overflow-tooltip="true" />
        <el-table-column label="字段名称" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="字段类型" prop="dataType" :show-overflow-tooltip="true" />
        <el-table-column label="字段长度" prop="value" :show-overflow-tooltip="true" />
        <el-table-column label="默认值" prop="value" :show-overflow-tooltip="true" />
        <el-table-column label="备注说明" prop="value" :show-overflow-tooltip="true" />
		  <el-table-column prop="createdAt" label="创建时间" align="center" width="180"></el-table-column> 

        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
	

            <el-button size="small" text type="warning" @click="onOpenEdit1(scope.row)">修改</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
           </div>         
                  




        </div>
 <EditDic ref="editDicRef" @typeList="typeList" />
	</div>
</template>            
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import { useRoute } from 'vue-router';
import EditDic from './component/editNode.vue';
import api from '/@/api/datahub';

interface TableDataState {
	ids: number[];
	tableData: {
		data: [];
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
    name: 'dataDetail',
    components: { EditDic },
    setup(prop, context) {
        		const editDicRef = ref();

		const route = useRoute();
        const state = reactive<TableDataState>({
            config: {},
		
			isShowDialog: false,
			detail: [],
            
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
                    sourceId: route.params && route.params.sourceId,
					status: '',
					dateRange: [],
				},
			},
		});



        onMounted(() => {
			

                typeList();
		});

        const typeList = () => {
			api.node.getList(state.tableData.param).then((res: any) => {
				state.tableData.data = res.list;
				state.tableData.total = res.Total;
			});
		};


        const CkOption=()=>{
                if(state.developer_status==1){
                    api.common.undeploy({sourceId:route.params.sourceId}).then((res: any) => {
                        ElMessage.success('操作成功');
                        state.developer_status=0;
                    });
                }else{
                    api.common.deploy({sourceId:route.params.sourceId}).then((res: any) => {
                        ElMessage.success('操作成功');
                        state.developer_status=1;
                    });
                }
		}
        const handleClick = (tab: TabsPaneContext, event: Event) => {
			console.log(tab, event);
		};

        	const onRowDel = (row: TableDataRow) => {
			let msg = '你确定要删除所选数据？';
			let ids: number[] = [];
			if (row) {
				msg = `此操作将永久删除数据节点：“${row.name}”，是否继续?`;
				ids = row.nodeId;
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
					api.node.delete(ids).then(() => {
						ElMessage.success('删除成功');
						typeList();
					});
				})
				.catch(() => {});
		};

        	// 打开修改数据源弹窗
        const onOpenEdit = (row: TableDataRow) => {
			editDicRef.value.openDialog(row);
		};

        	return {
			Edit,
            editDicRef,
            typeList,
            onRowDel,
            onOpenEdit,
            handleClick,
			CkOption,
			...toRefs(state),
		};
    },
});

</script>
<style>
.content {
	background: #fff;
	width: 100%;
	padding: 20px;
}
.content-box {
	background: #fff;
	width: 100%;
	padding: 20px;
	margin-top: 20px;
}
.cont_box {
	display: flex;
}
.cont_box .title {
	font-size: 24px;
}
.cont_box .pro-status {
	line-height: 40px;
	margin-left: 30px;
}
.cont_box .pro-status .on {
	background: #52c41a;
}
.cont_box .pro-status .off {
	background: #c41a1a;
}
.cont_box .pro-status span {
	position: relative;
	top: -1px;
	display: inline-block;
	width: 6px;
	height: 6px;
	vertical-align: middle;
	border-radius: 50%;
	margin-right: 5px;
}
.cont_box .pro-option {
	line-height: 40px;
	margin-left: 10px;
	color: #1890ff;
	cursor: pointer;
}
.content-box .pro-box {
	display: flex;
	padding: 10px;
}
.content-box .pro-box .protitle {
	font-size: 18px;
	font-weight: bold;
	line-height: 35px;
}
.content-box .pro-box .buttonedit {
	border: 0px;
	color: #1890ff;
}


</style>