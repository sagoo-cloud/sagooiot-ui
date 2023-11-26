<template>
	<el-dialog :title="textMap[dialogStatus]" v-model="dialogVisible" width="500px" :before-close="clsoeDialog" append-to-body :close-on-click-modal="false">
		<el-form ref="dataForm" :rules="rules" :model="temp" label-width="80px">
			<el-form-item label="标题" prop="title">
				<el-input v-model="temp.title" placeholder="请输入标题" />
			</el-form-item>
			<el-form-item label="调度周期" prop="interval">
				<el-input v-model="temp.interval" placeholder="请输入调度周期" />
			</el-form-item>
			<el-form-item label="转发格式" prop="encoding">
				<el-select v-model="temp.encoding" placeholder="请选择转发格式" style="width: 100%">
					<el-option v-for="item in formatOptions" :key="item.value" :label="item.title" :value="item.value"> </el-option>
				</el-select>
				<!-- <el-input v-model="temp.encoding" placeholder="请输入转发格式"/> -->
			</el-form-item>
			<el-form-item label="mqtt主题" prop="publishTopic">
				<el-input v-model="temp.publishTopic" placeholder="请输入mqtt主题" />
			</el-form-item>
			<el-form-item label="设备模板" prop="templateNumber">
				<el-select v-model="temp.templateNumber" filterable placeholder="请选择设备模板" style="width: 100%">
					<el-option v-for="item in templateOptions" :key="item.number" :label="item.title" :value="item.number"> </el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer class="dialog-footer">
			<el-button @click="clsoeDialog"> 取 消 </el-button>
			<el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()"> 保 存 </el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import api from '/@/api/device/modbus';
import { ElMessage } from 'element-plus';

export default {
	components: {},
	props: {
		formatOptions: {
			default: () => [],
		},
	},
	data() {
		return {
			temp: {
				title: '',
				interval: '20s',
				encoding: 'json',
				publishTopic: '',
				deviceNumber: '',
				number: '',
				templateNumber: '',
			},
			rules: {
				title: [{ required: true, message: '请输入标题', trigger: 'change' }],
				publishTopic: [{ required: true, message: '请输入mqtt主题', trigger: 'change' }],
				templateNumber: [{ required: true, message: '请选择设备模板', trigger: 'change' }],
			},
			dialogVisible: false,
			listLoading: false,
			dialogStatus: '',
			textMap: {
				update: '任务详情',
				create: '添加任务',
			},
			templateOptions: '',
		};
	},

	methods: {
		openDialog({ dialogStatus, row, deviceNumber }) {
			this.dialogStatus = dialogStatus;
			this.temp.deviceNumber = deviceNumber;
			if (row) {
				// this.temp = { ...row }
				this.temp.number = row.Job.number;
				this.temp.title = row.Job.title;
				this.temp.interval = row.Job.interval;
				this.temp.encoding = row.Job.encoding;
				this.temp.publishTopic = row.Job.publishTopic;
				this.temp.templateNumber = row?.Template?.number;
			}
			// this.getDict()
			this.getTemplateList();
			this.dialogVisible = true;
		},
		clsoeDialog() {
			this.dialogVisible = false;
			this.temp = {
				title: '',
				interval: '20s',
				encoding: 'json',
				publishTopic: '',
				deviceNumber: '',
				number: '',
				templateNumber: '',
			};
			(this.$refs['dataForm'] as any).resetFields();
		},
		// 获取模板数据
		getTemplateList() {
			this.listLoading = true;
			api.template
				.getList({ page: 1, size: 50 })
				.then((res: any) => {
					this.templateOptions = res.list || [];
				})
				.finally(() => {
					this.listLoading = false;
				});
		},
		createData() {
			(this.$refs['dataForm'] as any).validate((valid: boolean) => {
				if (valid) {
					api.task.addDeviceJob(this.temp).then(() => {
						this.$emit('finish');
						this.clsoeDialog();
						ElMessage.success('操作成功！');
					});
				}
			});
		},
		updateData() {
			(this.$refs['dataForm'] as any).validate((valid: boolean) => {
				if (valid) {
					api.task.editDeviceJob(this.temp).then(() => {
						this.$emit('finish');
						this.clsoeDialog();
						ElMessage.success('操作成功！');
					});
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped></style>
