<template>
  <div>
    <div v-for="(item, index) in Datalist" :key="index">
      <el-form-item :label="item.title + ':'" :prop="item.name" class="form-item" v-if="item.types === 'input'">
        <el-input v-model="formData[item.name]" :placeholder="'请输入' + item.title" @input="saveData()" />
      </el-form-item>
      <el-form-item :label="item.title + '：'" :prop="item.name" class="form-item" v-if="item.types === 'textarea'">
        <el-input v-model="formData[item.name]" type="textarea" @input="saveData()" />
      </el-form-item>

      <el-form-item v-if="item.types === 'date'" :label="item.title + '：'">
        <el-date-picker
          v-model="formData[item.name]"
          :default-value="item.value"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择时间"
          class="w100"
          clearable
          @change="saveData()"
        />
      </el-form-item>

      <el-form-item :label="item.title + '：'" prop="path" v-if="item.types === 'file'">
        <el-upload
          accept="*"
          :show-file-list="true"
          :limit="1"
          :headers="headers"
          :action="uploadUrl"
          :on-success="updateImg"
        >
          <el-button>
            <el-icon> <ele-Upload /> </el-icon>
            上传文件
          </el-button>
        </el-upload>
        <div>{{ url }}</div>
      </el-form-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineEmits, onMounted,defineProps ,onUnmounted} from 'vue';
  import getOrigin from '/@/utils/origin';
  import { ElMessage } from 'element-plus';

  const url = ref();
  const uploadUrl = getOrigin(import.meta.env.VITE_API_URL + '/common/singleFile');
  const headers = {
    Authorization: 'Bearer ' + localStorage.token,
  };
  const emit = defineEmits(['SetSaveData']);

  const props = defineProps({
    Datalist: {
      type: Array,
      default: () => [],
    },
  });
 
    onMounted(() => {
    for (const item of props.Datalist) {
      formData.value[item.name] = item.value ? item.value : '';
            console.log(item.value);

    }
  });

  const updateImg = (res: any) => {
    if (res.code === 0) {
      url.value = res.data.full_path;
      ElMessage.success('上传成功');
    } else {
      ElMessage.error(res.message);
    }
  };

  const formData = ref({});

  const saveData = () => {
    const updatedData = [];

    for (const item of props.Datalist) {
      updatedData.push({
        productKey: item.productKey,
        name: item.name,
        value: formData.value[item.name],
        fieldName: item.fieldName,
      });
    }

    console.log(updatedData);
    emit('SetSaveData', updatedData);
  };
</script>

<style scoped lang="scss">
  .form-item {
    flex: 0 0 25%;
  }
</style>