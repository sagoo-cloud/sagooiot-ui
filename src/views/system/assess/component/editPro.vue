<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '产品'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="90px">
        <el-form-item label="产品标识" prop="key">
          <el-input v-model="ruleForm.key" placeholder="请输入产品标识" />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品图片" prop="imageUrl">

          <uploadVue @set-img="handleAvatarSuccess"></uploadVue>

        </el-form-item>

        <el-form-item label="产品分类" prop="categoryId">
          <el-cascader :options="cateData" :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }" placeholder="请选择分类" clearable class="w100" v-model="ruleForm.categoryId">
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>

        <el-form-item label="所属组织" prop="deptId">
          <el-cascader :options="deptData" :props="{ checkStrictly: true, emitPath: false, value: 'deptId', label: 'deptName' }" placeholder="请选择所属组织" clearable class="w100" v-model="ruleForm.deptId">
            <template #default="{ node, data }">
              <span>{{ data.deptName }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>


        <el-form-item label="消息协议" prop="messageProtocol">


          <el-select v-model="ruleForm.messageProtocol" placeholder="请选择消息协议">
            <el-option v-for="item in messageData" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>

        <el-form-item label="接入方式" prop="transportProtocol">


          <el-select v-model="ruleForm.transportProtocol" placeholder="请选择接入方式">
            <el-option v-for="item in tranData" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>


        <el-form-item label="设备类型" prop="deviceType">
          <el-radio-group v-model="ruleForm.deviceType" model-value="设备">
            <el-radio label="设备">设备</el-radio>

            <el-radio label="网关">网关</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品描述	" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入产品描述"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/device';
import uploadVue from '/@/components/upload/index.vue';
import { ElMessage, UploadProps } from "element-plus";
import getOrigin from '/@/utils/origin'

interface RuleFormState {
  id: number;
  name: string;
  dictType: string;
  status: number;
  desc: string;
}
interface DicState {
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  cateData: RuleFormState[];
  deptData: RuleFormState[];
  messageData: RuleFormState[];
  tranData: RuleFormState[];
  rules: {}
}

export default defineComponent({
  name: 'deviceEditPro',
  components: { uploadVue },
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);
    const baseURL: string | undefined | boolean = getOrigin(import.meta.env.VITE_API_URL)

    const state = reactive<DicState>({
      isShowDialog: false,
      cateData: [], // 分类数据
      deptData: [], //
      messageData: [], //
      tranData: [], //
      imageUrl: "", //
      singleImg: baseURL + "/product/icon/upload",

      ruleForm: {
        id: 0,
        name: '',
        categoryId: '',
        deptId: '',
        messageProtocol: '',
        transportProtocol: '',
        deviceType: '设备',
        status: 1,
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
        key: [
          { required: true, message: "产品标识不能为空", trigger: "blur" }
        ],
        parentId: [{ required: true, message: '产品分类不能为空', trigger: 'blur' }],
        deptId: [{ required: true, message: '所属组织不能为空', trigger: 'blur' }],
        messageProtocol: [{ required: true, message: '消息协议不能为空', trigger: 'blur' }],
        transportProtocol: [{ required: true, message: '接入方式不能为空', trigger: 'blur' }],
        deviceType: [{ required: true, message: '设备类型不能为空', trigger: 'blur' }],
      }
    });




    const handleAvatarSuccess: UploadProps['onSuccess'] = (
      response) => {

      state.imageUrl = response
      state.ruleForm.imageUrl = response
    }


    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      api.category.getList({ status: 1 }).then((res: any) => {
        state.cateData = res.category || [];
      });
      api.dept.getList({ status: -1 }).then((res: any) => {
        state.deptData = res || [];
      });
      api.product.message_protocol_list({ status: -1 }).then((res: any) => {
        state.messageData = res.data || [];
      });
      api.product.trunsport_protocol_list({ status: -1 }).then((res: any) => {
        state.tranData = res.data || [];
      });
      if (row) {
        // api.dict.getType(row.dictId).then((res:any)=>{
        //   state.ruleForm = res.data.dictType
        // }

        state.ruleForm = row;
      }
      state.isShowDialog = true;
    };
    const resetForm = () => {
      state.ruleForm = {
        id: 0,
        name: '',
        dictType: '',
        status: 1,
        desc: ''
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
          if (state.ruleForm.id !== 0) {
            //修改
            api.product.edit(state.ruleForm).then(() => {
              ElMessage.success('产品类型修改成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          } else {
            //添加
            api.product.add(state.ruleForm).then(() => {
              ElMessage.success('产品类型添加成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          }
        }
      });
    };


    return {
      openDialog,
      handleAvatarSuccess,
      closeDialog,
      onCancel,
      onSubmit,
      formRef,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style scoped>
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
