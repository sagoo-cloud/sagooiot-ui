<template>
  <div class="upload">
    <el-upload class="hide" :accept="accept" :limit="1" :data="{ source }" :multiple="multiple" :headers="headers" :before-upload="beforeAvatarUpload" :on-error="uploadErr" :action="uploadUrl" :on-success="updateImg">
      <slot></slot>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import type { UploadProps } from 'element-plus';
import getOrigin from '/@/utils/origin'

const uploadUrl: string = getOrigin(import.meta.env.VITE_API_URL + '/common/singleImg');

const source = localStorage.uploadFileWay

const headers = {
  Authorization: 'Bearer ' + localStorage.token,
};

const emit = defineEmits(['setImg', 'setImgs']);

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: '.jpg,.png,.jpeg,.gif',
  },
  name: {
    type: String,
    default: '',
  }
});

const updateImg = (res: any) => {
  if (res.code !== 0) {
    return ElMessage.error(res.message)
  }
  const url = res?.data?.full_path
  emit('setImg', url, props.name);
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片不能超过2MB!');
    return false;
  }
  return true;
};
</script>

<style scoped>
.hide ::v-deep(.el-upload-list) {
  display: none;
}

.preview {
  max-width: 100%;
  max-height: 60vh;
  display: block;
  margin: 0 auto;
}
</style>