<template>
	<div class="layout-logo" v-if="setShowLogo" @click="onThemeConfigChange">
		<el-image :src="sysinfo.systemLogo" class="logo" />
		<span>{{ sysinfo.systemName }}</span>
	</div>
	<div class="layout-logo-size" v-else @click="onThemeConfigChange">
		<el-image :src="sysinfo.systemLogoMini" class="logo-mini" />
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '/@/store/index';

import logoMini from '/imgs/logo-mini.svg';

export default defineComponent({
	name: 'layoutLogo',
	data() {
		return {
			sysinfo: {
				systemName: '',
				systemLogo: '',
				systemLogoMini: '',
			},
		};
	},
	created() {
		this.sysinfo = JSON.parse(localStorage.sysinfo || '{}');
	},
	setup() {
		const store = useStore();
		// 获取布局配置信息
		const getThemeConfig = computed(() => {
			return store.state.themeConfig.themeConfig;
		});
		// 设置 logo 的显示。classic 经典布局默认显示 logo
		const setShowLogo = computed(() => {
			let { isCollapse, layout } = store.state.themeConfig.themeConfig;
			return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
		});
		// logo 点击实现菜单展开/收起
		const onThemeConfigChange = () => {
			if (store.state.themeConfig.themeConfig.layout === 'transverse') return false;
			store.state.themeConfig.themeConfig.isCollapse = !store.state.themeConfig.themeConfig.isCollapse;
		};
		return {
			logoMini,
			setShowLogo,
			getThemeConfig,
			onThemeConfigChange,
		};
	},
});
</script>

<style scoped lang="scss">
.layout-logo {
	width: 220px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	// box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	color: var(--next-bg-menuBar-black);
	background: var(--next-bg-menuBar-light);
	font-size: 20px;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;

	&:hover {
		span {
			color: var(--color-primary-light-2);
		}
	}

	.logo {
		height: 32px;
		width: auto;
		padding-right: 5px;
	}
}

.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	align-items: center;

	.logo-mini {
		height: 32px;
		width: auto;
		margin: 0 auto;
	}

	&:hover {
		img {
			animation: logoAnimation 0.3s ease-in-out;
		}
	}
}
</style>
