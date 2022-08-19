import type { App } from 'vue';
import { authDirective } from '/@/utils/authDirective';
import { colDirective } from '/@/utils/colDirective';
import { wavesDirective, dragDirective } from '/@/utils/customDirective';

/**
 * 导出指令方法：v-xxx
 * @methods colDirective 用户权限指令，用法：v-col
 * @methods authDirective 用户权限指令，用法：v-auth
 * @methods wavesDirective 按钮波浪指令，用法：v-waves
 * @methods dragDirective 自定义拖动指令，用法：v-drag
 */
export function directive(app: App) {
	// 用户权限指令
	authDirective(app);
	// 表格列表显示
	colDirective(app);
	// 按钮波浪指令
	wavesDirective(app);
	// 自定义拖动指令
	dragDirective(app);
}
