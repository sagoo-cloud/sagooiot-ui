<template>
	<el-dialog :title="title" v-model="isShowDialog" width="1100px">
		<div class="mb-4 tr">
			<el-dropdown>
				<el-button plain class="mr-3">
					操作<el-icon>
						<ele-ArrowDown />
					</el-icon>
				</el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click.native="checkAll(true)">全部勾选</el-dropdown-item>
						<el-dropdown-item @click.native="checkAll(false)">取消全选</el-dropdown-item>
						<el-dropdown-item @click.native="expand(true)">展开所有</el-dropdown-item>
						<el-dropdown-item @click.native="expand(false)">折叠所有</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<el-button :disabled="step <= 0" @click="prev">上一步</el-button>
			<el-button :disabled="step >= 3" @click="next">下一步</el-button>
			<el-button type="primary" :loading="btnLoading" :disabled="step < 3" @click="submit">确定</el-button>
			<el-button @click="cancel">取消</el-button>
		</div>
		<el-steps :active="step" simple>
			<el-step name title="菜单权限" />
			<el-step title="按钮权限" />
			<el-step title="列表权限" />
			<el-step title="接口权限" />
		</el-steps>
		<div class="scroll-part mt-3">
			<el-tree ref="treeRef" :data="treeData" show-checkbox default-expand-all node-key="id" highlight-current :props="defaultProps" check-on-click-node :expand-on-click-node="false" />
		</div>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '/@/api/system';
import { ElMessage } from 'element-plus';
const isShowDialog = ref(false);
const btnLoading = ref(false);
const step = ref(0);
const treeRef = ref();
const title = ref('角色权限设置');
const roleId = ref(0);
const treeData = ref([]);
const menuData = ref([]);
const buttonData = ref([]);
const listData = ref([]);
const apiData = ref([]);
const menuIds = ref([]);
const buttonIds = ref([]);
const columnIds = ref([]);
const apiIds = ref([]);

const typeList = ['menu', 'button', 'column', 'api'];
let idsList = [menuIds, buttonIds, columnIds, apiIds];
const treeDataList = [menuData, buttonData, listData, apiData];
const defaultProps = {
	children: 'children',
	label: 'title',
};

const openDialog = async (row: any) => {
	title.value = '角色权限设置 - ' + row.name;
	roleId.value = row.id;
	isShowDialog.value = true;
	step.value = 0;
	const ids = await api.role.getRoleIds(row.id);
	// idsList = ids.menuIds || [];
	menuIds.value = ids.menuIds || [];
	buttonIds.value = ids.buttonIds || [];
	columnIds.value = ids.columnIds || [];
	apiIds.value = ids.apiIds || [];
	// 设置选中
	treeRef.value.setCheckedKeys(ids.menuIds);
	const res = await api.role.auth.getList(typeList[step.value]);
	// console.log(res);
	treeData.value = res;
	menuData.value = res;
};
const cancel = () => {
	isShowDialog.value = false;
};

const expand = (expand: boolean) => {
	const nodes = treeRef.value.store.nodesMap;
	for (let i in nodes) {
		nodes[i].expanded = expand;
	}
};

const prev = async () => {
	stepChange()
	const currentStep = step.value;
	const prevStep = step.value - 1;
	// 获取选中id
	const val = treeRef.value.getCheckedKeys(currentStep === 0 ? false : true);
	idsList[currentStep].value = val;
	treeData.value = treeDataList[prevStep].value;
	treeRef.value.setCheckedKeys(idsList[prevStep].value);
	step.value = prevStep;
};

const next = async () => {
	stepChange()
	const nextStep = step.value + 1;
	const treeDataRes = await api.role.auth.getList(typeList[nextStep], menuIds.value);
	// 最外层是菜单，如果菜单下没有按钮，列表或者接口，就不显示这个菜单
	// 菜单id和其他id可能会重复，所以最外层的菜单id变一下，避免重复
	const treeDateFilter = (treeDataRes || []).filter((item: any) => {
		if (item.children?.length) {
			item.id += '_numu'
			return true
		}
		return false
	});
	treeData.value = treeDateFilter;
	treeDataList[nextStep].value = treeDateFilter;
	treeRef.value.setCheckedKeys(idsList[nextStep].value);
	step.value = nextStep;
};

// 切换时候赋值
const stepChange = () => {
	idsList[step.value].value = treeRef.value.getCheckedKeys(step.value === 0 ? false : true);
};

// 全选取消全选
const checkAll = (all: boolean) => {
	if (!all) {
		treeRef.value.setCheckedKeys([]);
	} else {
		const ids = deepTree(treeDataList[step.value].value, []);
		treeRef.value.setCheckedKeys(ids);
	}
};

const submit = async () => {
	stepChange()
	const data = {
		menuIds: menuIds.value,
		buttonIds: buttonIds.value,
		columnIds: columnIds.value,
		apiIds: apiIds.value,
		roleId: roleId.value,
	};
	// console.log(data);

	btnLoading.value = true;
	api.role.auth
		.set(data)
		.then(() => {
			ElMessage.success('权限设置成功');
		})
		.finally(() => {
			btnLoading.value = false;
			isShowDialog.value = false;
		});
};

function deepTree(tree: any[], arr: number[]) {
	for (let item of tree) {
		arr.push(item.id);
		if (item.children?.length) deepTree(item.children, arr);
	}
	return arr;
}

// openDialog({ name: '超级管理员', id: 3 });

defineExpose({ openDialog });
</script>

<style scoped lang="scss">
.scroll-part {
	height: calc(80vh - 200px);
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
