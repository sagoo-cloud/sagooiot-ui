<template>
  <div>
    <div v-for="(item, index) in condition" :key="index">

      <div v-if="index > 0"><el-divider>或满足以下条件</el-divider></div>
      <div class="type-item">
        <div class="flex-warp item_list">
          <div v-for="(vo, i) in item.list" :key="i">

            <div class="items">
              <el-button
                style="background: #fff; color: #000;border: 1px solid #d9cde3;margin-left: 10px;margin-right: 10px;"
                v-if="i > 0">并且</el-button>

              <el-popover placement="bottom" trigger="click">
                <template #reference>
                  <el-button style="background: #9adbff4d; color: #00a4fe;border: 1px solid #00a4fe4d;">{{ vo.param ||
                    '请选择参数' }}</el-button>
                </template>
                <div class="popover-content">
                  <ul>
                    <li v-for="option in options" :key="option.value" @click="vo.param = option.value;">{{ option.label }}
                    </li>
                  </ul>
                </div>
              </el-popover>

              <el-popover placement="bottom" trigger="click">
                <template #reference>
                  <el-button style="background: #a3caff4d; color: #2f54eb;border: 1px solid #2f54eb4d;">{{ vo.operator ||
                    '操作符' }}</el-button>
                </template>
                <div class="popover-content">
                  <ul>
                    <li v-for="option in options" :key="option.value" @click="vo.operator = option.value;">{{ option.label
                    }}</li>
                  </ul>
                </div>
              </el-popover>

              <el-popover placement="bottom" trigger="click">
                <template #reference>
                  <el-button style="background: #bc7dee1a; color: #692ca7;border: 1px solid #bc7dee80;">{{ vo.value ||
                    '参数值' }}</el-button>
                </template>
                <div class="popover-content">
                  <ul>
                    <li v-for="option in options" :key="option.value" @click="vo.value = option.value;">{{ option.label }}
                    </li>
                  </ul>
                </div>
              </el-popover>

              <el-icon size="16" v-if="i > 0" @click="DelSceneItem(index)" style="position: relative;top: -13px;">
                <CircleClose />
              </el-icon>

            </div>

          </div>

          <div style="    padding-top: 12px;" @click="addSceneItem(index)">
            <el-icon size="18" style="    font-size: 24px;">
              <CirclePlus size="18"/>
            </el-icon>
          </div>
        </div>

        <el-icon size="26" @click="delScene(index)" v-if="index > 0"
          style="top: -69px;position: relative;font-size: 26px;right: 15px;">
          <CircleClose />
        </el-icon>
      </div>

    </div>

    <div class="mt15"><el-button @click="addScene()">增加触发条件</el-button></div>





  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue'
import { CirclePlus, CircleClose, Right } from '@element-plus/icons-vue';

const options = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
];

interface IConditionItem {
  param?: string;
  operator?: string;
  value?: string;
}

interface IValueType {
  list: IConditionItem[] ;
}

const props = defineProps({

  condition: {
    type: Array as PropType<IValueType[]> | undefined,
    default: () => []
  },
  operate_index: {
    type: Number,
    default: () => 0
  }
})

const addSceneItem = (index: any | number) => {
  props.condition[index].list.push({
    'param': '',
    'operator': '',
    'value': ''
  })
}

const DelSceneItem = (index: any | number) => {
  props.condition[index].list.splice(index, 1);
}


const addScene = () => {
  props.condition.push({
    'list': [{
      'param': '',
      'operator': '',
      'value': ''
    }],

  });
};
const delScene = (index: number) => {
  props.condition.splice(index, 1);
}

</script>
<style scoped lang="scss">
::v-deep .el-divider__text {
  background: #f6f6f6 !important;

}

//先保留
// ::v-deep .condition_value{
//    .el-input__wrapper {
//       width: 120px;
//       background: #9adbff4d !important;
//       box-shadow:0px !important;
//     .el-input__inner{
//       color: #00a4fe;
//       text-align: center;
//     }
//     .el-input__wrapper .is-focus{
//       box-shadow:0px !important;
//     }
//     .el-input__inner::placeholder{
//       color: #00a4fe;
//     }
//   }
// }
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
    cursor: pointer;
  }

  .item_list {
    background: #fff;
    border: 1px dashed #959596;

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

}
</style>

