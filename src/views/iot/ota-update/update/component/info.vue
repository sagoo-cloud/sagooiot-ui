<template>
	<el-card class="system-dic-container" style="position: relative">
		<div class="content">
		
			<div class="container">
				<div class="item">升级包 ID：BV2IA9D4wF1b3ZfcRfWQ030100</div>
				<div class="item">升级包名称：测试</div>
				<div class="item">所属产品：测试</div>
			</div>
			<div class="container">
				<div class="item">升级包签名：d52b637c5eaf2bc9c24008bc4b723600</div>
				<div class="item">升级包版本号：1.0</div>
				<div class="item">创建时间：2023/09/30 13:08:46</div>
			</div>
			<div class="container">
				<div class="item">签名算法：MD5</div>
				<div class="item">升级包状态：未验证</div>
				<div class="item">验证进度：0%</div>
			</div>
			<div class="container">
				<div class="item">升级包描述：22222222222222</div>
				<div class="item">推送给设备的自定义信息：22222222222222233</div>
				<div class="item"></div>
			</div>
			
		</div>
	</el-card>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, defineComponent } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import { EditPen, DocumentAdd } from '@element-plus/icons-vue'
import api from '/@/api/network'


export default defineComponent({
	components: { EditPen, DocumentAdd },
	setup(props, context) {
		const route = useRoute()
		const state = reactive({
			developer_status: 2,
			detail: {},
			
		})
		const getDetail = () => {
			const id = route.params && route.params.id
			api.server.getDetail({ id: id }).then((res: any) => {
				state.detail = res
			})
		}
	
	
	
		onMounted(() => {
			 getDetail()
		})
		const handleClick = (tab: TabsPaneContext, event: Event) => {
			// console.log(tab, event)
		}

		return {
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
		font-size: 14px;
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
