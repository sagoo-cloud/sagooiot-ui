<template>
	<div class="device-function">
		<el-tabs tab-position="left">
			<el-tab-pane :label="item.name" v-for="item in list" :key="item.key">
				<div class="table-wrapper">
					<el-table :data="item.inputs || []" border>
						<el-table-column prop="name" label="参数名称" />
						<el-table-column prop="valueType.type" label="输入类型" />
						<el-table-column prop="name" label="值" min-width="200">
							<template #default="{ row }">
								<el-select v-model="row.value" clearable v-if="row.valueType.type === 'enum'" style="wdith: 100% !important;">
									<el-option v-for="item in row.valueType.elements" :key="item.value" :value="item.value" :label="item.text"></el-option>
								</el-select>
								<el-input v-model="row.value" clearable v-else>
									<template v-if="row.valueType.unit" #append>{{ row.valueType.unit }}</template>
								</el-input>
							</template>
						</el-table-column>
					</el-table>
					<el-input type="textarea" :value="item.result" class="result"> </el-input>
				</div>
				<div class="btn">
					<el-button type="primary" :loading="item.loading" @click="run(item)">执行</el-button>
					<el-button @click="clear(item)">清空</el-button>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '/@/api/device'

const props = defineProps({
	productKey: String,
	deviceKey: String,
})

interface IListItem {
	key: string
	name: string
	inputs: any[]
	result: string
	loading: boolean
}

const list = ref<IListItem[]>([])

api.tabDeviceFucntion.getList({ key: props.productKey }).then((res: IListItem[]) => {
	res.forEach((item) => (item.result = ''))
	list.value = res
})

function run(row: IListItem) {
	row.result = ''

	const notValid = row.inputs.some((item) => !item.value)
	if (notValid) return ElMessage.info('请输入完整参数')

	row.loading = true
	const params: any = {}
	row.inputs.forEach(({ key, value }) => (params[key] = value))
	api.tabDeviceFucntion
		.do({
			deviceKey: props.deviceKey,
			funcKey: row.key,
			params,
		})
		.then((res: any) => {
			// console.log(res)
			row.result = JSON.stringify(res, null, 2)
		})
		.finally(() => (row.loading = false))
}

function clear(row: IListItem) {
	row.result = ''
}
</script>

<style scoped lang="scss">
.table-wrapper {
	width: 100%;
	padding: 10px;
	display: flex;
	align-items: stretch;
	justify-content: space-between;
	gap: 20px;

	.el-table {
		flex: 3;
	}

	.result {
		flex: 2;
	}

	::v-deep(.el-textarea__inner) {
		height: 100%;
	}

	::v-deep(.el-select) {
		width: 100%;
	}
}
</style>
