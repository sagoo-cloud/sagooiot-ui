
<template>
	<el-card shadow="hover">
		<div class="search">
			<el-form :inline="true" ref="queryRef">
				<el-form-item label="批次名称：" prop="name">
					<el-input v-model="params.keyWord" placeholder="请输入产品名称" clearable size="default" style="width: 240px"
						@keyup.enter.native="getList" />
				</el-form-item>

				<el-form-item>

					<el-button size="default" type="primary" class="ml10" @click="getList()">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="CheckUpdate()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						添加批次
					</el-button>

				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
			<el-table-column prop="id" label="ID" width="60" show-overflow-tooltip></el-table-column>
			<el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="waitVersion" label="待升级版本号" show-overflow-tooltip></el-table-column>
			<el-table-column prop="method" label="协议方式" show-overflow-tooltip>
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.method == 1">http</el-tag>
					<el-tag size="small" v-if="scope.row.method == 2">https</el-tag>
					<el-tag size="small" v-if="scope.row.method == 3">mqtt</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="stratege" label="升级方式" show-overflow-tooltip>
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.stratege == 1">静态升级 </el-tag>
					<el-tag size="small" v-if="scope.row.stratege == 2">动态升级</el-tag>
				</template>
			</el-table-column>

			<el-table-column prop="push" label="主动推送" show-overflow-tooltip>
				<template #default="scope">
					<el-tag size="small" v-if="scope.row.push == 1">是 </el-tag>
					<el-tag size="small" v-if="scope.row.push == 2">否</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createdAt" label="创建时间" min-width="100" align="center"></el-table-column>
			<!-- <el-table-column label="操作" width="200" align="center">
				<template #default="scope">
					<el-button size="small" text type="warning" v-auth="'edit'" @click="CheckUpdate(scope.row)">编辑</el-button>
					<el-button size="small" text type="danger" v-auth="'del'" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column> -->
		</el-table>
		<pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize"
			@pagination="getList()" />

	</el-card>
	<CheckForm ref="checkFormRef" @getList="getList()"></CheckForm>
</template>
  
<script lang="ts" setup>
import api from '/@/api/ota';
import { useSearch } from '/@/hooks/useCommon';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import CheckForm from '../check.vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({
	detail: {
		type: Object,
		default: () => { }
	},
})
const queryRef = ref();
const router = useRouter();

const checkFormRef = ref();

const { params, tableData, getList, loading } = useSearch<any[]>(api.batch.getList, 'Data', { devOtaFirewareId: props.detail.id });

getList();

const CheckUpdate = async (row?: any) => {
	if (row) {
		checkFormRef.value.open(row);
		return;
	} else {

		let array={
			productId:props.detail.productId,
			devOtaFirewareId:props.detail.id
		}
		checkFormRef.value.open(array);
	}
};


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
  