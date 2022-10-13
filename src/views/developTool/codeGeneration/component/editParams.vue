<template>
	<el-dialog title="编辑表结构" v-model="state.dialogVisible" width="80%">
		<el-tabs v-model="state.activeName" @tab-click="onTabClick">
			<el-tab-pane label="基本信息" name="1">
				<el-form ref="ruleForm" :model="state.ruleForm" label-width="120px">
					<el-row>
						<el-col :span="12">
							<el-form-item label="表名称" prop="tableName">
								<el-input size="default" v-model="state.ruleForm.tableName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="表描述" prop="tableComment">
								<el-input size="default" v-model="state.ruleForm.tableComment"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="实体类名称" prop="className">
								<el-input size="default" v-model="state.ruleForm.className"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="作者" prop="functionAuthor">
								<el-input size="default" v-model="state.ruleForm.functionAuthor"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="备注" prop="remark">
						<el-input size="default" type="textarea" :rows="6" v-model="state.ruleForm.remark"></el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="字段信息" name="2">
				<!-- v-loading="state.tableData.loading"  -->
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
							<!-- 1 0 -->
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
			</el-tab-pane>
		</el-tabs>

		<template #footer>
			<div class="dialog-footer">
				<el-button type="default" @click="state.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="state.dialogVisible = false">提 交</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import api from '/@/api/device';
import { ElMessage } from 'element-plus';

const tagOption = ref(['api', 'editVue', 'entity', 'jsApi', 'listVue', 'router', 'service']);
const state = reactive({
	dialogVisible: false,
	activeName: '1',
	ruleForm: {},
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
const onTabClick = () => {};

defineExpose({ openDialog });
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
	max-height: calc(90vh - 111px) !important;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>