<template>
	<el-card class="system-dic-container" style="position: relative;">
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="标准视图" name="first">
				<el-collapse v-model="activeViewName">
                    <el-collapse-item title="基本信息" name="1">
                        <div class="collapse-wrap">
                            <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                                <el-form-item label="名称">
                                <el-input v-model="form.name" />
                                </el-form-item>
                                <el-form-item label="类型">
                                <el-select v-model="form.region" placeholder="请选择类型">
                                    <el-option label="Zone one" value="shanghai" />
                                    <el-option label="Zone two" value="beijing" />
                                </el-select>
                                </el-form-item>
                                <el-form-item label="禁用">
                                    <el-switch style="--el-switch-on-color: #dc1414;" v-model="form.delivery" />
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="串口参数" name="2">
                        <div class="collapse-wrap">
                            <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                                <el-form-item label="端口">
                                    <el-button></el-button>
                                </el-form-item>
                                <el-form-item label="波特率">
                                    <el-select v-model="form.region" placeholder="请选择波特率">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="数据位">
                                    <el-select v-model="form.region" placeholder="请选择数据位">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="停止位">
                                    <el-select v-model="form.region" placeholder="请选择停止位">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="检验位">
                                    <el-select v-model="form.region" placeholder="请选择检验位">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="断线重连" name="3">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                            <el-form-item label="启用">
                                <el-switch v-model="form.delivery" />
                            </el-form-item>
                            <el-form-item label="间隔">
                                <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />
                            </el-form-item>
                            <el-form-item label="最大次数">
                                <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="协议适配" name="4">
                        <el-form style="width: 600px;margin: 0 auto;" :model="form" label-width="68px">
                            <el-form-item label="协议">
                                <el-select v-model="form.region" placeholder="请选择协议适配">
                                    <el-option label="Zone one" value="shanghai" />
                                    <el-option label="Zone two" value="beijing" />
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
            <el-button size="medium" type="primary">提交</el-button>
		</div>

	  	 <!-- <codeEditor ref="mirrorRef"
	  :mode="resourceModalPro.mode"
	  :content="resourceModalPro.content"
	  >
	  </codeEditor> -->
	</el-card>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'
import codeEditor from '/@/components/codeEditor/index.vue'

import serverDetail from './component/serverDetail.vue'

import { useRoute } from 'vue-router';

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
		const route = useRoute();
		const state = reactive<TableDataState>({
            // id: "",
			resourceModalPro: {
				mode: '',
				content: ''
			},
			detail:{},
            activeViewName: ['1','2','3','4'],
            form:{
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: '',
            }
		});
		const activeName = ref('first')
        // const activeViewName = ref('1')
		const getDetail = () => {
			const id = route.params && route.params.id;
			api.tunnel.getDetail({"id": id}).then((res: any) => {
				console.log(res)
				state.detail = res
			})
		};
		onMounted(() => {
			// return;
			let obj = {
						"id": 1,
						"name": "新建服务器",
						"type": "tcp",
						"addr": "10010",
						"register": {
							"regex": "^\\w+$"
						},
						"heartbeat": {
							"enable": false,
							"timeout": 30,
							"regex": "^\\w+$"
						},
						"protocol": {
							"name": "ModbusTCP",
							"options": {}
						},
						"devices": [
							{
								"station": 1,
								"product_id": ""
							}
						],
						"disabled": false,
						"updated": "2022-08-26T15:10:07+08:00",
						"created": "2022-08-20T18:44:20+08:00",
						"running": true
					}
					var jsonData = JSON.stringify(obj);//data是请求的后台数据
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
			// editDicRef,
			// editAttrRef,
			// editFunRef,
			// editEventRef,
			// editTabRef,
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

