<template>
	<el-card class="system-dic-container" style="position: relative;">
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="服务器详情" name="first">
				<serverDetail :detail="detail" />
			</el-tab-pane>
			<el-tab-pane label="相关详情" name="second">相关详情</el-tab-pane>
			<el-tab-pane label="通道" name="third">通道</el-tab-pane>
		</el-tabs>
		<div style="position: absolute;right:20px;top: 34px;">
			<el-icon style="font-size: 16px;"><ele-RefreshRight /></el-icon>
			<el-icon style="font-size: 16px;margin: 0 6px;"><ele-Operation /></el-icon>
			<el-icon style="font-size: 16px;"><ele-Edit /></el-icon>
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
	resourceModalPro: {
		mode: string,
		content: string,
		// content: object,
	},
	detail: {}
}
export default defineComponent({
	name: 'tunnelDetail',
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
			detail:{}
		});
		const activeName = ref('first')
		const getDetail = () => {
			const id = route.params && route.params.id;
			api.getDetail({"id": id}).then((res: any) => {
				console.log(res)
				state.detail = res
			})
		};
		onMounted(() => {
			// state.id = route.params && route.params.id;
			// console.log(state.id)
			getDetail()
			return;
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

