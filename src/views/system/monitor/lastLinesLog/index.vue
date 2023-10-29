<template>
	<div>
	<el-card shadow="hover">

		<el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
			<el-table-column prop="name" label="文件名" show-overflow-tooltip></el-table-column>
			<el-table-column prop="size" label="大小" show-overflow-tooltip></el-table-column>
			<el-table-column prop="changeAt" label="修改时间" min-width="100" align="center"></el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template #default="scope">
					<el-button size="small" text type="primary" v-if="!scope.row.folderName"
						@click="view(scope.row)">详情</el-button>
					<el-button size="small" text type="primary" v-auth="'del'" @click="down(scope.row)">下载</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize"
			@pagination="getList()" />
	</el-card>

	<el-dialog v-model="dialogVisible" title="查看详情">
		<div>{{topmsg}}</div>
		<div v-for="line in errorMessage" :key="line" class="error-line">{{ line }}</div>
	</el-dialog>

</div>
</template>

<script lang="ts" setup>
import api from '/@/api/system';
import { useSearch } from '/@/hooks/useCommon';
import getOrigin from '/@/utils/origin'
import downloadFile from '/@/utils/download';
import { ref } from 'vue';
const { params, tableData, getList, loading } = useSearch<any[]>(api.lastLinesLog.getList, 'list', { keyWord: '' });
getList();

const dialogVisible=ref(false);
const errorMessage=ref([]);
const topmsg=ref();

const view = (row: any) => {
	const es = new EventSource(getOrigin(import.meta.env.VITE_SERVER_URL + "subscribe/logInfo?name="+row.name));
	es.addEventListener('log', ({ data }) => {
		topmsg.value=data;
	});
	api.lastLinesLog.detail({name:row.name}).then((res: any) => {
		errorMessage.value=res.list;
		dialogVisible.value=true;
    });
};
const down = (row: any) => {
	// window.open(getOrigin(import.meta.env.VITE_SERVER_URL + "system/monitor/downloadLog?name="+row.name));
	api.lastLinesLog.down({ name: row.name }).then((res: any) => downloadFile(res,row.name))
};

</script>
<style scoped>
.error-line {
  white-space: pre-line; /* 保留换行符 */
}
</style>