<!-- 平台接入-新增或者编辑 -->
<template>
		<el-dialog :title="ruleForm.id ? '新增' : '编辑'" v-model="isShowDialog" width="650px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="100px">
				<el-form-item label="平台类型" prop="types">
          <el-select style="width: 100%;" v-model="ruleForm.types" placeholder="请选择">
            <el-option label="电信" value="1"></el-option>
            <el-option disabled label="联通" value="2"></el-option>
            <el-option label="移动" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="App ID" prop="appKey">
          <el-input v-model="ruleForm.appKey" placeholder="请输入App ID" />
        </el-form-item>
        <el-form-item v-if="ruleForm.types == 1" label="secretKey" prop="appSecret">
          <el-input v-model="ruleForm.appSecret" placeholder="请输入secretKey" />
        </el-form-item>
        <el-form-item v-if="ruleForm.types == 1" label="用户id" prop="userId">
          <el-input v-model="ruleForm.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-if="ruleForm.types == 3" label="接口地址" prop="restUrl">
          <el-input v-model="ruleForm.restUrl" placeholder="请输入接口地址" />
        </el-form-item>
        <el-form-item label="状态">
          <!-- 1启用,0禁用 -->
          <el-switch v-model="ruleForm.status" :active-value="1" :inactive-value="0" inline-prompt active-text="启" inactive-text="禁"></el-switch>
        </el-form-item>
        <el-form-item label="说明">
          <el-input :rows="6" type="textarea" v-model="ruleForm.remark" placeholder="请输入说明" />
        </el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button :loading="btnLoading" type="primary" @click="onSubmit">确定</el-button>
				</span>
			</template>
		</el-dialog>
</template>

<script lang="ts" setup>
import api from '/@/api/iotCard';
import { ref, unref } from 'vue';
import { ElMessage } from 'element-plus';

const isShowDialog = ref(false);
const formRef = ref<HTMLElement | null>(null);
const emit = defineEmits(['updateList']);
const btnLoading = ref(false);

const ruleForm = ref({
  id: 0,
  types: "1",
  name: "",
  userId: "",
  password: "",
  appSecret: "",
  remark: "",
  appKey: "",
  restUrl: "",
  status: 1
})

const rules = ref({
  types: [{ required: true, message: '请选择平台类型', trigger: 'change' }],
  name: [{ required: true, message: '请输入名称', trigger: 'change' }],
  userId: [{ required: true, message: '请输入用户id', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'change' }],
  appSecret: [{ required: true, message: '请输入secretKey', trigger: 'change' }],
  appKey: [{ required: true, message: '请输入App ID', trigger: 'change' }],
  restUrl: [{ required: true, message: '请输入接口地址', trigger: 'change' }]
})

/**
 * 新增
 */
const onSubmit = () => {
  const formWrap = unref(formRef) as any;
  if (!formWrap) return;
  formWrap.validate(async (valid: boolean) => {
    if (!valid) return
    btnLoading.value = true
    if(ruleForm.value.id) {
      // 修改
      api.platform.editItem(ruleForm.value)
      .then(() => {
        ElMessage({ type: 'success', message: '修改成功' })
        emit('updateList')
        closeDialog();
        resetForm();
      })
      .finally(() => (btnLoading.value = false))
    }else{
      // 新增
      api.platform.addItem(ruleForm.value)
      .then(() => {
        ElMessage({ type: 'success', message: '添加成功' })
        emit('updateList')
        closeDialog();
        resetForm();
      })
      .finally(() => (btnLoading.value = false))
      }
  });
};

const resetForm = () => {
  ruleForm.value  = {
    id: 0,
    types: "1",
    name: "",
    userId: "",
    password: "",
    appSecret: "",
    remark: "",
    appKey: "",
    restUrl: "",
    status: 1
  }
}

/**
 * 点击取消按钮
 */
const onCancel = () => {
  closeDialog();
};

/**
 * 关闭弹窗
 */
const closeDialog = () => {
  isShowDialog.value = false;
};

const openDialog = (item:any) => {
  if(item) {
    // 修改
    ruleForm.value = { ...item };
  }
  isShowDialog.value = true;
}

defineExpose({ openDialog })
</script>
