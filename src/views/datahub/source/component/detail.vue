<template>
	<div class="system-edit-dic-container">
		<el-dialog title="查看数据源" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
       
        <el-form-item label="数据源名称" prop="name">
          {{ruleForm.name}}
        </el-form-item>

        <el-form-item label="数据类型" prop="types">
           {{ruleForm.types}}
        </el-form-item>

        <el-form-item label="地址" prop="host">
          {{ruleForm.host}}
        </el-form-item>

         <el-form-item label="端口" prop="port">
          {{ruleForm.port}}
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          {{ruleForm.userName}}
        </el-form-item>
        <el-form-item label="密码" prop="password">
           {{ruleForm.password}}
        </el-form-item>
  	
        <el-form-item label="备注" prop="description">
        {{ruleForm.description}}
        </el-form-item>
			</el-form>
		
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import api from '/@/api/datahub';
import {ElMessage} from "element-plus";
interface RuleFormState {
  id:number;
  name:string;
  types:string;
  host:string;
  port:string;
  userName:string;
  password:string;
  description:string;
  status:number;
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
			ruleForm: {
        id:0,
        name:'',
        types:'',
        host:'',
        port:'',
        userName:'',
        password:'',
        description:'',
        status:1,

			},
      rules: {
       
      }
		});
		// 打开弹窗
		const openDialog = (row: RuleFormState|null) => {
      resetForm();


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
        types:'',
        host:'',
        port:'',
        userName:'',
        password:'',
        description:'',
        status:1
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
            api.common.edit(state.ruleForm).then(()=>{
              ElMessage.success('数据源类型修改成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          }else{
            //添加
            api.common.add(state.ruleForm).then(()=>{
              ElMessage.success('数据源类型添加成功');
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
