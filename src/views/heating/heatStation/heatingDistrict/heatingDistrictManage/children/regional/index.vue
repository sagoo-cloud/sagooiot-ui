<template>
  <div class="system-dic-container">
    <div>
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="小区名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="请输入小区名称" clearable size="default" style="width: 240px" @keyup.enter="queryList" />
          </el-form-item>
          <el-form-item>
            <el-button size="default" v-auth="'regional-query'" type="primary" class="ml10" @click="queryList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" v-auth="'regional-reset'" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <el-button size="default" type="success" v-auth="'regional-add'" class="ml10" @click="onOpenAddDic">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
			<el-table :data="tableData.data" v-loading="tableData.loading">
				<el-table-column label="ID" align="center" prop="id" width="60" />
				<el-table-column label="小区名称" v-col="'regional-name'" prop="name" min-width="100" />
				<el-table-column label="区域名称" v-col="'regional-SysOrganization.name'" prop="SysOrganization.name" min-width="100">
					<template #default="{ row }">
						{{ row.SysOrganization.name }}
					</template>
				</el-table-column>
				<el-table-column label="更新时间" v-col="'regional-createdAt'" prop="createdAt" width="180" />
				<el-table-column prop="status" v-col="'regional-status'" label="启用状态" width="120" align="center">
					<template #default="scope">
						<el-switch v-model="scope.row.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁" @change="handleStatusChange(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" v-col="'regional-handle'" width="200" align="center" fixed="right">
					<template #default="scope">
						<el-button size="small" text type="warning" @click="onOpenEditDic(scope.row)">修改</el-button>
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
import systemApi from '/@/api/system';
import { nextTick } from 'process';

export default defineComponent({
	name: 'loop',
	components: { EditDic,Detail },
	props: {
		organizationId: {
			default: ''
		}
	},
	setup(prop, { emit }) {
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
					organizationId: '',
					status: -1
				},
			},
		});

		const queryList = () => {
			state.tableData.loading = true
			api.regionalManage.getList(state.tableData.param).then((res: any) => {
				console.log(res);
				state.tableData.data = res.Info || [];
				state.tableData.total = res.Total;
				state.tableData.loading = false
			});
		};
		
		const handleFinish = () => {
			emit('finish')
			queryList()
		}

		watch(() => prop.organizationId, () => {
			state.tableData.param.organizationId = prop.organizationId
			queryList()
		}, {
			deep: true,
			immediate: true
		})
		//查看详情
		const onOpenDetail=(row: any)=>{
			detailRef.value.openDialog(row);
		}
		// 打开新增产品弹窗
		const onOpenAddDic = () => {
			editDicRef.value.openDialog(null, prop.organizationId);
		};
		// 打开修改产品弹窗
		const onOpenEditDic = (row: any) => {
			editDicRef.value.openDialog(row);
		};
		
		// 状态修改
		const handleStatusChange = (row: any) => {
			let text = row.status === 1 ? '启用' : '停用';
			ElMessageBox.confirm('确认要"' + text + '"："' + row.name + '"小区吗?', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(function () {
					return api.regionalManage.setStatus(row.id, row.status);
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
			let msg = `此操作将永久删除小区：“${row.name}”，是否继续?`;

			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.regionalManage.del(row.id).then(() => {
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
			addDicRef,
			editDicRef,
			detailRef,
			queryRef,
			onOpenDetail,
			onOpenAddDic,
			onOpenEditDic,
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
