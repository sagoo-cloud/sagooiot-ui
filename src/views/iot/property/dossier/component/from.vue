<template>
  <div>
      <el-form-item :label="info.title + ':'" :prop="info.name" class="form-item" v-if="info.types === 'input'">
        <el-input v-model="formData[info.name]" :placeholder="'请输入' + info.title" @input="saveData()" />
      </el-form-item>
      <el-form-item :label="info.title + '：'" :prop="info.name" class="form-item" v-if="info.types === 'textarea'">
        <el-input v-model="formData[info.name]" type="textarea" @input="saveData()" />
      </el-form-item>

      <el-form-item v-if="info.types === 'date'" :label="info.title + '：'">
        <el-date-picker v-model="formData[info.name]" type="date" value-format="YYYY-MM-DD" placeholder="请选择时间" class="w100" clearable   @change="saveData()"/>
      </el-form-item>

       <el-form-item :label="info.title + '：'" prop="path" v-if="info.types === 'file'">
            <el-upload accept="*" :show-file-list="true"   :limit="1" :headers="headers" :action="uploadUrl"
              :on-success="updateImg">
              <el-button>
                <el-icon> <ele-Upload /> </el-icon>
                上传文件
              </el-button>
            </el-upload>
            <div>{{ url }}</div>
          </el-form-item>

 

  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, defineEmits } from 'vue';
import getOrigin from '/@/utils/origin';
import { ElMessage } from 'element-plus';

const url = ref();
const uploadUrl = getOrigin(import.meta.env.VITE_API_URL + '/common/singleFile');
const headers = {
  Authorization: 'Bearer ' + localStorage.token,
};
const emit = defineEmits(['SetSaveData']);

const props = defineProps({
  info: {
    type: Object,
    default: () => {}
  },
  index: {
    type: Number,
    default: () => 0
  }
});

const updateImg = (res: any) => {
  if (res.code === 0) {
    url.value= res.data.full_path
    ElMessage.success('上传成功');
  } else {
    ElMessage.error(res.message);
  }
};
const formData = ref({
  productKey: props.info.productKey,
  fieldName: props.info.fieldName,
  name: props.info.name,
  value: '',
});

const saveData = () => {
    formData.value.value = formData.value[props.info.name];
    
    let newdata = {
      index: props.index,
      data: formData.value,
    }
  emit('SetSaveData', newdata);
};
</script>

<style scoped lang="scss">
.form-item {
  flex: 0 0 25%;
}
</style>