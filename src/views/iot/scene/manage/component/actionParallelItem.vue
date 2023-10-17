
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
          <el-select v-model="item.actionType" filterable placeholder="请选择动作类型" @change="saveData">
            <el-option v-for="it in sourceActionTypeData" :key="it.key" :label="it.name" :value="it.key">
              <span style="float: left">{{ it.name }}</span>
              <span style="float: right; font-size: 13px">{{ it.key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <DeviceOut :index="index" :sourceData="sourceData" v-if="item.actionType==='deviceOutput'" @SetSaveData="SetSaveData"></DeviceOut>
        <SendNotice  :index="index" v-if="item.actionType==='sendNotice'"  @SetSaveData="SetSaveData"></SendNotice>
        <CallWebService :index="index"  v-if="item.actionType==='callWebService'"  @SetSaveData="SetSaveData"></CallWebService>
        <TriggerAlarm :index="index"  v-if="item.actionType==='triggerAlarm'"  @saveData="saveData"></TriggerAlarm>
        <DelayExecution  :index="index" v-if="item.actionType==='delayExecution'"  @saveData="saveData"></DelayExecution>
        <TriggerCustomEvent :index="index"  v-if="item.actionType==='triggerCustomEvent'"  @saveData="saveData"></TriggerCustomEvent>
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
import { PropType, ref,watch  } from 'vue'
import { DocumentAdd, CircleClose } from '@element-plus/icons-vue';
import DeviceOut from './actionType/deviceOut.vue';
import SendNotice from './actionType/sendNotice.vue';
import CallWebService from './actionType/callWebService.vue';
import TriggerAlarm from './actionType/triggerAlarm.vue';
import DelayExecution from './actionType/delayExecution.vue';
import TriggerCustomEvent from './actionType/triggerCustomEvent.vue';
const deviceListData = ref<testIValueType[]>([]);
const emit = defineEmits(['addScenesDetail','delScenesDetail','saveData']);

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
  sourceActionTypeData: {
    type: Array as PropType<testIValueType[]>,
    default: () => [{
      'key': 'deviceOutput',
      'name': '设备输出',
    }, {
      'key': 'sendNotice',
      'name': '发送通知',
    }, {
      'key': 'callWebService',
      'name': '调用WEB服务',
    }, {
      'key': "triggerAlarm",
      'name': '触发告警',
    }, {
      'key': 'delayExecution',
      'name': '延迟执行',
    }, {
      'key': 'triggerCustomEvent',
      'name': '触发场景自定义事件',
    }]
  }
})
const serialValue = ref(props.parallel);

const saveData=()=>{
  emit('saveData',props.parallel);
}
watch(() => props.parallel, (newSerial) => {
  serialValue.value = newSerial;
});




const SetSaveData = (data:any) => {
  serialValue.value[data.index] = data.data;
  emit('saveData', serialValue.value);
}
const addScene = () => {
  props.parallel.push({
    'actionType': '',
  });
};
const delScene = (index: number) => {
  props.parallel.splice(index, 1);
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

    border: 1px solid #d6d6d6;
    border-radius: 10px;
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

