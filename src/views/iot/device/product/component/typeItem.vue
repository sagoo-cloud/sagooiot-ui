<template>
  <div class="type-item">
    <template v-if="['int', 'long', 'float', 'double'].includes(valueType.type)">
      <el-form-item label="最大" prop="max">
        <el-input v-model="valueType.max" placeholder="请输入最大值" />
      </el-form-item>
      <el-form-item label="最小" prop="min">
        <el-input v-model="valueType.min" placeholder="请输入最小值" />
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="valueType.unit" placeholder="请输入单位" />
      </el-form-item>
    </template>

    <el-form-item label="精度" prop="decimals" v-if="['float', 'double'].includes(valueType.type)">
      <el-input v-model="valueType.decimals" placeholder="请输入精度" />
    </el-form-item>


    <el-form-item label="最大长度" prop="maxLength" v-if="valueType.type === 'string'">
      <el-input v-model="valueType.maxLength" placeholder="请输入最大长度" />
    </el-form-item>

    <el-form-item label="布尔值" v-if="valueType.type === 'boolean'">
      <div class="input-box">
        <el-input v-model="valueType.trueText" placeholder="请输入布尔值" value="是" /><span style="margin: 0px 10px">~</span>
        <el-input v-model="valueType.trueValue" placeholder="请输入布尔值" value="true" />
      </div>

      <div class="input-box">
        <el-input v-model="valueType.falseText" placeholder="请输入布尔值" value="否" /> <span style="margin: 0px 10px">~</span>
        <el-input v-model="valueType.falseValue" placeholder="请输入布尔值" value="false" />
      </div>
    </el-form-item>

    <el-form-item label="枚举项" prop="" v-if="valueType.type === 'enum'">
      <div class="input-box" v-for="(item, index) in valueType.elements" :key="index">
        <el-input v-model="item.text" placeholder="请输入枚举值" /><span style="margin: 0px 10px"><el-icon>
            <Right />
          </el-icon></span>
        <el-input v-model="item.value" placeholder="请输入枚举文本" />
        <div class="input-option">
          <el-icon @click="addEnum" v-if="index == 0">
            <Plus />
          </el-icon>
          <el-icon @click="delEnum(index)" v-if="index != 0">
            <Minus />
          </el-icon>
        </div>
      </div>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType } from 'vue'
import { Plus, Minus, Right } from '@element-plus/icons-vue';

interface IValyeType {
  type: string;
  min?: string;
  max?: string;
  unit?: string;
  decimals?: string;
  trueText?: string;
  falseText?: string;
  trueValue?: string;
  falseValue?: string;
  maxLength?: string;
  elements: { text: string, value: string }[];
  elementType?: IValyeType;
  properties?: { key: string, name: string, desc: string, valueType: IValyeType }[];
}

const props = defineProps({
  valueType: {
    type: Object as PropType<IValyeType>,
    required: true
  }
})

const addEnum = () => {
  props.valueType.elements.push({
    'text': '',
    'value': ''
  })
};

const delEnum = (index: number) => {
  props.valueType.elements.splice(index, 1)
}
</script>
<style scoped lang="scss">
.input-box{
  margin-top: 0;
  margin-bottom: 10px;
  &:last-child{
    margin-bottom: 0;
  }
}
</style>