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
			<el-button :disabled="step <= 1" @click="prev">上一步</el-button>
			<el-button :disabled="step >= 4" @click="next">下一步</el-button>
			<el-button type="primary" :loading="btnLoading" @click="submit">确定</el-button>
			<el-button @click="cancel">取消</el-button>
		</div>
		<el-steps :active="step" simple finish-status="success">
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
const step = ref(1);
const treeRef = ref();
const title = ref('角色权限设置');

const roleId = ref(0);
const treeData = ref([]);
const menuData = ref([]);
const buttonData = ref([]);
const listData = ref([]);
const apiData = ref([]);
const menuIds = ref<number[]>([]);
// 菜单id的半选节点
const menuIdsHalf = ref<number[]>([]);
const buttonIds = ref<number[]>([]);
// 按钮id的半选节点
const buttonIdsHalf = ref<number[]>([]);
const columnIds = ref<number[]>([]);
const apiIds = ref<number[]>([]);

const typeList = ['menu', 'button', 'column', 'api'];
let idsList = [menuIds, buttonIds, columnIds, apiIds];
const treeDataList = [menuData, buttonData, listData, apiData];
const defaultProps = {
	children: 'children',
	label: 'title',
};

// 返回的所有id都是 5_0 7_1 这种形式，_0代表半选 _1代表已选
const getIds = (idsArr: string[], isHalf = false) => {
	const ids: number[] = [];
	const idsHalf: number[] = [];
	(idsArr || []).forEach((idStr) => {
		const [id, tag] = idStr.split('_');
		if (tag === '1') {
			ids.push(Number(id));
		} else {
			idsHalf.push(Number(id));
		}
	});
	return isHalf ? idsHalf : ids;
};

// 设置id 5_0 7_1 这种形式，_0代表半选 _1代表已选
const setIds = (idsArr: number[], isHalf = false) => {
	return idsArr.map((id) => `${id}_${isHalf ? 0 : 1}`);
};

const openDialog = async (row: any) => {
	title.value = '角色权限设置 - ' + row.name;
	roleId.value = row.id;
	isShowDialog.value = true;
	step.value = 1;
	const ids = await api.role.getRoleIds(row.id);
	// idsList = ids.menuIds || [];
	menuIds.value = getIds(ids.menuIds);
	buttonIds.value = getIds(ids.buttonIds);
	columnIds.value = getIds(ids.columnIds);
	apiIds.value = getIds(ids.apiIds);
	// 设置选中
	treeRef.value.setCheckedKeys(menuIds.value);
	const res = await api.role.auth.getList(typeList[step.value - 1]);
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
	stepChange();
	// 获取选中id
	treeData.value = treeDataList[step.value - 2].value;
	treeRef.value.setCheckedKeys(idsList[step.value - 2].value);
	step.value = step.value - 1;
};

const next = async () => {
	stepChange();
	const treeDataRes = await api.role.auth.getList(typeList[step.value], menuIds.value.concat(menuIdsHalf.value));
	// 最外层是菜单，如果菜单下没有按钮，列表或者接口，就不显示这个菜单
	// 菜单id和其他id可能会重复，所以最外层的菜单id变一下，避免重复
	const itemsType = typeList[step.value]
	const treeDateFilter = (treeDataRes || []).filter((item: any) => {
		if (item.children?.length) {
			item.id += '_memu';
			if (itemsType === 'api') {
				item.children.forEach((i: any) => {
					i.title = i.method + '-' + i.title + (i.remark ? `(${i.remark})` : '')
				});
			}
			return true;
		}
		return false;
	});
	treeData.value = treeDateFilter;
	treeDataList[step.value].value = treeDateFilter;
	treeRef.value.setCheckedKeys(idsList[step.value].value);
	step.value = step.value + 1;
};

// 切换时候赋值
const stepChange = () => {
	if (step.value === 1) {
		// 包含被选中节点和半选中节点
		idsList[step.value - 1].value = treeRef.value.getCheckedKeys(false);
		menuIdsHalf.value = treeRef.value.getHalfCheckedKeys();
	} else if (step.value === 2) {
		// 包含被选中节点和半选中节点
		idsList[step.value - 1].value = treeRef.value.getCheckedKeys(false).filter((id: any) => typeof id === 'number');
		// 按钮的半选节点过滤菜单id, 菜单id是字符串类型。 id_menu 这种形式，把这种过滤掉
		buttonIdsHalf.value = treeRef.value.getHalfCheckedKeys().filter((id: any) => typeof id === 'number');
	} else {
		// 只返回叶子节点
		idsList[step.value - 1].value = treeRef.value.getCheckedKeys(true);
	}
};

// 全选取消全选
const checkAll = (all: boolean) => {
	if (!all) {
		treeRef.value.setCheckedKeys([]);
	} else {
		const ids = deepTree(treeDataList[step.value - 1].value, []);
		treeRef.value.setCheckedKeys(ids);
	}
};

const submit = async () => {
	stepChange();
	//  5_0 7_1 这种形式，_0代表半选 _1代表已选
	const data = {
		menuIds: setIds(menuIds.value).concat(setIds(menuIdsHalf.value, true)),
		buttonIds: setIds(buttonIds.value).concat(setIds(buttonIdsHalf.value, true)),
		columnIds: setIds(columnIds.value),
		apiIds: setIds(apiIds.value),
		roleId: roleId.value,
	};

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
