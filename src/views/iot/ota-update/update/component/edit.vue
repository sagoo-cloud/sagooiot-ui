<template>
  <div class="ota-edit-module-container">
    <el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '升级包'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" v-if="isShowDialog" label-width="160px">
        <el-form-item label="升级包类型" prop="typo">
          <el-radio-group v-model="ruleForm.typo">
            <el-radio label="1">整包</el-radio>
            <el-radio label="2" disabled>差分</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="升级包名称" prop="name">
          <el-input v-model.trim="ruleForm.name" placeholder="请输入升级包名称" />
        </el-form-item>

        <el-form-item label="所属产品" prop="productId">
          <el-select v-model="ruleForm.productId" placeholder="请选择产品" @change="seletChange">
            <el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()" />
          </el-select>
        </el-form-item>

        <el-form-item label="升级包模块" prop="module">
          <el-select v-model="ruleForm.module" placeholder="请选择升级包模块">
            <el-option v-for="item in moduleData" :key="item.id" :label="item.name" :value="item.id.toString()" />
          </el-select>

          <!-- 添加模块 -->
          <el-button type="success" @click="onOpenAddDic()" style="margin-left: 5px;">添加升级包模块</el-button>
        </el-form-item>

        <el-form-item label="升级包版本号" prop="version" v-if="ruleForm.typo == '1'">
          <el-input v-model="ruleForm.version" placeholder="请输入待升级包版本号" />
        </el-form-item>

        <el-form-item label="待升级版本号" prop="waitVersion" v-if="ruleForm.typo == '2'">
          <el-input v-model="ruleForm.waitVersion" placeholder="请输入待升级版本号" />
        </el-form-item>

        <el-form-item label="升级后版本号" prop="afterVersion" v-if="ruleForm.typo == '2'">
          <el-input v-model="ruleForm.afterVersion" placeholder="请输入升级后版本号" />
        </el-form-item>

        <el-form-item label="算法签名" prop="are">
          <el-select v-model="ruleForm.are" placeholder="请选择算法签名">
            <el-option v-for="item in areType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择升级包" prop="url">
          <el-upload :file-list="fileList" :accept="fileAccept" :show-file-list="false" :limit="1" :headers="headers" :data="{ source }" :action="uploadUrl" :on-success="updateImg">
            <el-button type="Default">上传升级包</el-button>
          </el-upload>
          <div v-if="ruleForm.urlName" style="color: green;margin-left: 10px;">{{ ruleForm.urlName }}，上传成功</div>
          <div v-else>{{ ruleForm.url }}</div>
        </el-form-item>

        <el-form-item label="升级包是否验证" prop="check">
          <el-radio-group v-model="ruleForm.check">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="升级包描述" prop="describe">
          <el-input v-model="ruleForm.describe" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="推送设备的自定义消息" prop="info">
          <el-input v-model="ruleForm.info" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加模块 -->
    <EditConfig ref="editDicRef" />
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import { ElMessage } from 'element-plus';
import api from '/@/api/ota';
import getOrigin from '/@/utils/origin';
import { checkVersion } from '/@/utils/validator';
import apiSystem from "/@/api/system";
import EditConfig from "/@/views/iot/ota-update/module/component/edit.vue";

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
  ossurl: string,
  urlName: string;
}

interface UpdateState {
  uploadUrl: string;
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  productData: [];
  moduleData: [];
  rules: {};
  uploadFileWay: number;
  fileAccept: [];
}

export default defineComponent({
  name: 'otaEditUpdateData',
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);
    const headers = { Authorization: 'Bearer ' + localStorage.token, };
    const source = JSON.parse(localStorage.sysinfo || '{"uploadFileWay": 0}').uploadFileWay;
    const editDicRef = ref();
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
    const fileList = ref([]);
    const urlName = ref();
    const state = reactive<UpdateState>({
      uploadUrl: getOrigin(import.meta.env.VITE_API_URL + '/common/singleFile'), // 上传地址
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
        check: '2',
        describe: '',
        info: '',
        url: '',
        ossurl: '',
        urlName: '',
      },
      productData: [],
      moduleData: [],
      rules: {
        typo: [{ required: true, message: '升级包类型不能为空', trigger: 'change' }],
        name: [{ required: true, message: '升级包名称不能为空', trigger: 'change' }],
        productId: [{ required: true, message: '所属产品不能为空', trigger: 'change' }],
        module: [{ required: true, message: '升级包模块不能为空', trigger: 'change' }],
        version: [
          { required: true, message: '升级包版本号不能为空', trigger: 'change' },
          { validator: checkVersion, message: '输入版本号格式错误，示例：（xx.xxx.xxx）', trigger: 'blue' }
        ],
        waitVersion: [{ required: true, message: '待升级版本号不能为空', trigger: 'change' }],
        afterVersion: [{ required: true, message: '升级后版本号不能为空', trigger: 'change' }],
        are: [{ required: true, message: '算法签名不能为空', trigger: 'change' }],
        url: [{ required: true, message: '升级包不能为空', trigger: 'change' }],
      },
      uploadFileWay: 0,// 上传方式
      fileAccept: [], // 上传格式
    });
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      if (row) {
        api.manage.detail(row.id).then((res: any) => {
          const data: RuleFormState = res;
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

      // 获取上传格式
      apiSystem.getInfoByKey({ ConfigKey: 'sys.uploadFile.fileType' }).then((res: any) => {
        let fileType = res.data.configValue.split(",");
        for (let i = 0; i < fileType.length; i++) {
          fileType[i] = '.' + fileType[i];
        }
        state.fileAccept = fileType;
      });
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
        check: '2',
        describe: '',
        info: '',
        url: '',
        ossurl: '',
        urlName: '',
      };
    };
    const updateImg = (res: any) => {
      if (res.code === 0) {
        state.ruleForm.url = res.data.full_path
        state.ruleForm.urlName = res.data.name
        state.ruleForm.ossurl = res.data.full_path
        fileList.value = []
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
      api.module.getList({ productID: productID }).then((res: any) => {
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
            state.ruleForm.ossurl = state.ruleForm.url;
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
    // 添加模块
    const onOpenAddDic = () => {
      editDicRef.value.openDialog();
    };
    return {
      editDicRef,
      openDialog,
      closeDialog,
      seletChange,
      onCancel,
      onSubmit,
      formRef,
      areType,
      source,
      headers,
      fileList,
      urlName,
      updateImg,
      onOpenAddDic,
      ...toRefs(state),
    };
  },
  components: { EditConfig },
});
</script>