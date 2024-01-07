<!--
 * @Author: vera_min vera_min@163.com
 * @Date: 2023-10-23 17:05:57
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2023-10-25 10:11:06
 * @FilePath: /sagoo-admin-ui/src/views/iot/ice104/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="page border bg padding page-full Ipt-2">
		<el-tabs v-model="activeName">
			<el-tab-pane label="设备详情" name="detail">
				<EditDeviceForm ref="editFormRef" />
			</el-tab-pane>
			<el-tab-pane label="设备任务" name="task">
				<DeviceTaskTable />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import EditDeviceForm from './component/editDeviceForm.vue'
import DeviceTaskTable from './component/deviceTaskTable.vue'

import api from '/@/api/ice104/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useSearch } from '/@/hooks/useCommonIce104'
import { useRoute } from 'vue-router'
import type { TabsPaneContext } from 'element-plus'

const route = useRoute()
const editFormRef = ref()
const detailFormData = ref({})
const queryRef = ref()

const activeName = ref('detail')

const { params, tableData, getList, loading } = useSearch(api.device.getList, 'data', { title: '' })

getList()

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(activeName)
	if (activeName.value == 'task') {
		console.log('获取详情')
		initDeviceInfo()
	} else {
		console.log('获取任务列表')
		getList()
	}
}

/**
 * 删除
 */
const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除：“${row.title}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.device.deleteItem({ number: row.number })
		ElMessage.success('删除成功')
		getList()
	})
}

/**
 * 获取设备详情
 */
const initDeviceInfo = async () => {
	const res = await api.device.detailItem(route.params && route.params.id)
	console.log(res)
	detailFormData.value = res.data
	editFormRef.value.open(res.data)
}
// 页面加载时
onMounted(() => {
	initDeviceInfo()
})
</script>
