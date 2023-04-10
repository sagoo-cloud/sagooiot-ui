<template>
	<el-dialog @close="state.ruleForm= {}" :title="state.ruleForm.id ? '编辑证书' : '新增证书'" v-model="state.dialogVisible" width="60%">
		<!-- <el-tabs v-model="state.activeName" @tab-click="onTabClick"> -->
			<!-- <el-tab-pane label="基本信息" name="1"> -->
				<el-form :rules="state.rules" ref="ruleForm" :model="state.ruleForm" label-width="120px">
					<el-form-item label="证书标准" prop="standard">
						<el-select v-model="state.ruleForm.standard" placeholder="请选择证书标准">
							<el-option
								v-for="dict in network_certificate"
								:key="dict.value"
								:label="dict.label"
								:value="dict.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="证书名称" prop="name">
						<el-input size="default" v-model="state.ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="证书文件" prop="fileContent">
						<el-input disabled v-if="state.ruleForm.fileContent" size="default" v-model="state.ruleForm.fileContent"></el-input>
						<uploadFile @update="updateFile" url="/common/singleFile"></uploadFile>
					</el-form-item>
					<el-form-item label="证书公钥" prop="publicKeyContent">
						<el-input size="default" disabled type="textarea" :rows="6" v-model="state.ruleForm.publicKeyContent"></el-input>
						<el-upload  
							class="upload-demo"
							action=""              
							accept=".txt"
							:on-change="beforePublicUpload"
							:auto-upload="false">
							<el-button size="small" type="primary">上传</el-button>             
						</el-upload>
					</el-form-item>
					<el-form-item label="证书私钥" prop="privateKeyContent">
						<el-input size="default" disabled type="textarea" :rows="6" v-model="state.ruleForm.privateKeyContent"></el-input>
						<el-upload  
							class="upload-demo"
							action=""              
							accept=".txt"
							:on-change="beforePrivateUpload"
							:auto-upload="false">
							<el-button size="small" type="primary">上传</el-button>             
						</el-upload>
					</el-form-item>
					<el-form-item label="说明">
						<el-input size="default" type="textarea" :rows="6" v-model="state.ruleForm.description"></el-input>
					</el-form-item>
					
				</el-form>
			<!-- </el-tab-pane> -->
			<!-- <el-tab-pane label="字段信息" name="2">
				<el-table :data="state.columns" style="width: 100%">
					<el-table-column label="字段描述" align="center" width="150" fixed="left">
						<template #default="{ row }">
							<el-input size="default" v-model="row.columnComment" placeholder=""></el-input>
						</template>
					</el-table-column>
					<el-table-column label="序号" type="index" width="60" align="center" />
					<el-table-column label="字段列名" prop="columnName" width="150"> </el-table-column>
					<el-table-column label="物理类型" prop="columnType" width="120"> </el-table-column>
					<el-table-column label="go类型" prop="goType" width="120">
						<template #default="{ row }">
							<el-select size="default" v-model="row.goType" placeholder="">
								<el-option label="int" value="int" />
								<el-option label="unit" value="unit" />
								<el-option label="int64" value="int64" />
								<el-option label="unit64" value="unit64" />
								<el-option label="float64" value="float64" />
								<el-option label="string" value="string" />
								<el-option label="Time" value="Time" />
								<el-option label="byte" value="byte" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="go属性" prop="goField" width="150">
						<template #default="{ row }">
							<el-input size="default" v-model="row.goField" placeholder=""></el-input>
						</template>
					</el-table-column>
					<el-table-column label="json属性" prop="jsonField" width="150">
						<template #default="{ row }">
							<el-input size="default" v-model="row.jsonField" placeholder=""></el-input>
						</template>
					</el-table-column>
					<el-table-column label="插入" prop="isInsert" width="70">
						<template #default="{ row }">
							<el-checkbox size="default" v-model="row.isInsert"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="编辑" prop="isEdit" width="70">
						<template #default="{ row }">
							<el-checkbox size="default" v-model="row.isEdit"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="列表" prop="isList" width="70">
						<template #default="{ row }">
							<el-checkbox size="default" v-model="row.isList"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="查询" prop="isQuery" width="70">
						<template #default="{ row }">
							<el-checkbox size="default" v-model="row.isQuery"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="必填" prop="isRequired" width="70">
						<template #default="{ row }">
							<el-checkbox size="default" v-model="row.isRequired"></el-checkbox>
						</template>
					</el-table-column>
					<el-table-column label="查询方式" prop="queryType" width="120">
						<template #default="{ row }">
							<el-select size="default" v-model="row.queryType" placeholder="">
								<el-option label="=" value="EQ" />
								<el-option label="!=" value="NE" />
								<el-option label=">" value="GT" />
								<el-option label=">=" value="GTE" />
								<el-option label="<" value="LT" />
								<el-option label="<=" value="LTE" />
								<el-option label="LIKE" value="LIKE" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="显示类型" prop="htmlType" width="140">
						<template #default="{ row }">
							<el-select size="default" v-model="row.htmlType" placeholder="">
								<el-option label="文本框" value="input" />
								<el-option label="下拉框" value="select" />
								<el-option label="开关" value="switch" />
								<el-option label="单选框" value="radio" />
								<el-option label="多选框" value="checkbox" />
								<el-option label="文件选择" value="file" />
								<el-option label="文本域" value="textarea" />
								<el-option label="日期控件" value="datetime" />
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="字典类型" prop="dictType" width="160">
						<template #default="{ row }">
							<el-select size="default" v-model="row.dictType" placeholder="">
								<el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column label="关系表" prop="linkTableName" width="160">
						<template #default="{ row }">
							<el-select size="default" v-model="row.linkTableName" placeholder="">
								<el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="生成信息" name="3">
				<el-form ref="ruleForm" :model="state.ruleForm" label-width="120px">
					<el-row>
						<el-col :span="12">
							<el-form-item label="指定应用名" prop="packageName">
								<el-input size="default" v-model="state.ruleForm.packageName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="生成模块名" prop="moduleName">
								<el-input size="default" v-model="state.ruleForm.moduleName"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="生成业务名" prop="businessName">
								<el-input size="default" v-model="state.ruleForm.businessName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="生成功能名" prop="functionName">
								<el-input size="default" v-model="state.ruleForm.functionName"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane> -->
		<!-- </el-tabs> -->

		<template #footer>
			<div class="dialog-footer">
				<el-button type="default" @click="state.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitData(ruleForm)">提 交</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, unref, getCurrentInstance } from 'vue';
