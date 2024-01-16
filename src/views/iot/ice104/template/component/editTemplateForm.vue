<template>
  <el-form ref="formRef" :rules="formRules" :model="ruleForm" label-position="right" label-width="80px" style="width: 70%;">
    <el-form-item label="模版编码" prop="number">
      <el-input disabled v-model="ruleForm.number" placeholder="请输入模版编码" />
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model="ruleForm.title" placeholder="请输入名称" />
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="ruleForm.status" inline-prompt active-text="开" inactive-text="关" :active-value="1" :inactive-value="0" />
    </el-form-item>

    <el-form-item label="备注">
      <el-input type="textarea" v-model="ruleForm.remarks" placeholder="请输入备注信息" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="btnLoading" @click="submitData"> 保 存 </el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from 'vue';
import api from '/@/api/ice104/index';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import apiDevice from '/@/api/device';

const btnLoading = ref(false);

const emit = defineEmits(['updateList']);
const formRef = ref();
const ruleForm = ref({
  number: '',
  title: '',
  status: 1,
  remarks: "",
  mode: 0
})

const formRules = computed(() => ({
  number: [{ required: true, trigger: 'change', message: '请输入设备编码' }],
}));

const submitData = async () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    btnLoading.value = true
    // 修改
    api.template.editItem({
      ...ruleForm.value,
    })
      .then(() => {
        ElMessage({ type: 'success', message: '修改成功' })
        emit('updateList')
      })
      .finally(() => (btnLoading.value = false))
  })
}

const open = async (row: any) => {
  if (row && row.number.toString()) {
    ruleForm.value = row;
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.width100 {
  width: 100%;
}
</style>
