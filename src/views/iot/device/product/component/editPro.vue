<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '产品'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="100px">
				<el-form-item label="产品标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入产品标识" :disabled="ruleForm.id" />
				</el-form-item>
				<el-form-item label="产品名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入产品名称" />
				</el-form-item>
				<el-form-item label="产品图片" prop="imageUrl">
					<uploadVue :img="imageUrl" @set-img="handleAvatarSuccess"></uploadVue>
				</el-form-item>

				<el-form-item label="产品分类" prop="categoryId">
					<el-cascader :options="cateData" :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }" placeholder="请选择分类" clearable class="w100" v-model="ruleForm.categoryId">
						<template #default="{ node, data }">
							<span>{{ data.name }}</span>
							<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
						</template>
					</el-cascader>
				</el-form-item>

				<el-form-item label="消息协议" prop="messageProtocol">
					<el-select v-model="ruleForm.messageProtocol" placeholder="请选择消息协议">
						<el-option v-for="dict in messageData" :key="dict.types" :label="dict.title" :value="dict.name"> </el-option>
						<!-- 增加系统默认的mqtt选项 -->
						<el-option label="Sagoo Mqtt" value="SagooMqtt"> </el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="传输协议" prop="transportProtocol">
					<el-select v-model="ruleForm.transportProtocol" placeholder="请选择传输协议" @change="transportProtocolChange">
						<el-option v-for="dict in network_server_type" :key="dict.value" :label="dict.label" :value="dict.value"> </el-option>
					</el-select>
				</el-form-item>
				<!-- 1，mqtt协议设备的认证
	在添加设备的页面，增加MQTT服务协议设备的认证方式的处理。
	当传输协议选择为：MQTT服务的时候，下面出现 认证方式的下拉列，分别为Basic、AccessToken接入两个下拉选项。
	Basic方式：
	选择这个方式的时候：页面出现，用户名及密码输入框。
	AccessToken接入方式：
	选择这个方式的时候：页面出现 Aceess Token的输入框
	2，TCP及其它协议认证
	这些配合【网络组件】功能中涉及到的设备通讯协议认证的处理。如果涉及到证书的，需要调用【证书管理】功能维护的证书列表。 -->
				<!-- 设备认证、网络组件服务增加认证方式authType（1=Basic，2=AccessToken，3=证书）
				涉及接口：产品添加、编辑、扩展信息更新；设备添加、编辑；网络组件服务添加、编辑 -->
				<!-- 设备认证 -->
				<template v-if="ruleForm.authType === 1 || ruleForm.authType === 2">
					<el-form-item label="认证方式" prop="">
						<el-radio-group v-model="ruleForm.authType">
							<el-radio :label="1">Basic</el-radio>
							<el-radio :label="2">AccessToken</el-radio>
						</el-radio-group>
					</el-form-item>
					<template v-if="ruleForm.authType === 1">
						<el-form-item label="用户名" prop="authUser">
							<el-input v-model="ruleForm.authUser" placeholder="请输入用户名" />
						</el-form-item>
						<el-form-item label="密码" prop="authPasswd">
							<el-input type="password" v-model="ruleForm.authPasswd" placeholder="请输入密码" />
						</el-form-item>
					</template>
					<template v-else>
						<el-form-item label="Aceess Token" prop="accessToken">
							<el-input v-model="ruleForm.accessToken" placeholder="请输入Aceess Token" />
						</el-form-item>
					</template>
				</template>
				<template v-else-if="ruleForm.authType === 3">
					<el-form-item label="认证证书" prop="certificateId">
						<el-select v-model="ruleForm.certificateId" placeholder="请选择证书">
							<el-option v-for="cert in certList" :key="cert.id" :label="cert.name" :value="cert.id"> </el-option>
						</el-select>
					</el-form-item>
				</template>

				<el-form-item label="设备类型" prop="deviceType">
					<el-radio-group v-model="ruleForm.deviceType">
						<el-radio label="设备">设备</el-radio>
						<el-radio label="网关">网关</el-radio>
						<el-radio label="子设备">子设备</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="产品描述	" prop="desc">
					<el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入产品描述"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" :loading="submitLoading" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, getCurrentInstance } from 'vue'
import api from '/@/api/device'
import certApi from '/@/api/certificateManagement';
import uploadVue from '/@/components/upload/index.vue'
import { validateNoSpace } from '/@/utils/validator';

import { ElMessage, UploadProps } from 'element-plus'
import getOrigin from '/@/utils/origin'

