<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.dictId!==0?'修改':'添加')+'字典'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="90px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="ruleForm.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="ruleForm.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <!-- 字典类型下拉框 -->
        <el-form-item label="字典分类" prop="moduleClassify">
          <el-select v-model="ruleForm.moduleClassify" placeholder="字典分类" clearable style="width: 240px">
            <el-option v-for="dict in dict_class_type" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1" >启用</el-radio>
            <el-radio :label="0" >禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit">{{ruleForm.dictId!==0?'修 改':'添 加'}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref , getCurrentInstance,} from 'vue';
import api from '/@/api/system';
import {ElMessage} from "element-plus";
interface RuleFormState {
  dictId:number;
  dictName:string;
  dictType:string;
  moduleClassify:string; // 字典分类
  status:number;
  remark:string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
  rules:{}
}

export default defineComponent({
	name: 'systemEditDic',
	setup(prop,{emit}) {
    const { proxy } = getCurrentInstance() as any;
    const { dict_class_type } = proxy.useDict('dict_class_type'); // 获取字典分类
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			ruleForm: {
        dictId:0,
        dictName:'',
        dictType:'',
        moduleClassify:'',
        status:1,
        remark:''
			},
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      }
		});
		// 打开弹窗
		const openDialog = (row: RuleFormState|null) => {
      resetForm();
      if (row){
        api.dict.getType(row.dictId).then((res:any)=>{
          state.ruleForm = res.data.dictType
        })
        state.ruleForm = row;
      }
			state.isShowDialog = true;
		};
    const resetForm = ()=>{
      state.ruleForm = {
        dictId:0,
        dictName:'',
        dictType:'',
        moduleClassify:'',
        status:1,
        remark:''
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
          if(state.ruleForm.dictId!==0){
            //修改
            api.dict.editType(state.ruleForm).then(()=>{
              ElMessage.success('修改成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          }else{
            //添加
            api.dict.addType(state.ruleForm).then(()=>{
              ElMessage.success('添加成功');
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
      dict_class_type,
      formRef,
			...toRefs(state),
		};
	},
});
</script>
