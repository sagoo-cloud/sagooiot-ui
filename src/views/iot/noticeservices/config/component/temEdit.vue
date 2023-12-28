<template>
	<div class="system-edit-dic-container">
		<el-dialog title="设置配置模板" v-model="isShowDialog" width="50%">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="110px">
        <el-form-item label="模版代码" prop="code">
          <el-input v-model.trim="ruleForm.code" placeholder="请输入代码" />
        </el-form-item>
				<el-form-item label="模版名称" prop="title">
					<el-input v-model.trim="ruleForm.title" placeholder="请输入名称" />
				</el-form-item>
        <el-form-item label="模板内容" prop="content">
          <el-input v-model.trim="ruleForm.content" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>

			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit">设置</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/notice';


import { ElMessage } from 'element-plus';
import { Delete, Plus, CircleClose, Top, Bottom, Minus, Right } from '@element-plus/icons-vue';
import { stat } from 'fs';

interface RuleFormState {
  code: string;
	title: string;
	configId:string;
	sendGateway:string;
	content:string;


}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: {};
	configData: {};
	id: number;
	configId:string;
	sendGateway:string;

}

export default defineComponent({
	name: 'Edit',
	components: { Delete, Plus, CircleClose, Minus, Right, Top, Bottom },

	setup(prop, { emit }) {
		const myRef = ref<HTMLElement | null>(null);
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			id: 0,
			configData:[],
			isShowDialog: false,
			configId:'',
			sendGateway:'',

			ruleForm: {
        code: '',
				title: '',
				content:'',
				sendGateway:'',
				configId:'',


			},
			rules: {
        code: [{ required: true, message: '模版代码不能为空', trigger: 'blur' }],
				title: [{ required: true, message: '配置名称不能为空', trigger: 'blur' }],
				configId: [{ required: true, message: '通知配置不能为空', trigger: 'blur' }],
				types: [{ required: true, message: '配置类型不能为空', trigger: 'blur' }],
				content: [{ required: true, message: '模板内容不能为空', trigger: 'blur' }],

			},
		});


		const opentemDialog=(id,type)=>{
			resetForm();
			if(id){
				api.template.configIddetail(id).then((res: any) => {
					state.ruleForm = res || [];
				});
			}
			state.configId = id;
			state.sendGateway = type;
			state.isShowDialog = true;
		}

		// 打开弹窗
		const openDialog = (row: RuleFormState | null,type) => {
			// resetForm();
			// if (row) {
			// 	state.ruleForm = row;
			// }

			// api.config.getList({ sendGateway: type }).then((res: any) => {
			// 	state.configData = res.Data || [];
			// });



			// state.ruleForm.sendGateway=type
			// state.isShowDialog = true;
		};



		const resetForm = () => {

			state.ruleForm = {
        code: '',
				title: '',
				content:'',

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

					//修改
					state.ruleForm.sendGateway=state.sendGateway;
						state.ruleForm.configId=state.configId;
						api.template.save(state.ruleForm).then(() => {
							ElMessage.success('配置修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
				}
			});
		};




		return {

			openDialog,
			opentemDialog,
			closeDialog,
			onCancel,
			onSubmit,
			formRef,
			myRef,
			...toRefs(state),
		};
	},
});
</script>
<style>
.inline {
	display: inline-flex;
}
.el-input__wrapper {
	width: 98%;
}

.box-content {
	border: 1px solid #e8e8e8;
	margin: 10px;
	padding: 10px;
}

.content-f {
	display: flex;
	margin-bottom: 10px;
}
.content-f .el-input__wrapper {
	margin-right: 5px;
}
.addbutton {
	width: 100%;
	margin-top: 10px;
	background: #fff;
	border: 1px solid #d1d1d1;
	color: #8d8b8b;
}
.conicon {
	width: 55px;
	height: 25px;

	font-size: 28px;
	line-height: 28px;
	cursor: pointer;
}
.jv-node {
	margin-left: 25px;
}
</style>
