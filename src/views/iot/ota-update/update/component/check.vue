<template>
  <!-- <el-dialog
    class="api-edit"
    v-model="showDialog"
    :title="`${formData.id ? '编辑批次' : '新增批次'}`"
    width="768px"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
    <el-form ref="formRef" :model="formData" :rules="ruleForm" label-width="160px"> -->
  <div class="ota-edit-module-container">
    <el-dialog :title="'操作升级包'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="160px">
        <el-form-item label="类型" prop="formType" @change="getFormType">
          <el-radio-group v-model="ruleForm.types">
            <el-radio label="1">验证</el-radio>
            <el-radio label="2">升级</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="批次名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入批次名称" />
        </el-form-item>

        <!--        <el-form-item label="待升级版本号" prop="waitVersion">-->
        <!--          <el-input v-model="ruleForm.waitVersion" placeholder="请输入待升级版本号" />-->
        <!--        </el-form-item>-->

        <el-form-item label="协议方式" prop="method">
          <el-radio-group v-model="ruleForm.method" @change="getMethod">
            <el-radio label="1">http</el-radio>
            <el-radio label="2">https</el-radio>
            <el-radio label="3">mqtt</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="所属设备" prop="devices" v-if="deviceShow">
<!--          <el-select v-model="ruleForm.devices" filterable multiple placeholder="请选择设备" class="width100">-->
<!--            <el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()" />-->
<!--          </el-select>-->

          <!-- 回显已选设备 -->
          <template v-if="deviceNameShow">
            <el-tag v-for="item in deviceNameList" style="margin-right: 10px;">{{ item }}</el-tag>
          </template>

          <el-button type="primary" @click="onOpenDevice()" style="margin-left: 5px; margin-top: 10px;">选择设备</el-button>
        </el-form-item>

        <el-form-item label="升级方式" prop="stratege">
          <el-radio-group v-model="ruleForm.stratege">
            <el-radio label="1" disabled>静态升级</el-radio>
            <el-radio label="2">动态升级</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="主动推送" prop="push">
          <el-radio-group v-model="ruleForm.push">
            <el-radio label="1" :disabled="ruleForm.pushDisabled">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
				<el-button @click="onCancel">取 消</el-button>
				<el-button type="primary" @click="onSubmit">{{ruleForm.id!==0?'修 改':'添 加'}}</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 设备绑定弹窗 -->
    <DeviceBind ref="deviceRef" @bindSuccess="getDeviceTableData" />
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, onMounted, ref, unref} from 'vue';
import { ElMessage } from 'element-plus';
import api from '/@/api/ota';
import rule from "/@/api/rule";
import Device from "/@/views/iot/device/instance/index.vue";
import DeviceBind from "/@/views/iot/ota-update/update/component/deviceBind.vue";

interface RuleFormState {
  id: number;
  name: string;
  waitVersion: string;
  method: string;
  devices: Array;
  stratege: string;
  devOtaFirmwareId: number;
  push: string;
  pushDisabled: boolean,
  types: string;
  productId: string;
}
interface UpdateState {
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  productData: [];
  rules: {};
  deviceShow: boolean;
  deviceNameShow: boolean;
  deviceNameList: [];
}

