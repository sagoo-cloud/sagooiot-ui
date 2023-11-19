<template>
  <div class="ota-edit-module-container">
    <el-dialog :title="(ruleForm.id!==0?'修改':'添加')+'升级包'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="160px">
        <el-form-item label="升级包类型" prop="typo">
          <el-radio-group v-model="ruleForm.typo">
            <el-radio label="1">整包</el-radio>
            <el-radio label="2">差分</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="升级包名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入升级包名称"/>
        </el-form-item>

        <el-form-item label="所属产品" prop="productId">
          <el-select v-model="ruleForm.productId" placeholder="请选择产品" @change="seletChange">
            <el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()"/>
          </el-select>
        </el-form-item>

        <el-form-item label="升级包模块" prop="module">
          <el-select v-model="ruleForm.module" placeholder="请选择产品">
            <el-option v-for="item in moduleData" :key="item.id" :label="item.name" :value="item.id.toString()"/>
          </el-select>
        </el-form-item>

        <el-form-item label="升级包版本号" prop="version" v-if="ruleForm.typo == '1'">
          <el-input v-model="ruleForm.version" placeholder="请输入待升级包版本号"/>
        </el-form-item>

        <el-form-item label="待升级版本号" prop="waitVersion" v-if="ruleForm.typo == '2'">
          <el-input v-model="ruleForm.waitVersion" placeholder="请输入待升级版本号"/>
        </el-form-item>

        <el-form-item label="升级后版本号" prop="afterVersion" v-if="ruleForm.typo == '2'">
          <el-input v-model="ruleForm.afterVersion" placeholder="请输入升级后版本号"/>
        </el-form-item>

        <el-form-item label="算法签名" prop="are">
          <el-select v-model="ruleForm.are" placeholder="请选择算法签名">
            <el-option v-for="item in areType" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="选择升级包" prop="url">
          <el-upload :accept="['.bin','.tar','.gz','.tar.xz','.zip','.gzip','.apk','.dav','.pack']"
                     :show-file-list="false" :limit="1" :headers="headers" :action="uploadUrl" :on-success="updateImg">
            <el-button type="Default">上传升级包</el-button>
          </el-upload>
          <div v-if="ruleForm.urlName" style="color: green;margin-left: 10px;">{{ ruleForm.urlName }}，上传成功</div>
          <div v-else>{{ ruleForm.url }}</div>
        </el-form-item>

        <el-form-item label="升级包是否验证" prop="check">
          <el-radio-group v-model="ruleForm.check">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="升级包描述" prop="describe">
          <el-input v-model="ruleForm.describe" type="textarea" :rows="3"/>
        </el-form-item>

        <el-form-item label="推送设备的自定义消息" prop="info">
          <el-input v-model="ruleForm.info" type="textarea" :rows="3"/>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
				<el-button @click="onCancel" size="default">取 消</el-button>
				<el-button type="primary" @click="onSubmit"
                   size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, ref, unref, getCurrentInstance,} from 'vue';
import {ElMessage} from 'element-plus';
import api from '/@/api/ota';
import getOrigin from '/@/utils/origin';

interface RuleFormState {
  id: number;
  typo: string;
  name: string;
  productId: '';
  module: string;
  version: string;
  waitVersion: string;
  afterVersion: string;
  are: string;
  check: string;
  describe: string;
  info: string;
  url: string;
  urlName: string;
}

interface UpdateState {
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  productData: [];
  moduleData: [];
  rules: {};
}

export default defineComponent({
  name: 'otaEditUpdateData',
  setup(prop, {emit}) {
    const formRef = ref<HTMLElement | null>(null);
    const headers = {Authorization: 'Bearer ' + localStorage.token,};
    const uploadUrl: string = getOrigin(import.meta.env.VITE_API_URL + "/common/singleFile");
    const areType = ref([
      {
        label: 'MD5',
        value: 'MD5',
      },
      {
        label: 'SHA256',
        value: 'SHA256',
      },
    ]);
    const urlName = ref();
    const state = reactive<UpdateState>({
      isShowDialog: false,
      ruleForm: {
        id: 0,
        typo: '1',
        name: '',
        productId: '',
        module: '',
        version: '',
        waitVersion: '',
        afterVersion: '',
        are: '',
        check: '',
        describe: '',
        info: '',
        url: '',
        urlName: '',
      },
      productData: [],
      moduleData: [],
      rules: {
        typo: [{required: true, message: '升级包类型不能为空', trigger: 'blur'}],
        name: [{required: true, message: '升级包名称不能为空', trigger: 'blur'}],
        productId: [{required: true, message: '所属产品不能为空', trigger: 'blur'}],
        module: [{required: true, message: '升级包模块不能为空', trigger: 'blur'}],
        version: [{required: true, message: '升级包版本号不能为空', trigger: 'blur'}],
        waitVersion: [{required: true, message: '待升级版本号不能为空', trigger: 'blur'}],
        afterVersion: [{required: true, message: '升级后版本号不能为空', trigger: 'blur'}],
        are: [{required: true, message: '算法签名不能为空', trigger: 'blur'}],
        url: [{required: true, message: '升级包不能为空', trigger: 'blur'}],
      },
    });
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      if (row) {
        api.manage.detail(row.id).then((res: any) => {
          const data: RuleFormState = res.data.data;
          state.ruleForm = data;
        });
        seletChange(row.productId);
        state.ruleForm = row;
      }

      // 获取产品列表
      api.module.getSubList().then((res: any) => {
        state.productData = res.product;
      });

      state.isShowDialog = true;
    };
    const resetForm = () => {
      state.ruleForm = {
        id: 0,
        typo: '1',
        name: '',
        productId: '',
        module: '',
        version: '',
        waitVersion: '',
        afterVersion: '',
        are: '',
        check: '',
        describe: '',
        info: '',
        url: '',
        urlName: '',
      };
    };
    const updateImg = (res: any) => {
      if (res.code === 0) {
        state.ruleForm.url = res.data.full_path
        state.ruleForm.urlName = res.data.name
        ElMessage.success('上传成功');
      } else {
        ElMessage.error(res.message);
      }
    };
    const seletChange = (val: Number) => {
      getModuleList(val);
    };
    const getModuleList = (productID: Number) => {
      state.ruleForm.module = '';
      api.module.getList({productID: productID}).then((res: any) => {
        state.moduleData = res.Data;
      });
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
            api.manage.edit(state.ruleForm).then(() => {
              ElMessage.success('升级包修改成功');
              closeDialog(); // 关闭弹窗
              emit('getList');
            });
          } else {
            //添加
            api.manage.add(state.ruleForm).then(() => {
              ElMessage.success('升级包添加成功');
              closeDialog(); // 关闭弹窗
              emit('getList');
            });
          }
        }
      });
    };
    return {
      openDialog,
      closeDialog,
      seletChange,
      onCancel,
      onSubmit,
      formRef,
      areType,
      headers,
      uploadUrl,
      urlName,
      updateImg,
      ...toRefs(state),
    };
  },
});
</script>