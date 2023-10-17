<template>
  
  <el-form-item label="告警级别：" prop="delayTime" class="form-item ml20">
    <el-input v-model="fromData.delayTime" placeholder="请输入告警级别" @input="saveData" class="w100 " />
  </el-form-item>
  <el-form-item label="告警信息：" prop="delayTime" class="form-item ml20">
    <el-input v-model="fromData.delayTime" placeholder="请输入告警信息" @input="saveData" class="w100 " />
  </el-form-item>
</template>

<script lang="ts" setup>
import {  ref } from 'vue'
const fromData = ref({
  actionType: "triggerAlarm",
  alarm:{
    alarmLevel:'',
    info:'',
  }
})


const saveData = () => {
  console.log(fromData);
}
saveData();


</script>
<style scoped lang="scss">
.form-item {
  flex: 0 0 25%;

}
</style>
