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
		<el-dialog :title="'验证升级包'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="160px">
				<el-form-item label="批次名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入批次名称" />
				</el-form-item>

				<el-form-item label="待升级版本号" prop="waitVersion">
					<el-input v-model="ruleForm.waitVersion" placeholder="请输入待升级版本号" />
				</el-form-item>

				<el-form-item label="协议方式" prop="method">
					<el-radio-group v-model="ruleForm.method">
						<el-radio label="1">http</el-radio>
						<el-radio label="2">https</el-radio>
						<el-radio label="3">mqtt</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="所属设备" prop="devices" v-if="ruleForm.method == '3'">
					<el-select v-model="ruleForm.devices" placeholder="请选择设备" >
						<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id.toString()" />
					</el-select>
				</el-form-item>

				<el-form-item label="升级方式" prop="stratege">
					<el-radio-group v-model="ruleForm.stratege">
						<el-radio label="1">静态升级</el-radio>
						<el-radio label="2">动态升级</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="主动推送" prop="push">
					<el-radio-group v-model="ruleForm.push">
						<el-radio label="1">是</el-radio>
						<el-radio label="2">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
				<el-button @click="onCancel" size="default">取 消</el-button>
				<el-button type="primary" @click="onSubmit" size="default">{{ruleForm.id!==0?'修 改':'添 加'}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref} from 'vue';
import { ElMessage } from 'element-plus';
import api from '/@/api/ota';

interface RuleFormState {
  id: number;
  name: string;
  waitVersion: string;
  method: string;
  devices: string;
  stratege: string;
  devOtaFirewareId: number;
  push: string;
}
interface UpdateState {
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  productData: [];
  rules: {};
}

export default defineComponent({
  name: 'otaEditUpdateData',
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);
    const state = reactive<UpdateState>({
		isShowDialog: false,
		ruleForm: {
			id: 0,
			name: '',
			waitVersion: '',
			method: '',
			devices: '',
			stratege: '',
      devOtaFirewareId: 0,
			push: '',
		},
	  	productData: [],
      	rules: {
        	name: [{ required: true, message: '批次名称不能为空', trigger: 'blur' }],
			    waitVersion: [{ required: true, message: '待升级版本号不能为空', trigger: 'blur' }],
			    method: [{ required: true, message: '协议方式不能为空', trigger: 'blur' }],
			    stratege: [{ required: true, message: '升级方式不能为空', trigger: 'blur' }],
			    devices: [{ required: true, message: '所属设备不能为空', trigger: 'blur' }],
          push: [{ required: true, message: '推送方式不能为空', trigger: 'blur' }],
      	},
    });
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      if (row) {
        // api.manage.detail(row.id).then((res: any) => {
          state.ruleForm.devOtaFirewareId = row.id;
        // });
      }
      state.isShowDialog = true;
    };
    const resetForm = () => {
      	state.ruleForm = {
        	id: 0,
          name: '',
          waitVersion: '',
          method: '',
          devices: '',
          stratege: '',
          devOtaFirewareId: 0,
          push: '',
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
// 	devOtaFirewareId: '',
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

// const getProductList = () => {
// 	api.batch.getDeviceList({productId:formData.productId}).then((res: any) => {
// 		let productDataList = res.device
// 		productData.value = productDataList
// 	})
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