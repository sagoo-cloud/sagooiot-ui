<template>
	<el-dialog title="子设备详情" v-model="showDialog" fullscreen width="80%">
		<DetailVue :deviceKey="deviceKey" v-if="showDialog"></DetailVue>
	</el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import DetailVue from '../detail.vue';

const showDialog = ref(false)
const deviceKey = ref('')

function openDialog(row: any) {
	deviceKey.value = row.key
	showDialog.value = true
}

defineExpose({ openDialog })

</script>
<style scoped></style>


