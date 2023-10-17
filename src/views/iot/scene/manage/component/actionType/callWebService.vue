<template>
  <el-form-item label="请求方式" prop="productKey" class="form-item" style="margin-left: 50px;">
    <el-select v-model="fromData.callWebService.method" filterable placeholder="请选择请求方式" @change="saveData">
      <el-option label="POST" value="POST" />
      <el-option label="GET" value="GET" />
    </el-select>
  </el-form-item>
  <el-form-item label="编码：" prop="executeAction" class="form-item">
    <el-select v-model="fromData.callWebService.encoding" filterable placeholder="请选择触发类型"  @change="saveData">
      <el-option label="UTF-8" value="UTF-8" />
      <el-option label="GBK" value="GBK" />
    </el-select>
  </el-form-item>
  <el-form-item label="服务地址：" prop="deviceKey" class="form-item">
    <el-input v-model="fromData.callWebService.url" placeholder="请输入服务地址：" @input="saveData" />
  </el-form-item>
  <el-form-item label="设置请求头：" prop="executeAction" class="form-item">
      <el-input v-model="fromData.callWebService.headers" type="textarea" @input="saveData" />
  </el-form-item>
  <el-form-item label="参数编写：" prop="executeAction" class="form-item" style="margin-left: 30px;">
      <el-input v-model="fromData.callWebService.parameter" type="textarea" @input="saveData" />
  </el-form-item>
</template>

<script lang="ts" setup>
import {  ref } from 'vue'
const emit = defineEmits(['SetSaveData']);

const props = defineProps({
  index:{
    type: Number,
    default: () => 0
  },
})
const fromData = ref({
  actionType: "callWebService",
  callWebService: {
    url: "",
    method: "",
    template: "",
    headers: "",
    encoding:"",
    parameter: "",
  }
})


const saveData = () => {
  let newdata={
    index:props.index,
    data:fromData.value,
  }
  emit('SetSaveData',newdata);

}


</script>
<style scoped lang="scss">
.form-item {
  flex: 0 0 25%;

}
</style>
