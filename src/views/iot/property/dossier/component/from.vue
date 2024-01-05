
<template>
	<div>
		<div v-for="(item, index) in dataList" :key="index">

      <el-form-item :label="item.title + ':'" :prop="item.name" class="form-item" v-if="item.types === 'input'">
        <el-input v-model="formData[item.name]" :placeholder="'请输入' + item.title" @input="saveData()" :readonly="disable" />
      </el-form-item>

      <el-form-item :label="item.title + '：'" :prop="item.name" class="form-item" v-if="item.types === 'textarea'">
        <el-input v-model="formData[item.name]" type="textarea" @input="saveData()" :readonly="disable" />
      </el-form-item>

      <el-form-item v-if="item.types === 'date'" :label="item.title + '：'">
        <el-date-picker v-model="formData[item.name]" :default-value="item.value" type="date" value-format="YYYY-MM-DD" placeholder="请选择时间" class="w100" clearable @change="saveData()" :readonly="disable" />
      </el-form-item>

      <el-form-item :label="item.title + '：'" prop="path" v-if="item.types === 'file'">
        <el-upload class="avatar-uploader" :action="uploadUrl" :headers="headers" :show-file-list="false" :on-success="customCallback(item.name)" :disabled="disable">
          <img v-if="formData[item.name]" :src="formData[item.name]" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon" v-if="!disable">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

		</div>
	</div>
</template>

<script lang="ts">
import {onMounted, defineComponent, reactive, toRefs} from 'vue'
import getOrigin from '/@/utils/origin'
import { Plus } from '@element-plus/icons-vue'

interface FromState {
  dataList: any,
  formData: any,
  disable: boolean,
}

export default defineComponent({
  name: 'dossierFromData',
  props: {
    DataList: {
      type: Array,
      default: () => [],
    },
    disable: {
      type: Boolean,
      default: () => false,
    }
  },
  setup(prop, { emit }) {
    const uploadUrl = getOrigin(import.meta.env.VITE_API_URL + '/common/singleFile')
    const headers = {
      Authorization: 'Bearer ' + localStorage.token,
    }
    // const emit = defineEmits(['SetSaveData'])

    const state = reactive<FromState>({
      dataList: prop.DataList,
      formData: {},
      disable: prop.disable,
    })

    onMounted(() => {
      initFormData();
    });

    const initFormData = () => {
      for (const item of state.dataList) {
        state.formData[item.name] = item.value ? item.value : ''
      }
    }

    const customCallback = (customValue: string) => {
      return function (file: any) {
        state.formData[customValue] = file.data.full_path
        saveData();
      }
    }

    const saveData = () => {
      const updatedData = []

      for (const item of state.dataList) {
        updatedData.push({
          productKey: item.productKey,
          name: item.name,
          value: state.formData[item.name], // 更新为formData的实际值
          fieldName: item.fieldName,
        })
      }

      emit('SetSaveData', updatedData)
    }

    return {
      headers,
      uploadUrl,
      customCallback,
      saveData,
      ...toRefs(state),
    };
  },

  components: {Plus},
})
</script>

<style scoped lang="scss">
.form-item {
	flex: 0 0 25%;
}

.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>