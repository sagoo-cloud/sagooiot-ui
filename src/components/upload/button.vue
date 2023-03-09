<template>
	<el-upload
		:accept="accept"
		:limit="1"
		:headers="headers"
		:before-upload="beforeAvatarUpload"
		:action="uploadUrl"
		:on-success="updateImg"
	>
		<el-button>
			<el-icon> <ele-Upload /> </el-icon>
			数据导入
		</el-button>
	</el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadProps } from 'element-plus';
import getOrigin from '/@/utils/origin';


const headers = {
	Authorization: 'Bearer ' + JSON.parse(sessionStorage.token),
};

const emit = defineEmits(['setImg', 'setImgs']);

const props = defineProps({
	accept: {
		type: String,
		default: '.xls,.xlsx',
	},
	url: {
		type: String,
		default: '/api/v1/region/loop/import',
	},
});

const uploadUrl: string = getOrigin(import.meta.env.VITE_API_URL + props.url);


const updateImg = (m1, m2) => {
	console.log(m1)
	console.log(m2)
};

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('文件不能超过2MB!');
		return false;
	}
	return true;
};
</script>
