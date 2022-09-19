<template>
	<el-card shadow="hover">
		<div class="search">
			<el-form :inline="true">
				<el-form-item>
					<el-input size="default" style="width: 200px; margin-left: 20px" class="search-input" placeholder="请输入搜索关键字" clearable> </el-input>
					<el-button size="default" type="primary" class="ml10">
						<el-icon>
							<ele-Search />
						</el-icon>
						查询
					</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="add()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增图纸
					</el-button>
				</el-form-item>
			</el-form>
		</div>
		<el-table :data="tableData" style="width: 100%" row-key="id" lazy :load="load" :tree-props="{ children: 'children', hasChildren: 'types' }">
			<!-- <el-table-column type="index" label="序号" width="60" align="center" /> -->
			<el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
			<el-table-column prop="folderName" label="文件夹名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="name" label="组态图名称" show-overflow-tooltip></el-table-column>
			<el-table-column prop="createdAt" label="创建时间" min-width="100" align="center"></el-table-column>
			<el-table-column prop="updatedAt" label="更新时间" min-width="100" align="center"></el-table-column>
			<el-table-column label="操作" width="100" align="center">
				<template #default="scope">
					<el-button size="small" text type="primary" v-if="!scope.row.folderName" @click="view(scope.row)">预览</el-button>
					<!-- <el-button size="small" text type="warning" @click="edit(scope.row)">编辑</el-button>
						<el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '/@/api/configuration';
import { Session } from '/@/utils/storage';

const tableData = ref<any[]>([]);

api.getFolder().then((res: any) => {
	tableData.value = (res.topology || []).map((item: any) => {
		return {
			...item,
			name: '',
			folderName: item.name,
		};
	});
});

const load = (row: any, treeNode: unknown, resolve: any) => {
	api
		.getList(row.id)
		.then((res: any) => {
			resolve(res.data || []);
		})
		.catch(() => {
			resolve([]);
		});
};

const view = (row: any) => {
	const url = import.meta.env.VITE_TOPO_URL + '/?token=' + encodeURIComponent(Session.get('token')) + `&bgColor=FF9900` +  '#/show/' + row.id;
	console.log(url)
	window.open(url);
};

const add = () => {
	const url = import.meta.env.VITE_TOPO_URL + '/?token=' + encodeURIComponent(Session.get('token'));
	window.open(url);
};
</script>
