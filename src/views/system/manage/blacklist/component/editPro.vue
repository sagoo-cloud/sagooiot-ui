<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加')" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="90px">
        <el-form-item label="IP地址" prop="ip">
          <el-input type="textarea" v-model.trim="ruleForm.ip" placeholder="请输入IP地址" />
          <div style="color: #a4a4a4;line-height: 20px;">
            <div>支持添加IP：如果添加多个IP请用“,”隔开</div>
            <div v-if="ruleForm.id == 0">支持添加IP段，如192.168.0.0/24</div>
            <div>支持添加IP范围，格式如：192.168.1.xx-192.168.1.xx</div>
          </div>

        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">已禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注	" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, getCurrentInstance } from 'vue';
import api from '/@/api/system';
import { ElMessage } from "element-plus";
import getOrigin from '/@/utils/origin'

interface RuleFormState {
  id: number;
  status: string;
  remark: string;
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
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);
    const baseURL: string | undefined | boolean = getOrigin(import.meta.env.VITE_API_URL)

    const { proxy } = getCurrentInstance() as any;
    const { network_server_type, network_protocols } = proxy.useDict('network_server_type', 'network_protocols');

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
        status: '1',
        remark: ''
      },
      rules: {
        ip: [
          { required: true, message: "IP地址不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "备注不能为空", trigger: "change" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ]
      }
    });

    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      if (row) {
        state.ruleForm = row;
      }
      state.isShowDialog = true;
    };
    const resetForm = () => {
      state.ruleForm = {
        id: 0,
        // name: '',
        // dictType: '',
        // deviceType: '设备',
        status: '1',
        remark: ''
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
            api.blackList.edit(state.ruleForm).then(() => {
              ElMessage.success('黑名单修改成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          } else {
            //添加
            delete state.ruleForm.id;
            api.blackList.add(state.ruleForm).then(() => {
              ElMessage.success('黑名单添加成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          }
        }
      });
    };

    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      network_server_type,
      network_protocols,
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
