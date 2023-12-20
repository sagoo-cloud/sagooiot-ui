<template>
  <div>
    <div v-for="(item, index) in Datalist" :key="index">
      <el-form-item
        :label="item.title + ':'"
        :prop="item.name"
        class="form-item"
        v-if="item.types === 'input'"
      >
        <el-input
          v-model="formData[item.name]"
          :placeholder="'请输入' + item.title"
          @input="saveData"
        />
      </el-form-item>
      <el-form-item
        :label="item.title + '：'"
        :prop="item.name"
        class="form-item"
        v-if="item.types === 'textarea'"
      >
        <el-input
          v-model="formData[item.name]"
          type="textarea"
          @input="saveData"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, defineEmits } from 'vue';

const emit = defineEmits(['SetSaveData']);

const props = defineProps({
  Datalist: {
    type: Array,
    default: () => []
  },
});

const formData = ref({});

const saveData = () => {
  emit('SetSaveData', formData.value);
};
</script>

<style scoped lang="scss">
.form-item {
  flex: 0 0 25%;
}
</style>