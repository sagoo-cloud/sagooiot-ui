<template>
	<el-card class="system-dic-container" style="position: relative;">
		<el-tabs v-model="activeName" class="demo-tabs">
			<el-tab-pane label="通道详情" name="first">
				<serverDetail :detail="detail" />
			</el-tab-pane>
			<el-tab-pane label="相关详情" name="second">相关详情</el-tab-pane>
			<el-tab-pane label="通道" name="third">通道</el-tab-pane>
		</el-tabs>
		<div style="position: absolute;right:20px;top: 34px;">
			<el-icon @click="freshData" style="cursor: pointer;font-size: 16px;margin-right:6px;"><ele-RefreshRight /></el-icon>
			<!-- <el-icon style="font-size: 16px;margin: 0 6px;"><ele-Operation /></el-icon> -->
			<el-icon @click="toEdit" style="cursor: pointer;font-size: 16px;"><ele-Edit /></el-icon>
		</div>
	</el-card>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'

import serverDetail from './component/serverDetail.vue'

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

	setup(props, context) {
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
			api.tunnel.getDetail({"id": id}).then((res: any) => {
				state.detail = res
			})
		};
		const freshData = () => {
			getDetail()
			ElMessage.success('刷新成功');
		};
		const toEdit = () => {
            router.push(`/iotmanager/network/tunnel/edit/${route.params && route.params.id}`)
        };
		onMounted(() => {
			getDetail()
		});

		return {
			activeName,
			toEdit,
			freshData,
			getDetail,
			...toRefs(props),
			...toRefs(state),
		};
	},
});
</script>

