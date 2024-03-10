<template>
  <div class="ota-edit-module-container">
    <el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '升级包'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" v-if="isShowDialog" label-width="160px">
        <el-form-item label="升级包类型" prop="types">
          <el-radio-group v-model="ruleForm.types">
            <el-radio label="1">整包</el-radio>
            <el-radio label="2" disabled>差分</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="升级包名称" prop="name">
          <el-input v-model.trim="ruleForm.name" placeholder="请输入升级包名称" />
        </el-form-item>

        <el-form-item label="所属产品" prop="productKey">
          <!-- 回显已选产品 -->
          <template v-if="productNameShow">
            <el-tag style="margin-right: 10px;">{{ productName }}</el-tag>
          </template>

          <el-button type="primary" @click="onOpenProduct()">选择产品</el-button>
        </el-form-item>

        <el-form-item label="升级包模块" prop="module">
          <el-select v-model="ruleForm.module" filterable placeholder="请选择升级包模块">
            <el-option v-for="item in moduleData" :key="item.id" :label="item.name" :value="item.id.toString()" />
          </el-select>

          <!-- 添加模块 -->
          <el-button type="success" @click="onOpenAddDic()" style="margin-left: 5px;">添加升级包模块</el-button>
        </el-form-item>

        <el-form-item label="升级包版本号" prop="version" v-if="ruleForm.types == '1'">
          <el-input v-model="ruleForm.version" placeholder="请输入待升级包版本号" />
        </el-form-item>

        <el-form-item label="待升级版本号" prop="waitVersion" v-if="ruleForm.types == '2'">
          <el-input v-model="ruleForm.waitVersion" placeholder="请输入待升级版本号" />
        </el-form-item>

        <el-form-item label="升级后版本号" prop="afterVersion" v-if="ruleForm.types == '2'">
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
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加模块 -->
    <EditConfig ref="editDicRef" @getList="getList" />

    <!-- 产品绑定弹窗 -->
    <ProductBind ref="productRef" @bindSuccess="getProductTableData" />
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import { ElMessage } from 'element-plus';
import api from '/@/api/ota';
import getOrigin from '/@/utils/origin';
import { checkVersion } from '/@/utils/validator';
import apiSystem from "/@/api/system";
import apiProduct from "/@/api/device"
import EditConfig from "/@/views/iot/ota-update/module/component/edit.vue";
import ProductBind from "/@/views/iot/ota-update/update/component/productBind.vue";

interface RuleFormState {
  id: number;
  types: string;
  name: string;
  productKey: string;
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
  size: string;
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
  productNameShow: boolean;
  productName: string;
}

export default defineComponent({
  name: 'otaEditUpdateData',
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);
    const headers = { Authorization: 'Bearer ' + sessionStorage.token, };
    const source = JSON.parse(localStorage.sysinfo || '{"uploadFileWay": 0}').uploadFileWay;
    const productRef = ref();
    const editDicRef = ref();
    const fileList = ref([]);
    const urlName = ref();
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
    const state = reactive<UpdateState>({
      uploadUrl: getOrigin(import.meta.env.VITE_API_URL + '/common/singleFile'), // 上传地址
      isShowDialog: false,
      ruleForm: {
        id: 0,
        types: '1',
        name: '',
        productKey: '',
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
        size: '',
      },
      productData: [],
      moduleData: [],
      rules: {
        types: [{ required: true, message: '升级包类型不能为空', trigger: 'change' }],
        name: [{ required: true, message: '升级包名称不能为空', trigger: 'change' }],
        productKey: [{ required: true, message: '所属产品不能为空', trigger: 'change' }],
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
      productNameShow: false, // 回显产品名称状态
      productName: '', // 回显产品名称
    });
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      if (row) {
        api.manage.detail(row.id).then((res: any) => {
          const data: RuleFormState = res;
          state.ruleForm = data;
        });
        selectChange(row.productKey);
        state.ruleForm = row;
        // 获取产品名称
        apiProduct.product.detail(state.ruleForm.productKey).then((res: any) => {
          if (res.data) {
            state.productNameShow = true;
            state.productName = res.data.name;
          }
        })
      }

      // 获取产品列表
      api.module.getSubList().then((res: any) => {
        state.productData = res.product;
      });

      state.isShowDialog = true;
      state.productNameShow = false;

      // 获取上传格式
      apiSystem.getInfoByKey('sys.uploadFile.fileType').then((res: any) => {
        if (res.data) {
          let fileType = res.data.configValue.split(",");
          for (let i = 0; i < fileType.length; i++) {
            fileType[i] = '.' + fileType[i];
          }
          state.fileAccept = fileType;
        }
      });
    };
    const resetForm = () => {
      state.ruleForm = {
        id: 0,
        types: '1',
        name: '',
        productKey: '',
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
        size: '',
      };
    };
    const updateImg = (res: any) => {
      if (res.code === 0) {
        state.ruleForm.url = res.data.full_path
        state.ruleForm.urlName = res.data.name
        state.ruleForm.ossurl = res.data.full_path
        state.ruleForm.size = res.data.size;
        fileList.value = []
        ElMessage.success('上传成功');
      } else {
        ElMessage.error(res.message);
      }
    };
    const selectChange = (val: string) => {
      getModuleList(val);
    };
    const getModuleList = (productKey?: string) => {
      state.ruleForm.module = '';
      if (!productKey) {
        productKey = state.ruleForm.productKey
      }
      api.module.getList({ productKey }).then((res: any) => {
        state.moduleData = res.Data;
      });
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
      state.productNameShow = false;
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
    // 添加升级包模块后回调方法
    const getList = () => {
      getModuleList()
    }
    const onOpenProduct = () => {
      productRef.value.openDialog();
    }
    // 获取产品回显数据
    const getProductTableData = (productKeyList: any, deviceNameList: any) => {
      state.ruleForm.productKey = productKeyList[0];
      selectChange(productKeyList[0]);
      state.productName = deviceNameList[0];
      state.productNameShow = true;
    }
    return {
      editDicRef,
      openDialog,
      closeDialog,
      selectChange,
      onCancel,
      onSubmit,
      productRef,
      formRef,
      areType,
      source,
      headers,
      fileList,
      urlName,
      updateImg,
      onOpenAddDic,
      getList,
      onOpenProduct,
      getModuleList,
      getProductTableData,
      ...toRefs(state),
    };
  },
  components: {ProductBind, EditConfig },
});
</script>