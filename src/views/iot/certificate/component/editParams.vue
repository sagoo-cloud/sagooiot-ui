<template>
	<el-dialog @close="closeDialog" :title="state.ruleForm.id ? '编辑证书' : '新增证书'" v-model="state.dialogVisible" width="60%">
		<!-- <el-tabs v-model="state.activeName" @tab-click="onTabClick"> -->
		<!-- <el-tab-pane label="基本信息" name="1"> -->
		<el-form :rules="state.rules" ref="ruleForm" :model="state.ruleForm" label-width="120px">
			<el-form-item label="证书标准" prop="standard">
				<el-select v-model="state.ruleForm.standard" placeholder="请选择证书标准">
					<el-option v-for="dict in network_certificate" :key="dict.value" :label="dict.label" :value="dict.value"> </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="证书名称" prop="name">
				<el-input v-model.trim="state.ruleForm.name"></el-input>
			</el-form-item>
			<el-form-item label="证书文件" prop="fileContent">
				<el-input disabled v-if="state.ruleForm.fileContent" v-model="state.ruleForm.fileContent"></el-input>
				<uploadFile @update="updateFile"></uploadFile>
			</el-form-item>
			<el-form-item label="证书公钥" prop="publicKeyContent">
				<el-input disabled type="textarea" :rows="6" v-model="state.ruleForm.publicKeyContent"></el-input>
				<el-upload class="upload-demo" action="" accept=".txt" :on-change="beforePublicUpload" :auto-upload="false">
					<el-button size="small" type="primary">上传</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item label="证书私钥" prop="privateKeyContent">
				<el-input disabled type="textarea" :rows="6" v-model="state.ruleForm.privateKeyContent"></el-input>
				<el-upload class="upload-demo" action="" accept=".txt" :on-change="beforePrivateUpload" :auto-upload="false">
					<el-button size="small" type="primary">上传</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item label="说明">
				<el-input type="textarea" :rows="6" v-model="state.ruleForm.description"></el-input>
			</el-form-item>
		</el-form>

		<template #footer>
			<div class="dialog-footer">
				<el-button type="default" @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="submitData(ruleForm)">提 交</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { FormInstance } from 'element-plus'
import uploadFile from '/@/components/upload/uploadFile.vue'

import api from '/@/api/certificateManagement'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update'])

const ruleForm = ref<FormInstance>()

const state = reactive({
	dialogVisible: false,
	activeName: '1',
	id: 0,
	ruleForm: {},
	rules: {
		name: [{ required: true, message: '证书名称不能为空', trigger: 'blur' }],
		standard: [{ required: true, message: '证书标准不能为空', trigger: ['blur', 'change'] }],
		fileContent: [{ required: true, message: '证书文件不能为空', trigger: 'blur' }],
		publicKeyContent: [{ required: true, message: '证书公钥不能为空', trigger: ['blur', 'change'] }],
		privateKeyContent: [{ required: true, message: '证书私钥不能为空', trigger: ['blur', 'change'] }],
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
})
const { proxy } = getCurrentInstance() as any
const { network_certificate } = proxy.useDict('network_certificate')
// 打开弹窗
const openDialog = (row: any) => {
	if (row) {
		state.ruleForm = row
	}
	state.dialogVisible = true
}

// 关闭弹窗
const closeDialog = () => {
	state.dialogVisible = false
	state.ruleForm = {}
	ruleForm.value?.clearValidate()
}
// 取消
// const onCancel = () => {
// 	closeDialog()
// }

const submitData = async (formEl: any | undefined) => {
	if (!formEl) return
	await formEl.validate((valid: any) => {
		if (valid) {
			if (state.ruleForm.id) {
				// 编辑
				api.certificateManagement.edit(state.ruleForm).then(() => {
					ElMessage.success('证书编辑成功')
					state.dialogVisible = false
					emit('update')
					state.ruleForm = {}
				})
			} else {
				// 新增
				api.certificateManagement.add(state.ruleForm).then(() => {
					ElMessage.success('证书添加成功')
					state.dialogVisible = false
					emit('update')
					state.ruleForm = {}
				})
			}
		}
	})
}

const beforePublicUpload = (response: any, file: any) => {
	let reader = new FileReader()
	reader.readAsText(file[file.length - 1].raw, 'UTF-8') //读取，转换字符编码
	reader.onload = function (e: any) {
		let val = e.target.result //获取数据
		let rtulist = val.split('\r\n')
		state.ruleForm.publicKeyContent = rtulist[0]
	}
}

const beforePrivateUpload = (response: any, file: any) => {
	let reader = new FileReader()
	reader.readAsText(file[file.length - 1].raw, 'UTF-8') //读取，转换字符编码
	reader.onload = function (e: any) {
		let val = e.target.result //获取数据
		let rtulist = val.split('\r\n')
		state.ruleForm.privateKeyContent = rtulist[0]
	}
}
const updateFile = (url: string) => {
	state.ruleForm.fileContent = url
}

defineExpose({ openDialog })
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
