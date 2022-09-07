<template>
	<el-card class="system-dic-container" style="position: relative;">
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="标准视图" name="first">
				<el-collapse v-model="activeViewName">
                    <el-collapse-item title="基本信息" name="1">
                        <div class="collapse-wrap">
                            <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                                <el-form-item label="名称">
                                    <el-input v-model="form.name" placeholder="请填写名称" />
                                </el-form-item>
                                <el-form-item label="类型">
                                    <el-select v-model="form.types" placeholder="请选择类型">
                                        <el-option
                                            v-for="dict in network_tunnel_type"
                                            :key="dict.value"
                                            :label="dict.label"
                                            :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-show="form.types!='serial'" label="地址">
                                    <el-input v-model="form.addr" placeholder="端口号，IP:端口" />
                                </el-form-item>
                                <el-form-item label="禁用">
                                    <el-switch style="--el-switch-on-color: #dc1414;" v-model="form.status" />
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item v-show="form.types=='serial'" title="串口参数" name="2">
                        <div class="collapse-wrap">
                            <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                                <el-form-item label="端口">
                                    <el-button>/dev/ttyS0</el-button>
                                </el-form-item>
                                <el-form-item label="波特率">
                                    <el-select v-model="form.serial.baud_rate" placeholder="请选择波特率">
                                        <el-option label="150" :value="150" />
                                        <el-option label="200" :value="200" />
                                        <el-option label="300" :value="300" />
                                        <el-option label="600" :value="600" />
                                        <el-option label="1200" :value="1200" />
                                        <el-option label="1800" :value="1800" />
                                        <el-option label="2400" :value="2400" />
                                        <el-option label="4800" :value="4800" />
                                        <el-option label="7200" :value="7200" />
                                        <el-option label="9600" :value="9600" />
                                        <el-option label="14400" :value="14400" />
                                        <el-option label="19200" :value="19200" />
                                        <el-option label="28800" :value="28800" />
                                        <el-option label="38400" :value="38400" />
                                        <el-option label="57600" :value="57600" />
                                        <el-option label="76800" :value="76800" />
                                        <el-option label="115200" :value="115200" />
                                        <el-option label="230400" :value="230400" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据位">
                                    <el-select v-model="form.serial.data_bits" placeholder="请选择数据位">
                                        <el-option label="5" :value="5" />
                                        <el-option label="6" :value="6" />
                                        <el-option label="7" :value="7" />
                                        <el-option label="8" :value="8" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="停止位">
                                    <el-select v-model="form.serial.stop_bits" placeholder="请选择停止位">
                                        <el-option label="1" :value="1" />
                                        <el-option label="2" :value="2" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="检验位">
                                    <el-select v-model="form.serial.parity" placeholder="请选择检验位">
                                        <el-option label="无" :value="0" />
                                        <el-option label="偶" :value="1" />
                                        <el-option label="奇" :value="2" />
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item v-show="form.type!='serial'" title="心跳包" name="4">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                            <el-form-item label="启用">
                                <el-switch v-model="form.heartbeat.enable" />
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item v-if="form.types=='serial'||form.types=='tcp-client'||form.types=='udp-client'" title="断线重连" name="4">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                            <el-form-item label="启用">
                                <el-switch v-model="form.retry.enable" />
                            </el-form-item>
                            <el-form-item label="间隔">
                                <el-input-number v-model="form.retry.timeout" :min="0" @change="handleChange" />
                            </el-form-item>
                            <el-form-item label="最大次数">
                                <el-input-number v-model="form.retry.maximum" :min="0" @change="handleChange" />
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="协议适配" name="5">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                            <el-form-item label="协议">
                                <el-select v-model="form.protocol.name" placeholder="请选择协议适配">
                                    <el-option label="Modbus RTU" value="Modbus RTU" />
                                    <el-option label="Modbus TCP" value="Modbus TCP" />
                                    <el-option label="Omron Hostlink" value="Omron Hostlink" />
                                    <el-option label="Omron FINS UDP" value="Omron FINS UDP" />
                                    <el-option label="Omron FINS TCP" value="Omron FINS TCP" />
                                    <el-option label="Simatic S7-200 Smart" value="Simatic S7-200 Smart" />
                                    <el-option label="Simatic S7-200" value="Simatic S7-200" />
                                    <el-option label="Simatic S7-300" value="Simatic S7-300" />
                                    <el-option label="Simatic S7-400" value="Simatic S7-400" />
                                    <el-option label="Simatic S7-1200" value="Simatic S7-1200" />
                                    <el-option label="Simatic S7-1500" value="Simatic S7-1500" />
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
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'
import codeEditor from '/@/components/codeEditor/index.vue'

import serverDetail from './component/serverDetail.vue'

import { useRoute, useRouter } from 'vue-router';

import api from '/@/api/network';

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
    form: object
}
export default defineComponent({
	name: 'tunnelCreate',
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
        const { network_tunnel_type } = proxy.useDict('network_tunnel_type');
		
        const state = reactive<TableDataState>({
            // id: "",
			resourceModalPro: {
				mode: '',
				content: ''
			},
			detail:{},
            activeViewName: ['1','2','3','4','5'],
            form:{
                // 名称
                name: '新建通道',
                // 类型
                types: 'serial',
                // 禁用
                status: false,
                // 地址
                addr: '',
                // 串口参数
                serial:{
                    baud_rate: 9600,
                    data_bits: 8,
                    stop_bits: 1,
                    parity: 0
                },
                // 断线重连
                retry: {
                    enable: true,
                    timeout: 30,
                    maximum: 0,
                },
                // 协议适配
                protocol: {
                    name: "Modbus RTU",
                    options: {}
                },
                // 心跳包
                heartbeat: {
                    enable: false,
                    hex: "",
                    regex: "^\\w+$",
                    text: "",
                    timeout: 30
                }
            }
		});
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
            // 串口参数-检验位-无
            if(state.form.serial.parity == 0) {
                state.form.serial.rs485 = false
                delete state.form.serial.port
            }
            // 串口参数-检验位-偶/奇
            if(state.form.serial.parity == 1 || state.form.serial.parity == 2) {
                state.form.serial.port = null
                delete state.form.serial.rs485
            }
            let params = {
                ...state.form
            }
            console.log(params)
            // return
            api.tunnel.addItem({...state.form}).then((res: any) => {
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
            
			let obj = {
						// "id": 1,
						// "name": "新建服务器",
						// "type": "tcp",
						// "addr": "10010",
						// "register": {
						// 	"regex": "^\\w+$"
						// },
						// "heartbeat": {
						// 	"enable": false,
						// 	"timeout": 30,
						// 	"regex": "^\\w+$"
						// },
						// "protocol": {
						// 	"name": "ModbusTCP",
						// 	"options": {}
						// },
						// "devices": [
						// 	{
						// 		"station": 1,
						// 		"product_id": ""
						// 	}
						// ],
						// "disabled": false,
						// "updated": "2022-08-26T15:10:07+08:00",
						// "created": "2022-08-20T18:44:20+08:00",
						// "running": true
					}
					var jsonData = JSON.stringify(obj);
					state.resourceModalPro.content = JSON.stringify(JSON.parse(jsonData),null,4);
		});
		const handleClick = (tab: TabsPaneContext, event: Event) => {
			console.log(tab, event)
		}

		return {
			Edit,
			activeName,
			getDetail,
			handleClick,
            network_tunnel_type,
			// editDicRef,
			// editAttrRef,
			// editFunRef,
			// editEventRef,
			// editTabRef,
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

