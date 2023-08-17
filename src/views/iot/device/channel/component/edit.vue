<template>
	<el-dialog title="添加设备通道" v-model="dialogVisible" width="600px" :before-close="clsoeDialog" :close-on-click-modal="false">
		<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 90%; margin: 0 auto">
			<el-form-item label="通道名称" prop="title">
				<el-input v-model="temp.title" placeholder="请输入通道名称" />
			</el-form-item>
			<el-form-item label="注册码" prop="number">
				<el-input v-model="temp.number" placeholder="请输入注册码" />
			</el-form-item>
			<el-form-item label="设备地址" prop="slaveId">
				<el-input v-model.number="temp.slaveId" placeholder="请输入设备地址" />
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="clsoeDialog()"> 取 消 </el-button>
			<el-button type="primary" @click="createData()"> 保 存 </el-button>
		</div>
	</el-dialog>
</template>
<script lang="ts">
import api from '/@/api/device/modbus';
import { ElMessage } from 'element-plus';
export default {
	data() {
		return {
			temp: {
				title: '',
				number: '',
				templateNumber: '',
				slaveId: '',
				interval: '',
			},
			rules: {
				title: [{ required: true, message: '请输入通道名称', trigger: 'blur' }],
				number: [{ required: true, message: '请输入注册码', trigger: 'blur' }],
				slaveId: [{ required: true, message: '请输入设备地址', trigger: 'blur' }],
			},
			dialogVisible: false,
			listLoading: false,
			templateOptions: [],
		};
	},

	methods: {
		open() {
			// this.getList();
			this.dialogVisible = true;
		},
		clsoeDialog() {
			(this.$refs.dataForm as any).resetFields();
			this.dialogVisible = false;
		},
		// 获取模板数据
		getList() {
			this.listLoading = true;
			api.channel
				.getList({ page: 1, size: 50 })
				.then((data: any) => {
					this.templateOptions = data.list || [];
				})
				.finally(() => {
					this.listLoading = false;
				});
		},
		createData() {
			(this.$refs['dataForm'] as any).validate((valid: boolean) => {
				if (valid) {
					api.channel.addDevice(this.temp).then(() => {
						this.$emit('getList');
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
