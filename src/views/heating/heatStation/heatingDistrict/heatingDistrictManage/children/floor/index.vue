<template>
  <div class="system-dic-container">
    <div>
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入楼宇名称" clearable size="default" style="width: 240px" @keyup.enter="queryList" />
          </el-form-item>
          <el-form-item label="楼号" prop="number">
            <el-input v-model="tableData.param.number" placeholder="请输入楼号" clearable size="default" style="width: 240px" @keyup.enter="queryList" />
          </el-form-item>
          <el-form-item>
            <el-button size="default" v-auth="'floor-query'" type="primary" class="ml10" @click="queryList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" v-auth="'floor-reset'" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <el-button size="default" v-auth="'floor-add'" type="success" class="ml10" @click="onOpenDialog()">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%" >
        <el-table-column label="ID" align="center" prop="id" width="60" />
	    	<el-table-column label="楼宇名称" v-col="'floor-name'" prop="name" />
	    	<el-table-column label="楼号" v-col="'floor-number'" prop="number" />
	    	<el-table-column label="更新时间" v-col="'floor-createdAt'" prop="createdAt" width="180" />
				<el-table-column label="启用状态" v-col="'floor-status'" prop="status" width="120" align="center">
					<template #default="scope">
						<el-switch v-model="scope.row.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁" @change="handleStatusChange(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
        <el-table-column label="操作" v-col="'floor-handle'" width="200" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" text type="warning" @click="onOpenDialog(scope.row)">修改</el-button>
            <el-button size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="tableData.total>0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="queryList" />
    </div>
    <EditDic ref="editDicRef" @queryList="handleFinish()" />
    <Detail ref="detailRef"  />
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, watch } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import Detail from './component/detail.vue';
import api from '/@/api/heatingDistrict';
import { emit } from 'process';

export default defineComponent({
	name: 'loop',
	components: { EditDic,Detail },
	props: {
		nodeId: {
			default: ''
		}
	},
	setup(prop, { emit }) {
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
					number: '',
					nodeId: '',
					status: -1
				},
			},
		});

		const queryList = () => {
			state.tableData.loading = true
			api.floor.getList(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Info || [];
				state.tableData.total = res.Total;
				state.tableData.loading = false
			});
		};

		const handleFinish = () => {
			emit('finish')
			queryList()
		}
		
		watch(() => prop.nodeId, () => {
			state.tableData.param.nodeId = prop.nodeId
			queryList()
		}, {
			deep: true,
			immediate: true
		})

		//查看详情
		const onOpenDetail=(row: any)=>{
			detailRef.value.openDialog(row);
		}
		// 打开新增修改弹窗
		const onOpenDialog = (row: any) => {
			editDicRef.value.openDialog(row, { nodeId: prop.nodeId });
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
			let msg = `此操作将永久删除楼宇：“${row.name}”，是否继续?`;

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

		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			queryList();
		};

		return {
			editDicRef,
			detailRef,
			queryRef,
			onOpenDetail,
			onOpenDialog,
			onRowDel,
			queryList,
			resetQuery,
			handleStatusChange,
			handleFinish,
			...toRefs(state),
		};
	},
});
</script>
