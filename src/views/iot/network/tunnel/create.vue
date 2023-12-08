<template>
    <el-card class="system-dic-container" style="position: relative;">
        <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="新增通道" name="first">
                <el-collapse v-model="activeViewName">
                    <el-collapse-item title="基本信息" name="1">
                        <div class="collapse-wrap">
                            <el-form style="width: 600px;margin: 0 auto;" :model="form" :rules="rules" label-width="68px">
                                <el-form-item label="名称" prop="name">
                                    <el-input v-model="form.name" show-word-limit maxlength="20" placeholder="请填写名称" />
                                </el-form-item>
                                <el-form-item label="类型">
                                    <el-select v-model="form.types" placeholder="请选择类型">
                                        <el-option v-for="dict in network_tunnel_type" :key="dict.value" :label="dict.label" :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-show="form.types != 'serial'" label="地址">
                                    <el-input v-model="form.addr" placeholder="端口号，IP:端口" />
                                </el-form-item>
                                <el-form-item label="启用">
                                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item v-show="form.types == 'serial'" title="串口参数" name="2">
                        <div class="collapse-wrap">
                            <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                                <el-form-item label="端口">
                                    <el-button>/dev/ttyS0</el-button>
                                </el-form-item>
                                <el-form-item label="波特率">
                                    <el-select v-model="form.serial.baud_rate" placeholder="请选择波特率">
                                        <el-option v-for="dict in tunnel_serial_baudrate" :key="dict.value" :label="dict.label" :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据位">
                                    <el-select v-model="form.serial.data_bits" placeholder="请选择数据位">
                                        <el-option v-for="dict in tunnel_serial_databits" :key="dict.value" :label="dict.label" :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="停止位">
                                    <el-select v-model="form.serial.stop_bits" placeholder="请选择停止位">
                                        <el-option v-for="dict in tunnel_serial_stopbits" :key="dict.value" :label="dict.label" :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="检验位">
                                    <el-select v-model="form.serial.parity" placeholder="请选择检验位">
                                        <el-option v-for="dict in tunnel_serial_parity" :key="dict.value" :label="dict.label" :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item v-show="form.type != 'serial'" title="心跳包" name="4">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                            <el-form-item label="启用">
                                <el-switch v-model="form.heartbeat.enable" />
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item v-if="form.types == 'serial' || form.types == 'tcp-client' || form.types == 'udp-client'" title="断线重连" name="4">
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
                                <el-select v-model="form.protoccol.name" placeholder="请选择协议适配">
                                    <el-option v-for="dict in network_protocols" :key="dict.value" :label="dict.label" :value="dict.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="协议参数">
                                <codeEditor class="params" ref="mirrorRef" :mode="resourceModalPro.mode" :content="resourceModalPro.content" :getValue="getValue">
                                </codeEditor>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
        </el-tabs>
        <div style="position: absolute;right:20px;top: 20px;">
            <el-button size="medium" @click="$router.replace('/iotmanager/network/tunnel')">取消</el-button>
            <el-button @click="submit" size="medium" type="primary">提交</el-button>
        </div>
    </el-card>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'
import codeEditor from '/@/components/codeEditor/index.vue'

import serverDetail from './component/serverDetail.vue'

import { useRoute, useRouter } from 'vue-router';

import api from '/@/api/network';

interface TableDataState {
    activeViewName: string[];
    resourceModalPro: {
        mode: string,
        content: string,
    },
    detail: object,
    form: object,
    rules: object,
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
        const { network_tunnel_type, tunnel_serial_baudrate, tunnel_serial_databits, tunnel_serial_stopbits, tunnel_serial_parity, network_protocols } = proxy.useDict('network_tunnel_type', 'tunnel_serial_baudrate', 'tunnel_serial_databits', 'tunnel_serial_stopbits', 'tunnel_serial_parity', 'network_protocols');

        const state = reactive<TableDataState>({
            // id: "",
            resourceModalPro: {
                mode: '',
                content: ''
            },
            detail: {},
            activeViewName: ['1', '2', '3', '4', '5'],
            form: {
                // 名称
                name: '',
                // 类型
                types: 'serial',
                // 启用
                status: false,
                // 地址
                addr: '',
                // 串口参数
                serial: {
                    baud_rate: "9600",
                    data_bits: "6",
                    stop_bits: "1",
                    parity: '0'
                },
                // 断线重连
                retry: {
                    enable: true,
                    timeout: 30,
                    maximum: 0,
                },
                // 协议适配
                protoccol: {
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
                }
            },
            rules: {
                name: [
                    { required: true, message: '名称不能为空', trigger: 'change' }
                ]
            }
        });

        const mirrorRef = ref('mirrorRef')
        const activeName = ref('first')

        const getDetail = () => {
            const id = route.params && route.params.id;
            api.tunnel.getDetail({ "id": id }).then((res: any) => {
                state.detail = res
            })
        };


        const submit = () => {
            // 串口参数-检验位-无
            if (state.form.serial.parity == 0) {
                state.form.serial.rs485 = false
                delete state.form.serial.port
            }
            // 串口参数-检验位-偶/奇
            if (state.form.serial.parity == 1 || state.form.serial.parity == 2) {
                state.form.serial.port = null
                delete state.form.serial.rs485
            }
            if (mirrorRef.value.getValue()) {
                try {
                    state.form.protoccol.options = eval("(" + mirrorRef.value.getValue() + ")")
                } catch (error) {
                    return ElMessage('协议参数解析错误')
                }
            }
            // return
            api.tunnel.addItem({ ...state.form }).then((res: any) => {
                ElMessage.success('添加成功')
                goBack()
            });
        };
        const goBack = () => {
            router.go(-1);
        }
        onMounted(() => {
            let obj = {}
            var jsonData = JSON.stringify(obj);
            state.resourceModalPro.content = JSON.stringify(JSON.parse(jsonData), null, 4);
        });

        return {
            mirrorRef,
            activeName,
            getDetail,
            network_tunnel_type,
            tunnel_serial_baudrate,
            tunnel_serial_databits,
            tunnel_serial_stopbits,
            tunnel_serial_parity,
            network_protocols,
            submit,
            goBack,
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
        margin: 0 !important;
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

