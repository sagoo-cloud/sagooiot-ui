<template>
	<div class="text-copy-part">
		<div class="text-part-text">{{ text }}</div>
		<el-tooltip effect="dark" content="复制" placement="top">
			<el-icon color="#409eff" @click="copy(text)"><ele-CopyDocument /></el-icon>
		</el-tooltip>
	</div>
</template>

<script lang="ts" setup>
import copy from '/@/utils/copy.ts'
defineProps({ text: String })
</script>
  
<style lang="scss" scoped>
.text-copy-part {
	display: flex;
	align-items: center;

	.text-part-text {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.el-icon {
		cursor: pointer;
		margin-left: 4px;
	}
}
</style>
