<template>
	<el-dialog title="导入" v-model="dialogVisible" :close-on-click-modal="false" class="import-dialog" :before-close="handleClose">
		<h3 class="title">上传文件</h3>
		<p class="tips">说明：请上传文件，支持格式.XLS|.XLSX</p>
		<input type="file" ref="upload" style="display: none" accept=".xls,.xlsx" class="outputlist_upload" />
		<div class="file-box" @click="handleUpload">
			<el-image :src="equiUploadImg" />
			<span>上传文件</span>
		</div>
		<div v-if="fileName" class="file-content">
			<span>
				<i class="el-icon-document"></i>
				{{ fileName }}
			</span>
			<span class="el-icon-close" @click="removeFile"></span>
		</div>

		<div v-if="info.length" style="color: #f00">错误信息：</div>
		<div class="file-content" v-for="(item, index) in info" :key="index">
			<span>{{ item }}</span>
		</div>

		<el-button type="primary" class="import-btn" @click="handleImport" :loading="importLoading">导入</el-button>
	</el-dialog>
</template>

<script lang="ts">
import equiDownloadImg from './images/equi_download.png';
import equiUploadImg from './images/equi_upload.png';
import api from '/@/api/device/modbus';
import { ElMessage } from 'element-plus';

export default {
	data() {
		return {
			dialogVisible: false,
			equiDownloadImg,
			equiUploadImg,
			fm: {},
			fileName: '',
			importLoading: false,
			importFlag: 1,
			templateNumber: '',
			info: [],
		};
	},

	methods: {
		openDialog() {
			this.dialogVisible = true;

			this.$nextTick(() => {
				(this.$refs.upload as any).addEventListener('change', this.uploadChange);
			});
		},

		handleClose() {
			this.dialogVisible = false;
			this.importLoading = false;
			this.fm = {};
			this.fileName = '';
			this.info = [];

			(this.$refs.upload as any).removeEventListener('change', this.uploadChange);
			(this.$refs.upload as any).value = '';
		},

		uploadChange(e) {
			this.readExcel(e);
		},

		// 上传
		handleUpload() {
			(this.$refs.upload as any).click();
		},

		removeFile() {
			this.fm = {};
			this.fileName = '';
			(this.$refs.upload as any).value = '';
		},

		readExcel(e: any) {
			// 表格导入
			const files = e.target.files;
			if (files.length <= 0) {
				// 如果没有文件名
				return false;
			} else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
				ElMessage.error('上传格式不正确，请上传xls或者xlsx格式！');
				return false;
			}
			let fm = new FormData();
			fm.append('file', files[0]);
			fm.append('template_number', this.templateNumber);

			this.fm = fm;
			this.fileName = files[0].name;
		},

		handleImport() {
			if (!this.fm) {
				return ElMessage.error('请上传文件！');
			}
			this.importLoading = true;
			api.template
				.importFile(this.fm, {
					headers: {
						dataType: 'formData',
					},
				})
				.then((res: any) => {
					if (res.code === 0) {
						let info = res.data.Info || [];
						this.info = info;
						if (!info.length) {
							ElMessage.success('导入成功');
						}
					}
				})
				.finally(() => {
					this.importLoading = false;
				});
		},
	},

	mounted() {},
};
</script>

<style lang="scss" scoped>
::v-deep {
	.import-dialog {
		.el-dialog {
			width: 575px !important;
			height: auto;
		}
	}
}
.title {
	// color: #000;
	font-size: 16px;
	margin-bottom: 10px;
}

.tips {
	color: #999;
	font-size: 14px;
	margin-bottom: 10px;
}

.file-box {
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 10px;
	margin-bottom: 20px;
	border: 2px dashed #ccc;
	img {
		margin-right: 10px;
	}
}

.import-btn {
	width: 100%;
	height: 40px;
	font-size: 16px;
}

.file-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	line-height: 24px;
	cursor: pointer;
	margin-bottom: 20px;
	padding: 5px 10px;
	&:hover {
		background-color: #f5f7fa;
	}
}
</style>
