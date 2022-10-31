<template>
	<el-card class="system-dic-container" style="position: relative;">
		<el-tabs v-model="activeName" class="demo-tabs">
			<el-tab-pane label="编辑服务器" name="first">
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
			<el-button size="medium">取消</el-button>
            <el-button @click="submit" size="medium" type="primary">提交</el-button>
		</div>
	</el-card>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
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
    form: object
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
			resourceModalPro: {
				mode: '',
				content: ''
			},
			detail:{},
            activeViewName: ['1','2','3'],
            form:{
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
			api.server.getDetail({"id": id}).then((res: any) => {
                const {id, name, types, status, addr, register, protocol, heartbeat, devices} = res
                state.form["id"] = id
                state.form["name"] = name
                state.form["types"] = types
                state.form["status"] = status
                state.form["addr"] = addr
                state.form["register"] = JSON.parse(register)
                state.form["protocol"] = JSON.parse(protocol)
                state.form["heartbeat"] = JSON.parse(heartbeat)
                state.form["devices"] = JSON.parse(devices)

                let jsonData = JSON.stringify(JSON.parse(protocol).options);
				state.resourceModalPro.content = JSON.stringify(JSON.parse(jsonData),null,4);
                mirrorRef.value.setValue(state.resourceModalPro.content);
			})
		};
        const submit = () => {
            let params = {
                ...state.form
            }
            if(mirrorRef.value.getValue()) {
                state.form.protocol.options = eval("(" + mirrorRef.value.getValue() + ")")
            }
            console.log(params)
            // return
            api.server.editItem({...state.form}).then((res: any) => {
                ElMessage.success('添加成功')
                router.go(-1);
			});
        };
		onMounted(() => {
            getDetail();
		});

		return {
            mirrorRef,
			activeName,
			getDetail,
            network_server_type,
            network_protocols,
            submit,
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

</style>

