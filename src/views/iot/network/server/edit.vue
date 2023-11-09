<template>
	<el-card class="system-dic-container" style="position: relative;">
		<el-tabs v-model="activeName" class="demo-tabs">
			<el-tab-pane label="编辑服务器" name="first">
				<el-collapse v-model="activeViewName">
                    <el-collapse-item title="基本信息" name="1">
                        <div class="collapse-wrap">
                            <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="98px">
                                <el-form-item label="名称">
                                    <el-input v-model="form.name" placeholder="请填写名称" />
                                </el-form-item>
                                <el-form-item label="类型">
                                    <el-select @change="handleChangeType" v-model="form.types" placeholder="请选择类型">
                                        <el-option
                                            v-for="dict in network_server_type"
                                            :key="dict.value"
                                            :label="dict.label"
                                            :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="form.types == 'tcp'" label="粘拆包规则">
                                    <el-select @change="initData" v-model="stickValue" placeholder="请选择类型">
                                        <el-option
                                            v-for="dict in stick_type"
                                            :key="dict.value"
                                            :label="dict.label"
                                            :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                 <el-form-item v-if="form.types == 'tcp' && stickValue">
                                    <el-form-item v-if="stickValue == '分隔符'" class="flex-column" label="分隔符">
                                        <el-input v-model="stick['delimit,omitempty']" placeholder="请填写分隔符" />
                                    </el-form-item>
                                    <el-form-item v-if="stickValue == '自定义脚本'" class="flex-column" label="自定义脚本">
                                        <el-input v-model="stick['custom,omitempty']" placeholder="请填写自定义脚本" />
                                    </el-form-item>
                                    <el-form-item v-if="stickValue == '固定长度'" class="flex-column" label="固定长度">
                                        <el-input type="number" v-model="stick['fixedLen,omitempty']" placeholder="请填写固定长度" />
                                    </el-form-item>
                                    <el-form-item v-if="stickValue == '长度字段'" class="flex-column" label="长度">
                                        <el-input type="number" v-model="stick['len,omitempty']['len']" placeholder="请填写长度" />
                                    </el-form-item>
                                    <el-form-item v-if="stickValue == '长度字段'" class="flex-column" label="偏移量">
                                        <el-input type="number" v-model="stick['len,omitempty']['offset']" placeholder="请填写偏移量" />
                                    </el-form-item>
                                    <el-form-item v-if="stickValue == '长度字段'" class="flex-column" label="大小端">
                                        <el-select  v-model="stick['len,omitempty']['endian']" placeholder="请选择大小端">
                                            <el-option label="大端" value="大端" />
                                            <el-option label="小端" value="小端" />
                                        </el-select>
                                    </el-form-item>
                                </el-form-item>
                                <el-form-item label="地址">
                                    <el-input v-model="form.addr" placeholder="端口号" />
                                </el-form-item>
                                <el-form-item label="开启TLS">
                                       <el-radio-group v-model="form.isTls" class="ml-4">
                                            <el-radio :label="1">是</el-radio>
                                            <el-radio :label="0">否</el-radio>
                                        </el-radio-group>
                                </el-form-item>
                                <el-form-item v-if="form.isTls == 1 && form.types != 'mqtt_server'" label="选择证书">
                                    <el-select v-model="form.certificateId" placeholder="请选择证书">
                                        <el-option
                                            v-for="item in certificateList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="form.isTls == 1 && form.types == 'mqtt_server'" label="接入方式">
                                     <el-select  v-model="form.authType" placeholder="选择接入方式">
                                        <el-option label="Basic" :value="1" />
                                        <el-option label="AccessToken" :value="2" />
                                        <!-- <el-option label="证书" :value="3" /> -->
                                    </el-select>
                                    <el-form-item v-if="form.authType == 1" class="flex-column" label="用户名">
                                        <el-input v-model="form.authUser" placeholder="请填写用户名" />
                                    </el-form-item>
                                    <el-form-item v-if="form.authType == 1" class="flex-column" label="密码">
                                        <el-input v-model="form.authPasswd" placeholder="请填写密码" />
                                    </el-form-item>
                                    <el-form-item v-if="form.authType == 2" class="flex-column" label="Aceess Token">
                                        <el-input v-model="form.accessToken" placeholder="请填写Aceess Token" />
                                    </el-form-item>
                                </el-form-item>
                                <el-form-item label="启用">
                                    <el-switch :active-value="1" :inactive-value="0" v-model="form.status" />
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="注册包" name="2">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="98px">
                            <el-form-item label="正则表达式">
                                <el-input v-model="form.register.regex" placeholder="请填写名称" />
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="协议适配" name="3">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="98px">
                            <el-form-item label="协议">
                                <el-select v-model="form.protocol.name" placeholder="请选择协议适配">
                                    <el-option
                                        v-for="dict in network_protocols"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="协议参数">
                                <codeEditor class="params" ref="mirrorRef"
                                :mode="resourceModalPro.mode"
                                :content="resourceModalPro.content"
                                >
                                </codeEditor>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
			</el-tab-pane>
		</el-tabs>
		<div style="position: absolute;right:20px;top: 20px;">
			<el-button size="medium" @click="goBack">取消</el-button>
            <el-button @click="submit" size="medium" type="primary">提交</el-button>
		</div>
	</el-card>
