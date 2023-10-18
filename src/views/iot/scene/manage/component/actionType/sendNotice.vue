<template>
  <el-form-item label="通知方式" prop="productKey" class="form-item" style="margin-left: 50px;">
    <el-select v-model="fromData.notice.types" filterable placeholder="请选择通知方式" @change="seletChange">
      <el-option v-for="item in notice_send_gateway" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </el-form-item>

  <el-form-item label="通知配置：" prop="name" class="form-item">
    <el-select v-model="fromData.notice.name" filterable placeholder="请选择通知配置" @change="getTemplist">
      <el-option v-for="item in sendGatewayData" :key="item.id" :label="item.title" :value="item.id" />
    </el-select>
  </el-form-item>

  <el-form-item label="通知模板：" prop="executeAction" class="form-item">
    <el-select v-model="fromData.notice.template" filterable placeholder="请选择触发类型">
      <el-option v-for="item in noticeConfigData" :key="item.id" :label="item.title" :value="item.id" />
    </el-select>
  </el-form-item>


  <div class="form-item" v-for="(ph, phindex) in fromData.notice.object_temp" :key="phindex">
    <el-input v-model="ph.info" placeholder="请输入接收人信息" style="width: 320px" @input="saveData" />
    <el-icon style="width: 32px; height: 32px; font-size: 24px" v-if="phindex == 0" @click="AddPhone(index)">
      <CirclePlus />
    </el-icon>
    <el-icon style="width: 32px; height: 32px; font-size: 24px" v-if="phindex > 0" @click="DelPhone( phindex)">
      <Remove />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, getCurrentInstance,onMounted } from 'vue'
import notice from '/@/api/notice';
import { CirclePlus, Remove } from '@element-plus/icons-vue';
const emit = defineEmits(['SetSaveData']);

const { proxy } = getCurrentInstance() as any;
const { notice_send_gateway } = proxy.useDict('notice_send_gateway');
const sendGatewayData = ref([]);
const noticeConfigData = ref([]);
interface testIValueType {
  id?: string;
  key?: string;
  name?: string;
}
const props = defineProps({
  sourceData: {
    type: Array as PropType<testIValueType[]>,
    default: () => []
  },
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
  actionType: "sendNotice",
  notice: {
    types: "",
    name: "",
    template: "",
    object: {},
    object_temp: [{
      info:'',
    }]
  }
})

const AddPhone = () => {
  fromData.value.notice.object_temp.push({
    info:'',
  });
};

const DelPhone = (index: number) => {
  fromData.value.notice.object_temp.splice(index, 1);
};
const seletChange = (val: string) => {
  notice.config.getList({ sendGateway: val }).then((res: any) => {
    sendGatewayData.value = res.Data;
  });
}

const getTemplist = (val: number) => {
  notice.template.configIddetail(val).then((res: any) => {
    noticeConfigData.value = [res];
  });
}

const saveData = () => {
  const result = fromData.value.notice.object_temp.map(item => item.info);
  fromData.value.notice.object = result;

  SetSaveData();
}
const SetSaveData = () => {
  let newdata={
    index:props.index,
    data:fromData.value,
  }
  emit('SetSaveData',newdata);
}

onMounted(() => {
    if (props.data && props.data.notice) {
      fromData.value.notice = { ...props.data.notice }
      let infoc = props.data;
      seletChange(infoc.notice.types);
      getTemplist(infoc.notice.name);
    }
});
</script>
<style scoped lang="scss">
.form-item {
  flex: 0 0 25%;

}
</style>
