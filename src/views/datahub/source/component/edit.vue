<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.sourceId!==0?'修改':'添加')+'数据源'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
       
        <el-form-item label="数据源标识" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入数据源名称" />
        </el-form-item>
        <el-form-item label="数据源名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入数据源名称" />
        </el-form-item>

        <el-form-item label="数据来源" prop="from">
					<el-radio-group v-model="ruleForm.from"  >
						<el-radio :label="1">api导入</el-radio>
						<el-radio :label="2">数据库</el-radio>
						<el-radio :label="3">文件</el-radio>
					</el-radio-group>
				</el-form-item>

        <el-form-item label="地址" prop="host">
          <el-input v-model="ruleForm.host" placeholder="请输入地址" />
        </el-form-item>

         <el-form-item label="端口" prop="port">
          <el-input v-model="ruleForm.port" placeholder="请输入端口" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" />
        </el-form-item>

        <el-divider content-position="left">数据源配置</el-divider>

        <el-form-item label="请求方法" prop="method">
              <el-select v-model="config.method" placeholder="请选择请求方法">
                  <el-option
                    v-for="item in methodData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
          </el-form-item>


        <el-form-item label="请求地址" prop="url">
          <el-input v-model="config.url" placeholder="请输入请求地址" />
        </el-form-item>
        <el-form-item label="更新时间" prop="interval">
          <el-input v-model="config.interval" placeholder="请输入更新时间" class="w-35" />
          <el-select v-model="config.intervalUnit" placeholder="请选择单位">
                  <el-option
                    v-for="item in unitData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
        </el-form-item>

        <div class="box-content">
        
        </div>

  	    <el-form-item label="状态" prop="status">
					<el-radio-group v-model="ruleForm.status"  >
						<el-radio label="0">未启用</el-radio>

						<el-radio label="1">启用</el-radio>
					</el-radio-group>
				</el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ruleForm.sourceId!==0?'修 改':'添 加'}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import api from '/@/api/datahub';
import {ElMessage} from "element-plus";
interface RuleFormState {
  sourceId:number;
  name:string;
  from:number;
  key:string;
  port:string;
  userName:string;
  password:string;
  desc:string;
  status:number;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
  rules:{}
}

export default defineComponent({
	name: 'Edit',
	setup(prop,{emit}) {
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
      config:{},
      requestParams:[{
        type:'',
        key:'',
        name:'',
        value:''
      }],
      methodData:[{
          label:'GET',
          value:'get'
        },{
          label:'POST',
          value:'post'
        },{
          label:'PUT',
          value:'put'
      }],

      unitData:[
        {
          label:'second',
          value:'秒'
        },
         {
          label:'minute',
          value:'分'
        },
        {
          label:'hour',
          value:'时'
        },
        {
          label:'day',
          value:'天'
        },
      ],

			ruleForm: {
        sourceId:0,
        name:'',
        from:1,
        key:'',
        port:'',
        userName:'',
        password:'',
        desc:'',
        status:1,

			},
      rules: {
        name: [
          { required: true, message: "数据源名称不能为空", trigger: "blur" }
        ],
        from: [
          { required: true, message: "数据源类型不能为空", trigger: "blur" }
        ],
        host: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        port: [{ required: true, message: '端口不能为空', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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
       sourceId:0,
        name:'',
        from:1,
        key:'',
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
          if(state.ruleForm.sourceId!==0){
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
<style>
.el-input__wrapper{
  width:98%;
}
.box-content{
  
  
}
</style>
