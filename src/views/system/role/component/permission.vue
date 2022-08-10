<template>
  <el-dialog title="角色权限设置" v-model="isShowDialog" width="1000px">
    角色权限设置
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from 'vue';
const isShowDialog = ref(false);

const openDialog = (row: any) => {
	console.log(row);
	isShowDialog.value = true;
};

defineExpose({ openDialog });
</script>

<style scoped lang="scss">
</style>
