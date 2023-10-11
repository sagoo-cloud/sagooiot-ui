<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(open_type ==='upload' ? '导入' : '导出') + '设备'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
       
        <el-form-item label="所属产品" prop="productId">
          <el-select v-model="ruleForm.productId"  placeholder="请选择所属产品" class="w100">
            <el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="导入文件" prop="path" v-if="open_type ==='upload'">
          <el-upload accept="xls,xlsx,csv" :show-file-list="false" :limit="1" 
									:headers="headers" :action="uploadUrl" :on-success="updateImg">
									<el-button>
										<el-icon> <ele-Upload /> </el-icon>
										上传文件
									</el-button>
								</el-upload>
                <div>{{ruleForm.path}}</div>
        </el-form-item>
       
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">{{ open_type=== 'upload'  ? '导入设备' : '导出设备' }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, nextTick } from 'vue';
import api from '/@/api/device';
import { ElMessage } from "element-plus";
import downloadFile from '/@/utils/download';
import getOrigin from '/@/utils/origin';


interface RuleFormState {
  productId: number | string;
  path: string;
}

const form: RuleFormState = {
  productId: '',
  path: '',
}

interface DicState {
  productData: any[];
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  rules: {}
  open_type:string;
}


export default defineComponent({
  setup(prop, { emit }) {
    
const uploadUrl: string = getOrigin(import.meta.env.VITE_API_URL + "/common/singleFile");
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
        productId: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
      }
    });
    const updateImg = (res: any) => {
			if (res.code === 0) {
        state.ruleForm.path=res.data.path;
				ElMessage.success('上传成功');
			} else {
				ElMessage.error(res.message);
			}
		};
    // 打开弹窗
    const openDialog = (type:string) => {
      resetForm();
      api.product.getLists({ status: 1 }).then((res: any) => {
        state.productData = res.product || [];
      });
      state.open_type=type;
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
    const onSubmit = () => {
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          if (state.open_type ==='upload') {
            api.device.import(state.ruleForm).then((res: any) => {
              ElMessage.success('导入成功');
              closeDialog(); // 关闭弹窗
            });


          } else {

            
            api.device.export({ productId: state.ruleForm.productId }).then((res: any) => downloadFile(res))
            closeDialog(); // 关闭弹窗

          }
        }
      });
    };
    return {
      uploadUrl,
      headers,
      tagRef,
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

