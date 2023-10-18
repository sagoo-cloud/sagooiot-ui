<template>
  
  <el-form-item label="延时执行：" prop="delayTime" class="form-item">
    <el-input v-model="fromData.delayTime" placeholder="请输入延时执行,单位秒" @input="saveData" />
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
  actionType: "delayExecution",
  delayTime:''
})



const saveData = () => {
  let newdata={
    index:props.index,
    data:fromData.value,
  }
  emit('SetSaveData',newdata);
}

onMounted(() => {
    if (props.data && props.data.delayTime) {
      fromData.value.delayTime = { ...props.data.delayTime }
    }
});

</script>
<style scoped lang="scss">
.form-item {
  flex: 0 0 25%;

}
</style>
