<template>
  
  <el-form-item label="延时执行：" prop="delayTime" class="form-item">
    <el-input v-model="fromData.delayTime" placeholder="请输入延时执行,单位秒" @input="saveData" />
  </el-form-item>
  
</template>

<script lang="ts" setup>
import {  ref } from 'vue'
const fromData = ref({
  actionType: "delayExecution",
  delayTime:''
})

const emit = defineEmits(['saveData']);

const saveData = () => {
  emit('saveData',fromData);

}


</script>
<style scoped lang="scss">
.form-item {
  flex: 0 0 25%;

}
</style>
