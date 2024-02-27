<template>
	<div class="upload">
		<el-upload v-model:file-list="fileList" :class="{ hide: fileList.length >= limit }" :accept="accept" list-type="picture-card" :limit="limit" :data="{ source }" :multiple="multiple" :headers="headers" :before-upload="beforeAvatarUpload" :action="uploadUrl"
			:on-success="updateImg" :on-preview="handlePictureCardPreview" :on-remove="updateImg">
			<el-icon>
				<ele-Plus />
			</el-icon>
		</el-upload>
		<el-dialog v-model="dialogVisible">
			<el-image class="preview" :src="dialogImageUrl" alt="Preview Image" />
		</el-dialog>

		<!-- 上传单张图片 -->
		<!-- <uploadVue @set-img="youImg=$event" ></uploadVue> -->

		<!-- 上传多长图片 需增加limit属性，设定图片最多张数 -->
		<!-- <uploadVue @set-imgs="youImgs=$event" :limit="2"></uploadVue> -->

		<!-- 上传单张图片，img属性可以恢复表单图片显示 -->
		<!-- <uploadVue img="https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" @set-img="youImg=$event"></uploadVue> -->

		<!-- 上传多张图片，imgs属性可以恢复表单图片多图显示 需增加limit属性，设定图片最多张数 -->
		<!-- <uploadVue :imgs="['https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png']" @set-imgs="youImgs=$event" :limit="2"></uploadVue> -->
	</div>
</template>

<script lang="ts" setup>
import { ref, PropType, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import getOrigin from '/@/utils/origin'

const uploadUrl: string = getOrigin(import.meta.env.VITE_API_URL + '/common/singleImg')

const headers = {
	Authorization: 'Bearer ' + localStorage.token,
}

const emit = defineEmits(['setImg', 'setImgs'])

const source = localStorage.uploadFileWay

const props = defineProps({
	multiple: {
		type: Boolean,
		default: false,
	},
	widthHost: {
		type: Boolean,
		default: true,
	},
	accept: {
		type: String,
		default: '.jpg,.png,.jpeg,.gif',
	},
	limit: {
		type: Number,
		default: 1,
	},
	imgs: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
	img: {
		type: String,
		default: '',
	},
	// keyName: {
	// 	type: String,
	// 	default: '',
	// },
})

const fileList = ref<any[]>([
	// {
	// 	name: '',
	// 	url: '',
	// },
])

const updateImg = (res?: any) => {
	if (res && res.code !== undefined && res.code !== 0) {
		return ElMessage.error(res.message)
	}

	const list = fileList.value.map((item) => {
		if (item.response) {
			return item.response?.data?.full_path
		} else {
			return item.url
		}
	})
	if (props.limit === 1) {
		const img = list[0]
		if (!img) {
			emit('setImg', '');
			return;
		}
		emit('setImg', img);
	} else {
		emit('setImgs', list)
		// if(props.keyName) {
		// 	emit('setImgs', { list: list, keyName: props.keyName})
		// }else {
		// 	emit('setImgs', list)
		// }
	}
}

// 如果传入图片输入，设置图片显示
watch(
	() => props.imgs,
	(imgs) => {
		if (imgs.length) {
			fileList.value = imgs.map((url) => ({ name: url, url }))
			updateImg()
		} else {
			fileList.value = []
		}
	},
	{ immediate: true }
)

// 传入单独图片，设置图片显示
watch(
	() => props.img,
	(img) => {
		if (img) {
			fileList.value = [{ name: img, url: img }]
			updateImg()
		} else {
			fileList.value = []
		}
	},
	{ immediate: true }
)

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
	dialogImageUrl.value = uploadFile.url!
	dialogVisible.value = true
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('图片不能超过2MB!')
		return false
	}
	return true
}
</script>

<style scoped>
.hide :deep(.el-upload--picture-card) {
	display: none;
}

.preview {
	max-width: 100%;
	max-height: 60vh;
	display: block;
	margin: 0 auto;
}
</style>
