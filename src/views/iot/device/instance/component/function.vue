<template>
	<div class="device-function">
		<el-empty description="暂无功能列表，请先在物模型的功能定义中添加" v-if="!loading && !list.length"></el-empty>
		<el-tabs tab-position="left">
			<el-tab-pane :label="item.name" v-for="item in list" :key="item.key">
				<div class="table-wrapper">
					<el-table :data="item.inputs || []" border>
						<el-table-column prop="name" label="参数名称" />
						<el-table-column prop="valueType.type" label="输入类型" />
						<el-table-column prop="name" label="值" min-width="200">
							<template #default="{ row }">
								<el-select v-model="row.value" clearable v-if="row.valueType.type === 'enum'" style="width: 100% !important;">
									<el-option v-for="item in row.valueType.elements" :key="item.value" :value="item.value" :label="item.text"></el-option>
								</el-select>
								<el-radio-group v-model="row.value" v-else-if="row.valueType.type === 'boolean'">
									<el-radio :label="true">{{ row.valueType.trueText || '是' }}</el-radio>
									<el-radio :label="false">{{ row.valueType.falseText || '否' }}</el-radio>
								</el-radio-group>
								<el-input v-model="row.value" clearable v-else :placeholder="row.valueType.type === 'array' ? 'JSON.stringify(arr)结果去掉外层单引号' : '请输入'">
									<template v-if="row.valueType.unit" #append>{{ row.valueType.unit }}</template>
								</el-input>
							</template>
						</el-table-column>
					</el-table>
					<el-input type="textarea" :value="item.result" class="result" read-only placeholder="执行结果："> </el-input>
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
const loading = ref(true)

getData()

function getData() {
	loading.value = true
	api.tabDeviceFucntion.getList({ productKey: props.productKey }).then((res: IListItem[]) => {
		if (!res) return
		res.forEach((item) => (item.result = ''))
		list.value = res
	}).finally(() => loading.value = false)
}


function run(row: IListItem) {
	row.result = ''

	// 如果是布尔类型，不需要校验，其他类型不能为空
	const notValid = row.inputs.some((item) => item.value === null || item.value === '' || item.value === undefined)

	if (notValid) return ElMessage.info('请输入完整参数')

	const params: any = {}
	row.inputs.forEach(({ key, value, valueType }) => {
		if (valueType.type === 'array') {
			try {
				const newValue = JSON.parse(value)
				if (typeof newValue !== 'object') {
					throw new Error()
				}
				params[key] = newValue
			} catch (error: any) {
				ElMessage.error('请输入正确的JSON数组字符串格式')
				throw (error)
			}
		} else if (['int', 'float', 'double'].includes(valueType.type)) {
			// 设置参数 数字类型转为number 长整型不能转，会丢失精度
			params[key] = Number(value)
		} else {
			params[key] = value
		}
	})
	row.loading = true
	api.tabDeviceFucntion
		.do({
			deviceKey: props.deviceKey,
			funcKey: row.key,
			params,
		})
		.then((res: any) => {
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

	:deep(.el-textarea__inner) {
		height: 100%;
	}

	:deep(.el-select) {
		width: 100%;
	}
}
</style>
