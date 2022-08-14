<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.dictId!==0?'修改':'添加')+'产品'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="90px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品图片" prop="imageUrl">
        <el-upload
            class="avatar-uploader"
            action="http://zhgy.sagoo.cn:8899/api/v1/common/singleImg"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><ele-Plus /></el-icon>
          </el-upload>
        </el-form-item>
         <el-form-item label="产品标识" prop="key">
          <el-input v-model="ruleForm.key" placeholder="请输入产品标识" />
        </el-form-item>
        <el-form-item label="产品分类">
              <el-cascader :options="cateData" :props="{ checkStrictly: true,emitPath: false, value: 'id', label: 'name' }" placeholder="请选择分类" clearable class="w100" v-model="ruleForm.parentId">
                <template #default="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
             <el-form-item label="所属部门">
              <el-cascader :options="deptData" :props="{ checkStrictly: true,emitPath: false, value: 'deptId', label: 'deptName' }" placeholder="请选择所属部门" clearable class="w100" v-model="ruleForm.deptId">
                <template #default="{ node, data }">
                  <span>{{ data.deptName }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
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
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ruleForm.dictId!==0?'修 改':'添 加'}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref } from 'vue';
import api from '/@/api/device';
import {ElMessage,UploadProps} from "element-plus";

interface RuleFormState {
  id:number;
  name:string;
  dictType:string;
  status:number;
  remark:string;
  imageUrl:string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
  cateData: RuleFormState[];
  deptData: RuleFormState[];
  rules:{}
}

export default defineComponent({
	name: 'deviceEditPro',
	setup(prop,{emit}) {
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
    	cateData: [], // 分类数据
    	deptData: [], // 分类数据

			ruleForm: {
        dictId:0,
        dictName:'',
        dictType:'',
        status:1,
        remark:''
			},
      rules: {
        name: [
          { required: true, message: "产品名称不能为空", trigger: "blur" }
        ],
         key: [
          { required: true, message: "产品标识不能为空", trigger: "blur" }
        ]
      }
		});

    const handleAvatarSuccess: UploadProps['onSuccess'] = (
      response,
      uploadFile
    ) => {
      console.log(response);
      console.log(11111111);
      console.log(uploadFile);
      imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    }

    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
      if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
      }
      return true
    }
		// 打开弹窗
		const openDialog = (row: RuleFormState|null) => {
      resetForm();
        api.category.getList({ status: 1 }).then((res: any) => {
          state.cateData = res.category || [];
        });
        api.dept.getList({ status: -1 }).then((res: any) => {
          console.log(res)
          
          state.deptData = res || [];
        });
      if (row){
        // api.dict.getType(row.dictId).then((res:any)=>{
        //   state.ruleForm = res.data.dictType
        // })

      

        state.ruleForm = row;
      }
			state.isShowDialog = true;
		};
    const resetForm = ()=>{
      state.ruleForm = {
        dictId:0,
        dictName:'',
        dictType:'',
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
            // api.dict.editType(state.ruleForm).then(()=>{
            //   ElMessage.success('产品类型修改成功');
            //   closeDialog(); // 关闭弹窗
            //   emit('typeList')
            // })
          }else{
            //添加
            // api.dict.addType(state.ruleForm).then(()=>{
            //   ElMessage.success('产品类型添加成功');
            //   closeDialog(); // 关闭弹窗
            //   emit('typeList')
            // })
          }
        }
      });
		};


		return {
			openDialog,
      beforeAvatarUpload,
      beforeAvatarUpload,
			closeDialog,
			onCancel,
			onSubmit,
      formRef,
			...toRefs(state),
		};
	},
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
