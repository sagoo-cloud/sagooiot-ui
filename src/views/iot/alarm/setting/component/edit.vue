<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '告警'" v-model="isShowDialog" width="50%">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" v-if="isShowDialog" label-width="110px">
				<el-form-item label="名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入名称" />
				</el-form-item>

				<el-form-item label="告警级别" prop="level">
					<el-radio-group v-model="ruleForm.level">
						<el-radio :label="item.level" v-for="item in levelData" :key="item.level">{{ item.name }}</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="选择产品" prop="productKey">
					<el-select v-model="ruleForm.productKey" filterable placeholder="请选择产品" @change="setType()">
						<el-option v-for="item in productData" :key="item.key" :label="item.name" :value="item.key">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; font-size: 13px">{{ item.key }}</span>
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="选择设备" prop="deviceKey">
					<el-select v-model="ruleForm.deviceKey" filterable placeholder="请选择设备">
						<el-option label="全部" value="all">全部</el-option>
						<el-option v-for="item in sourceData" :key="item.key" :label="item.name" :value="item.key">
							<span style="float: left">{{ item.name }}</span>
							<span style="float: right; font-size: 13px">{{ item.key }}</span>
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="触发方式" prop="triggerType" v-if="ruleForm.productKey">
					<el-radio-group v-model="ruleForm.triggerType" @change="getRadio()">
						<el-radio :label="item.type" v-for="item in typeData" :key="item.type">{{ item.title }}</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="选择事件" prop="eventKey" v-if="ruleForm.triggerType === 4">
					<el-select v-model="ruleForm.eventKey" filterable placeholder="请选择事件" @change="eventTypeChange">
						<el-option v-for="item in eventList" :key="item.key" :label="item.name" :value="item.key"></el-option>
					</el-select>

				</el-form-item>


				<div v-if="ruleForm.triggerType > 2">
					<el-divider content-position="left">触发条件</el-divider>
					<div class="box-content">
						<div v-for="(item, index) in requestParams" :key="index">
							<div style="text-align: center" v-if="index > 0">
								<el-icon>
									<Top />
								</el-icon>
								<div>
									<el-select v-model="item.andOr" placeholder="选择条件关系">
										<el-option label="无" :value="0" />
										<el-option label="并且" :value="1" />
										<el-option label="或" :value="2" />
									</el-select>
								</div>
								<el-icon>
									<Bottom />
								</el-icon>
							</div>

							<div style="
									padding: 10px;
									border: 1px solid var(--next-border-color-light);
									background-color: var(--next-border-color-light);
									margin-bottom: 10px;
									position: relative;
								">
								<div class="conicon" style="width: 100%; text-align: right; position: absolute; right: -8px; top: -8px; color: red">
									<el-icon @click="delParams(index)">
										<CircleClose />
									</el-icon>
								</div>

								<div style="display: flex">
									<el-divider content-position="left">参数设置</el-divider>
								</div>

								<div v-for="(aaa, bbb) in item.filters" :key="bbb">
									<div style="text-align: center" v-if="bbb > 0">
										<el-icon>
											<Top />
										</el-icon>
										<div>
											<el-select v-model="aaa.andOr" placeholder="选择条件关系" style="width: 150px">
												<el-option label="无" :value="0" />
												<el-option label="并且" :value="1" />
												<el-option label="或" :value="2" />
											</el-select>
										</div>
										<el-icon>
											<Bottom />
										</el-icon>
									</div>
									<div class="content-f">
										<el-select v-model="aaa.key" :placeholder="ruleForm.triggerType === 4 && !ruleForm.eventKey ? '请先选择事件' : '选择参数'" style="width: 320px">
											<el-option v-for="a in triData" :key="a.paramKey" :label="a.title" :value="a.paramKey" />
										</el-select>
										<el-select v-model="aaa.operator" placeholder="选择操作符" style="width: 320px">
											<el-option v-for="b in operData" :key="b.type" :label="b.title" :value="b.type" />
										</el-select>
										<el-input v-model="aaa.value" placeholder="请输入条件值" style="width: 320px" />

										<div class="conicon">
											<el-icon @click="delParamss(index, bbb)">
												<Delete />
											</el-icon>
										</div>
									</div>
								</div>

								<el-button type="primary" class="addbutton" @click="addParams(index)">增加条件</el-button>
							</div>
						</div>
					</div>
					<el-button type="success" class="addbutton" @click="addParamss">增加分组</el-button>
				</div>

				<el-divider content-position="left">执行动作</el-divider>
				<div class="box-content">
					<div v-for="(item, index) in action" :key="index">
						<div style="
								padding: 10px;
								border: 1px solid var(--next-border-color-light);
								background-color: var(--next-border-color-light);
								margin-bottom: 10px;
								position: relative;
							">
							<div class="conicon" style="width: 100%; text-align: right; position: absolute; right: -8px; top: -8px; color: red">
								<el-icon @click="delAction(index)">
									<CircleClose />
								</el-icon>
							</div>

							<div style="display: flex">
								<el-divider content-position="left">消息通知</el-divider>
							</div>

							<div class="content-f">
								<el-select v-model="item.sendGateway" placeholder="请选择通知方式" style="width: 320px" @change="getNode(item.sendGateway, index)">
									<el-option v-for="a in notice_send_gateway" :key="a.value" :label="a.label" :value="a.value" />
								</el-select>
								<el-select v-model="item.noticeConfig" placeholder="请选择通知配置" style="width: 320px" @change="getTem(item.noticeConfig, index)">
									<el-option v-for="b in sendGatewayData[index]" :key="b.id" :label="b.title" :value="b.id" />
								</el-select>
								<el-select v-model="item.noticeTemplate" placeholder="请选择通知模板" style="width: 320px">
									<el-option v-for="c in noticeConfigData[index]" :key="c.id" :label="c.title" :value="c.id" />
								</el-select>
							</div>
							<div>
								<div style="display: flex; margin-bottom: 10px" v-for="(ph, phindex) in item.addressee" :key="phindex">
									<el-input v-model="ph.phone" placeholder="请输入接收人信息" style="width: 320px" />
									<el-icon style="width: 32px; height: 32px; font-size: 24px" v-if="phindex == 0" @click="AddPhone(index)">
										<CirclePlus />
									</el-icon>
									<el-icon style="width: 32px; height: 32px; font-size: 24px" v-if="phindex > 0" @click="DelPhone(index, phindex)">
										<Remove />
									</el-icon>
								</div>
							</div>
						</div>
					</div>
				</div>
				<el-button type="success" class="addbutton" @click="addAction">增加执行</el-button>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">取 消</el-button>
					<el-button type="primary" @click="onSubmit">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, getCurrentInstance, watch } from 'vue';
