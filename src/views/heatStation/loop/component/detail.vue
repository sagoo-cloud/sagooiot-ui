<template>
	<div class="system-edit-dic-container">
		<el-dialog title="查看设备" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
       <el-form-item label="设备标识" prop="key">
          {{ruleForm.key}}
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          {{ruleForm.name}}
        </el-form-item>

        

           <el-form-item label="所属产品" prop="productId">
       
                {{ruleForm.productName}}
            </el-form-item> 

         <el-form-item label="所属部门" prop="deptId">
               {{ruleForm.deptName}}
            </el-form-item> 

           
        
        <el-form-item label="设备证书" prop="certificate">
            {{ruleForm.certificate}}
        </el-form-item>

        <el-form-item label="设备秘钥" prop="secureKey">
            {{ruleForm.secureKey}}
        </el-form-item>

         <el-form-item label="固件版本号" prop="version">
          {{ruleForm.version}}
        </el-form-item>
      
  
        <el-form-item label="备注" prop="desc">
           {{ruleForm.desc}}
        </el-form-item>
			</el-form>

		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import api from '/@/api/device';
import {ElMessage} from "element-plus";
interface RuleFormState {
  id:number;
  name:string;
  certificate:string;
  secureKey:string;
  version:string;
  productId:number;
  deptId:number;
  desc:string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
  rules:{}
}

export default defineComponent({
	name: 'deviceEditPro',
	setup(prop,{emit}) {
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
      productData: [], // 分类数据
      deptData: [], // 
			ruleForm: {
        id:0,
        name:'',
        productId:'',
        deptId:0,
        certificate:'',
        secureKey:'',
        version:'',
        desc:''
			},
      rules: {
       
      }
		});
		// 打开弹窗
		const openDialog = (row: RuleFormState|null) => {
      resetForm();

        api.product.getLists({ status: 1 }).then((res: any) => {
          state.productData = res.product || [];
        });
        api.dept.getList({ status: -1 }).then((res: any) => {
          state.deptData = res || [];
        });


      if (row){
        // api.dict.getType(row.id).then((res:any)=>{
        //   state.ruleForm = res.data.dictType
        // })
        state.ruleForm = row;
      }
			state.isShowDialog = true;
		};
    const resetForm = ()=>{
      state.ruleForm = {
        id:0,
        name:'',
        productId:'',
        deptId:0,
        certificate:'',
        secureKey:'',
        version:'',
        desc:''
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
          if(state.ruleForm.id!==0){
            //修改
            api.instance.edit(state.ruleForm).then(()=>{
              ElMessage.success('设备类型修改成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          }else{
            //添加
            api.instance.add(state.ruleForm).then(()=>{
              ElMessage.success('设备类型添加成功');
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
      formRef,
			...toRefs(state),
		};
	},
});
</script>
