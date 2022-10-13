<template>
	<el-dialog title="生成配置" v-model="state.dialogVisible" width="769px">
		<el-form ref="form" :model="state.ruleForm" label-width="80px">
			<el-form-item label="上级菜单">
				<el-cascader :options="state.options" :props="state.props" clearable style="width: 100%;"/>
			</el-form-item>
		</el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="default" @click="state.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="state.dialogVisible = false">编 辑</el-button>
      </div>
    </template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import api from '/@/api/device';
import { ElMessage } from 'element-plus';

const tagOption = ref(['api', 'editVue', 'entity', 'jsApi', 'listVue', 'router', 'service'])
const state = reactive({
	dialogVisible: false,
	props: {
		checkStrictly: true,
	},
	ruleForm: {},
	options: [
		{
			value: 'guide',
			label: 'Guide',
			children: [
				{
					value: 'disciplines',
					label: 'Disciplines',
					children: [
						{
							value: 'consistency',
							label: 'Consistency',
						},
						{
							value: 'feedback',
							label: 'Feedback',
						},
						{
							value: 'efficiency',
							label: 'Efficiency',
						},
						{
							value: 'controllability',
							label: 'Controllability',
						},
					],
				},
				{
					value: 'navigation',
					label: 'Navigation',
					children: [
						{
							value: 'side nav',
							label: 'Side Navigation',
						},
						{
							value: 'top nav',
							label: 'Top Navigation',
						},
					],
				},
			],
		},
		{
			value: 'component',
			label: 'Component',
			children: [
				{
					value: 'basic',
					label: 'Basic',
					children: [
						{
							value: 'layout',
							label: 'Layout',
						},
						{
							value: 'color',
							label: 'Color',
						},
						{
							value: 'typography',
							label: 'Typography',
						},
						{
							value: 'icon',
							label: 'Icon',
						},
						{
							value: 'button',
							label: 'Button',
						},
					],
				},
				{
					value: 'form',
					label: 'Form',
					children: [
						{
							value: 'radio',
							label: 'Radio',
						},
						{
							value: 'checkbox',
							label: 'Checkbox',
						},
						{
							value: 'input',
							label: 'Input',
						},
						{
							value: 'input-number',
							label: 'InputNumber',
						},
						{
							value: 'select',
							label: 'Select',
						},
						{
							value: 'cascader',
							label: 'Cascader',
						},
						{
							value: 'switch',
							label: 'Switch',
						},
						{
							value: 'slider',
							label: 'Slider',
						},
						{
							value: 'time-picker',
							label: 'TimePicker',
						},
						{
							value: 'date-picker',
							label: 'DatePicker',
						},
						{
							value: 'datetime-picker',
							label: 'DateTimePicker',
						},
						{
							value: 'upload',
							label: 'Upload',
						},
						{
							value: 'rate',
							label: 'Rate',
						},
						{
							value: 'form',
							label: 'Form',
						},
					],
				},
				{
					value: 'data',
					label: 'Data',
					children: [
						{
							value: 'table',
							label: 'Table',
						},
						{
							value: 'tag',
							label: 'Tag',
						},
						{
							value: 'progress',
							label: 'Progress',
						},
						{
							value: 'tree',
							label: 'Tree',
						},
						{
							value: 'pagination',
							label: 'Pagination',
						},
						{
							value: 'badge',
							label: 'Badge',
						},
					],
				},
				{
					value: 'notice',
					label: 'Notice',
					children: [
						{
							value: 'alert',
							label: 'Alert',
						},
						{
							value: 'loading',
							label: 'Loading',
						},
						{
							value: 'message',
							label: 'Message',
						},
						{
							value: 'message-box',
							label: 'MessageBox',
						},
						{
							value: 'notification',
							label: 'Notification',
						},
					],
				},
				{
					value: 'navigation',
					label: 'Navigation',
					children: [
						{
							value: 'menu',
							label: 'Menu',
						},
						{
							value: 'tabs',
							label: 'Tabs',
						},
						{
							value: 'breadcrumb',
							label: 'Breadcrumb',
						},
						{
							value: 'dropdown',
							label: 'Dropdown',
						},
						{
							value: 'steps',
							label: 'Steps',
						},
					],
				},
				{
					value: 'others',
					label: 'Others',
					children: [
						{
							value: 'dialog',
							label: 'Dialog',
						},
						{
							value: 'tooltip',
							label: 'Tooltip',
						},
						{
							value: 'popover',
							label: 'Popover',
						},
						{
							value: 'card',
							label: 'Card',
						},
						{
							value: 'carousel',
							label: 'Carousel',
						},
						{
							value: 'collapse',
							label: 'Collapse',
						},
					],
				},
			],
		},
		{
			value: 'resource',
			label: 'Resource',
			children: [
				{
					value: 'axure',
					label: 'Axure Components',
				},
				{
					value: 'sketch',
					label: 'Sketch Templates',
				},
				{
					value: 'docs',
					label: 'Design Documentation',
				},
			],
		},
	]
});
// 打开弹窗
const openDialog = (row: any) => {
	if (row) {
		state.ruleForm = row;
	}
	state.dialogVisible = true;
};

// 关闭弹窗
const closeDialog = () => {
	state.dialogVisible = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};


defineExpose({ openDialog });
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
	max-height: calc(90vh - 111px)!important;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>