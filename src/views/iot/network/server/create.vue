<template>
	<el-card class="system-dic-container" style="position: relative;">
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="新建服务器" name="first">
				<el-collapse v-model="activeViewName">
                    <el-collapse-item title="基本信息" name="1">
                        <div class="collapse-wrap">
                            <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="70px">
                                <el-form-item label="名称">
                                    <el-input v-model="form.name" placeholder="请填写名称" />
                                </el-form-item>
                                <el-form-item label="类型">
                                    <el-select v-model="form.types" placeholder="请选择类型">
                                        <el-option
                                            v-for="dict in network_server_type"
                                            :key="dict.value"
                                            :label="dict.label"
                                            :value="dict.value">
                                        </el-option>
                                    </el-select>
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
                                <el-form-item v-if="form.isTls == 1" label="选择证书">
                                    <el-select v-model="form.certificateId" placeholder="请选择证书">
                                        <el-option
                                            v-for="item in certificateList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="启用">
                                    <el-switch v-model="form.status" />
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="注册包" name="2">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="82px">
                            <el-form-item label="正则表达式">
                                <el-input v-model="form.register.regex" placeholder="请填写名称" />
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="协议适配" name="3">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                            <el-form-item label="协议">
                                <el-select v-model="form.protocol.name" placeholder="请选择协议适配">
                                    <el-option
                                        v-for="dict in network_protocols"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value">
                                    </el-option>
                                    <!-- <el-option label="Modbus RTU" value="Modbus RTU" />
                                    <el-option label="Modbus TCP" value="Modbus TCP" />
                                    <el-option label="Omron Hostlink" value="Omron Hostlink" />
                                    <el-option label="Omron FINS UDP" value="Omron FINS UDP" />
                                    <el-option label="Omron FINS TCP" value="Omron FINS TCP" />
                                    <el-option label="Simatic S7-200 Smart" value="Simatic S7-200 Smart" />
                                    <el-option label="Simatic S7-200" value="Simatic S7-200" />
                                    <el-option label="Simatic S7-300" value="Simatic S7-300" />
                                    <el-option label="Simatic S7-400" value="Simatic S7-400" />
                                    <el-option label="Simatic S7-1200" value="Simatic S7-1200" />
                                    <el-option label="Simatic S7-1500" value="Simatic S7-1500" /> -->
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
			<!-- <el-tab-pane label="专家视图" name="second">
                <h1>专家视图</h1>
            </el-tab-pane> -->
		</el-tabs>
		<div style="position: absolute;right:20px;top: 20px;">
			<el-button size="medium">取消</el-button>
            <el-button @click="submit" size="medium" type="primary">提交</el-button>
		</div>

	  	 <!-- <codeEditor ref="mirrorRef"
	  :mode="resourceModalPro.mode"
	  :content="resourceModalPro.content"
	  >
	  </codeEditor> -->
	</el-card>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance, watch } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'
import codeEditor from '/@/components/codeEditor/index.vue'

import serverDetail from './component/serverDetail.vue'

import { useRoute, useRouter } from 'vue-router';

import api from '/@/api/network';
import api2 from '/@/api/system';

interface TableDataState {
	// ids: number[];
	// id: string;
    activeViewName: string[];
	resourceModalPro: {
		mode: string,
		content: string,
		// content: object,
	},
	detail: object,
    form: object,
    certificateList: object[];
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
			resourceModalPro: {
				mode: '',
				content: ''
			},
			detail:{},
            activeViewName: ['1','2','3'],
            certificateList: [],
            form:{
                id: "",
                // 是否开启TLS
                isTls: 0,
                // 证书id
                certificateId: "",
                // 名称
                name: '新建服务器',
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
			api.tunnel.getDetail({"id": id}).then((res: any) => {
				console.log(res)
				state.detail = res
			})
		};
        const submit = () => {
            console.log(state.form)
            let params = {
                ...state.form
            }
            if(mirrorRef.value.getValue()) {
                state.form.protocol.options = eval("(" + mirrorRef.value.getValue() + ")")
            }
            console.log(params)
            // return
            api.server.addItem({...state.form}).then((res: any) => {
				console.log(res);
                ElMessage.success('添加成功')
                router.go(-1);
                // const { list, total, page } = res
                // state.data = list
                // state.total = total
                // state.param.page = page
			});
        };
		onMounted(() => {
            
			let obj = {}
			var jsonData = JSON.stringify(obj);
			state.resourceModalPro.content = JSON.stringify(JSON.parse(jsonData),null,4);
		});
		const handleClick = (tab: TabsPaneContext, event: Event) => {
			console.log(tab, event)
		}
        const getCertificateList = () => {
            api2.certificate.getList().then((res: any) => {
				console.log(res)
                state.certificateList = res.Info;
			})
		}
		watch(
			() => state.form.types,
			(value) => {
				console.log(value)
                if(value == 'http') {
                    getCertificateList()
                }
                // api.certificate.getList();
			}
		);

        watch(
			() => state.form.isTls,
			(value) => {
				console.log(value)
                if(value == '2') {
                    state.form.certificate = ''
                }
                // api.certificate.getList();
			}
		);
		return {
			Edit,
            mirrorRef,
			activeName,
			getDetail,
			handleClick,
            network_server_type,
            network_protocols,
			// editDicRef,
			// editAttrRef,
			// editFunRef,
			// editEventRef,
			// editTabRef,
            getCertificateList,
            submit,
			...toRefs(props),
			...toRefs(state),
		};
	},
});
</script>

<style>
.CodeMirror {
  width: 100%;
  height: 600px;
  font-size: 16px;
}
</style>
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

</style>

