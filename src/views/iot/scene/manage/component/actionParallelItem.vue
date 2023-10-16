
<template>
  <div class="type-item">
    <div v-for="(item, index) in parallellist" :key="index" class="item " :class="index > 0 ? 'biankang' : ''">
      <div class="conicon" style="width: 100%; text-align: right; position: relative; right: -8px; top: -8px; color: red"
        v-if="index > 0">
        <el-icon @click="delScene(index)">
          <CircleClose />
        </el-icon>
      </div>
      <div class="product flex flex-warp">

        <el-form-item label="动作类型：" prop="product_key">
          <el-select v-model="item.product_key" filterable placeholder="请选择产品">
            <el-option v-for="it in sourceActionTypeData" :key="it.key" :label="it.name" :value="it.key">
              <span style="float: left">{{ it.name }}</span>
              <span style="float: right; font-size: 13px">{{ it.key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型：" prop="device_key">
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

        <el-form-item label="属性：" prop="type">
          <el-select v-model="item.type" filterable placeholder="请选择触发类型">
            <el-option v-for="it in sourceData" :key="it.key" :label="it.name" :value="it.key">
              <span style="float: left">{{ it.name }}</span>
              <span style="float: right; font-size: 13px">{{ it.key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </div>


    </div>
    <div>
      <div class=" flex-center">
        <el-button :icon="DocumentAdd" @click="addScene()" style="border: 1px solid #409eff;color: #409eff;">新增并行动作</el-button>
      </div>
    </div>





  </div>
</template>

<script lang="ts" setup>
import { PropType, ref  } from 'vue'
import { DocumentAdd, CircleClose } from '@element-plus/icons-vue';



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

  parallellist: {
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
  },

})


const addScene = () => {
  props.parallellist.push({
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
};
const delScene = (index: number) => {
  props.parallellist.splice(index, 1);
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

    border: 1px dashed #959596;;
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
