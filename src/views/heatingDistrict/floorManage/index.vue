<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="所属组织" prop="organizationId">
						<el-tree-select
							v-model="tableData.param.organizationId"
							:data="orgList"
							:props="{
								label: 'name',
								children: 'children'
							}"
							placeholder="请选择"
							node-key="id"
							:clearable="true"
							check-strictly
							style="width: 100%;"
							:render-after-expand="true"
							size="default"
						/>
          </el-form-item>
          <el-form-item label="小区名称" prop="plotId">
            <el-select v-model="tableData.param.plotId" placeholder="选择小区名称" filterable clearable size="default">
							<el-option
								v-for="item in plotList"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
          </el-form-item>
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入楼宇名称" clearable size="default" style="width: 240px" @keyup.enter="queryList" />
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
            <el-button size="default" type="success" class="ml10" @click="onOpenDialog()">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增
            </el-button>
            <!-- <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除
            </el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%" >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="ID" align="center" prop="id" width="60" />
	    	<el-table-column label="楼宇名称" prop="name" min-width="100" />
	    	<el-table-column label="楼号" prop="number" min-width="100" />
	    	<!-- <el-table-column label="单元数" prop="name" /> -->
        <el-table-column label="小区名称" prop="" min-width="100">
          <template #default="{ row }">
            {{ row.ZhgyPlotInfo ? row.ZhgyPlotInfo.name : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="组织名称" prop="" min-width="100">
          <template #default="{ row }">
            {{ row.SysOrganization ? row.SysOrganization.name : '-' }}
          </template>
        </el-table-column>
	    	<el-table-column label="更新时间" prop="createdAt" width="180" />
				<el-table-column prop="status" label="启用状态" width="120" align="center">
					<template #default="scope">
						<el-switch v-model="scope.row.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁" @change="handleStatusChange(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" text type="warning" @click="onOpenDialog(scope.row)">修改</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="queryList" />
    </el-card>
    <EditDic ref="editDicRef" @queryList="queryList" />
    <Detail ref="detailRef"  />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import Detail from './component/detail.vue';
import api from '/@/api/heatingDistrict';
import systemApi from '/@/api/system';

export default defineComponent({
	name: 'loop',
	components: { EditDic,Detail },
	setup() {
		const addDicRef = ref();
		const editDicRef = ref();
		const detailRef=ref();
		const queryRef = ref();
		const state = reactive({
			ids: [],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					name: '',
					plotId: '',
					organizationId: '',
					status: -1
				},
			},
		});
		// 组织
		const orgList = ref([])
		// 小区
		const plotList = ref([])
		// 初始化表格数据
		const initTableData = () => {
			queryList();
		};
		// 获取组织
		const getOrgList = () => {
			systemApi.org.getList({ name: '', status: -1 }).then((res: any) => {
				orgList.value = res;
			});
		}
		// 获取区域
		const getPlotList = () => {
			api.regionalManage.allList({})
				.then((res: any) => {
					plotList.value = res.Info || []
				})
		}
		const queryList = () => {
			state.tableData.loading = true
			api.floor.getList(state.tableData.param).then((res: any) => {
				console.log(res);
				state.tableData.data = res.Info || [];
				state.tableData.total = res.Total;
				state.tableData.loading = false
			});
		};

		//查看详情
		const onOpenDetail=(row: any)=>{
			detailRef.value.openDialog(row);
		}
		// 打开新增修改弹窗
		const onOpenDialog = (row: any) => {
			editDicRef.value.orgList = orgList.value
			editDicRef.value.plotList = plotList.value
			editDicRef.value.openDialog(row);
		};
		
		// 状态修改
		const handleStatusChange = (row: any) => {
			let text = row.status === 1 ? '启用' : '停用';
			ElMessageBox.confirm('确认要"' + text + '"："' + row.name + '"楼宇吗?', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(function () {
					return api.floor.setStatus(row.id, row.status);
				})
				.then(() => {
					ElMessage.success(text + '成功');
				})
				.catch(function () {
					row.status = row.status === 0 ? 1 : 0;
				});
		};
		// 删除产品
		const onRowDel = (row: any) => {
			// let msg = '你确定要删除所选数据？';
			// let ids: number[] = [];
			// if (row) {
			let msg = `此操作将永久删除楼宇：“${row.name}”，是否继续?`;
			// 	ids = [row.id];
			// } else {
			// 	ids = state.ids;
			// }
			// if (ids.length === 0) {
			// 	ElMessage.error('请选择要删除的数据。');
			// 	return;
			// }
			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.floor.del(row.id).then(() => {
						ElMessage.success('删除成功');
						queryList();
					});
				})
				.catch(() => {});
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
			getOrgList();
			getPlotList()
		});
		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			queryList();
		};

		return {
			addDicRef,
			editDicRef,
			detailRef,
			queryRef,
			onOpenDetail,
			onOpenDialog,
			onRowDel,
			queryList,
			resetQuery,
			orgList,
			plotList,
			handleStatusChange,
			...toRefs(state),
		};
	},
});
</script>
