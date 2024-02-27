<template>
  <div class="system-edit-dic-container">
    <el-dialog title="日志详情" v-model="isShowDialog" width="700">
      <el-form label-width="90px" label-position="left">
        <el-form-item label="规则名称">
          {{ ruleForm.ruleName }}
        </el-form-item>
        <el-form-item label="告警类型">
          <span v-if="ruleForm.type == 1">规则告警</span>
          <span v-else>设备自主告警</span>
        </el-form-item>
        <el-form-item label="产品名称">
          {{ product_name }}
        </el-form-item>
        <el-form-item label="设备名称">
          {{ devcie_name }}
        </el-form-item>

        <el-form-item label="告警级别">
          {{ alarmLevel_name }}
        </el-form-item>

        <el-form-item label="告警时间">
          {{ ruleForm.createdAt }}
        </el-form-item>
        <el-form-item label="告警数据">
          <JsonViewer style="width:100%;" :value="jsonData" boxed sort theme="jv-dark" />
        </el-form-item>

        <el-form-item label="处理意见">
          {{ ruleForm.content }}
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref } from 'vue';
import api from '/@/api/alarm';
import 'vue3-json-viewer/dist/index.css';

interface DicState {
  isShowDialog: boolean;
  ruleForm: any;
  product_name: '';
  devcie_name: '';
  alarmLevel_name: '';
  jsonData: {};
}

export default defineComponent({
  name: 'Edit',

  setup() {
    const state = reactive<DicState>({
      isShowDialog: false,
      product_name: '',
      devcie_name: '',
      alarmLevel_name: '',
      ruleForm: {},
      jsonData: {},
    });

    // 打开弹窗
    const openDialog = (row: any) => {
      //resetForm();
      api.log.detail(row.id).then((res: any) => {
        state.ruleForm = res.data;
        state.jsonData = JSON.parse(res.data.data);
        state.product_name = res.data.product.name;
        state.devcie_name = res.data.devcie.name;
        state.alarmLevel_name = res.data.alarmLevel.name;
      });

      state.isShowDialog = true;
    };
    // const resetForm = () => {
    //   state.ruleForm = {};
    // };

    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };

    return {
      openDialog,
      closeDialog,
      onCancel,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 0;
}
</style>
