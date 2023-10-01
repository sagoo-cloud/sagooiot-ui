<template>
	<el-card class="system-dic-container" style="position: relative">
		<div class="content">
			<div class="flex cont_box">
				<div class="font26">升级包名称：店里车间场景</div>
				<div class="pro-status"><span :class="developer_status == 2 ? 'on' : 'off'"></span>{{ developer_status == 2 ? '已验证' : '未验证' }}</div>
			</div>
			<div class="mt20"></div>
			<div class="container">
				<div class="item">升级包类型：整包</div>
				<div class="item">升级包签名：d52b637c5eaf2bc9c24008bc4b723600</div>
			</div>
			<div class="container">
				<div class="item">签名算法：MD5</div>
				<div class="item">模块名称：default</div>
			</div>
			<div class="mt20"></div>
			<div class="status_list">
				<div class="otaflex">
					<div class="otaflex_div1">
							<div class="otaflex_div2">
								<span class="title">目标设备总数</span>
								<div class="count otaflex_div3">0</div>
							</div>
						</div>
						<div class="otaflex_div1">
							<div class="otaflex_div2">
								<span class="title"><span class="on"></span>目标成功数</span>
								<div class="count otaflex_div3">0</div>
							</div>

						</div>
						<div class="otaflex_div1">
							<div class="otaflex_div2">
								<span class="title"><span class="off"></span>目标失败数</span>
								<div class="count otaflex_div3">0</div>
							</div>
						</div>
						<div class="otaflex_div1">
							<div class="otaflex_div2">
								<span class="title"><span class="ofn"></span>目标取消数</span>
								<div class="count otaflex_div3">0</div>
							</div>

						</div>
				</div>
			</div>
		</div>
	</el-card>
	<div class="mt10"></div>
	<el-card class="system-dic-container" style="position: relative">
		<el-tabs v-model="activeTab">
				<el-tab-pane label="批次管理" name="tab1">
					<BatchList :updata_id="detail.id"></BatchList>
				</el-tab-pane>
				<el-tab-pane label="设备列表" name="tab2">
					<DeviceList :updata_id="detail.id"></DeviceList>
				</el-tab-pane>
				<el-tab-pane label="升级包信息" name="tab3">
					<InfoList :updata_id="detail.id"></InfoList>
				</el-tab-pane>
			</el-tabs>
	</el-card>

</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { EditPen, DocumentAdd } from '@element-plus/icons-vue'
import EditForm from './edit.vue'
import InfoList from './component/info.vue'
import DeviceList from './component/device.vue'
import BatchList from './component/batch.vue'
import api from '/@/api/network'

const editFormRef = ref()

export default defineComponent({
	components: { EditPen, EditForm, DocumentAdd,InfoList,DeviceList,BatchList},
	setup(props, context) {
		const route = useRoute()
		const router = useRouter()
		const state = reactive({
			activeTab:'tab1',
			developer_status: 2,
			detail: {},
			
		})
		const getDetail = () => {
			const id = route.params && route.params.id
			api.server.getDetail({ id: id }).then((res: any) => {
				state.detail = res
			})
		}
		const addOrEdit = async (row?: any) => {
			editFormRef.value.open(row)
		}

		const freshData = () => {
			getDetail()
			ElMessage.success('刷新成功')
		}
		const toEdit = () => {
			router.push(`/iotmanager/network/server/edit/${route.params && route.params.id}`)
		}
		onMounted(() => {
			// getDetail()
		})
		const handleClick = (tab: TabsPaneContext, event: Event) => {
			// console.log(tab, event)
		}

		return {
			toEdit,
			addOrEdit,
			editFormRef,
			freshData,
			getDetail,
			handleClick,
			...toRefs(props),
			...toRefs(state),
		}
	},
})
</script>

<style scoped lang="scss">
.status_list{
	width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
	padding: 10px;
	.otaflex{
		font-size: 12px;
		display: flex;
		align-items: center;
		margin-left: -6px;
		.otaflex_div1{
			padding: 0 24px;
			min-width: 200px;
			width: fit-content;
			.otaflex_div2 {
				align-items: center;
				.title{
					color: #666;
					font-size: 14px;
				}
				span {
					display: block;
					border-radius: 50%;
					.on {
						background: #52c41a;
					}

					.off {
						background: #c41a1a;
					}
					.ofn {
						background: rgb(255, 138, 0);
					}

					span {
						position: relative;
						top: -1px;
						display: inline-block;
						width:10px;
						height: 10px;
						vertical-align: middle;
						border-radius: 50%;
						margin-right: 5px;
					}

				}
				.otaflex_div3{
					font-size: 24px;
					margin-top: 10px;
					color: #373d41;
				}
			}
	
	
		}
		
	}
}
.container {
	display: flex;
	padding: 10px;
}

.item {
	flex: 1;
}
.desc {
	margin-top: 15px;
}

.edit {
	line-height: 40px;
	margin-top: 15px;
	margin-left: 30px;
}

.cont_box .pro-status {
	line-height: 40px;
	margin-left: 30px;
	margin-top: 5px;

	.on {
		background: #52c41a;
	}

	.off {
		background: #c41a1a;
	}

	span {
		position: relative;
		top: -1px;
		display: inline-block;
		width: 6px;
		height: 6px;
		vertical-align: middle;
		border-radius: 50%;
		margin-right: 5px;
	}
}
</style>
