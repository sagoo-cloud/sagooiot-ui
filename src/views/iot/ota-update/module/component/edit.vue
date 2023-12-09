<template>
	<div class="ota-edit-module-container">
		<el-dialog :title="(ruleForm.id!==0?'修改':'添加')+'模块'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="90px">
				<el-form-item label="所属产品" prop="productId">
					<el-select v-model="ruleForm.productId" placeholder="请选择产品">
						<el-option v-for="item in productData" :key="item.name" :label="item.name" :value="item.id.toString()" />
					</el-select>
				</el-form-item>
				<el-form-item label="模块名称" prop="name">
					<el-input v-model.trim="ruleForm.name" placeholder="请输入模块名称" />
				</el-form-item>
				<el-form-item label="模块别名" prop="nameAs">
					<el-input v-model.trim="ruleForm.nameAs" placeholder="请输入模块别名" />
				</el-form-item>
				<el-form-item label="模块描述" prop="describe">
					<el-input v-model.trim="ruleForm.describe" type="textarea" placeholder="请输入内容" />
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
  nameAs: string;
  productId: '';
  describe: string;
}
interface ModuleState {
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  productData: [],
  rules: {};
}

export default defineComponent({
  name: 'otaEditModuleData',
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);
    const state = reactive<ModuleState>({
      isShowDialog: false,
      ruleForm: {
        id: 0,
        name: '',
        nameAs: '',
        productId: '',
		    describe: '',
      },
	    productData: [],
      rules: {
        productId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '模块名称不能为空', trigger: 'blur' }],
        nameAs: [{ required: true, message: '模块别名不能为空', trigger: 'blur' }],
      },
    });
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();
      if (row) {
        api.module.detail(row.id).then((res: any) => {
          const data: RuleFormState = res.data.data;
          state.ruleForm = data;
        });
		
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
        name: '',
        nameAs: '',
        productId: '',
        describe: '',
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
            api.module.edit(state.ruleForm).then(() => {
              ElMessage.success('模块修改成功');
              closeDialog(); // 关闭弹窗
              emit('getList');
            });
          } else {
            //添加
            api.module.add(state.ruleForm).then(() => {
              ElMessage.success('模块添加成功');
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
</script>