import { genFileId, FormRules, FormInstance } from 'element-plus'
import uploadFile from '/@/components/upload/uploadFile.vue';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

import api from '/@/api/certificateManagement';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['update']);

const ruleForm = ref<FormInstance>()

// const tagOption = ref(['api', 'editVue', 'entity', 'jsApi', 'listVue', 'router', 'service']);
const state = reactive({
	dialogVisible: false,
	activeName: '1',
	id: 0,
	ruleForm: {},
	rules: {
		name: [{ required: true, message: '证书名称不能为空', trigger: 'blur' }],
		standard: [{ required: true, message: '证书标准不能为空', trigger: 'blur' }],
		fileContent: [{ required: true, message: '证书文件不能为空', trigger: 'blur' }],
		publicKeyContent: [{ required: true, message: '证书公钥不能为空', trigger: 'blur' }],
		privateKeyContent: [{ required: true, message: '证书私钥不能为空', trigger: 'blur' }]
	},
	columns: [
		{
			columnId: 29,
			tableId: 3,
			TableName: '',
			columnName: 'business_type',
			columnComment: '0其它 1新增 2修改 3删除',
			columnType: 'varchar(1)',
			columnKey: '',
			goType: 'string',
			goField: 'BusinessType',
			jsonField: 'businessType',
			htmlField: '',
			isPk: '0',
			isIncrement: '',
			isRequired: '0',
			isInsert: '1',
			isEdit: '1',
			isList: '1',
			isQuery: '1',
			queryType: 'EQ',
			htmlType: 'datetime',
			dictType: '',
			sort: 3,
			linkTableName: '',
			linkTableClass: '',
			linkTablePackage: '',
			linkLabelId: '',
			linkLabelName: '',
		},
		{
			columnId: 31,
			tableId: 3,
			TableName: '',
			columnName: 'method',
			columnComment: '请求方法',
			columnType: 'varchar(255)',
			columnKey: '',
			goType: 'string',
			goField: 'Method',
			jsonField: 'method',
			htmlField: '',
			isPk: '0',
			isIncrement: '',
			isRequired: '0',
			isInsert: '1',
			isEdit: '1',
			isList: '1',
			isQuery: '1',
			queryType: 'EQ',
			htmlType: 'input',
			dictType: '',
			sort: 4,
			linkTableName: '',
			linkTableClass: '',
			linkTablePackage: '',
			linkLabelId: '',
			linkLabelName: '',
		},
		{
			columnId: 33,
			tableId: 3,
			TableName: '',
			columnName: 'oper_name',
			columnComment: '操作人员',
			columnType: 'varchar(255)',
			columnKey: '',
			goType: 'string',
			goField: 'OperName',
			jsonField: 'operName',
			htmlField: '',
			isPk: '0',
			isIncrement: '',
			isRequired: '1',
			isInsert: '1',
			isEdit: '1',
			isList: '1',
			isQuery: '1',
			queryType: 'LIKE',
			htmlType: 'input',
			dictType: '',
			sort: 5,
			linkTableName: '',
			linkTableClass: '',
			linkTablePackage: '',
			linkLabelId: '',
			linkLabelName: '',
		},
		{
			columnId: 35,
			tableId: 3,
			TableName: '',
			columnName: 'oper_url',
			columnComment: '操作url',
			columnType: 'varchar(255)',
			columnKey: '',
			goType: 'string',
			goField: 'OperUrl',
			jsonField: 'operUrl',
			htmlField: '',
			isPk: '0',
			isIncrement: '',
			isRequired: '0',
			isInsert: '1',
			isEdit: '1',
			isList: '1',
			isQuery: '1',
			queryType: 'EQ',
			htmlType: 'input',
			dictType: '',
			sort: 6,
			linkTableName: '',
			linkTableClass: '',
			linkTablePackage: '',
			linkLabelId: '',
			linkLabelName: '',
		},
		{
			columnId: 37,
			tableId: 3,
			TableName: '',
			columnName: 'oper_ip',
			columnComment: '操作IP',
			columnType: 'varchar(255)',
			columnKey: '',
			goType: 'string',
			goField: 'OperIp',
			jsonField: 'operIp',
			htmlField: '',
			isPk: '0',
			isIncrement: '',
			isRequired: '0',
			isInsert: '1',
			isEdit: '1',
			isList: '1',
			isQuery: '1',
			queryType: 'EQ',
			htmlType: 'input',
			dictType: '',
			sort: 7,
			linkTableName: '',
			linkTableClass: '',
			linkTablePackage: '',
			linkLabelId: '',
			linkLabelName: '',
		},
		{
			columnId: 41,
			tableId: 3,
			TableName: '',
			columnName: 'status',
			columnComment: '0=正常,1=异常',
			columnType: 'varchar(1)',
			columnKey: '',
			goType: 'string',
			goField: 'Status',
			jsonField: 'status',
			htmlField: '',
			isPk: '0',
			isIncrement: '',
			isRequired: '1',
			isInsert: '1',
			isEdit: '1',
			isList: '1',
			isQuery: '1',
			queryType: 'EQ',
			htmlType: 'radio',
			dictType: '',
			sort: 10,
			linkTableName: '',
			linkTableClass: '',
			linkTablePackage: '',
			linkLabelId: '',
			linkLabelName: '',
		},
		{
			columnId: 42,
			tableId: 3,
			TableName: '',
			columnName: 'oper_id',
			columnComment: '',
			columnType: 'bigint(20)',
			columnKey: '',
			goType: 'int64',
			goField: 'OperId',
			jsonField: 'operId',
			htmlField: '',
			isPk: '1',
			isIncrement: '',
			isRequired: '0',
			isInsert: '1',
			isEdit: '0',
			isList: '1',
			isQuery: '1',
			queryType: 'EQ',
			htmlType: 'input',
			dictType: '',
			sort: 1,
			linkTableName: '',
			linkTableClass: '',
			linkTablePackage: '',
			linkLabelId: '',
			linkLabelName: '',
		},
	],
});
const { proxy } = getCurrentInstance() as any;
const { network_certificate } = proxy.useDict('network_certificate');
console.log(network_certificate)
// 打开弹窗
const openDialog = (row: any) => {
	if (row) {
		state.ruleForm = row;
	}
	state.dialogVisible = true;
};

