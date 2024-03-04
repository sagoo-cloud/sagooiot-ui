import type { App } from 'vue';
import { smallInBig } from '/@/utils/arrayOperation';
import router from '../router';

/**
 * 用户权限指令
 * @directive 单个权限验证（v-auth="xxx"）
 * @directive 多个权限验证，满足一个则显示（v-auths="[xxx,xxx]"）
 * @directive 多个权限验证，全部满足则显示（v-auth-all="[xxx,xxx]"）
 */
export function authDirective(app: App) {
	const allPermissions = "*/*/*"
	// 单个权限验证（v-auth="xxx"）
	app.directive('auth', {
		mounted(el, binding) {
			if (localStorage.btnNoAuth) return
			const buttons = <string[]>router.currentRoute.value.meta.buttons
			if (buttons.includes(allPermissions)) return

			// 不显示该dom
			if (!buttons.includes(binding.value)) el.parentNode.removeChild(el)
			// 设置为disabled
			// if (!buttons.includes(binding.value)) el.classList.add('v-disabled')
		},
	});
	app.directive('noauth', {
		mounted(el, binding) {
			const buttons = <string[]>router.currentRoute.value.meta.buttons
			if (buttons.includes(binding.value)) el.parentNode.removeChild(el)
		},
	});
	// 多个权限验证，满足一个则显示（v-auths="[xxx,xxx]"）
	app.directive('auths', {
		mounted(el, binding) {
			if (localStorage.btnNoAuth) return
			const buttons = <string[]>router.currentRoute.value.meta.buttons
			if (buttons.includes(allPermissions)) return
			let flag = false;
			buttons.map((val: string) => {
				binding.value.map((v: string) => {
					if (val === v) flag = true;
				});
			});
			if (!flag) el.parentNode.removeChild(el);
			// if (!flag) el.classList.add('v-disabled')
		},
	});
	// 多个权限验证，全部满足则显示（v-auth-all="[xxx,xxx]"）
	app.directive('auth-all', {
		mounted(el, binding) {
			if (localStorage.btnNoAuth) return
			const buttons = <string[]>router.currentRoute.value.meta.buttons
			if (buttons.includes(allPermissions)) return
			!smallInBig(buttons, binding.value) && el.parentNode.removeChild(el)
			// !smallInBig(buttons, binding.value) && el.classList.add('v-disabled')
		},
	});
}
