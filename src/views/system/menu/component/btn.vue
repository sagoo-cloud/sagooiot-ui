<template>
  <el-drawer v-model="drawer" :title="title" direction="rtl" size="700px">
    <div class="p-3">
      <el-button size="default" type="success" class="ml10" @click="onAddRow">
        <el-icon>
          <ele-FolderAdd />
        </el-icon>
        新增
      </el-button>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '/@/api/system';

const title = ref('按钮权限');
const drawer = ref(false);

const open = async (row: any) => {
	console.log(row);
	title.value = '按钮权限 - ' + row.name;
	drawer.value = true;
	let res = await api.menu.btn.getList({ menuID: row.id, status: -1 });
	console.log(res);
};
const onAddRow = (row: any) => {
	console.log(row);
};

defineExpose({ open });
</script>
