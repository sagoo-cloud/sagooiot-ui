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
								<el-input v-model="row.value" clearable>
									<template v-if="row.valueType.unit" #append>{{ row.valueType.unit }}</template>
								</el-input>
							</template>
						</el-table-column>
					</el-table>
					<el-input type="textarea" :value="item.result" class="result"> </el-input>
				</div>
				<div class="btn">
					<el-button type="primary" @click="run(item)">执行</el-button>
					<el-button @click="clear(item)">清空</el-button>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '/@/api/device'

const props = defineProps({
	funKey: String,
})

interface IListItem {
	key: string
	name: string
	inputs: any[]
	result: string
}

const list = ref<IListItem[]>([])

api.tabDeviceFucntion.getList({ key: props.funKey }).then((res: IListItem[]) => {
	console.log(res)
	console.log(res[0])
	res.forEach((item) => (item.result = ''))
	list.value = res
})

function run(row: IListItem) {
  row.result = JSON.stringify(row, null, 2)
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
}
</style>