// 关闭弹窗
const closeDialog = () => {
	state.dialogVisible = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};

const submitData =  async (formEl: any | undefined) => {
	if (!formEl) return
		await formEl.validate((valid: any, fields: any) => {
		if (valid) {
			console.log('submit!')
			if(state.ruleForm.id) {
				// 编辑
				api.certificateManagement.edit(state.ruleForm).then((res: any) => {
					ElMessage.success('证书编辑成功');
					console.log(res)
					state.dialogVisible = false
					emit('update')
					state.ruleForm = {}
				});
			}else {
				// 新增
				api.certificateManagement.add(state.ruleForm).then((res: any) => {
					ElMessage.success('证书添加成功');
					console.log(res)
					state.dialogVisible = false
					emit('update')
					state.ruleForm = {}
				});
			}

		} else {
			console.log('error submit!', fields)
		}
	})
}

const beforePublicUpload = (response:any, file:any, fileList:any) => {
	let reader=new FileReader();
	reader.readAsText(file[file.length-1].raw,'UTF-8')//读取，转换字符编码
	reader.onload=function(e:any){
		let val = e.target.result;//获取数据
		let rtulist = val.split("\r\n")
		console.log('rtulist:>> ', rtulist);
		state.ruleForm.publicKeyContent = rtulist[0];
	}
}

const beforePrivateUpload = (response:any, file:any, fileList:any) => {
	let reader=new FileReader();
	reader.readAsText(file[file.length-1].raw,'UTF-8')//读取，转换字符编码
	reader.onload=function(e:any){
		let val = e.target.result;//获取数据
		let rtulist = val.split("\r\n")
		console.log('rtulist:>> ', rtulist);
		state.ruleForm.privateKeyContent = rtulist[0];
	}
}
const updateFile = (url: string) => {
	console.log('文件上传成功')
	state.ruleForm.fileContent = url
}

defineExpose({ openDialog });
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
	max-height: calc(90vh - 111px) !important;
	overflow-y: auto;
	overflow-x: hidden;
}
:deep(.el-upload-list) {
	display: none;
}
</style>