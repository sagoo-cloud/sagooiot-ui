<template>
  <el-dialog title="标签设置" v-model="isShowDialog" width="500px">
    <el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="110px">
      <el-form-item label="标签键名" prop="key">
        <el-input v-model="ruleForm.key" placeholder="请输入标签键名" />
      </el-form-item>

      <el-form-item label="标签名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入标签名称" />
      </el-form-item>

      <el-form-item label="标签值" prop="value">
        <el-input v-model="ruleForm.value" placeholder="请输入标签值" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">添 加</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance()

interface Tag {
  key: string;
  name: string;
  value: string;
}

const form = {
  key: '',
  name: '',
  value: '',
}

const formRef = ref(null)
const isShowDialog = ref(false)

const ruleForm = reactive<Tag>({
  ...form
})

const rules = {
  key: [{ required: true, message: "请输入标签键名", trigger: "change" }],
  name: [{ required: true, message: "请输入标签名称", trigger: "change" }],
  value: [{ required: true, message: '请输入标签值', trigger: 'change' }],
}

function addRow() {
  const fromDom = formRef.value as any
  fromDom && fromDom.resetFields()
  Object.assign(ruleForm, { ...form })
  isShowDialog.value = true
}

async function onSubmit() {
  const fromDom = formRef.value as any
  await fromDom.validate()
  proxy.$parent.addTag({ ...ruleForm })
  isShowDialog.value = false
}

defineExpose({
  addRow
})

</script>

<style lang="scss" scoped></style>
