<template>
	<codeEditor class="params" ref="mirrorRef" mode="" :content="content"></codeEditor>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import codeEditor from '/@/components/codeEditor/index.vue'
const content = ref('')
onMounted(() => {
	content.value = '{}'
})
</script>
