<template>
  <el-form-item label="自定义场景：" prop="executeAction" class="form-item">
    <el-select v-model="fromData.executeAction" filterable placeholder="请选择自定义场景" @change="getTemplist">
      <el-option v-for="item in sceneList" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
  </el-form-item>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import api from '/@/api/scene';

const fromData = ref({
  actionType: "triggerCustomEvent",
  executeAction:''
})
interface testIValueType {
  id?: string;
  key?: string;
  name?: string;
}

const sceneList=ref(<testIValueType[]>[]);

const getsceneList=()=>{
  let param={
					pageNum: 1,
					pageSize: 50,
					sceneType: 'manual',
		};
    api.manage.getList(param).then((res: any) => {
      sceneList.value=res.Data;
    });
}
getsceneList();

const saveData = () => {
  console.log(fromData);
}
saveData();
</script>

