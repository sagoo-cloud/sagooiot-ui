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
	</el-card>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
import type { TabsPaneContext } from 'element-plus'

import serverDetail from './component/serverDetail.vue'

import { useRoute } from 'vue-router';

import api from '/@/api/network';

interface TableDataState {
	resourceModalPro: {
		mode: string,
		content: string,
	},
	detail: {}
}
export default defineComponent({
	name: 'tunnelDetail',
	components: { serverDetail },
	props: {
		type: {
			type: String,
			default: ''
		}
	},

	setup(props, context) {
		const route = useRoute();
		const state = reactive<TableDataState>({
			resourceModalPro: {
				mode: '',
				content: ''
			},
			detail:{}
		});
		const activeName = ref('first')
		const getDetail = () => {
			const id = route.params && route.params.id;
			api.server.getDetail({"id": id}).then((res: any) => {
				console.log(res)
				state.detail = res
			})
		};
		onMounted(() => {
			getDetail()
		});
		const handleClick = (tab: TabsPaneContext, event: Event) => {
			console.log(tab, event)
		}

		return {
			Edit,
			activeName,
			getDetail,
			handleClick,
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

