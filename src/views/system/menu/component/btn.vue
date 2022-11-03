<template>
	<el-drawer v-model="drawer" :title="title" direction="rtl" size="700px">
		<div class="p-3">
			<el-button size="default" type="success" class="mr-3" @click="onAddRow">
				<el-icon>
					<ele-FolderAdd />
				</el-icon>
				新增按钮
			</el-button>

			<el-dropdown @command="addCommonType">
				<el-button text type="primary">
					<el-icon>
						<ele-Plus />
					</el-icon>常用按钮权限
				</el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="add-新增">新增</el-dropdown-item>
						<el-dropdown-item command="edit-编辑">编辑</el-dropdown-item>
						<el-dropdown-item command="detail-详情">详情</el-dropdown-item>
						<el-dropdown-item command="del-删除">删除</el-dropdown-item>
						<el-dropdown-item command="upload-导入">导入</el-dropdown-item>
						<el-dropdown-item command="dwonload-导出">导出</el-dropdown-item>
						<el-dropdown-item command="reset-重置">重置</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>

		<el-table :data="tableData" style="width: 100%" row-key="id" border :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
			<el-table-column type="index" label="序号" width="60" align="center" />
			<el-table-column prop="name" label="按钮名称" width="220" show-overflow-tooltip></el-table-column>
			<el-table-column prop="types" label="按钮编码" show-overflow-tooltip></el-table-column>
			<el-table-column prop="status" label="状态" width="100" align="center">
				<template #default="scope">
					<el-switch v-model="scope.row.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁" @change="handleStatusChange(scope.row)">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100" align="center">
				<template #default="scope">
					<el-button size="small" text type="warning" @click="onEdit(scope.row)">修改</el-button>
					<el-button size="small" text type="danger" @click="onDel(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-drawer>
	<btnForm ref="btnFormRef" :parent-data="tableData" @getList="getList"></btnForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import btnForm from './btn-form.vue';
import { MenuBtnRow } from '/@/api/model/system/menu';
import api from '/@/api/system';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getBackEndControlRoutes } from '/@/router/backEnd';

const title = ref('按钮权限');
const drawer = ref(false);
const tableData = ref<MenuBtnRow[]>([]);
const menuRow = ref();
const btnFormRef = ref();
const getList = async () => {
	tableData.value = [];
	let res = await api.menu.btn.getList({ menuId: menuRow.value.id as number, status: -1 });
	tableData.value = res || [];
};

const open = async (row: any) => {
	// console.log(row);
	title.value = '按钮权限 - ' + row.title;
	drawer.value = true;
	menuRow.value = row;
	getList();
};

const onAddRow = () => {
	btnFormRef.value.open({ menuId: menuRow.value.id });
};

const onEdit = (row: MenuBtnRow) => {
	btnFormRef.value.open(row);
};

// 添加常用类型
const addCommonType = async (command: string) => {
	const [types, name] = command.split('-');
	const formData: MenuBtnRow = {
		parentId: -1,
		menuId: menuRow.value.id as number,
		name,
		types,
		description: '',
		status: 1,
	};
	await api.menu.btn.add(formData);
	ElMessage.success('操作成功');
	getList();
	getBackEndControlRoutes();
};

// 修改启用停用状态
const handleStatusChange = (row: MenuBtnRow) => {
	let text = row.status === 1 ? '启用' : '停用';
	ElMessageBox.confirm('确认要"' + text + '"："' + row.name + '"按钮吗?', '警告', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async function () {
			await api.menu.btn.setStatus(row.id as number, row.menuId as number, row.status);
			ElMessage.success('操作成功');
			getBackEndControlRoutes();
		})
		.catch(function () {
			row.status = row.status === 0 ? 1 : 0;
		});
};

const onDel = (row: MenuBtnRow) => {
	ElMessageBox.confirm(`此操作将删除按钮：“${row.name}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.menu.btn.del(row.id as number);
		ElMessage.success('删除成功');
		getList();
		getBackEndControlRoutes();
	});
};

defineExpose({ open });
</script>
