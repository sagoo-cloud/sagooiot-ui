<template>
	<codeEditor class="params" ref="mirrorRef" mode="" :content="content"></codeEditor>
	<el-button type="primary" style="margin-top:20px" @click="saveCode">保存脚本</el-button>
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

const content = ref('')
const mirrorRef = ref()

onMounted(() => {
	content.value = props.script!
})

function saveCode() {
	const data = mirrorRef.value.getValue()

	if (data === '') {
		return toSave(data)
	}

	try {
		eval("(" + data + ")")
		toSave(data)
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
</script>
<style lang="scss" scoped>
::v-deep(.CodeMirror){
	height: calc(100vh - 360px);
}
</style>