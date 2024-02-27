<template>
	<div class="page bg border padding Ipt-2" style="position: relative;">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="服务器详情" name="first">
				<serverDetail :detail="detail" />
			</el-tab-pane>
			<!-- <el-tab-pane label="相关详情" name="second">相关详情</el-tab-pane>
			<el-tab-pane label="通道" name="third">通道</el-tab-pane> -->
		</el-tabs>
		<div style="position: absolute;right:20px;top: 18px;">
			<el-icon @click="freshData" style="font-size: 16px;margin-right:6px;"><ele-RefreshRight /></el-icon>
			<!-- <el-icon style="font-size: 16px;margin: 0 6px;"><ele-Operation /></el-icon> -->
			<el-icon @click="toEdit"  style="cursor: pointer;font-size: 16px;"><ele-Edit /></el-icon>
		</div>
	</div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import type { TabsPaneContext } from 'element-plus';
import serverDetail from './component/serverDetail.vue';
import { useRoute, useRouter } from 'vue-router';

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

	setup(props) {
		const route = useRoute();
		const router = useRouter();
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
				state.detail = res
			})
		};
		const freshData = () => {
			getDetail()
			ElMessage.success('刷新成功');
		};
		const toEdit = () => {
            router.push(`/iotmanager/network/server/edit/${route.params && route.params.id}`)
        };
		onMounted(() => {
			getDetail()
		});
		const handleClick = (tab: TabsPaneContext, event: Event) => {
			// console.log(tab, event)
		}

		return {
			toEdit,
			activeName,
			freshData,
			getDetail,
			handleClick,
			...toRefs(props),
			...toRefs(state),
		};
	},
});
</script>

<style scoped>
.CodeMirror {
  width: 100%;
  height: 600px;
  font-size: 16px;
}
</style>

