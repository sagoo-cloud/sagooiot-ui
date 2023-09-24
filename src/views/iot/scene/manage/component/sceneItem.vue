<template>
  <div class="type-item">
    <div v-for="(item, index) in sceneList" :key="index" class="item " :class="index > 0 ? 'biankang' : ''">
      <div class="conicon" style="width: 100%; text-align: right; position: relative; right: -8px; top: -8px; color: red"
        v-if="index > 0">
        <el-icon @click="delScene(index)">
          <CircleClose />
        </el-icon>
      </div>
      <div class="font16">场景定义</div>
      <div class="title flex">
        <div class="icon"></div>触发规则
      </div>
      <div class="product flex flex-warp">

        <el-form-item label="产品：" prop="product_key">
          <el-select v-model="item.product_key" filterable placeholder="请选择产品">
            <el-option v-for="it in sourceData" :key="it.key" :label="it.name" :value="it.key">
              <span style="float: left">{{ it.name }}</span>
              <span style="float: right; font-size: 13px">{{ it.key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备：" prop="device_key">
          <el-select v-model="item.device_key" filterable placeholder="请选择设备">
            <el-option v-for="it in sourceData" :key="it.key" :label="it.name" :value="it.key">
              <span style="float: left">{{ it.name }}</span>
              <span style="float: right; font-size: 13px">{{ it.key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="触发类型：" prop="type">
          <el-select v-model="item.type" filterable placeholder="请选择触发类型">
            <el-option v-for="it in sourceData" :key="it.key" :label="it.name" :value="it.key">
              <span style="float: left">{{ it.name }}</span>
              <span style="float: right; font-size: 13px">{{ it.key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定时请求">
          <div style="display:flex">
            <el-input v-model="item.cronExpression" placeholder="请输入cron表达式" />
            <el-dialog v-model="dialogVisible" title="选择Cron规则" width="60%">
              <vue3cron @handlelisten="handlelisten" :type="index" @close="cronclose"></vue3cron>
            </el-dialog>
            <el-button type="success"  @click="showCron()" style="margin-left: 5px;">设置</el-button>

          </div>
        </el-form-item>
        <el-form-item label="属性：" prop="type">
          <el-select v-model="item.type" filterable placeholder="请选择触发类型">
            <el-option v-for="it in sourceData" :key="it.key" :label="it.name" :value="it.key">
              <span style="float: left">{{ it.name }}</span>
              <span style="float: right; font-size: 13px">{{ it.key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="title flex">
        <div class="icon"></div>触发条件 <div class="ml10"> <el-switch v-model="item.where" />
        </div>
      </div>
        <Condition :condition="item.condition" :operate_index="index"  v-if="item.where"></Condition>
    </div>
    <div>
      <div class="edit">
        <el-button type="primary" :icon="DocumentAdd" @click="addScene()">新增场景定义</el-button>
      </div>
    </div>




 
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref,unref  } from 'vue'
import { DocumentAdd, CircleClose, Right } from '@element-plus/icons-vue';
import vue3cron from '/@/components/vue3cron/vue3cron.vue';

import Condition from './condition.vue';

const dialogVisible=ref();

interface IConditionItem {
  param?: string;
  operator?: string;
  value?: string;
}

interface IValueType {
  type?: string;
  product_key?: string;
  device_key?: string;
  where?: string;
  cronExpression?: string;
  condition?: {
    list?: IConditionItem[] ;
  }[];
}



interface testIValueType {
  key: string;
  name?: string;

}

const props = defineProps({

  sceneList: {
    type: Array as PropType<IValueType[]>,
    default: () => []
  },
  sourceData: {
    type: Array as PropType<testIValueType[]>,
    default: () => [{
      'key': 'test',
      'name': '测试',
    }, {
      'key': 'test',
      'name': '测试',
    }, {
      'key': 'test',
      'name': '测试',
    }, {
      'key': 'test',
      'name': '测试',
    }, {
      'key': 'test',
      'name': '测试',
    }]
  }
})


const addScene = () => {
  props.sceneList.push({
    'product_key': '',
    'device_key': '',
    'type': '',
    'condition':[{
								'list': [{
											'param': '',
											'operator': '',
											'value': ''
										}]
							}]
  });
  console.log(props.sceneList);
};
const delScene = (index: number) => {
  props.sceneList.splice(index, 1);
}
const setNull = (row: any, key: string, val: string) => {
  if (!val) row[key] = null
}
const handlelisten = (e: any) => {
  props.sceneList[e.type].cronExpression=e.cron;
 
};
const showCron = () => {
  dialogVisible.value = true;

};
const cronclose = () => {
  dialogVisible.value = false;
}
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
    padding: 20px;
    background-color: #f2f3f5;
    margin-top: 20px;

  }

  .biankang {

    border: 1px dashed;
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

    .el-form-item {
      margin-left: 30px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }

}
</style>