export default defineComponent({
  name: 'otaEditUpdateData',
  components: {DeviceBind},
  computed: {
    rule() {
      return rule
    }
  },
  setup(prop, { emit }) {
    const deviceRef = ref();
    const formRef = ref<HTMLElement | null>(null);
    const state = reactive<UpdateState>({
      isShowDialog: false,
      ruleForm: {
        id: 0,
        name: '',
        waitVersion: '',
        method: '1',
        devices: [],
        stratege: '2',
        devOtaFirmwareId: 0,
        push: '2',
        pushDisabled: true,
        types: '1',
        productId: '',
      },
      productData: [],
      rules: {
        name: [{ required: true, message: '批次名称不能为空', trigger: 'blur' }],
        method: [{ required: true, message: '协议方式不能为空', trigger: 'blur' }],
        stratege: [{ required: true, message: '升级方式不能为空', trigger: 'blur' }],
        push: [{ required: true, message: '推送方式不能为空', trigger: 'blur' }],
        types: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
      },
      deviceShow: false, // 所属设备是否显示
      deviceNameShow: false, // 回显设备名称状态
      deviceNameList: [], // 回显设备名称
    });
    // 页面加载时
    onMounted(() => {
      // getProductList();
      getFormType();
    });
    // 获取操作升级包类型
    const getFormType = () => {
      // 如果是验证类型，设备信息必填项
      if (state.ruleForm.types === '1') {
        state.deviceShow = true;
        state.rules.devices = [{
          required: true,
          message: '所属设备不能为空',
          trigger: 'blur'
        }];
      } else { // 如果是升级类型，设备可选可不选
        delete (state.rules.devices);
        state.deviceShow = false;
      }
    };
    // 获取协议方式
    const getMethod = () => {
      // 如果是http、https协议则主动推送为否
      // if (state.ruleForm.method === '1') {
        state.ruleForm.push = '2';
        state.ruleForm.pushDisabled = true;
      // }
      // if (state.ruleForm.method === '2') {
      //   state.ruleForm.push = '2';
      //   state.ruleForm.pushDisabled = true;
      // }
      if (state.ruleForm.method === '3'){
        state.ruleForm.pushDisabled = false;
        state.ruleForm.push = '1';
      }
    };
    const getProductList = () => {
      api.batch.getDeviceList({ productId: state.ruleForm.productId}).then((res: any) => {
        state.productData = res.device
      })
    }
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      state.deviceNameList = [];
      state.deviceNameShow = false;
      if (row) {
        state.ruleForm.devOtaFirmwareId = row.id;
        state.ruleForm.productId = row.productId;
      }
      state.isShowDialog = true;

      if (state.ruleForm.types == '1') {
        state.deviceShow = true;
      }
    };
    const resetForm = () => {
      state.ruleForm = {
        id: 0,
        name: '',
        waitVersion: '',
        method: '1',
        devices: [],
        stratege: '2',
        devOtaFirmwareId: 0,
        push: '2',
        pushDisabled: true,
        types: '1',
        productId: '',
      };
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
      state.deviceNameList = [];
      state.deviceNameShow = false;
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
            api.batch.edit(state.ruleForm).then(() => {
              ElMessage.success('升级包修改成功');
              closeDialog(); // 关闭弹窗
              emit('getList');
            });
          } else {
            //添加
            api.batch.add(state.ruleForm).then(() => {
              ElMessage.success('升级包添加成功');
              closeDialog(); // 关闭弹窗
              emit('getList');
            });
          }
        }
      });
    };
    // 获取设备列表
    const getDeviceTableData = (deviceIdList: any, deviceNameList: any) => {
      state.ruleForm.devices = deviceIdList;
      state.deviceNameList = deviceNameList;
      state.deviceNameShow = true;
    };
    // 打开设备列表
    const onOpenDevice = () => {
      deviceRef.value.openDialog(state.ruleForm.devices, state.ruleForm.productId);
    };
    return {
      deviceRef,
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      getMethod,
      getFormType,
      onOpenDevice,
      getDeviceTableData,
      formRef,
      ...toRefs(state),
    };
  },
});


// import { ref, reactive, nextTick } from 'vue'
// import api from '/@/api/ota'
// import { ruleRequired } from '/@/utils/validator'
// import { ElMessage } from 'element-plus'


// const emit = defineEmits(['getList'])

// const showDialog = ref(false)
// const formRef = ref()

// const productData = ref([
// 	{
// 		id: '',
// 		name: '',
// 	},
// ])
// const baseForm = {
// 	id: undefined,
// 	method: '1',
// 	push: '1',
// 	name: '',
// 	devices: '',
// 	stratege: '1',
// 	waitVersion: '',
// 	devOtaFirmwareId: '',
// 	productId:'',
// }

// const formData = reactive({
// 	...baseForm,
// })

// const ruleForm = {
// 	method: [ruleRequired('请选择批次类型')],
// 	name: [ruleRequired('批次名称不能为空')],
// 	productId: [ruleRequired('请选择所属产品')],
// 	devices: [ruleRequired('请选择批次模块')],
// 	stratege: [ruleRequired('批次版本号不能为空')],
// 	waitVersion: [ruleRequired('升级后版本号不能为空')],
// }


// const onSubmit = async () => {
// 	await formRef.value.validate()

// 	const theApi = formData.id ? api.batch.edit : api.batch.add
// 	await theApi(formData)
// 	ElMessage.success('操作成功')
// 	resetForm()
// 	showDialog.value = false
// 	emit('getList')
// }

// const resetForm = async () => {
// 	Object.assign(formData, { ...baseForm })
// 	formRef.value && formRef.value.resetFields()
// }

// const open = async (row: any) => {
// 	resetForm()
// 	showDialog.value = true
// 	nextTick(() => {
// 		Object.assign(formData, { ...row })
// 		getProductList()

// 	})
// }

// defineExpose({ open })
</script>

<style lang="scss" scoped>
.width100 {
  width: 100%;
}
</style>