<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(open_type === 'upload' ? '导入' : '导出') + '设备'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="110px">

        <el-form-item label="所属产品" prop="productKey">
          <el-select v-model="ruleForm.productKey" placeholder="请选择所属产品" class="w100">
            <el-option v-for="item in productData" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="导入文件" prop="path" v-if="open_type === 'upload'">
          <el-upload accept="xls,xlsx,csv" :show-file-list="true" :data="{ productKey: ruleForm.productKey }" :limit="1" :headers="headers" :action="uploadUrl" :on-success="updateImg" :before-upload="beforeAvatarUpload">
            <el-button>
              <el-icon> <ele-Upload /> </el-icon>
              上传文件
            </el-button>
          </el-upload>
          <div>{{ ruleForm.path }}</div>
        </el-form-item>
        <el-form-item label="样表下载" v-if="open_type === 'upload'">
          <el-button @click="down" type="primary" text="primary">
            <el-icon> <ele-Download /> </el-icon>
            下载文件
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" v-if="open_type !== 'upload'">{{ open_type === 'upload' ? '导入设备' : '导出设备'
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, nextTick } from 'vue';
import api from '/@/api/device';
import { ElMessage, UploadProps } from "element-plus";
import downloadFile from '/@/utils/download';
import getOrigin from '/@/utils/origin';


interface RuleFormState {
  productKey: number | string;
  path: string;
}

const form: RuleFormState = {
  productKey: '',
  path: '',
}

interface DicState {
  productData: any[];
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  rules: {}
  open_type: string;
}


export default defineComponent({
  setup(prop, { emit }) {

    const uploadUrl: string = getOrigin(import.meta.env.VITE_API_URL + "/product/device/import");
    const headers = {
      Authorization: 'Bearer ' + localStorage.token,
    };
    const formRef = ref<HTMLElement | null>(null);
    const tagRef = ref<HTMLElement | null>(null);
    const state = reactive<DicState>({
      isShowDialog: false,
      open_type: '',
      productData: [], // 分类数据
      ruleForm: {
        ...form
      },
      rules: {
        productKey: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
      }
    });


    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
      if (!state.ruleForm.productKey) {
        ElMessage.error('请先选择所属产品!');
        return false;
      }
      if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('文件不能超过2MB!');
        return false;
      }
      return true;
    };

    const updateImg = (res: any) => {
      if (res.code === 0) {
        ElMessage.success('导入成功');
        closeDialog(); // 关闭弹窗
        emit('typeList')

      } else {
        ElMessage.error(res.message);
      }
    };
    // 打开弹窗
    const openDialog = (type: string) => {
      resetForm();
      api.product.getLists({ status: 1 }).then((res: any) => {
        state.productData = res.product || [];
      });
      state.open_type = type;
      state.isShowDialog = true;
    };
    const resetForm = () => {
      state.ruleForm = {
        ...form
      }
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };
    // 新增
    const getCurrentTime = () => {
      const date = new Date();
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return year + month + day + hours + minutes;
    }
    const onSubmit = () => {
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          if (state.open_type === 'upload') {
            api.device.import(state.ruleForm).then((res: any) => {
              ElMessage.success('导入成功');
              closeDialog(); // 关闭弹窗
            });
          } else {
            const selectedProduct = state.productData.find((item) => item.key === state.ruleForm.productKey);
            if (selectedProduct) {
              api.device.export({ productKey: state.ruleForm.productKey }).then((res: any) => downloadFile(res, selectedProduct.name + "-" + getCurrentTime() + ".xlsx"))
              closeDialog(); // 关闭弹窗
            }


          }
        }
      });
    };
    const down = () => {
      const fileURL = '/deviceImportExample.xlsx';
      // 创建下载链接
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', 'deviceImportExample.xlsx');

      // 模拟点击下载链接进行下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    return {
      uploadUrl,
      headers,
      tagRef,
      beforeAvatarUpload,
      down,
      updateImg,
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      formRef,
      ...toRefs(state),
    };
  },
});
</script>

