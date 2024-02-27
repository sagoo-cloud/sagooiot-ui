<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '功能定义'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="120px">
        <el-form-item label="功能定义标识" prop="key">
          <el-input v-model="ruleForm.key" placeholder="请输入功能定义标识" />
        </el-form-item>
        <el-form-item label="功能定义名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入功能定义名称" />
        </el-form-item>
        <el-form-item label="数据类型" prop="valueType">
          <el-select v-model="ruleForm.valueType" placeholder="请选择数据类型">
            <el-option-group v-for="group in typeData" :key="group" :label="group">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item label="是否只读" prop="accessMode">
          <el-radio-group v-model="ruleForm.accessMode">
            <el-radio label="1">只读</el-radio>
            <el-radio label="0">读写</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="功能定义描述	" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入功能定义描述"></el-input>
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
import { ElMessage } from "element-plus";

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
  typeData: RuleFormState[];
  rules: {}
}

export default defineComponent({
  name: 'deviceEditPro',
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);

    const state = reactive<DicState>({
      isShowDialog: false,
      typeData: [], //

      ruleForm: {
        id: 0,
        name: '',
        key: '',
        transportProtocol: '',
        accessMode: '1',
        status: 1,
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: "功能定义名称不能为空", trigger: "blur" }
        ],
        key: [
          { required: true, message: "功能定义标识不能为空", trigger: "blur" }
        ],
        accessMode: [{ required: true, message: '功能定义分类不能为空', trigger: 'blur' }],
        deptId: [{ required: true, message: '所属组织不能为空', trigger: 'blur' }],
        deviceType: [{ required: true, message: '设备类型不能为空', trigger: 'blur' }],
      }
    });

    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();

      api.product.getDataType({ status: -1 }).then((res: any) => {
        state.typeData = res.dataType || [];
      });

      if (row) {
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
              ElMessage.success('功能定义类型修改成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          } else {
            //添加
            api.product.add(state.ruleForm).then(() => {
              ElMessage.success('功能定义类型添加成功');
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
