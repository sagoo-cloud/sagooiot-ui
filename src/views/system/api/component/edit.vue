<template>
  <el-dialog class="api-edit" v-model="showDialog" :title="`${formData.id  ?  '编辑接口'  :  '新增接口'}`" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="80px">
      <el-form-item label="关联页面" prop="parentId">
        <el-cascader :options="menuData" :props="{ checkStrictly: false,  multiple:  true,  emitPath: false, value: 'id', label: 'title' }" placeholder="请选择关联页面" clearable class="w100" v-model="formData.menuIds"></el-cascader>
      </el-form-item>
      <el-form-item label="接口名称" prop="name">
        <el-input v-model="formData.name" placeholder="输入接口名称" />
      </el-form-item>
      <el-form-item label="接口地址" prop="address">
        <el-input v-model="formData.address" placeholder="接口地址" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import api from '/@/api/system';
import { ApiRow } from '/@/api/model/system/menu';
import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();
const menuData = ref<any[]>([]);

const baseForm: ApiRow = {
  menuIds: [],
  id: undefined,
  name: '',
  address: '',
  remark: '',
  status: 1,
};

const formData = reactive<ApiRow>({
  ...baseForm,
});

const ruleForm = {
  menuIds: [ruleRequired('关联页面不能为空')],
  name: [ruleRequired('接口名称不能为空')],
  address: [ruleRequired('接口地址不能为空')],
};

// 加载菜单列表
api.menu.getList({ status: -1 }).then((res: any[]) => {
  menuData.value = res;
});

const onSubmit = async () => {
  await formRef.value.validate();

  const theApi = formData.id ? api.api.edit : api.api.add;

  await theApi(formData);

  ElMessage.success('操作成功');
  resetForm();
  showDialog.value = false;
  emit('getList');
};

const resetForm = async () => {
  Object.assign(formData, { ...baseForm });
  formRef.value && formRef.value.resetFields();
};

const open = async (row: any) => {
  resetForm();
  showDialog.value = true;
  nextTick(() => {
    Object.assign(formData, { ...row });
  });
};

defineExpose({ open });
</script>
