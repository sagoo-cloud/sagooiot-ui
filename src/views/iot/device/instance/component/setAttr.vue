<template>
  <el-dialog title="设置属性" v-model="visiable" width="600px" append-to-body>
    <el-form :model="data" ref="queryRef" label-width="68px">
      <el-form-item label="属性标识" prop="key">
        <el-input v-model="data.key" disabled placeholder="请输入属性标识" clearable />
      </el-form-item>
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="data.name" disabled placeholder="请输入属性名称" clearable />
      </el-form-item>
      <el-form-item label="数据类型" prop="type">
        <el-select v-model="data.valueType.type" placeholder="请选择数据类型" disabled style="width: 100%;">
          <el-option-group v-for="group in typeData" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.type" :label="item.title" :value="item.type" />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="属性值" prop="desc">
        <template v-if="['int', 'long', 'float', 'double', 'date'].includes(data.valueType.type)">
          <el-input type="number" v-model.number="data.desc" placeholder="请输入属性值" clearable>
            <template v-if="data.valueType.unit" #append>{{ data.valueType.unit }}</template>
          </el-input>
        </template>
        <template v-else-if="['enum'].includes(data.valueType.type)">
          <el-select v-model="data.desc" clearable style="wdith: 100% !important;">
            <el-option v-for="item in data.valueType.elements" :key="item.value" :value="item.value" :label="item.text"></el-option>
          </el-select>
        </template>
        <template v-else>
          <el-input v-model="data.desc" placeholder="请输入属性值" clearable>
            <template v-if="data.valueType.unit" #append>{{ data.valueType.unit }}</template>
          </el-input>
        </template>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visiable = false" size="default">取 消</el-button>
        <el-button type="primary" @click="onSubmit" size="default">设 置</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import api from '/@/api/device';
import { ElMessage } from 'element-plus';

const visiable = ref(false)
const typeData = ref<any[]>([])

const data = reactive({
  "key": "a",
  "name": "s",
  "accessMode": 0,
  "valueType": {
    "type": "int",
    "unit": "",
    "elements": [],
  },
  "desc": ""
})

api.product.getDataType({ status: -1 }).then((res: any) => {
  const datat = Object.values(res.dataType) as any;
  datat.forEach((item: any, index: number) => {
    if (index == 0) {
      datat[index]['label'] = '基础类型';
      datat[index]['options'] = item;
    } else {
      datat[index]['label'] = '扩展类型';
      datat[index]['options'] = item;
    }
  });
  typeData.value = datat || [];
});

function show(row: any) {
  Object.assign(data, row)
  visiable.value = true
}

function onSubmit() {
  return
  api.product.propertySet(data).then(() => {
    ElMessage.success('操作成功')
  })
}

defineExpose({ show })

</script>

<style lang="scss" scoped></style>