import api from '/@/api/datahub';
import iotapi from '/@/api/device';
import alarm from '/@/api/alarm';
import notice from '/@/api/notice';

import { ElMessage } from 'element-plus';
import { Delete, CircleClose, Top, Bottom, CirclePlus, Remove } from '@element-plus/icons-vue';

interface RuleFormState {
	id: number;
	name: string;
	triggerType: number;
	level: string;
	eventKey: string;
	productKey: string;
	deviceKey: string;
	triggerCondition: any[];
	action: any;
}
interface DicState {
	id: number;
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: any;
	sourceData: any;
	productData: any;
	typeData: any;
	triData: any;
	operData: any;
	levelData: any;
	requestParams: any;
	action: any;
	tempData: any;
	sendGatewayData: any;
	noticeConfigData: any;
	eventList: any;
}

export default defineComponent({
	name: 'Edit',
	components: { Delete, CircleClose, Top, Bottom, CirclePlus, Remove },

	setup(prop, { emit }) {
		const myRef = ref<HTMLElement | null>(null);
		const formRef = ref<HTMLElement | null>(null);
		const { proxy } = getCurrentInstance() as any;

		const { notice_send_gateway } = proxy.useDict('notice_send_gateway');
		const state = reactive<DicState>({
			id: 0,
			isShowDialog: false,
			sourceData: [],
			tempData: [],
			productData: [],
			typeData: [],
			triData: [],
			operData: [],
			levelData: [],
			sendGatewayData: [],
			noticeConfigData: [],
			eventList: [],
			action: [
				{
					sendGateway: '',
					noticeConfig: '',
					noticeTemplate: '',
					addressee: [
						{
							phone: '',
						},
					],
				},
			],
			requestParams: [
				{
					andOr: '',
					filters: [
						{
							key: '',
							operator: '',
							value: '',
							andOr: 0,
						},
					],
				},
			],
			ruleForm: {
				id: 0,
				name: '',
				triggerType: 1,
				eventKey: '',
				level: '',
				productKey: '',
				deviceKey: '',
				action: [
					{
						sendGateway: '',
						noticeConfig: '',
						noticeTemplate: '',
						addressee: {},
					},
				],
				triggerCondition: [
					{
						andOr: '',
						filters: [
							{
								key: '',
								operator: '',
								value: '',
								andOr: 0,
							},
						],
					},
				],
			},
			rules: {
				name: [{ required: true, message: '告警名称不能为空', trigger: 'change' }],
				level: [{ required: true, message: '告警级别不能为空', trigger: 'change' }],
				productKey: [{ required: true, message: '请选择产品', trigger: 'change' }],
				deviceKey: [{ required: true, message: '请选择设备', trigger: 'change' }],
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();
			getDevData();
			if (row) {
				setType(true);


				alarm.common.detail(row.id).then((res: any) => {

					state.requestParams = res.data.condition.triggerCondition;
					let product_key = res.data.productKey;
					res.data.performAction.action.forEach(function (value: { sendGateway: any; noticeConfig: number; }, index: string | number) {
						notice.config.getList({ sendGateway: value.sendGateway }).then((res: any) => {
							state.sendGatewayData[index] = res.Data;
						});

						if (value.noticeConfig) {
							notice.template.configIddetail(value.noticeConfig).then((res: any) => {
								state.noticeConfigData[index] = [res];
							});
						}
					});
					state.action = res.data.performAction.action;
					state.action.forEach(function (value: { addressee: any[]; }, index: string | number) {
						state.action[index].addressee = value.addressee.map((p: any) => {
							return { phone: p };
						});
					});
					iotapi.product.event({ key: res.data.productKey }).then((ress: any) => {
						state.eventList = ress || []
						state.ruleForm.eventKey = row.eventKey
					})
					state.ruleForm = res.data;

					if (product_key) {
						alarm.common.trigger_type(product_key).then((res: any) => {
							state.typeData = res.list || [];
						});

					}
				});


			}
			state.isShowDialog = true;
		};

		//获取设备列表
		const getDevData = () => {
			iotapi.product.getLists({ status: 1 }).then((res: any) => {
				state.productData = res.product || [];
			});
			alarm.common.levelall().then((res: any) => {
				state.levelData = res.list || [];
			});
			alarm.common.operator().then((res: any) => {
				state.operData = res.list || [];
			});
		};

		const resetForm = () => {
			state.requestParams = [
				{
					andOr: '',
					filters: [
						{
							key: '',
							operator: '',
							value: '',
							andOr: 0,
						},
					],
				},
			];
			state.action = [
				{
					sendGateway: '',
					noticeConfig: '',
					noticeTemplate: '',
					addressee: [
						{
							phone: '',
						},
					],
				},
			];

			state.ruleForm = {
				id: 0,
				name: '',
				triggerType: 1,
				level: '',
				productKey: '',
				eventKey: '',
				deviceKey: '',
				action: [
					{
						sendGateway: '',
						noticeConfig: '',
						noticeTemplate: '',
						addressee: {},
					},
				],
				triggerCondition: [
					{
						andOr: '',
						filters: [
							{
								key: '',
								operator: '',
								value: '',
								andOr: 0,
							},
						],
					},
				],
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

		const eventTypeChange = () => {
			gettriData()
		};

		watch(() => state.ruleForm.productKey, (key) => {
			if (!key) return
			// 切换产品时候重新获取事件列表，清空之前选中的事件
			state.ruleForm.eventKey = ''

			iotapi.product.event({ key }).then((res: any) => {
				state.eventList = res || []
			})
		})

		// 新增
		const onSubmit = () => {
			const formWrap = unref(formRef) as any;
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					state.ruleForm.triggerCondition = state.requestParams;

					state.action.forEach(function (value: { addressee: any[]; }, index: string | number) {
						state.action[index].addressee = value.addressee.map((p: { phone: any; }) => {
							return p.phone;
						});
					});

					state.ruleForm.action = state.action;

					if (state.ruleForm.id !== 0) {
						//修改
						alarm.common.edit(state.ruleForm).then(() => {
							ElMessage.success('告警修改成功');
							closeDialog(); // 关闭弹窗
							emit('dataList');
						});
					} else {
						//添加
						alarm.common.add(state.ruleForm).then(() => {
							ElMessage.success('告警添加成功');
							closeDialog(); // 关闭弹窗
							emit('dataList');
						});
					}
				}
			});
		};

		const AddPhone = (index: string | number) => {
			state.action[index].addressee.push({
				phone: '',
			});
		};

		const DelPhone = (index: string | number, bbb: any) => {
			state.action[index].addressee.splice(bbb, 1);
		};

		const addAction = () => {
			state.action.push({
				sendGateway: '',
				noticeConfig: '',
				noticeTemplate: '',
				addressee: [
					{
						phone: '',
					},
				],
			});
		};
		const delAction = (index: any) => {
			state.action.splice(index, 1);
		};

		const delParams = (index: any) => {
			state.requestParams.splice(index, 1);
		};

		const delParamss = (index: string | number, bbb: any) => {
			state.requestParams[index].filters.splice(bbb, 1);
		};

		const addParamss = () => {
			state.requestParams.push({
				andOr: '',
				filters: [
					{
						key: '',
						operator: '',
						value: '',
						andOr: '',
					},
				],
			});
		};
		const addParams = (index: string | number) => {
			state.requestParams[index].filters.push({
				key: '',
				operator: '',
				value: '',
				andOr: '',
			});
		};

		const setType = (notResetDeviceKey?: boolean) => {
			!notResetDeviceKey && (state.ruleForm.deviceKey = '')

			api.common.getdevList({ productKey: state.ruleForm.deviceKey }).then((res: any) => {
				state.sourceData = res.device;
			});
			alarm.common.trigger_type(state.ruleForm.productKey).then((res: any) => {
				state.typeData = res.list || [];
			});

			gettriData();

		};

		const getRadio = () => {
			gettriData();
		}
		const gettriData = () => {
			// 清空之前设置的参数设置
			state.requestParams = [{
				andOr: '',
				filters: [
					{
						key: '',
						operator: '',
						value: '',
						andOr: 0,
					},
				],
			}]
			setTriData()
		}

		function setTriData() {
			// 重置参数列表
			state.triData = [];

			const triggerType = state.ruleForm.triggerType
			const form = {
				productKey: state.ruleForm.productKey,
				triggerType,
				eventKey: ''
			}

			// 如果是事件上报，需要传eventKey参数
			if (triggerType === 4) {
				form.eventKey = state.ruleForm.eventKey
				if (!form.eventKey) return
			}

			alarm.common.trigger_params(form).then((res: any) => {
				state.triData = res.list || [];
			});
		}

		const getNode = (event: any, index: string | number) => {
			state.action[index].noticeConfig = '';
			notice.config.getList({ sendGateway: event }).then((res: any) => {
				state.sendGatewayData[index] = res.Data;
			});
		};

		const getTem = (event: number, index: string | number) => {
			state.action[index].noticeTemplate = '';
			notice.template.configIddetail(event).then((res: any) => {
				state.noticeConfigData[index] = [res];
			});
		};

		return {
			getRadio,
			gettriData,
			getTem,
			getNode,
			delAction,
			addAction,
			eventTypeChange,
			AddPhone,
			DelPhone,
			setType,
			addParams,
			addParamss,
			delParamss,
			delParams,
			openDialog,
			closeDialog,
			getDevData,
			onCancel,
			onSubmit,
			formRef,
			notice_send_gateway,
			myRef,
			...toRefs(state),
		};
	},
});
</script>
<style scoped>
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
 