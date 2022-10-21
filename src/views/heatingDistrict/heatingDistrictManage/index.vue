<template>
  <div class="page-container">
		<div class="left-panel">
  		<el-input v-model="filterText" size="default" placeholder="搜索区域" />
			<el-tree
				:data="treeList"
				node-key="id"
				default-expand-all
				:props="{
					children: 'children'
				}"
				@node-click="onNodeClick"
				:expand-on-click-node="false"
			>
				<template #default="{ node, data }">
					<span class="custom-tree-node" :class="{ active: data.id === curNode.id }">
						<span>{{ data.orgName }}</span>
					</span>
				</template>
			</el-tree>
		</div>
		<div class="right-panel">
			<!-- 小区 -->
			<Regional v-if="curNode.orgType === 'org'" :organizationId="curNode.id" @finish="getTreeData()"/>
			<!-- 楼宇 -->
			<Floor v-else-if="curNode.orgType === 'plot'" :nodeId="curNode.id" @finish="getTreeData()"/>
			<!-- 单元 -->
			<Unit v-else-if="curNode.orgType === 'floor'" :nodeId="curNode.id" @finish="getTreeData()"/>
			<!-- 住户 -->
			<Resident v-else-if="curNode.orgType === 'unit'" :nodeId="curNode.id" @finish="getTreeData()"/>
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
		const onNodeClick = (data: any, node: any) => {
			console.log(data)
			console.log(node)
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
			getTreeData()
		});


		return {
			treeList,
			onNodeClick,
			getTreeData,
			...toRefs(state),
		};
	},
});
</script>

<style lang="scss" scoped>
.page-container {
	display: grid;
	grid-template-columns: 250px 1fr;
	background-color: #fff;
	border: 1px solid #ddd;
	.left-panel {
		padding: 20px;
	}
	.right-panel {
		display: flex;
		flex-direction: column;
		padding: 20px;
		border-left: 1px solid #ddd;
	}
}


.custom-tree-node {
  &.active {
    color: var(--el-color-primary);
		// background: var(--el-color-primary-light-9);
  }
}
</style>