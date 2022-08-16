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
      <el-button :disabled="step <= 0" @click="step--">上一步</el-button>
      <el-button :disabled="step >= 3" @click="next">下一步</el-button>
      <el-button type="primary" :loading="btnLoading" :disabled="step < 3">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
    <el-steps :active="step" simple>
      <el-step name title="菜单权限" />
      <el-step title="按钮权限" />
      <el-step title="列表权限" />
      <el-step title="接口权限" />
    </el-steps>
    <div class="scroll-part mt-3">
      <el-tree ref="treeRef" :data="menuData" show-checkbox default-expand-all node-key="id" highlight-current :props="defaultProps" check-on-click-node :expand-on-click-node="false" />
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
const menuData = ref([]);
const menuIds = ref([]);

const typeList = ['menu', 'button', 'column', 'api'];
const defaultProps = {
	children: 'children',
	label: 'name',
};

const openDialog = async (row: any) => {
	title.value = '角色权限设置 - ' + row.name;
	isShowDialog.value = true;
	let res = await api.role.auth.getList(typeList[step.value]);
	console.log(res);
	menuData.value = res;
};
const cancel = () => {
	isShowDialog.value = false;
};
const next = async () => {
	if (step.value === 0) {
		const val = treeRef.value.getCheckedKeys(true);
		console.log(val);
		menuIds.value = val;
		let res = await api.role.auth.getList(typeList[step.value + 1], val);
		console.log(res);
	}
};

// openDialog({ name: '超级管理员' });

defineExpose({ openDialog });
</script>

<style scoped lang="scss">
.scroll-part {
	max-height: calc(100vh - 200px);
	overflow-x: hidden;
	overflow-y: auto;
}
</style>
