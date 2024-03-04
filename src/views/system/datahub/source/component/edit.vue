<template>
	<el-dialog class="api-edit" v-model="showDialog" :title="`${formData.sourceId ? '编辑数据源' : '新增数据源'}`" width="800px" :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form class="inline-form" ref="formRef" :model="formData" :rules="ruleForm" label-width="120px">
			<el-form-item label="数据源标识" prop="key">
				<el-input v-model="formData.key" placeholder="请输入数据源名称" :disabled="formData.sourceId" />
			</el-form-item>
			<el-form-item label="数据源名称" prop="name">
				<el-input v-model="formData.name" placeholder="请输入数据源名称" />
			</el-form-item>
			<el-form-item label="描述" prop="desc">
				<el-input v-model="formData.desc" type="textarea" placeholder="请输入内容"></el-input>
			</el-form-item>

			<el-form-item label="数据来源" prop="from" v-if="!formData.sourceId">
				<el-radio-group v-model="formData.from">
					<el-radio :label="1">api导入</el-radio>
					<el-radio :label="4">设备</el-radio>
					<el-radio :label="2">数据库</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-divider content-position="left">数据源配置</el-divider>


			<div v-if="formData.from == 1">

				<el-form-item label="请求方法" prop="config.method">
					<el-select v-model="formData.config.method" :rules="ruleForm['config.method']" placeholder="请选择请求方法">
						<el-option v-for="item in methodData" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>

				<el-form-item label="请求地址" prop="config.url">
					<el-input v-model="formData.config.url" placeholder="请输入请求地址" :rules="ruleForm['config.url']" />
				</el-form-item>

				<el-form-item label="定时请求" prop="config.cronExpression">
					<div style="display:flex">
						<el-input v-model="formData.config.cronExpression" placeholder="请输入cron表达式" :rules="ruleForm['config.cronExpression']" />
						<el-button type="success" @click="showCron('config')" style="    margin-left: 5px;">设置</el-button>

					</div>
				</el-form-item>

				<div class="box-content">
					<div>
						<div v-for="(item, index) in requestParams" :key="index" style="padding: 10px; border: 1px solid #eee; margin-bottom: 10px; position: relative">
							<div class="conicon" style="width: 100%; text-align: right; position: absolute; right: -8px; top: -8px; color: red">
								<el-icon @click="delParams(index)">
									<CircleClose />
								</el-icon>
							</div>

							<div style="display: flex">
								<el-divider content-position="left">请求参数</el-divider>
							</div>
							<div class="content-f" v-for="(aaa, bbb) in item" :key="bbb">
								<el-select v-model="aaa.type" placeholder="参数类型" style="width: 320px">
									<el-option v-for="item in paramData" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
								<el-input v-model="aaa.name" placeholder="请输入参数标题" style="width: 320px" />
								<el-input v-model="aaa.key" placeholder="请输入参标识" style="width: 320px" />
								<el-input v-model="aaa.value" placeholder="请输入参数值" style="width: 320px" />
								<div class="conicon">
									<el-icon @click="delParamss(index, bbb)">
										<Delete />
									</el-icon>
								</div>
							</div>
							<el-button type="primary" class="addbutton" @click="addParams(index)">增加</el-button>
							<div style=""></div>
						</div>
					</div>
				</div>
				<el-button type="success" class="addbutton" @click="addParamss">增加分组</el-button>
			</div>
			<div v-if="formData.from == 4">
				<el-form-item label="选择设备" prop="devconfig.deviceKey">
					<el-select v-model="formData.devconfig.deviceKey" :rules="ruleForm['devconfig.deviceKey']" filterable placeholder="请选择设备" @change="setNode">
						<el-option v-for="item in sourceData" :key="item.key" :label="item.name" :value="item.id">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; font-size: 13px">{{ item.key }}</span>
						</el-option>
					</el-select>
				</el-form-item>
			</div>



			<div v-if="formData.from == 2">

				<el-form-item label="数据来源" prop="tabconfig.type">
					<el-radio-group v-model="formData.tabconfig.type" :rules="ruleForm['tabconfig.type']">
						<el-radio label="mysql">mysql</el-radio>
						<el-radio label="mssql">mssql</el-radio>

					</el-radio-group>
				</el-form-item>

				<div class="inline">
					<el-form-item label="主机地址" prop="tabconfig.host">
						<el-input v-model="formData.tabconfig.host" placeholder="请输入主机地址" :rules="ruleForm['tabconfig.host']" />
					</el-form-item>

					<el-form-item label="端口号" prop="tabconfig.port">
						<el-input v-model="formData.tabconfig.port" placeholder="请输入端口号" :rules="ruleForm['tabconfig.port']" />
					</el-form-item>
				</div>
				<div class="inline">
					<el-form-item label="用户名" prop="tabconfig.user">
						<el-input v-model="formData.tabconfig.user" placeholder="请输入用户名" :rules="ruleForm['tabconfig.user']" />
					</el-form-item>

					<el-form-item label="密码" prop="tabconfig.passwd">
						<el-input v-model="formData.tabconfig.passwd" placeholder="请输入密码" :rules="ruleForm['tabconfig.passwd']" />
					</el-form-item>
				</div>

				<el-form-item label="数据库名称" prop="tabconfig.dbName">
					<el-input v-model="formData.tabconfig.dbName" placeholder="请输入数据库名称" :rules="ruleForm['tabconfig.dbName']" />
				</el-form-item>

				<el-form-item label="执行方式" prop="tabconfig.queryType">
					<el-radio-group v-model="formData.tabconfig.queryType" :rules="ruleForm['tabconfig.queryType']">
						<el-radio label="tableName">数据表</el-radio>
						<el-radio label="sql">Sql</el-radio>

					</el-radio-group>
				</el-form-item>

				<el-form-item label="" prop="tabconfig.tableName">
					<el-input v-model="formData.tabconfig.tableName" type="textarea" :placeholder="formData.tabconfig.queryType == 'sql' ? '请输入sql语句' : '请输入表名称'" />
				</el-form-item>

				<el-form-item label="主键字段" prop="tabconfig.pk">
					<el-input v-model="formData.tabconfig.pk" placeholder="请输入主键字段" :rules="ruleForm['tabconfig.pk']" />
				</el-form-item>

				<el-form-item label="每次获取数量" prop="tabconfig.num">
					<el-input v-model="formData.tabconfig.num" placeholder="请输入每次获取数量" :rules="ruleForm['tabconfig.num']" />
				</el-form-item>

				<el-form-item label="任务表达式" prop="tabconfig.cronExpression">

					<div style="display:flex">
						<el-input v-model="formData.tabconfig.cronExpression" placeholder="请输入cron任务表达式" :rules="ruleForm['tabconfig.cronExpression']" />
						<el-button type="success" @click="showCron('tabconfig')" style="    margin-left: 5px;">设置</el-button>

					</div>

				</el-form-item>
			</div>

		</el-form>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="onTest" type="warning" v-if="sourceId > 0">测试</el-button>

				<el-button @click="showDialog = false">取消</el-button>
				<el-button type="primary" @click="onSubmit">确定</el-button>
			</div>
		</template>
	</el-dialog>
	<el-dialog v-model="dialogVisible" title="返回Json数据" width="30%">
		<JsonViewer :value="jsonData" boxed sort theme="jv-dark" @click="onKeyclick" />

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">关闭</el-button>
			</span>
		</template>
	</el-dialog>

	<el-dialog v-model="cronShow" title="选择Cron规则" width="60%">
		<vue3cron @handlelisten="handlelisten" :type="crontype" @close="cronclose"></vue3cron>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue'
