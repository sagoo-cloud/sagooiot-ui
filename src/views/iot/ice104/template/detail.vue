<!--
 * @Author: vera_min vera_min@163.com
 * @Date: 2023-10-23 17:05:57
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2023-10-25 10:11:06
 * @FilePath: /sagoo-admin-ui/src/views/iot/ice104/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="page page-full">
		<el-card shadow="hover" class="page-full-part">
			<el-tabs v-model="activeName">
				<el-tab-pane label="模版详情" name="detail">
					<EditTemplateForm ref="editFormRef" />
				</el-tab-pane>
				<el-tab-pane label="模版点位" name="point">
					<TemplateTaskTable />
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import EditTemplateForm from './component/editTemplateForm.vue';
import TemplateTaskTable from './component/templateTaskTable.vue';

import api from '/@/api/ice104/index';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonIce104';
import { useRoute } from 'vue-router';
import type { TabsPaneContext } from 'element-plus'

const route = useRoute();
const editFormRef = ref();
const detailFormData = ref({});
const queryRef = ref();
const activeName = ref('detail')

const { params, tableData, getList, loading } = useSearch(api.device.getList, 'data', { title: '' });
getList();

/**
 * 删除
 */
const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除：“${row.title}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.device.deleteItem({number: row.number});
		ElMessage.success('删除成功');
		getList();
	});
};

/**
 * 获取设备详情
 */
const initTemplateInfo = async () => {
	const res = await api.template.detailItem(route.params && route.params.id)
	detailFormData.value = res.data;
	editFormRef.value.open(res.data);
}
// 页面加载时
onMounted(() => {
	initTemplateInfo()
});
</script>