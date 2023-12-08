<template>
	<el-dialog :title="textMap[dialogStatus]" v-model="dialogVisible" :width="dialogWidth" :before-close="clsoeDialog" :close-on-click-modal="false">
		<div class="wrapper">
			<el-form class="form" ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 400px">
				<el-form-item label="模板名称" prop="title">
					<el-input v-model.trim="temp.title" placeholder="请输入模板名称" />
				</el-form-item>
				<el-form-item label="读取模式" prop="mode">
					<el-select v-model="temp.mode" placeholder="请选择模式" class="filter-item" style="width: 100%" @change="handleModeChange">
						<!-- <el-option label="顺序读取" :value="0" /> -->
						<el-option label="批量读取" :value="1" />
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remarks">
					<el-input v-model="temp.remarks" placeholder="请输入备注" />
				</el-form-item>
			</el-form>
			<el-tabs v-model="activeName" v-if="dialogStatus === 'update'" :key="tabsKey">
				<el-tab-pane label="数据区" name="1" v-if="temp.mode !== 0">
					<DataAreaDialog :templateNumber="temp.number" ref="dataAreaDialog" v-if="activeName === '1'" />
				</el-tab-pane>
				<el-tab-pane label="变量列表" name="2">
					<DeviceTemplateDialog :templateNumber="temp.number" :mode="temp.mode" ref="deviceTemplateDialog" v-if="activeName === '2'" />
				</el-tab-pane>
			</el-tabs>
		</div>
		<template #footer class="dialog-footer">
			<el-button @click="clsoeDialog"> 取 消 </el-button>
			<el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()"> 保 存 </el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import api from '/@/api/device/modbus';
import DataAreaDialog from './dataAreaDialog.vue';
import DeviceTemplateDialog from './deviceTemplateDialog.vue';
import { ElMessage } from 'element-plus';

export default {
	components: {
		DataAreaDialog,
		DeviceTemplateDialog,
	},
	data() {
		return {
			temp: {
				title: '',
				mode: 1,
				remarks: '',
				number: '',
			},
			rules: {
				title: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
				mode: [{ required: true, message: '请选择模式', trigger: 'change' }],
			},
			dialogVisible: false,
			dialogStatus: '',
			textMap: {
				update: '模板详情',
				create: '添加模板',
			},
			activeName: '1',
			tabsKey: Date.now(),
		};
	},

	computed: {
		dialogWidth() {
			return this.dialogStatus === 'create' ? '500px' : '80%';
		},
	},

	methods: {
		open(dialogStatus: string, row: any) {
			this.dialogStatus = dialogStatus;
			this.tabsKey = Date.now();
			this.dialogVisible = true;
			if (row) {
				this.temp = { ...row };
				if (this.temp.mode === 0) {
					this.activeName = '2';
				}
			} else {
				this.getDataId();
			}
		},
		clsoeDialog() {
			this.activeName = '1';
			this.temp = {
				title: '',
				mode: 1,
				remarks: '',
				number: '',
			};
			(this.$refs.dataForm as any).resetFields()
			this.dialogVisible = false;
		},
		// 获取模板id 自动生成
		getDataId() {
			api.getDataId().then((res: any) => {
				this.temp.number = res.data_id;
			});
		},
		createData() {
			(this.$refs['dataForm'] as any).validate((valid: boolean) => {
				if (valid) {
					api.template.addTemplate(this.temp).then(() => {
						this.$emit('getList');
						this.clsoeDialog();
						ElMessage.success('操作成功！');
					});
				}
			});
		},
		updateData() {
			(this.$refs['dataForm'] as any).validate((valid: boolean) => {
				if (valid) {
					api.template.editTemplate(this.temp).then(() => {
						this.$emit('getList');
						this.clsoeDialog();
						ElMessage.success('操作成功！');
					});
				}
			});
		},
		handleModeChange(value: number) {
			if (value === 0) {
				this.activeName = '2';
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	max-height: 70vh;
	overflow-y: auto;
}
</style>
