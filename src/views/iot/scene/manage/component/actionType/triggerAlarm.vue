<template>
  
  <el-form-item label="告警级别：" prop="alarmLevel" class="form-item ml20">
    <el-input v-model="fromData.alarm.alarmLevel" placeholder="请输入告警级别" @input="saveData" class="w100 " />
  </el-form-item>
  <el-form-item label="告警信息：" prop="info" class="form-item ml20">
    <el-input v-model="fromData.alarm.info" placeholder="请输入告警信息" @input="saveData" class="w100 " />
  </el-form-item>
</template>

<script lang="ts" setup>
import {  ref,onMounted } from 'vue'

const emit = defineEmits(['SetSaveData']);

const props = defineProps({
  data: {
    type: Object,
    default: () => { }
  },
  index:{
    type: Number,
    default: () => 0
  },
})
const fromData = ref({
  actionType: "triggerAlarm",
  alarm:{
    alarmLevel:'',
    info:'',
  }
})


const saveData = () => {
  let newdata={
    index:props.index,
    data:fromData.value,
  }
  emit('SetSaveData',newdata);
}
onMounted(() => {
  if (props.data && props.data.alarm) {
    fromData.value.alarm = { ...props.data.alarm }
  }
});
</script>
<style scoped lang="scss">
.form-item {
  flex: 0 0 25%;

}
</style>
