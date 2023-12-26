<template>
	<div class="page">
		<el-card shadow="nover">
			<el-form :inline="true" ref="queryRef">
				<el-form-item label="场景名称：" prop="name">
					<el-input v-model="params.keyWord" placeholder="场景名称" clearable size="default" style="width: 220px" @keyup.enter.native="getList(1)" />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-select v-model="params.status" placeholder="发布状态" clearable size="default" style="width: 160px">
						<el-option label="全部" :value="-1" />
						<el-option label="成功" :value="1" />
						<el-option label="失败" :value="0" />
					</el-select>
				</el-form-item>
				<el-form-item label="执行时间" prop="dateRange">
					<el-date-picker v-model="params.dateRange" size="default" style="width: 240px" value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
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
			<el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
				<el-table-column prop="id" label="ID" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="场景名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="场景类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="name" label="执行状态" width="100" align="center">
					<template #default="scope">
						<el-tag type="success" size="small" v-if="scope.row.status">成功</el-tag>
						<el-tag type="info" size="small" v-else>失败</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createdAt" label="执行时间" min-width="100" align="center"></el-table-column>
				<el-table-column label="操作" width="200" align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" v-if="!scope.row.folderName" @click="view(scope.row)">详情</el-button>
						<el-button size="small" text type="info" v-auth="'del'" @click="del(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import api from '/@/api/scene';
import { useSearch } from '/@/hooks/useCommon';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import { ref } from 'vue';
const queryRef = ref();
const { params, tableData, getList, loading } = useSearch<any[]>(api.log.getList, 'data', { keyWord: '' });
getList();


const view = (row: any) => {

};

const del = (row: any) => {
	ElMessageBox.confirm(`此操作将删除场景：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.log.del(row.id);
		ElMessage.success('删除成功');
		getList(1);
	});
};
</script>