</template>
<script lang="ts">
import { watch, toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'
import codeEditor from '/@/components/codeEditor/index.vue'

import serverDetail from './component/serverDetail.vue'

import { useRoute, useRouter } from 'vue-router';

import api from '/@/api/network';
import api2 from '/@/api/system';

interface TableDataState {
    activeViewName: string[];
	resourceModalPro: {
		mode: string,
		content: string,
	},
	detail: object,
    form: object,
    certificateList: object[];
    stick: {
        // 分隔符
        "delimit,omitempty": string,
        // 自定义脚本
        "custom,omitempty": string,
        // 固定长度
        "fixedLen,omitempty": number,
        // 长度字段
        "len,omitempty": {
            "len": number,
            "offset": number,
            "endian": string
        }
    };
    stick_type: object[];
    stickValue: string;
}
export default defineComponent({
	name: 'serverCreate',
	components: { codeEditor, serverDetail },
	props: {
		type: {
			type: String,
			default: ''
		}
	},

	setup(props, context) {
        const { proxy } = getCurrentInstance() as any;
		const route = useRoute();
        const router = useRouter();
        const { network_server_type, network_protocols } = proxy.useDict('network_server_type', 'network_protocols');
		
        const state = reactive<TableDataState>({
            // id: "",
            stickValue: "",
            stick: {
                "delimit,omitempty": "",
                "custom,omitempty": "",
                "fixedLen,omitempty": 0,
                "len,omitempty": {
                    "len": 0,
                    "offset": 0,
                    "endian": ""
                }
            },
            stick_type: [
                {
                    label: "分隔符",
                    value: "分隔符"
                },
                {
                    label: "自定义脚本",
                    value: "自定义脚本"
                },
                {
                    label: "固定长度",
                    value: "固定长度"
                },
                {
                    label: "长度字段",
                    value: "长度字段"
                }
            ],
			resourceModalPro: {
				mode: '',
				content: ''
			},
            certificateList: [],
			detail:{},
            activeViewName: ['1','2','3'],
            form:{
                // 名称
                name: '',
                // AccessToken
                accessToken: "",
                // 认证密码
                authPasswd: "",
                // 认证用户
                authUser: "",
                // 认证方式（1=Basic，2=AccessToken，3=证书）
                authType: 3,
                // 是否开启TLS
                isTls: 0,
                // 证书id
                certificateId: "",
                // 类型
                types: 'tcp',
                // 禁用
                status: false,
                // 地址
                addr: '',
                register: {
                    regex: "^\w+$"
                },
                // 协议适配
                protocol: {
                    name: "ModbusTCP",
                    options: {}
                },
                // 心跳包
                heartbeat: {
                    enable: false,
                    hex: "",
                    regex: "^\\w+$",
                    text: "",
                    timeout: 30
                },
                // 设备
                devices: []
            }
		});
        const mirrorRef = ref('mirrorRef')
		const activeName = ref('first')
		const getDetail = () => {
			const id = route.params && route.params.id;
			api.server.getDetail({"id": id}).then((res: any) => {
                
                const {id, isTls, authType, certificateId, authUser, authPasswd, accessToken, name, types, status, addr, register, protocol, heartbeat, devices, stick} = res
                state.form["id"] = id
                state.form["name"] = name
                state.form["types"] = types
                state.form["status"] = status
                state.form["isTls"] = isTls
                state.form["addr"] = addr
                state.form["authType"] = authType
                state.form["authUser"] = authUser
                state.form["authPasswd"] = authPasswd
                state.form["accessToken"] = accessToken
                state.form["certificateId"] = certificateId
                state.form["register"] = JSON.parse(register)
                state.form["protocol"] = JSON.parse(protocol)
                state.form["heartbeat"] = JSON.parse(heartbeat)
                state.form["devices"] = JSON.parse(devices)
                let stickInfo = JSON.parse(stick)
                if(stickInfo.len && stickInfo.len.endian) {
                    state.stick["len,omitempty"] = stickInfo.len
                }else if(stickInfo.fixedLen) {
                    state.stick["fixedLen,omitempty"] = stickInfo.fixedLen
                }else if(stickInfo.custom) {
                    state.stick["custom,omitempty"] = stickInfo.custom
                }else if(stickInfo.delimit) {
                    state.stick["delimit,omitempty"] = stickInfo.delimit
                }
                if(types == 'tcp') {
                    if(state.stick['delimit,omitempty']) {
                        state.stickValue = '分隔符'
                    }else if(state.stick['custom,omitempty']) {
                        state.stickValue = '自定义脚本'
                    }else if(state.stick['fixedLen,omitempty']) {
                        state.stickValue = '固定长度'
                    }else if(state.stick['len,omitempty']) {
                        state.stickValue = '长度字段'
                    }
                }

                let jsonData = JSON.stringify(JSON.parse(protocol).options);
				state.resourceModalPro.content = JSON.stringify(JSON.parse(jsonData),null,4);
                mirrorRef.value.setValue(state.resourceModalPro.content);
			})
		};
        const submit = () => {
            let params = {
                ...state.form,
                "stick": {
                    ...state.stick
                }
            }
            if(mirrorRef.value.getValue()) {
                state.form.protocol.options = eval("(" + mirrorRef.value.getValue() + ")")
            }
            // return
            api.server.editItem(params).then((res: any) => {
                ElMessage.success('修改成功')
                goBack()
			});
        };
        const goBack = () => {
            router.go(-1);
        }
        const initData = () => {
            state.stick = {
                "delimit,omitempty": "",
                "custom,omitempty": "",
                "fixedLen,omitempty": 0,
                "len,omitempty": {
                    "len": 0,
                    "offset": 0,
                    "endian": ""
                }
            }
        }
        const handleChangeType = () => {
            if(state.form.types != 'mqtt_server' && state.form.isTls == 1) {
                state.form.authType = 3
                return;
            }
            if(state.form.isTls == 0) {
                state.form.authType = ""
            }
        }
        const getCertificateList = () => {
            api2.certificate.getList().then((res: any) => {
                state.certificateList = res.Info;
			})
		}
        watch(
			() => state.form.isTls,
			(value) => {
                if(value == 0) {
                    state.form.authType = ""
                }
			}
		);
		onMounted(() => {
            getDetail();
            getCertificateList();
		});

		return {
            mirrorRef,
			activeName,
			getDetail,
            network_server_type,
            network_protocols,
            submit,
            initData,
            handleChangeType,
            getCertificateList,
			...toRefs(props),
			...toRefs(state),
		};
	},
});
</script>
<style lang="scss" scoped>
::v-deep .el-collapse-item__header {
    position: relative;
    padding-left: 20px;
    .el-collapse-item__arrow {
        margin: 0!important;
        position: absolute;
        left: 0;
        right: 0;
        
    }
}
::v-deep .el-input,
::v-deep .el-input-number {
    width: 500px;
}
::v-deep .params {
    width: 600px;
}

::v-deep .flex-column {
    display: flex;
    flex-direction: column;
    .el-form-item__label {
        justify-content: flex-start;
    }
}

</style>

