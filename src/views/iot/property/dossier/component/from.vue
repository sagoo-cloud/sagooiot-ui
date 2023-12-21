
<template>
	<div>
		<div v-for="(item, index) in Datalist" :key="index">
			<el-form-item :label="item.title + ':'" :prop="item.name" class="form-item" v-if="item.types === 'input'">
				<el-input v-model="formData[item.name]" :placeholder="'请输入' + item.title" @input="saveData()" />
			</el-form-item>
			<el-form-item :label="item.title + '：'" :prop="item.name" class="form-item" v-if="item.types === 'textarea'">
				<el-input v-model="formData[item.name]" type="textarea" @input="saveData()" />
			</el-form-item>

			<el-form-item v-if="item.types === 'date'" :label="item.title + '：'">
				<el-date-picker v-model="formData[item.name]" :default-value="item.value" type="date" value-format="YYYY-MM-DD" placeholder="请选择时间" class="w100" clearable @change="saveData()" />
			</el-form-item>

			<el-form-item :label="item.title + '：'" prop="path" v-if="item.types === 'file'">



				<el-upload class="avatar-uploader" :action="uploadUrl" :headers="headers" :show-file-list="false" :on-success="customCallback(item.name)">
					<img v-if="formData[item.name]" :src="formData[item.name]" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>


			</el-form-item>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, defineEmits, onMounted, defineProps } from 'vue'
import getOrigin from '/@/utils/origin'
import { Plus } from '@element-plus/icons-vue'

const url = ref()
const uploadUrl = getOrigin(import.meta.env.VITE_API_URL + '/common/singleFile')
const headers = {
	Authorization: 'Bearer ' + localStorage.token,
}
const emit = defineEmits(['SetSaveData'])

const props = defineProps({
	Datalist: {
		type: Array,
		default: () => [],
	},
})

const formData = ref({})

onMounted(() => {
	for (const item of props.Datalist) {
		formData.value[item.name] = item.value ? item.value : ''
	}
})

const customCallback = (customValue: string) => {
	return function (file: any) {
		formData.value[customValue] = file.data.full_path
		saveData();
	}
}

const saveData = () => {
	const updatedData = []

	for (const item of props.Datalist) {
		updatedData.push({
			productKey: item.productKey,
			name: item.name,
			value: formData.value[item.name], // 更新为formData的实际值
			fieldName: item.fieldName,
		})
	}

	emit('SetSaveData', updatedData)
}
</script>

<style scoped lang="scss">
.form-item {
	flex: 0 0 25%;
}

.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>