<template>
	<div class="system-edit-dic-container">
		<el-dialog title="数据记录" v-model="isShowDialog" width="75%">


			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">




       <el-form-item :label="item+'：'"  v-for="(item,index) in jData" >
          {{jsonsData[index]}}
        </el-form-item>


        
			</el-form>

		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import api from '/@/api/datahub';
import {ElMessage} from "element-plus";

interface DicState {
	isShowDialog: boolean;
}

export default defineComponent({
	name: 'deviceEditPro',
	setup(prop,{emit}) {
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
      jsonsData:[],
      jData:[]
	
 
		});
		// 打开弹窗
		const openDialog = (row: RuleFormState|null) => {
      resetForm();
      if (row){
        api.template.getdata(row.id).then((res:any)=>{

          const jsonData=JSON.parse(res.data);
        
          state.jData=Object.keys(jsonData);
          console.log(state.jData);
          state.jData.forEach((item, index) => {
						state.jsonsData[index] = jsonData[item];
					});

          console.log(state.jsonsData);
          //state.ruleForm = res.data.dictType
        })
        state.ruleForm = row;
      }
			state.isShowDialog = true;
		};
    const resetForm = ()=>{
      state.jsonsData=[];
      state.jData=[];
    };
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};


		return {
			openDialog,
			closeDialog,
			onCancel,
      formRef,
			...toRefs(state),
		};
	},
});
</script>