import api from '/@/api/datahub';
import { ruleRequired } from '/@/utils/validator'
import 'vue3-json-viewer/dist/index.css';
import vue3cron from '/@/components/vue3cron/vue3cron.vue';

import { ElMessage } from 'element-plus'
import { Delete, CircleClose, } from '@element-plus/icons-vue';

const emit = defineEmits(['typeList'])

const showDialog = ref(false)
const dialogVisible = ref(false)
const cronShow = ref(false)
const formRef = ref()
const jsonData = ref()
const crontype = ref()
const sourceData = ref([]);
const sourceId = ref();
const methodData = ref([
	{
		label: 'GET',
		value: 'get',
	},
	{
		label: 'POST',
		value: 'post',
	},
]);

const paramData = ref([
	{
		lable: 'header',
		value: 'header',
	},
	{
		lable: 'body',
		value: 'body',
	},
	{
		lable: 'param',
		value: 'param',
	},
]);

const requestParams = ref([
	[
		{
			type: '',
			key: '',
			name: '',
			value: '',
		},
	],
]);
const config = ref({
	method: '',
})
const delParams = (index: number) => {
	requestParams.value.splice(index, 1);
};

const delParamss = (index: number, bbb: number) => {
	requestParams.value[index].splice(bbb, 1);
};

const addParamss = () => {
	requestParams.value.push([
		{
			type: '',
			key: '',
			name: '',
			value: '',
		},
	]);
};
const addParams = (index: number) => {
	requestParams.value[index].push({
		type: '',
		key: '',
		name: '',
		value: '',
	});
};
const handlelisten = (e: any) => {
	if (e.type == 'config') {
		formData.config.cronExpression = e.cron
	} else if (e.type == 'tabconfig') {
		formData.tabconfig.cronExpression = e.cron
	}
};
const showCron = (type: string) => {
	crontype.value = type
	cronShow.value = true;

};
const cronclose = () => {
	cronShow.value = false;
}
const onTest = () => {
	if (formData.from == 1) {
		api.common.api(sourceId.value).then((res: any) => {
			jsonData.value = JSON.parse(res.data);
			dialogVisible.value = true;
		});
	} else if (formData.from == 4) {
		api.common.devapi(sourceId.value).then((res: any) => {
			jsonData.value = JSON.parse(res.data);
			dialogVisible.value = true;
		});
	}
};

