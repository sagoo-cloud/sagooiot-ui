<template>
	<div class="page padding">
		<el-card shadow="nover">
			<el-menu :default-active="activeName" @select="menuChange" class="el-menu-vertical-demo" size="small">
				<el-menu-item index="1">基础配置</el-menu-item>
				<el-menu-item index="2">安全配置</el-menu-item>
			</el-menu>
		</el-card>
		<el-card shadow="nover">
			<div class="scroll-wrapper">
				<BasicVue v-if="activeName === '1'"></BasicVue>
				<SafeVue v-else-if="activeName === '2'"></SafeVue>
			</div>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import BasicVue from "./basic.vue";
import SafeVue from "./safe.vue";


const activeName = ref('1')

function menuChange(index: string) {
	activeName.value = index
}

</script>


<style scoped lang="scss">
.page {
	display: flex;
	justify-content: space-between;
	gap: 16px;

	.el-card:first-child {
		width: 240px;
	}

	.el-card:last-child {
		flex: 1;
	}
	.el-card ::v-deep(.el-card__body) {
		flex: 1;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.el-menu {
		width: 200px;

		::v-deep(.el-menu-item) {
			height: 40px !important;
			line-height: 40px !important;
		}
	}
}
</style>
