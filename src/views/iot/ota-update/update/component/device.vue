<template>
	<el-card shadow="hover">
		<div class="search">
			<el-form :inline="true" ref="queryRef">
				<el-form-item label="设备名称：" prop="name">
					<el-input v-model="params.keyWord" placeholder="请输入产品名称" clearable size="default" style="width: 240px" @submit.prevent />
				</el-form-item>

				<el-form-item>

					<el-button size="default" type="primary" class="ml10" @click="getList(1)">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
				</el-form-item>

			</el-form>
		</div>
		<el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
			<el-table-column prop="id" label="ID" width="60" show-overflow-tooltip></el-table-column>
			<el-table-column prop="deviceName" label="设备名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="status" label="状态" show-overflow-tooltip>
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.status == 0">待推送</el-tag>
					<el-tag size="small" v-if="scope.row.status == 1">已推送</el-tag>
					<el-tag size="small" v-if="scope.row.status == 2">升级中</el-tag>
					<el-tag size="small" v-if="scope.row.status == 3">升级成功</el-tag>
					<el-tag size="small" v-if="scope.row.status == 4">升级失败</el-tag>
					<el-tag size="small" v-if="scope.row.status == 5">已取消</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="step" label="升级进度" show-overflow-tooltip></el-table-column>
			<el-table-column prop="fail" label="失败原因" width="100" align="center">
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.fail == -1">升级失败</el-tag>
					<el-tag size="small" v-if="scope.row.fail == -2">下载失败</el-tag>
					<el-tag size="small" v-if="scope.row.fail == -3">校验失败</el-tag>
					<el-tag size="small" v-if="scope.row.fail == -4">烧写失败</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createdAt" label="时间" min-width="100" align="center"></el-table-column>
			<!-- <el-table-column label="操作" width="200" align="center">
				<template #default="scope">

					<el-button size="small" text type="warning" v-auth="'edit'" @click="addOrEdit(scope.row)">编辑</el-button>

					<el-button size="small" text type="danger" v-auth="'del'" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column> -->
		</el-table>
		<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />

	</el-card>
</template>
  
<script lang="ts" setup>
import api from '/@/api/ota';
import { useSearch } from '/@/hooks/useCommon';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({
	detail: {
		type: Object,
		default: () => { }
	},
})
const queryRef = ref();


const { params, tableData, getList, loading } = useSearch<any[]>(api.device.getList, 'fireware', { devOtaFirewareId: props.detail.id });

getList();


const del = (row: any) => {
	ElMessageBox.confirm(`此操作将删除图形：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.manage.del(row.id);
		ElMessage.success('删除成功');
		getList();
	});
};
</script>
  