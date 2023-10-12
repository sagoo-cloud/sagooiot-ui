<template>
  <div>
    <div v-for="(item, index) in condition" :key="index">

      <div v-if="index > 0"><el-divider>或满足以下条件</el-divider></div>
      <div class="type-item">
        <div class="conicon"
          style="width: 100%; text-align: right; position: relative; right: -15px; top: -5px; color: red"
          v-if="index > 0">
          <el-icon @click="delScene(index)">
            <CircleClose />
          </el-icon>
        </div>

        <div class="flex-warp item_list">

          <div v-for="(vo, i) in item" :key="i">

            <div class="items">
              <el-button
                style="background: #fff; color: #000;border: 1px solid #d9cde3;margin-left: 10px;margin-right: 10px;"
                v-if="i > 0">并且</el-button>

              <el-popover placement="bottom" trigger="click" ref="popoverRef" v-model:visible="vo.isPopoverVisible">
                <template #reference>
                  <el-button style="background: #9adbff4d; color: #00a4fe;border: 1px solid #00a4fe4d;">{{
                    vo.parameter_text ||
                    '请选择参数' }}</el-button>
                </template>
                <div class="popover-content">
                  <ul>
                    <li v-for="(option, d) in columnList" :key="d" @click="setParameter(vo, option)" >
                      {{ option.name }}
                    </li>
                  </ul>
                </div>
              </el-popover>

              <el-popover placement="bottom" trigger="click" v-model:visible="vo.isPopoverVisible1">
                <template #reference>
                  <el-button style="background: #a3caff4d; color: #2f54eb;border: 1px solid #2f54eb4d;">{{
                    vo.operator_text ||
                    '操作符' }}</el-button>
                </template>
                <div class="popover-content">
                  <ul>
                    <li v-for="option in vo.operatorList" :key="option.Key"
                      @click="vo.operator = option.Key; vo.operator_text = option.Name; vo.isPopoverVisible1 = false; saveData();">
                      {{ option.Name }}</li>
                  </ul>
                </div>
              </el-popover>

              <el-popover placement="bottom" trigger="click">
                <template #reference>
                  <el-button style="background: #bc7dee1a; color: #692ca7;border: 1px solid #bc7dee80;">{{ vo.value ||
                    '参数值' }}</el-button>
                </template>
                <div class="popover-content">
                  <el-input v-model="vo.value" placeholder="请输入参数值" @input="saveData" />

                </div>
              </el-popover>

              <el-icon size="16" v-if="i>0" @click="DelSceneItem(i, index)" style="position: relative;top: -13px;">
                <CircleClose />
              </el-icon>

            </div>

          </div>

          <div style="    padding-top: 12px;" @click="addSceneItem(index)">
            <el-icon size="18" style="    font-size: 24px;">
              <CirclePlus size="18" />
            </el-icon>
          </div>

        </div>

      </div>


    </div>

    <div class="mt15"><el-button @click="addScene()">增加或条件</el-button></div>





  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue'
import { CirclePlus, CircleClose, Right } from '@element-plus/icons-vue';
const emit = defineEmits(['EditPen']);
interface IConditionItem {
  [x: string]: any;
  parameter?: string;
  operator?: string;
  value?: string;
}
interface Column {
  termTypes: any[]; 
}
const props = defineProps({
  condition: {
    type: Array as PropType<IConditionItem[]> | undefined,
    default: () => []
  },
  columnList: {
    type: Array as PropType<Column[]>,
    default: () => []
  },
  operate_index: {
    type: Number,
    default: () => 0
  }
})

const setParameter = (vo: IConditionItem, item: any) => {
  vo.parameter_text = item.name;
  vo.parameter = item.column;
  // operatorList.value=item.termTypes
  vo.operatorList = item.termTypes;
  vo.isPopoverVisible = false; // 关闭弹窗

  saveData();
}

const saveData = () => {
  emit('EditPen', props.operate_index);
}

const addSceneItem = (index: number) => {
  props.condition[index].push({
    'parameter': '',
    'operator': '',
    'value': ''
  })
  saveData();

}

const DelSceneItem = (index: number, parentIndex: number) => {
  props.condition[parentIndex].splice(index, 1);
  saveData();

}

const addScene = () => {
  props.condition.push([{
    'parameter': '',
    'operator': '',
    'value': ''
  }]);
};
const delScene = (index: number) => {
  props.condition.splice(index, 1);
}
const initItem = () => {
  props.condition.forEach((item) => {
    item.forEach((vo:any) => {
      let operator = vo.operator;
      let matchedColumn = props.columnList.find((column:any) =>
        column.termTypes.some((term:any) => term.Key === operator)
      );
      if (matchedColumn) {
        vo.operatorList = matchedColumn.termTypes;
      } else {
        vo.operatorList = []; // 如果没有匹配的列，设置为空数组
      }
    });
  });
};
initItem();

</script>
<style scoped lang="scss">

.popover-content {
  padding: 0px;
}

.popover-content ul {
  list-style-type: none;
  padding: 0;
}

.popover-content li {
  cursor: pointer;
  padding: 5px;

}

.popover-content li:hover {
  background-color: #e6f7ff;
}

.type-item {
  margin-top: 15px;

  .conicon {
    width: 55px;
    height: 5px;

    font-size: 24px;
    line-height: 28px;
    cursor: pointer;
  }

  .item_list {
    // background: #fff;

    .items {
      padding: 10px;

      .el-select {
        width: 99px;
      }

      .el-select--default {
        --el-select-border-color-hover: var(--el-border-color-hover);
        --el-select-disabled-border: var(--el-disabled-border-color);
        --el-select-font-size: var(--el-font-size-base);
        --el-select-close-hover-color: var(--el-text-color-secondary);
        --el-select-input-color: var(--el-text-color-placeholder);
        --el-select-multiple-input-color: var(--el-text-color-regular);
        --el-select-input-focus-border-color: var(--el-color-primary);
        --el-select-input-font-size: 14px;
      }


    }


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

}</style>

