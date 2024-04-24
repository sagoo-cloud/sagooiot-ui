<template>
	<div class="flex">
		<codeEditor class="params flex1" ref="mirrorRef" mode="" :content="content"></codeEditor>
		<div class="mock" style="width: 300px;margin-left: 20px;">
			<el-radio-group v-model="functionName">
				<el-radio-button label="parse">parse</el-radio-button>
				<el-radio-button label="send">send</el-radio-button>
			</el-radio-group>
			<el-input class="input" v-model="inputData" type="textarea" placeholder="请输入入参，以字符串的方式，如果是对象字符串会在执行时自动转换为对象再执行"></el-input>
			<el-input class="input" v-model="outputData" type="textarea" readonly placeholder="此处显示执行结果"></el-input>
		</div>
	</div>
	<el-button type="primary" style="margin-top:20px" v-auth="'save'" @click="saveCode">保存脚本</el-button>
	<el-button type="primary" style="margin-top:20px" v-auth="'debug'" @click="mock">调试</el-button>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import codeEditor from '/@/components/codeEditor/index.vue'
import { ElMessage } from 'element-plus';
import api from '/@/api/device';
import { useRoute } from 'vue-router';

const emptyFunction = `
// 下面是预制的空的方法，请不要修改函数名称，直接在内部编写函数即可

// 此处是设备功能调用应答数据解析
function parse (data) {

	// 此处编写对数据的处理

	return data
}


// 此处是设备功能调用发送数据解析
function send (data) {

	// 此处编写对数据的处理

	return data
}
`

const route = useRoute();

const emit = defineEmits(['updateScript'])

const props = defineProps({
	script: String
})

const inputData = ref('')
const outputData = ref('')
const content = ref('')
const functionName = ref('parse')
const mirrorRef = ref()

onMounted(() => {
	content.value = props.script! || emptyFunction
})

async function saveCode() {
	const funStr = mirrorRef.value.getValue()

	if (funStr === '') {
		return toSave(funStr)
	}

	await validate()

	toSave(funStr)
}

function toSave(data: string) {
	api.product.script({
		key: route.params.id,
		scriptInfo: data
	}).then(() => {
		ElMessage.success('保存成功')
		emit('updateScript', data)
	})
}

function validate() {

	return new Promise((resolve, reject) => {
		const funStr = mirrorRef.value.getValue()
		const worker = new Worker('./worker.js');

		// 向 Worker 发送消息
		worker.postMessage({ type: 'validateFunctionString', functionString: funStr });

		// 监听 Worker 返回的消息
		worker.addEventListener('message', ({ data }) => {
			worker.terminate()
			if (data.isOk) return resolve(true)
			ElMessage.error(data.message)
			reject()
		});
	})
}

async function mock() {
	outputData.value = ''
	
	await validate()

	if (!inputData.value) return ElMessage.error('请输入参数')

	const funStr = mirrorRef.value.getValue()

	if (funStr === '') {
		return ElMessage.error('请先输入可执行脚本')
	}


	const worker = new Worker('./worker.js');
	// 向 Worker 发送消息
	worker.postMessage({ type: 'runFunction', functionString: funStr, functionName: functionName.value, params: inputData.value });
	// 监听 Worker 返回的消息
	worker.addEventListener('message', ({ data }) => {
		worker.terminate()
		if (data.isOk) {
			return outputData.value = typeof data.data === 'object' ? JSON.stringify(data.data, null, 2) : data.data
		}
		ElMessage.error(data.message)
	});
}
</script>

<style lang="scss" scoped>
:deep(.CodeMirror) {
	height: calc(100vh - 340px);
}

.input,
.output {
	margin-top: 14px;
	:deep(.el-textarea__inner) {
		height: calc(50vh - 200px);
	}
}
</style>