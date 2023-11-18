<template>
  <el-dialog class="api-edit" v-model="showDialog" :title="`${formData.id ? '编辑组态图' : '新增组态图'}`" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="100px">
      <el-form-item label="组态图名称" prop="name">
        <el-input v-model.trim="formData.name" placeholder="输入组态图名称" />
      </el-form-item>
      <!-- <el-form-item label="说明" prop="remarks">
        <el-input v-model="formData.remarks" type="textarea" :rows="3" />
      </el-form-item> -->
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
import api from '/@/api/configuration';
import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';
import pako from 'pako'

const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();

const jsonData = pako.deflate('{"x":0,"y":0,"scale":1,"pens":[],"origin":{"x":0,"y":0},"center":{"x":0,"y":0},"paths":{},"version":"1.2.13"}', { to: 'string' })

const baseForm = {
  "id": undefined,
  "folderId": 1,
  "types": "topology",
  "jsonData": jsonData,
  "name": "",
  "pointIds": "",
  "images": "https://dummyimage.com/100x100?text=no%20data",
  "status": 1
}

const formData = reactive({
  ...baseForm,
});

const ruleForm = {
  name: [ruleRequired('图纸名称不能为空')],
};

const onSubmit = async () => {
  await formRef.value.validate();

  const theApi = formData.id ? api.edit : api.add;

  if (!formData.id) {
    formData.folderId = 1;
    api.getFolder().then((res: any) => {
      if (res.topology && res.topology.length > 0) {
        formData.folderId = res.topology[0].id;
        toSend(theApi, formData)
      } else {
        api.addFolder({ types: 'topology', name: '默认分类' }).then(({ folderId }: any) => {
          formData.folderId = folderId
          toSend(theApi, formData)
        })
      }
    })
  } else {
    toSend(theApi, formData)
  }
};

const toSend = async (theApi: any, formData: any) => {
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
