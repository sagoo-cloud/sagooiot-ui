<template>
  <div class="type-item">
    <template v-if="['int', 'long', 'float', 'double'].includes(valueType.type)">
      <div class="flex-row" style="margin-bottom: 0;">
        <el-form-item label="取值范围" prop="min" class="flex1">
          <el-input v-model="valueType.min" type="number" @input="setNull(valueType, 'min', $event)" placeholder="最小值" />
        </el-form-item>
        <div class="split" style="margin-bottom: 20px;">~</div>
        <el-form-item prop="max" class="flex1" label-width="0">
          <el-input v-model="valueType.max" type="number" @input="setNull(valueType, 'max', $event)" placeholder="最大值" />
        </el-form-item>
      </div>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="valueType.unit" placeholder="请输入单位" />
      </el-form-item>
    </template>

    <el-form-item label="精度" prop="decimals" v-if="['float', 'double'].includes(valueType.type)">
      <el-input v-model="valueType.decimals" type="number" placeholder="请输入精度" />
    </el-form-item>


    <el-form-item label="最大长度" prop="maxLength" v-if="valueType.type === 'string'">
      <el-input v-model="valueType.maxLength" type="number" placeholder="请输入最大长度" />
    </el-form-item>

    <el-form-item label="布尔值" v-else-if="valueType.type === 'boolean'">
      <div class="input-box">
        <el-input v-model="valueType.trueText" placeholder="请输入布尔值" value="是" /><span style="margin: 0px 10px">~</span>
        <el-input v-model="valueType.trueValue" placeholder="请输入布尔值" value="true" />
      </div>

      <div class="input-box">
        <el-input v-model="valueType.falseText" placeholder="请输入布尔值" value="否" /> <span style="margin: 0px 10px">~</span>
        <el-input v-model="valueType.falseValue" placeholder="请输入布尔值" value="false" />
      </div>
    </el-form-item>

    <el-form-item label="枚举项" prop="" v-else-if="valueType.type === 'enum'">
      <div class="input-box" v-for="(item, index) in valueType.elements" :key="index">
        <el-input v-model="item.text" placeholder="请输入枚举文本" /><span style="margin: 0px 10px"><el-icon>
            <Right />
          </el-icon></span>
        <el-input v-model="item.value" placeholder="请输入枚举值" />
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
    <el-form-item label="对象属性" prop="" v-else-if="valueType.type === 'object'">
      <div class="w-full" v-for="(item, index) in valueType.properties" :key="index">
        <div class="flex-row">
          <el-input v-model="item.key" placeholder="属性标识" class="flex1" />
          <el-input v-model="item.name" placeholder="属性名称" class="flex1" />
          <el-select v-model="item.valueType.type" placeholder="请选择元素类型" style="width: 140px;">
            <el-option-group v-for="group in typeData" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.type" :label="item.title" :value="item.type" :disabled="['array', 'object', 'enum', 'date'].includes(item.type)" />
            </el-option-group>
          </el-select>
          <el-icon @click="addObject" v-if="index == 0">
            <Plus />
          </el-icon>
          <el-icon @click="delObject(index)" v-if="index != 0">
            <Minus />
          </el-icon>
        </div>
        <el-form label-width="70" label-position="left">
          <TypeItem v-if="item.valueType.type" :valueType="item.valueType"></TypeItem>
        </el-form>
      </div>
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { Plus, Minus, Right } from '@element-plus/icons-vue';
import TypeItem from './typeItem.vue';

interface IValyeType {
  type: string | null;
  min?: string | null;
  max?: string | null;
  unit?: string | null;
  decimals?: string | null;
  trueText?: string | null;
  falseText?: string | null;
  trueValue?: string | null;
  falseValue?: string | null;
  maxLength?: string | null;
  elements: { text: string, value: string }[];
  elementType?: IValyeType;
  properties: { key: string, name: string, desc: string, valueType: IValyeType }[];
}

const valueTypeBase = {
  type: null,
  // max: null,
  // min: null,
  unit: null,
  decimals: null,
  trueText: null,
  falseText: null,
  trueValue: null,
  falseValue: null,
  maxLength: null,
  elements: [{
    'text': '',
    'value': ''
  }],
  properties: [],
}

const props = defineProps({
  valueType: {
    type: Object as PropType<IValyeType>,
    required: true
  },
  typeData: Array as PropType<any[]>
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

const addObject = () => {
  props.valueType.properties.push({
    'key': '',
    'name': '',
    'desc': '',
    valueType: { ...valueTypeBase }
  })
};

const delObject = (index: number) => {
  props.valueType.properties.splice(index, 1)
}

const setNull = (row: any, key: string, val: string) => {
  if (!val) row[key] = null
}
</script>
<style scoped lang="scss">
.type-item {
  width: 100%;
}

.w-full {
  &:not(:first-child) {
    margin-top: 10px
  }
}

.flex-row {
  width: 100%;
  margin-top: 0;
  margin-bottom: 10px;
  gap: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
