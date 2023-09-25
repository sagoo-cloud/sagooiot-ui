<template>
  <div class="type-item">
    <div v-for="(item, index) in actionList" :key="index" class="item " :class="index > 0 ? 'biankang' : ''">
      <div class="conicon" style="width: 100%; text-align: right; position: relative; right: -8px; top: -8px; color: red"
        v-if="index > 0">
        <el-icon @click="delAction(index)">
          <CircleClose />
        </el-icon>
      </div>
      <div class="title flex">
        <div class="icon"></div>串行动作
      </div>
      <div class="product flex flex-warp">
        <ActionSerialItem :seriallist="item.seriallist"></ActionSerialItem>

      
      </div>

      <div class="title flex">
        <div class="icon"></div>并行动作
      </div>
      <div class="product flex flex-warp">
            <ActionParallelItem :parallellist="item.parallellist"></ActionParallelItem>
      
      </div>
    </div>
    <div>
      <div class="edit">
        <el-button type="primary" :icon="DocumentAdd" @click="addAction()">新增场景动作</el-button>
      </div>
    </div>




 
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref  } from 'vue'
import { DocumentAdd, CircleClose } from '@element-plus/icons-vue';
import ActionSerialItem from './actionSerialItem.vue';
import ActionParallelItem from './actionParallelItem.vue';


interface IConditionItem {
  param?: string;
  operator?: string;
  value?: string;
}

interface IValueType {
  seriallist?:IConditionItem[] ;
  parallellist?:IConditionItem[] ;
}

const props = defineProps({

  actionList: {
    type: Array as PropType<IValueType[]>,
    default: () => []
  },

})


const addAction = () => {
  props.actionList.push({
    'seriallist':[{

    }],
    'parallellist':[{
      
    }],
  });
  console.log(props.actionList);
};
const delAction = (index: number) => {
  props.actionList.splice(index, 1);
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
    padding: 10px;


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

    .el-form-item {
      margin-left: 30px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }

}
</style>

