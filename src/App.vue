<template>
	<el-config-provider :size="getGlobalComponentSize" :locale="i18nLocale">
		<router-view v-show="getThemeConfig.lockScreenTime !== 0" />
		<LockScreen v-if="getThemeConfig.isLockScreen" />
		<Setings ref="setingsRef" v-show="getThemeConfig.lockScreenTime !== 0" />
		<CloseFull />
	</el-config-provider>
</template>

<script lang="ts">
import { computed, ref, getCurrentInstance, onBeforeMount, onMounted, onUnmounted, nextTick, defineComponent, watch, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '/@/store/index';
import other from '/@/utils/other';
import { Local, Session } from '/@/utils/storage';
import setIntroduction from '/@/utils/setIconfont';
import LockScreen from '/@/layout/lockScreen/index.vue';
import Setings from '/@/layout/navBars/breadcrumb/setings.vue';
import CloseFull from '/@/layout/navBars/breadcrumb/closeFull.vue';
import api from '/@/api/system';
import _ from 'loadsh'
// 进入系统的时间
sessionStorage.setItem('comeTime', Date.now().toString())

export default defineComponent({
	name: 'app',
	components: { LockScreen, Setings, CloseFull },
	async created() {
		api.sysinfo().then((res: any) => {
			localStorage.setItem('sysinfo', JSON.stringify(res));
			// 使用的事base64加密的，解决之后的值  sysPasswordChangePeriod + "|" + isSecurityControlEnabled + "|" + isRsaEnabled
			// 顺序是，密码变更周期，是否启动安全控制，是否启用rsa，中间你需要根据 | 切割一下
			const [sysPasswordChangePeriod, isSecurityControlEnabled, isRsaEnabled] = window.atob(res.target).split('|')

			// 安全开关是否开启 按钮权限，列表权限，rsa权限在开启安全权限下才使用
			sessionStorage.setItem('isSecurityControlEnabled', Number(isSecurityControlEnabled) ? '1' : '');
			sessionStorage.setItem('isRsaEnabled', (Number(isSecurityControlEnabled) && Number(isRsaEnabled)) ? '1' : '');
			sessionStorage.setItem('sysPasswordChangePeriod', sysPasswordChangePeriod);
		});
	},
	setup() {
		// 监听屏幕尺寸变化
		window.onresize = _.debounce(() => {
			store.commit('global/setResize')
		}, 200)
		
		const { proxy } = <any>getCurrentInstance();
		const setingsRef = ref();
		const route = useRoute();
		const store = useStore();
		const state = reactive({
			i18nLocale: null,
		});
		// 获取布局配置信息
		const getThemeConfig = computed(() => {
			return store.state.themeConfig.themeConfig;
		});
		// 获取全局组件大小
		const getGlobalComponentSize = computed(() => {
			return other.globalComponentSize;
		});
		// 布局配置弹窗打开
		const openSetingsDrawer = () => {
			setingsRef.value.openDrawer();
		};
		// 设置初始化，防止刷新时恢复默认
		onBeforeMount(() => {
			// 设置批量第三方 icon 图标
			setIntroduction.cssCdn();
			// 设置批量第三方 js
			setIntroduction.jsCdn();
		});
		// 页面加载时
		onMounted(() => {
			nextTick(() => {
				// 监听布局配置弹窗点击打开
				proxy.mittBus.on('openSetingsDrawer', () => {
					openSetingsDrawer();
				});
				// 设置 i18n，App.vue 中的 el-config-provider
				proxy.mittBus.on('getI18nConfig', (locale: string) => {
					(state.i18nLocale as string | null) = locale;
				});
				// 获取缓存中的布局配置
				if (Local.get('themeConfig')) {
					store.dispatch('themeConfig/setThemeConfig', Local.get('themeConfig'));
					document.documentElement.style.cssText = Local.get('themeConfigStyle');
				}
				// 获取缓存中的全屏配置
				if (Session.get('isTagsViewCurrenFull')) {
					store.dispatch('tagsViewRoutes/setCurrenFullscreen', Session.get('isTagsViewCurrenFull'));
				}
			});
		});
		// 页面销毁时，关闭监听布局配置/i18n监听
		onUnmounted(() => {
			proxy.mittBus.off('openSetingsDrawer', () => { });
			proxy.mittBus.off('getI18nConfig', () => { });
		});
		// 监听路由的变化，设置网站标题
		watch(
			() => route.path,
			() => {
				other.useTitle();
			}
		);
		return {
			setingsRef,
			getThemeConfig,
			getGlobalComponentSize,
			...toRefs(state),
		};
	},
});
</script>
