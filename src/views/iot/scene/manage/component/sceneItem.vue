<template>
  <div class="type-item">
    <div v-for="(item, index) in sceneList" :key="index" class="item " :class="index > 0 ? 'biankang' : ''">
      <div class="conicon" style="width: 100%; text-align: right; position: relative; right: -8px; top: -8px; color: red" v-if="index > 0">
        <el-icon @click="delScene(index)">
          <CircleClose />
        </el-icon>
      </div>
      <div class="title flex">
        <div class="icon"></div>触发规则
      </div>
      <div class="product flex flex-warp">
        <el-form-item label="产品：" prop="productKey">
          <el-select v-model="item.productKey" filterable clearable placeholder="请选择产品" @change="seletChange(index, item.productKey!)">
            <el-option v-for="it in sourceData" :key="it.key" :label="it.name" :value="it.key">
              <span style="float: left">{{ it.name }}</span>
              <span style="float: right; font-size: 13px">{{ it.key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备：" prop="deviceKey">
          <el-select v-model="item.deviceKey" filterable clearable placeholder="请选择设备" @change="EditPen(index)">
            <el-option v-for="it in deviceListData" :key="it.key" :label="it.name" :value="it.key">
              <span style="float: left">{{ it.name }}</span>
              <span style="float: right; margin-left: 8px;font-size: 13px">{{ it.key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="触发类型：" prop="triggerType">
          <el-select v-model="item.triggerType" clearable filterable placeholder="请选择触发类型" @change="getSelectcolumns(index, item.triggerType!)">
            <el-option v-for="it in sence_source_type" :key="it.value" :label="it.label" :value="it.value">
              <span style="float: left">{{ it.label }}</span>
              <span style="float: right; font-size: 13px">{{ it.value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定时请求" v-if="item.triggerType && ['readAttribute', 'functionCall'].includes(item.triggerType)">
          <div style="display:flex">
            <el-input v-model="item.timer" placeholder="请输入cron表达式" />
            <el-dialog v-model="dialogVisible" title="选择Cron规则" width="60%">
              <vue3cron @handlelisten="handlelisten" :type="index" @close="cronclose"></vue3cron>
            </el-dialog>
            <el-button type="success" @click="showCron()" style="margin-left: 5px;">设置</el-button>

          </div>
        </el-form-item>
      </div>
      <div class="title flex">
        <div class="icon"></div> 触发条件 <div class="ml10"> <el-switch v-model="item.triggerSwitch" @change="EditPen(index)" />
        </div>
      </div>
      <Condition :condition="item.condition" :operate_index="index" :columnList="columnList" v-if="item.triggerSwitch && columnList.length > 0" @EditPen="EditPen">
      </Condition>
    </div>
    <div>
      <div class="edit">
        <el-button type="primary" :icon="DocumentAdd" @click="addScene()">新增场景定义</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, unref, reactive, getCurrentInstance } from 'vue'
import { DocumentAdd, CircleClose, Right } from '@element-plus/icons-vue';
import vue3cron from '/@/components/vue3cron/vue3cron.vue';
import api from '/@/api/scene';
import product from '/@/api/device';
import datahub from '/@/api/datahub';

import Condition from './condition.vue';
const { proxy } = getCurrentInstance() as any;
const scene_type = proxy.useDict('scene_type');

const { sence_source_type } = proxy.useDict('sence_source_type');

const emit = defineEmits(['addScenesDetail', 'delScenesDetail', 'editScenesDetail']);
const dialogVisible = ref();
const deviceListData = ref<testIValueType[]>([]);
const functionCallList = ref<testIValueType[]>([]);
const propertyCallList = ref<testIValueType[]>([]);
const columnList = ref([]);
let product_key = "";
interface IConditionItem {
  parameter?: string;
  operator?: string;
  value?: string;
}
interface IValueType {
  triggerType?: string;
  productKey?: string;
  deviceKey?: string;
  triggerSwitch?: boolean;
  timer?: string;
  condition?: IConditionItem[][]; // 更新这里的类型定义
}
interface testIValueType {
  id: string;
  key: string;
  name?: string;
}
const props = defineProps({
  sceneList: {
    type: Array as PropType<IValueType[]>,
    default: () => [],
  },
  sceneType: {
    type: String,
    default: () => '',
  },
  sourceData: {
    type: Array as PropType<testIValueType[]>,
    default: () => []
  },
})

const seletChange = (index: number, val: string) => {
  product_key = val;
  //根据产品key获取产品ID
  let info = props.sourceData?.find((pro: { key: any; }) => pro.key === val);

  if (info) {
    // 重置 deviceKey 的值
    props.sceneList[index].deviceKey = '';
    // 重置当前项的 condition 值
    props.sceneList[index].condition = [[{
      'parameter': '',
      'operator': '',
      'value': ''
    }]];
    getDeviceList(info.id)
  }
  EditPen(index);
}
const getDeviceList = (_id: any) => {
  product.device.allList({ productId: _id }).then((res: any) => {
    deviceListData.value = res.device
  })
}
const getSelectcolumns = (index: number, val: string) => {
  EditPen(index);
  getcolumns(index, val);
  // 重置当前项的 condition 值
  props.sceneList[index].condition = [[{
    'parameter': '',
    'operator': '',
    'value': ''
  }]];

}
//获取类型数据
const getAction = (val: string) => {
  switch (val) {
    case 'functionCall':
      product.tabDeviceFucntion.getList({ key: product_key }).then((res: any) => {
        functionCallList.value = res
      })
      break;
    case 'readAttribute':
      datahub.node.getpropertyList({ key: product_key }).then((re: any) => {
        propertyCallList.value = re;
      });

      break;
    case 'modifyAttribute':
      datahub.node.getpropertyList({ key: product_key }).then((re: any) => {
        propertyCallList.value = re;
      });
      break;
  }
}

const getcolumns = (index: number, val: string) => {
  let where = {
    "sceneType": props.sceneType, //场景类型
    "typeName": scene_type[props.sceneType],
    "device": {
      "operation": {
        "operator": val
      },
      "productKey": product_key,
      "selector": "all"
    }
  }
  getcolumnsList(where);
}
const getcolumnsList = (where: any) => {
  api.manage.getColumns(where).then((res: any) => {
    if (res) {
      columnList.value = res;
    }
  })
}
const addScene = () => {
  props.sceneList.push({
    'productKey': '',
    'deviceKey': '',
    'triggerType': '',
    'timer': '',
    'triggerSwitch': false,
    'condition': [[{
      'parameter': '',
      'operator': '',
      'value': ''

    }]]
  });
  emit('addScenesDetail', 'definition');
};

const EditPen = (index: number) => {
  emit('editScenesDetail', index);
}
const delScene = (index: number) => {
  emit('delScenesDetail', index);
  props.sceneList.splice(index, 1);
}
const setNull = (row: any, key: string, val: string) => {
  if (!val) row[key] = null
}
const handlelisten = (e: any) => {
  props.sceneList[e.type].timer = e.cron;
  EditPen(e.type);
};
const showCron = () => {
  dialogVisible.value = true;
};
const cronclose = () => {
  dialogVisible.value = false;
}
//初始化
const intScenel = () => {
  let array_data = props.sceneList;
  array_data.map((val: any, index) => {
    if (val.productKey) {
      product_key = val.productKey;
      let info = props.sourceData?.find((pro: { key: any; }) => pro.key === val.productKey);

      if (info) {
        getDeviceList(info.id)
      }
    }
    if (val.triggerType) {
      getcolumns(index, val.triggerType)
    }
  });
}
intScenel();
</script>
<style scoped lang="scss">
.type-item {
  margin-top: 15px;

  .edit {
    margin-top: 15px;
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
    padding: 10px;
  }

  .biankang {
    border: 1px solid #e8e2e2;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
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
    .el-form-item {
      margin-left: 30px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }
}
</style>

