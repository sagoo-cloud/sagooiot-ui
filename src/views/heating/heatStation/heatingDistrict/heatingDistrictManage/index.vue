<template>
	<div class="page-container">
		<div class="head-card">
			<div class="head-card-item">
				<div class="item">
					<div class="count">{{ cardCount.org }}</div>
					<div class="label">区域统计</div>
				</div>
				<div class="logo">
					<img src="/@/assets/icon-org.png" class="img">
				</div>
			</div>
			<div class="head-card-item">
				<div class="item">
					<div class="count">{{ cardCount.plot }}</div>
					<div class="label">小区统计</div>
				</div>
				<div class="logo">
					<img src="/@/assets/icon-plot.png" class="img">
				</div>
			</div>
			<div class="head-card-item">
				<div class="item">
					<div class="count">{{ cardCount.resident }}</div>
					<div class="label">住户统计</div>
				</div>
				<div class="logo">
					<img src="/@/assets/icon-resident.png" class="img">
				</div>
			</div>
		</div>
		<div class="panel">
			<div class="left-panel">
				<el-input v-model="filterText" size="default" placeholder="搜索区域" />
				<el-tree :data="treeList" node-key="id" default-expand-all :props="{
					children: 'children'
				}" @node-click="onNodeClick" :expand-on-click-node="false">
					<template #default="{ data }">
						<span class="custom-tree-node" :class="{ active: `${data.id}-${data.orgType}` === `${curNode.id}-${curNode.orgType}` }">
							<img src="/src/assets/icon-org.png" v-if="data.orgType === 'org'">
							<img src="/src/assets/icon-plot.png" v-else-if="data.orgType === 'plot'">
							<img src="/src/assets/icon-floor.png" v-else-if="data.orgType === 'floor'">
							<img src="/src/assets/icon-unit.png" v-else-if="data.orgType === 'unit'">
							<span class="name" :title="data.orgName">{{ data.orgName }}</span>
						</span>
					</template>
				</el-tree>
			</div>
			<div class="right-panel">
				<!-- 小区 -->
				<Regional v-if="curNode.orgType === 'org'" :organizationId="curNode.id" @finish="initPage()" />
				<!-- 楼宇 -->
				<Floor v-else-if="curNode.orgType === 'plot'" :nodeId="curNode.id" @finish="initPage()" />
				<!-- 单元 -->
				<Unit v-else-if="curNode.orgType === 'floor'" :nodeId="curNode.id" @finish="initPage()" />
				<!-- 住户 -->
				<Resident v-else-if="curNode.orgType === 'unit'" :nodeId="curNode.id" @finish="initPage()" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import api from '/@/api/heatingDistrict';
import Regional from './children/regional/index.vue'
import Floor from './children/floor/index.vue'
import Unit from './children/unit/index.vue'
import Resident from './children/resident/index.vue'

export default defineComponent({
	name: '',
	components: {
		Regional,
		Floor,
		Unit,
		Resident
	},
	setup() {
		const treeList = ref([])
		const state = reactive({
			filterText: '',
			cardCount: {
				org: 0,
				plot: 0,
				resident: 0
			},
			curNode: {}
		});
		// 获取区域树
		const getTreeData = () => {
			api.heatingDistrict.getTree({})
				.then((res: any) => {
					treeList.value = res || []
					if (!state.curNode.id) {
						state.curNode = treeList.value[0]
					}
				})
		}
		// 获取组织数量
		const getOrgCount = () => {
			api.heatingDistrict.getOrganizationCount({})
				.then((res: any) => {
					console.log(res)
					state.cardCount.org = res.Count
				})
		}

		// 获取小区数量
		const getPlotCount = () => {
			api.heatingDistrict.getPlotCount({})
				.then((res: any) => {
					console.log(res)
					state.cardCount.plot = res.Count
				})
		}

		// 获取组织数量
		const getResidentCount = () => {
			api.heatingDistrict.getResidentCount({})
				.then((res: any) => {
					console.log(res)
					state.cardCount.resident = res.Count
				})
		}

		const initPage = () => {
			getTreeData()
			getOrgCount()
			getPlotCount()
			getResidentCount()
		}

		const onNodeClick = (data: any, node: any) => {
			// console.log(data)
			// console.log(node)
			if (data.orgType === 'floor') {
				data.plotId = node.parent.data.id
			} else if (data.orgType === 'unit') {
				data.floorId = node.parent.data.id
				data.plotId = node.parent.parent.data.id
			}
			state.curNode = data
		}

		// 页面加载时
		onMounted(() => {
			initPage()
		});


		return {
			treeList,
			onNodeClick,
			getTreeData,
			initPage,
			...toRefs(state),
		};
	},
});
</script>

<style lang="scss" scoped>
.page-container {
	background-color: #fff;

	.panel {
		display: grid;
		grid-template-columns: 250px 1fr;
		border: 1px solid #ddd;
		// &::before {
		// 	content: " ";
		// 	display: block;
		// 	clear: both;
		// }
	}

	.left-panel {
		padding: 20px;
	}

	.right-panel {
		display: flex;
		flex-direction: column;
		padding: 20px;
		border-left: 1px solid #ddd;
		position: relative;
	}
}


.custom-tree-node {
	display: grid;
	grid-template-columns: 20px 1fr;
	align-items: center;

	img {
		width: 16px;
		height: 16px;
	}

	.name {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&.active {
		color: var(--el-color-primary);
		// background: var(--el-color-primary-light-9);
	}
}

.head-card {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	padding: 20px;

	&-item {
		display: flex;
		justify-content: center;
		align-items: center;

		.item {
			text-align: center;

			// margin-right: 10px;
			.count {
				font-size: 32px;
				font-weight: 700;
				color: #101010;
				margin-bottom: 5px;
			}
		}

		.logo {
			width: 72px;
			height: 72px;
			border-radius: 50%;
			// border: 1px solid #ddd;
			display: flex;
			align-items: center;
			justify-content: center;

			.img {
				width: 32px;
				height: 32px;
			}
		}
	}
}

:deep(.system-dic-container) {
	position: absolute;
	width: calc(100% - 40px);
}
</style>