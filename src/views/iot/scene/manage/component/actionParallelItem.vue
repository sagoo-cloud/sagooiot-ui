
<template>
  <div class="type-item">
    <div v-for="(item, index) in parallel" :key="index" class="item " :class="index > 0 ? 'biankang' : ''">
      <div class="conicon" style="width: 100%; text-align: right; position: relative; right: -8px; top: -8px; color: red"
        v-if="index > 0">
        <el-icon @click="delScene(index)">
          <CircleClose />
        </el-icon>
      </div>
      <div class="product flex flex-warp">
        <el-form-item label="动作类型：" prop="actionType">
          <el-select v-model="item.actionType" filterable clearable placeholder="请选择动作类型" @change="saveData">
            <el-option v-for="it in sence_action_type" :key="it.value" :label="it.label" :value="it.value">
              <span style="float: left">{{ it.label }}</span>
              <span style="float: right; font-size: 13px">{{ it.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <DeviceOut :index="index" :data="parallel[index]" :sourceData="sourceData" v-if="item.actionType==='deviceOutput' && parallel[index] && sourceData.length>0" @SetSaveData="SetSaveData"></DeviceOut>
        <SendNotice  :index="index" :data="parallel[index]" v-if="item.actionType==='sendNotice'  && parallel[index]"  @SetSaveData="SetSaveData"></SendNotice>
        <CallWebService :index="index" :data="parallel[index]"  v-if="item.actionType==='callWebService'  && parallel[index]"  @SetSaveData="SetSaveData"></CallWebService>
        <TriggerAlarm :index="index" :data="parallel[index]"  v-if="item.actionType==='triggerAlarm'  && parallel[index]"  @SetSaveData="SetSaveData"></TriggerAlarm>
        <DelayExecution  :index="index" :data="parallel[index]" v-if="item.actionType==='delayExecution'  && parallel[index]"  @SetSaveData="SetSaveData"></DelayExecution>
        <TriggerCustomEvent :index="index" :data="parallel[index]"  v-if="item.actionType==='triggerCustomEvent'  && parallel[index]"  @SetSaveData="SetSaveData"></TriggerCustomEvent>
      </div>
    </div>
    <div>
      <div class=" flex-center">
        <el-button :icon="DocumentAdd" @click="addScene()"
          style="border: 1px solid #409eff;color: #409eff;">新增串行动作</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch, getCurrentInstance  } from 'vue'
import { DocumentAdd, CircleClose } from '@element-plus/icons-vue';
import DeviceOut from './actionType/deviceOut.vue';
import SendNotice from './actionType/sendNotice.vue';
import CallWebService from './actionType/callWebService.vue';
import TriggerAlarm from './actionType/triggerAlarm.vue';
import DelayExecution from './actionType/delayExecution.vue';
import TriggerCustomEvent from './actionType/triggerCustomEvent.vue';
const emit = defineEmits(['addScenesDetail', 'delData', 'saveData']);

const { proxy } = getCurrentInstance() as any;
const { sence_action_type } = proxy.useDict('sence_action_type');

interface IValueType {
  actionType?:string;
}
interface testIValueType {
  key?: string;
  name?: string;
}

const props = defineProps({

  parallel: {
    type: Array as PropType<IValueType[]>,
    default: () => []
  },
  sourceData: {
    type: Array as PropType<testIValueType[]>,
    default: () => []
  },
  index: {
    type: Number ,
    default: () => []
  }
})
const parallelValue = ref(props.parallel);

const saveData=()=>{
  let newData={
    index:props.index,
    data:props.parallel,
  }
  emit('saveData',newData);
}
watch(() => props.parallel, (newSerial) => {
  parallelValue.value = newSerial;
});




const SetSaveData = (data:any) => {
  parallelValue.value[data.index] = data.data;
  let newData={
    index:props.index,
    data:parallelValue.value,
  }
  emit('saveData', newData);
}
const addScene = () => {
  props.parallel.push({
    'actionType': '',
  });
};
const delScene = (index: number) => {
  props.parallel.splice(index, 1);
  let newData={
    index:props.index,
    data:props.parallel,
  }
  emit('saveData',newData);
}



</script>
<style scoped lang="scss">
.type-item {
  width: 100%;

  .edit {
    margin-left: 10px;
    color: #2041d4;
  }

  .conicon {
    width: 55px;
    height: 25px;
    font-size: 28px;
    line-height: 28px;
    cursor: pointer;
  }

  .item {
    margin-bottom: 20px;

  }

  .biankang {

    border-top: 1px solid #d6d6d6;
    // border-radius: 10px;
  }


  .title {
    height: 40px;

    .icon {
      margin-left: 2px;
      margin-right: 10px;
      width: 5px;
      height: 20px;
      background-color: #315efb;
    }
  }

  .product {
    margin-bottom: 20px;

    .el-form-item {
      margin-left: 30px;
      margin-bottom: 10px;
    }
  }

}
</style>