interface RuleFormState {
	id: number
	categoryId: number | string
	messageProtocol: string
	transportProtocol: string
	deviceType: string
	name: string
	authType: string
	status: number
	desc: string
	authUser: string
	authPasswd: string
	accessToken: string
	certificateId: string
}
interface DicState {
	isShowDialog: boolean
	ruleForm: RuleFormState
	cateData: RuleFormState[]
	deptData: RuleFormState[]
	messageData: RuleFormState[]
	tranData: RuleFormState[]
	rules: {},
	imageUrl: string
}

const form = {
	id: 0,
	name: '',
	categoryId: '',
	messageProtocol: '',
	transportProtocol: '',
	deviceType: '设备',
	status: 1,
	desc: '',
	authType: '',
	authUser: '',
	authPasswd: '',
	accessToken: '',
	certificateId: '',

}

export default defineComponent({
	name: 'deviceEditPro',
	components: { uploadVue },
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null)
		const baseURL: string | undefined | boolean = getOrigin(import.meta.env.VITE_API_URL)

		const { proxy } = getCurrentInstance() as any
		const { network_server_type } = proxy.useDict('network_server_type')

		const certList = ref([])
		const submitLoading = ref(false)

		const state = reactive<DicState | any>({
			isShowDialog: false,
			cateData: [], // 分类数据
			deptData: [], //
			messageData: [], //
			network_protocols: [], // 消息协议
			tranData: [], //
			imageUrl: '', //
			singleImg: baseURL + '/product/icon/upload',
			ruleForm: {
				...form
			},
			rules: {
				name: [ { required: true, message: '产品名称不能为空', trigger: 'change' },
        				{ max: 32, message: '产品名称不能超过32个字符', trigger: 'change' },
						{ validator: validateNoSpace, message: '产品名称不能包含空格', trigger: 'change' }
					],
				key: [{ required: true, message: '产品标识不能为空', trigger: 'change' },
					{ validator: validateNoSpace, message: '产品标识不能包含空格', trigger: 'change' }],
				messageProtocol: [{ required: true, message: '消息协议不能为空', trigger: 'change' }],
				transportProtocol: [{ required: true, message: '传输协议不能为空', trigger: 'change' }],
				categoryId: [{ required: true, message: '产品分类不能为空', trigger: 'change' }],
				deviceType: [{ required: true, message: '设备类型不能为空', trigger: 'change' }],
			},
		})

		const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
			state.imageUrl = response
			state.ruleForm.icon = response
		}

		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm()
			api.category.getList({ status: 1 }).then((res: any) => {
				state.cateData = res.category || []
			})
			api.dept.getList({ status: -1 }).then((res: any) => {
				state.deptData = res || []
			})
			api.product.getTypesAll({ types: 'protocol' }).then((res: any) => {
				state.messageData = res || [];
			});

			// 证书列表
			certApi.certificateManagement.getAll().then((res: any) => {
				certList.value = res.Info || []
			});
			// api.product.trunsport_protocol_list({ status: -1 }).then((res: any) => {
			//   state.tranData = res.data || [];
			// });
			if (row) {
				// api.dict.getType(row.dictId).then((res:any)=>{
				//   state.ruleForm = res.data.dictType
				// }
				state.imageUrl = row.icon

				state.ruleForm = row
				if (row.authType === 0) {
					transportProtocolChange(row.transportProtocol)
				}
			} else {
				state.imageUrl = ""
			}
			state.isShowDialog = true
		}
		const resetForm = () => {
			state.ruleForm = {
				...form
			}
		}
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false
		}
		// 取消
		const onCancel = () => {
			closeDialog()
		}
		const transportProtocolChange = (type: string) => {
			if (type === 'mqtt_server') {
				state.ruleForm.authType = 1
			} else {
				state.ruleForm.authType = 3
			}
		}
		// 新增
		const onSubmit = () => {
			const formWrap = unref(formRef) as any
			if (!formWrap) return
			formWrap.validate((valid: boolean) => {
				if (valid) {
					submitLoading.value = true
					if (state.ruleForm.id !== 0) {
						//修改
						api.product.edit(state.ruleForm).then(() => {
							ElMessage.success('产品类型修改成功')
							closeDialog() // 关闭弹窗
							emit('typeList')
						}).finally(() => submitLoading.value = false)
					} else {
						//添加
						api.product.add(state.ruleForm).then(() => {
							ElMessage.success('产品类型添加成功')
							closeDialog() // 关闭弹窗
							emit('typeList')
						}).finally(() => submitLoading.value = false)
					}
				}
			})
		}



		return {
			transportProtocolChange,
			submitLoading,
			certList,
			openDialog,
			handleAvatarSuccess,
			closeDialog,
			onCancel,
			onSubmit,
			network_server_type,
			formRef,
			...toRefs(state),
		}
	},
})
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
