import type { App } from 'vue';
import { smallInBig } from '/@/utils/arrayOperation';
import router from '../router';

/**
 * 用户权限指令
 * @directive 单个权限验证（v-col="xxx"）
 * @directive 多个权限验证，满足一个则显示（v-cols="[xxx,xxx]"）
 * @directive 多个权限验证，全部满足则显示（v-col-all="[xxx,xxx]"）
 */
export function colDirective(app: App) {
	const allPermissions = "*/*/*"
	// 单个权限验证（v-col="xxx"）
	app.directive('col', {
		mounted(el, binding) {
			if (localStorage.colNoAuth) return
			const columns = <string[]>router.currentRoute.value.meta.columns
			if (columns.includes(allPermissions)) return
			if (!columns.includes(binding.value)) el.parentNode.removeChild(el)
		},
	});
	// 多个权限验证，满足一个则显示（v-cols="[xxx,xxx]"）
	app.directive('cols', {
		mounted(el, binding) {
			if (localStorage.colNoAuth) return
			const columns = <string[]>router.currentRoute.value.meta.columns
			if (columns.includes(allPermissions)) return
			let flag = false;
			columns.map((val: string) => {
				binding.value.map((v: string) => {
					if (val === v) flag = true;
				});
			});
			if (!flag) el.parentNode.removeChild(el);
		},
	});
	// 多个权限验证，全部满足则显示（v-col-all="[xxx,xxx]"）
	app.directive('col-all', {
		mounted(el, binding) {
			if (localStorage.colNoAuth) return
			const columns = <string[]>router.currentRoute.value.meta.columns
			if (columns.includes(allPermissions)) return
			!smallInBig(columns, binding.value) && el.parentNode.removeChild(el)
		},
	});
}
