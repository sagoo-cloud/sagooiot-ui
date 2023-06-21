<template>
	<div class="flex">
		<codeEditor class="params flex1" ref="mirrorRef" mode="" :content="content"></codeEditor>
		<div class="mock" style="width: 300px;margin-left: 20px;">
			<el-input class="input" v-model="inputData" type="textarea" placeholder="请输入入参，以字符串的方式，如果是对象字符串会在执行时自动转换为对象再执行"></el-input>
			<el-input class="output" v-model="outputData" type="textarea" readonly placeholder="此处显示执行结果"></el-input>
		</div>
	</div>
	<el-button type="primary" style="margin-top:20px" @click="saveCode">保存脚本</el-button>
	<el-button type="primary" style="margin-top:20px" @click="mock">调试</el-button>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import codeEditor from '/@/components/codeEditor/index.vue'
import { ElMessage } from 'element-plus';
import api from '/@/api/device';
import { useRoute } from 'vue-router';

const route = useRoute();

const emit = defineEmits(['updateScript'])

const props = defineProps({
	script: String
})

const inputData = ref('')
const outputData = ref('')
const content = ref('')
const mirrorRef = ref()

onMounted(() => {
	content.value = props.script!
})

function saveCode() {
	const funStr = mirrorRef.value.getValue()

	if (funStr === '') {
		return toSave(funStr)
	}

	try {
		eval("(" + funStr + ")")
		toSave(funStr)
	} catch (error) {
		ElMessage.error('语法校验未通过')
	}
}

function toSave(data: string) {
	api.product.script({
		id: route.params.id,
		scriptInfo: data
	}).then(() => {
		ElMessage.success('保存成功')
		emit('updateScript', data)
	})
}

function mock() {
	if (!inputData.value) return ElMessage.error('请输入参数')

	const funStr = mirrorRef.value.getValue()

	if (funStr === '') {
		return ElMessage.error('请先输入可执行脚本')
	}

	try {
		const fun = eval("(" + funStr + ")")
		try {
			const res = fun(JSON.parse(inputData.value))
			outputData.value = typeof res === 'object' ? JSON.stringify(res, null, 2) : res
		} catch {
			const res = fun(inputData.value)
			outputData.value = typeof res === 'object' ? JSON.stringify(res, null, 2) : res
		}
	} catch (error) {
		ElMessage.error('数据解析脚本语法校验未通过或参数类型有误')
	}

}
</script>
<style lang="scss" scoped>
::v-deep(.CodeMirror) {
	height: calc(100vh - 360px);
}

.input,
.output {
	::v-deep(.el-textarea__inner) {
		height: calc(50vh - 190px);
	}
}

.output {
	margin-top: 20px;
}
</style>