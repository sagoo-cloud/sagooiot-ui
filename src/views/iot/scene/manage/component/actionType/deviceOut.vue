<template>
  <el-form-item label="产品：" prop="productKey" class="form-item">
    <el-select v-model="fromData.productKey" filterable clearable placeholder="请选择产品" @change="seletChange">
      <el-option v-for="it in sourceData" :key="it.key" :label="it.name" :value="it.key">
        <span style="float: left">{{ it.name }}</span>
        <span style="float: right; font-size: 13px">{{ it.key }}</span>
      </el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="设备：" prop="deviceKey" class="form-item">
    <el-select v-model="fromData.deviceKey" filterable clearable placeholder="请选择设备" @change="saveData">
      <el-option label="全部" value="all">全部</el-option>

      <el-option v-for="it in deviceListData" :key="it.key" :label="it.name" :value="it.key">
        <span style="float: left">{{ it.name }}</span>
        <span style="float: right; font-size: 13px">{{ it.key }}</span>
      </el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="触发类型：" prop="executeAction" class="form-item">
    <el-select v-model="fromData.executeAction" filterable placeholder="请选择触发类型" @change="selectAction">
      <el-option v-for="it in sourceActionTypeData" :key="it.key" :label="it.name" :value="it.key">
        <span style="float: left">{{ it.name }}</span>
        <span style="float: right; font-size: 13px">{{ it.key }}</span>
      </el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="功能调用" prop="type" class="form-item" v-if="fromData.executeAction == 'functionCall'">
    <el-select v-model="fromData.functionCall.functionName" filterable placeholder="请选择功能调用" @change="saveData">
      <el-option v-for="it in functionCallList" :key="it.key" :label="it.name" :value="it.key">
        <span style="float: left">{{ it.name }}</span>
        <span style="float: right; font-size: 13px">{{ it.key }}</span>
      </el-option>
    </el-select>
  </el-form-item>


  <el-form-item label="参数" prop="type" class="form-item" v-if="fromData.executeAction == 'functionCall'">
    <el-input v-model="fromData.functionCall.parameter" placeholder="请输入参数" @input="saveData" />
  </el-form-item>



  <el-form-item label="读取属性" prop="type" class="form-item" v-if="fromData.executeAction == 'getProperties'">
    <el-select v-model="fromData.getProperties" filterable multiple placeholder="请选择读取属性" @change="saveData">
      <el-option v-for="it in propertyCallList" :key="it.key" :label="it.name" :value="it.key">
        <span style="float: left">{{ it.name }}</span>
        <span style="float: right; font-size: 13px">{{ it.key }}</span>
      </el-option>
    </el-select>
  </el-form-item>

  <el-form-item label="设置属性" prop="type" class="form-item" v-if="fromData.executeAction == 'setProperties'">
    <el-select v-model="fromData.setProperties_temp" filterable multiple placeholder="请选择设置属性" @change="setProperties">
      <el-option v-for="it in propertyCallList" :key="it.key" :label="it.name" :value="it.key">
        <span style="float: left">{{ it.name }}</span>
        <span style="float: right; font-size: 13px">{{ it.key }}</span>
      </el-option>
    </el-select>
  </el-form-item>
  <div class="form-item" v-if="fromData.executeAction == 'setProperties'">
    <el-table :data="setPropertiesItem">
      <el-table-column>
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="{ row }">
          <el-input v-model="row.value" @input="saveSetData"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref,onMounted } from 'vue'
import product from '/@/api/device';
import datahub from '/@/api/datahub';
const emit = defineEmits(['SetSaveData']);

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
  index: {
    type: Number,
    default: () => 0
  },
  data: {
    type: Object,
    default: () => { }
  },
  sourceActionTypeData: {
    type: Array as PropType<testIValueType[]>,
    default: () => [{
      'key': 'functionCall',
      'name': '功能调用',
    }, {
      'key': 'getProperties',
      'name': '获取属性',
    }, {
      'key': 'setProperties',
      'name': '设置属性',
    }]
  },
})
const deviceListData = ref<testIValueType[]>([]);
const functionCallList = ref<testIValueType[]>([]);
const propertyCallList = ref<testIValueType[]>([]);
const productKey = ref();
const setPropertiesItem = ref([]);
const fromData = ref({
  actionType: "deviceOutput",
  productKey: "",
  deviceKey: "",
  executeAction: "",
  functionCall: {
    functionName: "",
    parameter: ""
  },
  getProperties: {},
  setProperties: [],
  setProperties_temp: [],
})

const selectAction=(val:string)=>{
  saveData();
  getAction(val);
}
//获取类型数据
const getAction = (val: string) => {
  switch (val) {
    case 'functionCall':
      product.tabDeviceFucntion.getList({ key: productKey.value }).then((res: any) => {
        functionCallList.value = res
      })
      break;
    case 'getProperties':
      datahub.node.getpropertyList({ key: productKey.value }).then((re: any) => {
        propertyCallList.value = re;
      });

      break;
    case 'setProperties':
      datahub.node.getpropertyList({ key: productKey.value }).then((re: any) => {
        propertyCallList.value = re;
      });
      break;
  }
}

const saveSetData = () => {
  fromData.value.setProperties = setPropertiesItem.value;
  saveData();

}
const setProperties = (val: any) => {
  setPropertiesItem.value = val.map((item: string) => {
    return {
      name: item,
      value: ''
    };
  });

  fromData.value.setProperties = setPropertiesItem.value;
  saveData();
}

const saveData = () => {
  let newdata = {
    index: props.index,
    data: fromData.value,
  }
  emit('SetSaveData', newdata);
}

const getDeviceList = (_id: any) => {
  product.device.allList({ productId: _id }).then((res: any) => {
    deviceListData.value = res.device
  })
}
const seletChange = (val: string) => {
  productKey.value = val;
  //根据产品key获取产品ID
  let info = props.sourceData?.find((pro: testIValueType) => pro.key === val);
  if (info) {
    // 重置 deviceKey 的值
    fromData.value.deviceKey = '';
    getDeviceList(info.id)
  }
  saveData();
}

onMounted(() => {
    let infoc = props.data;
    if (infoc.productKey) {
    productKey.value = infoc.productKey;
    let info = props.sourceData?.find((pro: testIValueType) => pro.key === infoc.productKey);
    if (info) {
       getDeviceList(info.id)
    }
  }

    getAction(infoc.executeAction);
    if (props.data && props.data.setProperties) {
      setPropertiesItem.value =props.data.setProperties
    }

    fromData.value = infoc as typeof fromData.value;

    if (props.data && props.data.functionCall) {
      fromData.value.functionCall = props.data.functionCall;
    } else {
      fromData.value.functionCall = {
        functionName: "",
        parameter: ""
      };
}
    
});



</script>
<style scoped lang="scss">
.form-item {
  flex: 0 0 25%;
}
</style>
