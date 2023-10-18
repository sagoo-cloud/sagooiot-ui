<template>
  <el-form-item label="自定义场景：" prop="executeAction" class="form-item">
    <el-select v-model="fromData.executeAction" filterable placeholder="请选择自定义场景" @change="saveData">
      <el-option v-for="item in sceneList" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
  </el-form-item>
</template>

<script lang="ts" setup>
import {ref,onMounted} from 'vue';
import api from '/@/api/scene';
const emit = defineEmits(['SetSaveData']);

const props = defineProps({
  index:{
    type: Number,
    default: () => 0
  },
  data: {
    type: Object,
    default: () => { }
  },
})
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
  let newdata={
    index:props.index,
    data:fromData.value,
  }
  emit('SetSaveData',newdata);
}
onMounted(() => {
    if (props.data && props.data.executeAction) {
      fromData.value.executeAction = { ...props.data.executeAction }
    }
});


</script>