const setNode = (event:any) => {
	sourceData.value.forEach((item:any) => {
		if (item.id == event) {
			formData.devconfig.productKey = item.product.key;
			formData.devconfig.deviceKey = item.key;
		}
	});
};
const baseForm = {
	sourceId: undefined,
	name: '',
	key: '',
	desc: '',
	from: 1,
	config: {
		method: '',
		url: '',
		cronExpression: '',
		requestParams: [],
	},
	devconfig: {
		deviceKey: '',
		productKey:'',
	},
	tabconfig: {
		type: 'mysql',
		host: '',
		port: '',
		user: '',
		passwd: '',
		dbName: '',
		queryType: '',
		tableName: '',
		pk: '',
		num: '',
		cronExpression: '',
	}
}
const onKeyclick = () => {

};
const formData = reactive({
	...baseForm,
})


const ruleForm = {
	key: [ruleRequired('数据源标识不能为空')],
	name: [ruleRequired('数据源名称不能为空')],
	from: [ruleRequired('数据源类型不能为空')],

	'config.method': [
		{ required: true, message: '请求方法不能为空', trigger: 'change' },
		{
			validator: (rule: any, value: string, callback: any) => {
				console.log(formData.config.method);
				if (formData.from === 1 && !formData.config.method) {
					callback(new Error('请求方法不能为空'));
				} else {
					callback();
				}
			},
			trigger: 'change'
		}
	],
	'config.url': [ruleRequired('请求地址不能为空')],
	'config.cronExpression': [ruleRequired('定时请求不能为空')],
	'devconfig.deviceKey': [ruleRequired('请选择设备')],
	'tabconfig.type': [ruleRequired('请选择数据来源')],
	'tabconfig.host': [ruleRequired('请输入主机地址')],
	'tabconfig.port': [ruleRequired('请输入端口号')],
	'tabconfig.user': [ruleRequired('请输入用户名')],
	'tabconfig.passwd': [ruleRequired('请输入密码')],
	'tabconfig.dbName': [ruleRequired('请输入数据库名称')],
	'tabconfig.queryType': [ruleRequired('请选择执行方式')],
	'tabconfig.tableName': [ruleRequired('该项不能为空')],
	'tabconfig.pk': [ruleRequired('请输入主键字段')],
	'tabconfig.num': [ruleRequired('请输入每次获取数量')],
	'tabconfig.cronExpression': [ruleRequired('请输入cron任务表达式')],

}
const getDevData = () => {
	api.common.getdevList({}).then((res: any) => {
		sourceData.value = res.device;
	});
};

const onSubmit = async () => {
	await formRef.value.validate()
	


	if (formData.from == 1) {
		let form = {
			sourceId: sourceId.value? sourceId.value:'',
			key: formData.key,
			name: formData.name,
			desc: formData.desc,
			from: formData.from,
			config: {
				...formData.config,
				 requestParams: requestParams.value
			},
		};
		const theApi = sourceId.value ? api.common.edit : api.common.add
		await theApi(form)
		ElMessage.success('操作成功')
		resetForm()
		showDialog.value = false
		emit('typeList')

	} else if (formData.from == 4) {
		let form = {
						sourceId: formData.sourceId ? formData.sourceId : '',
						key: formData.key,
						name: formData.name,
						desc: formData.desc,
						from: formData.from,
						config: formData.devconfig
			};
				const theApi = formData.sourceId ? api.common.devedit : api.common.devadd
				await theApi(form)
				ElMessage.success('操作成功')
				resetForm()
				showDialog.value = false
				emit('typeList')
	} else if (formData.from == 2) {
		let form = {
			sourceId: formData.sourceId ? formData.sourceId : '',
			key: formData.key,
			name: formData.name,
			desc: formData.desc,
			from: formData.from,
			config: formData.tabconfig
		};
		const theApi = formData.sourceId ? api.common.dbedit : api.common.dbadd
		await theApi(form)
		ElMessage.success('操作成功')
		resetForm()
		showDialog.value = false
		emit('typeList')
	}





}

const resetForm = async () => {
	Object.assign(formData, { ...baseForm })
	formRef.value && formRef.value.resetFields()
	requestParams.value = [
		[
			{
				type: '',
				key: '',
				name: '',
				value: '',
			},
		],
	]

}

const openDialog = async (row: any) => {
	resetForm()
	showDialog.value = true

	nextTick(() => {
		if (row) {

			sourceId.value = row.sourceId;
			api.common.detail(row.sourceId).then((res: any) => {
				Object.assign(formData, { ...res.data })
				if (res.data.from == 1) {
					formData.config = res.data.apiConfig;
					requestParams.value = res.data.apiConfig.requestParams;
				} else if (res.data.from == 4) {
					formData.devconfig = res.data.deviceConfig;
				} else if (res.data.from == 2) {
					formData.tabconfig = res.data.dbConfig;
				}

			});
		}
		getDevData();

	})
}

defineExpose({ openDialog })
</script>
<style scoped lang="scss">
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
