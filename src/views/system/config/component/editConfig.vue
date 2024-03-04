<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(ruleForm.configId!==0?'修改':'添加')+'参数'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="90px">
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="ruleForm.configName" placeholder="请输入参数名称" />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="ruleForm.configKey" placeholder="请输入参数键名" />
        </el-form-item>
        <!-- 字典类型下拉框 -->
        <el-form-item label="参数分类" prop="moduleClassify">
          <el-select v-model="ruleForm.moduleClassify" placeholder="参数分类" clearable style="width: 240px">
            <el-option v-for="dict in param_class_type" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="ruleForm.configValue" placeholder="请输入参数键值" />
        </el-form-item>
        <el-form-item label="系统内置" prop="configType">
          <el-radio-group v-model="ruleForm.configType">
            <el-radio v-for="dict in sysYesNoOptions" :key="dict.value" :label="Number(dict.value)">{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit">{{ruleForm.configId!==0?'修 改':'添 加'}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, getCurrentInstance,} from 'vue';
import { ElMessage } from 'element-plus';
import api from '/@/api/system';
interface RuleFormState {
  configId: number;
  configName: string;
  configKey: string;
  configValue: string;
  configType: number;
  remark: string;
  moduleClassify:string; // 字典分类
}
interface DicState {
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  rules: {};
}

const baseForm: RuleFormState = {
  configId: 0,
  configName: '',
  configKey: '',
  configValue: '',
  configType: 0,
  remark: '',
  moduleClassify: '',
}

export default defineComponent({
  name: 'systemEditDicData',
  props: {
    sysYesNoOptions: {
      type: Array,
      default: () => [],
    },
  },
  setup(prop, { emit }) {
    const { proxy } = getCurrentInstance() as any;
    const { param_class_type } = proxy.useDict('param_class_type'); // 获取字典分类
    const formRef = ref<HTMLElement | null>(null);
    const state = reactive<DicState>({
      isShowDialog: false,
      ruleForm: {
        ...baseForm
      },
      rules: {
        configName: [{ required: true, message: '参数名称不能为空', trigger: 'change' }],
        configKey: [{ required: true, message: '参数键名不能为空', trigger: 'change' }],
        moduleClassify: [{ required: true, message: '字典分类不能为空', trigger: 'change' }],
        configValue: [{ required: true, message: '参数键值不能为空', trigger: 'change' }],
      },
    });
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      if (row) {
        state.ruleForm = row;
        api.config.detail(row.configId).then((res: any) => {
          const data: RuleFormState = res.data;
          state.ruleForm = data;
        });
      }
      state.isShowDialog = true;
    };
    const resetForm = () => {
      state.ruleForm = {
        ...baseForm
      };
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
          if (state.ruleForm.configId !== 0) {
            //修改
            api.config.edit(state.ruleForm).then(() => {
              ElMessage.success('参数修改成功');
              closeDialog(); // 关闭弹窗
              emit('dataList');
            });
          } else {
            //添加
            api.config.add(state.ruleForm).then(() => {
              ElMessage.success('参数添加成功');
              closeDialog(); // 关闭弹窗
              emit('dataList');
            });
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
      param_class_type,
    };
  },
});
</script>
