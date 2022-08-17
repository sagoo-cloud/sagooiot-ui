<template>
  <el-dialog :title="title" custom-class="full-dialog" v-model="isShowDialog" width="1100px" fullscreen>
    <div class="mb-4 tr">
      <el-dropdown>
        <el-button plain class="mr-3">
          操作<el-icon>
            <ele-ArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>全部勾选</el-dropdown-item>
            <el-dropdown-item>取消全选</el-dropdown-item>
            <el-dropdown-item>展开所有</el-dropdown-item>
            <el-dropdown-item>折叠所有</el-dropdown-item>
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
      <el-tree ref="treeRef" :data="treeData" show-checkbox default-expand-all node-key="id" highlight-current :props="defaultProps" check-on-click-node :expand-on-click-node="false" @check-change="checkChange" />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '/@/api/system';
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
const idsList = [menuIds, buttonIds, columnIds, apiIds];
const treeDataList = [menuData, buttonData, listData, apiData];
const defaultProps = {
	children: 'children',
	label: 'name',
};

const openDialog = async (row: any) => {
	title.value = '角色权限设置 - ' + row.name;
	roleId.value = row.id;
	isShowDialog.value = true;
	let res = await api.role.auth.getList(typeList[step.value]);
	// console.log(res);
	treeData.value = res;
	menuData.value = res;
};
const cancel = () => {
	isShowDialog.value = false;
};

const prev = async () => {
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
	const nextStep = step.value + 1;
	let res = await api.role.auth.getList(typeList[nextStep], menuIds.value);
	// console.log(res);
	treeData.value = res;
	treeDataList[nextStep].value = res;
	treeRef.value.setCheckedKeys(idsList[nextStep].value);

	step.value = nextStep;
};

const checkChange = () => {
	idsList[step.value].value = treeRef.value.getCheckedKeys(step.value === 0 ? false : true);
};
const submit = async () => {
	const data = {
		menuIds: menuIds.value,
		buttonIds: buttonIds.value,
		columnIds: columnIds.value,
		apiIds: apiIds.value,
		roleId: roleId.value,
	};
	console.log(data);
};

openDialog({ name: '超级管理员', id: 3 });

defineExpose({ openDialog });
</script>

<style scoped lang="scss">
.scroll-part {
	max-height: calc(100vh - 200px);
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
