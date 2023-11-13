<template>
	<el-dialog title="设备通道详情" v-model="dialogVisible" width="900px" :before-close="clsoeDialog" :close-on-click-modal="false">
		<el-tabs v-model="activeName">
			<el-tab-pane label="通道信息" name="1">
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
					<!-- <el-form-item label="调度周期(秒)" prop="interval">
            <el-input v-model="temp.interval" placeholder="请输入调度周期" />
          </el-form-item> -->
					<el-form-item label="" prop="">
						<div align="right">
							<el-button @click="clsoeDialog"> 取 消 </el-button>
							<el-button type="primary" @click="updateData()"> 保 存 </el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="任务" name="2">
				<div class="filter-container">
					<el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate"> 添加任务 </el-button>
				</div>

				<el-table :key="tableKey" v-loading="listLoading" :data="taskList" border fit highlight-current-row style="width: 100%">
					<el-table-column label="标题" prop="Job.title" align="center"></el-table-column>
					<el-table-column label="调度周期" prop="Job.interval" align="center"></el-table-column>
					<el-table-column label="转发格式" prop="encoding" align="center">
						<template #default="{ row }">
							{{ getCodingLabel(row) }}
						</template>
					</el-table-column>
					<el-table-column label="mqtt主题" prop="Job.publishTopic" align="center"></el-table-column>
					<el-table-column label="模板" prop="Template.title" align="center"></el-table-column>
					<el-table-column label="操作" align="center" width="200">
						<template #default="{ row, $index }">
							<el-button type="primary" size="mini" @click="handleUpdate(row)"> 详情 </el-button>
							<el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)"> 删除 </el-button>
						</template>
					</el-table-column>
				</el-table>

				<pagination v-if="total > 0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.size" @pagination="getList()" />
				<TaskDialog ref="taskDialog" :formatOptions="formatOptions" @finish="getList(1)" />
			</el-tab-pane>
			<el-tab-pane label="通道码流" name="3">
				<div>
					<el-button :type="evsrc ? 'info' : 'primary'" @click="openEv()">开始</el-button>
					<el-button :type="evsrc ? 'primary' : 'info'" :disabled="!evsrc" @click="closeEv()">停止</el-button>
					<el-button type="defualt" @click="clearLog()">清空</el-button>
					<el-button type="info" style="margin-left: 150px" @click="downloadLog()">下载报文</el-button>
					<ul id="logContainer" ref="logContainer"></ul>
				</div>
			</el-tab-pane>
		</el-tabs>
	</el-dialog>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import api from '/@/api/device/modbus';
import getOrigin from '/@/utils/origin';
import TaskDialog from './taskDialog.vue';

export default {
	components: { TaskDialog },
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
				templateNumber: [{ required: true, message: '请输入设备模板', trigger: 'change' }],
			},
			dialogVisible: false,
			activeName: '1',
			taskList: [],
			listLoading: false,
			total: 0,
			tableKey: 0,
			listQuery: {
				page: 1,
				size: 10,
			},
			evsrc: null as any,
			count: 0,
			templateOptions: [],
			formatOptions: [],
		};
	},
	watch: {
		activeName: 'handleTabClick',
	},

	methods: {
		open(row: any) {
			this.temp = { ...row };
			this.getDict();
			this.dialogVisible = true;
		},
		downloadLog() {
			window.open(getOrigin(import.meta.env.VITE_MODBUS_API) + '/debug/export_message?number=' + this.temp.number);
		},
		clsoeDialog() {
			this.dialogVisible = false;
			this.activeName = '1';
			(this.$refs['dataForm'] as any).resetFields();
			this.closeEv();
		},
		updateData() {
			(this.$refs['dataForm'] as any).validate((valid: boolean) => {
				if (valid) {
					const tempData = Object.assign({}, this.temp);
					api.channel.editDevice(tempData).then(() => {
						this.$emit('getList');
						this.clsoeDialog();
						ElMessage.success('操作成功！');
					});
				}
			});
		},
		// tab 切换
		handleTabClick() {
			this.closeEv(false);
			if (this.activeName === '2') {
				// 任务
				this.getList();
			} else if (this.activeName === '3') {
				// 码流
				// this.initEv()
			}
		},
		handleFilter() {
			this.listQuery.page = 1;
			this.getList();
		},
		// 获取字典数据
		getDict() {
			api.getDict({ code: 'forwardFormat' }).then((data: any) => {
				this.formatOptions = data.list || [];
			});
		},
		// 获取任务list
		getList() {
			this.listLoading = true;
			api.task.getList(this.listQuery)
				.then((res: any) => {
					this.taskList = res.list || [];
					this.total = res.Total;
				})
				.finally(() => {
					this.listLoading = false;
				});
		},
		handleDelete(row: any) {
			this.$confirm('是否确认删除任务名称为"' + row.Job.title + '"的数据项?', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(function () {
					return api.task.deleteDeviceJob({ number: row.Job.number });
				})
				.then(() => {
					this.handleFilter();
					ElMessage.success('删除成功！');
				})
				.catch(function () { });
		},
		handleCreate() {
			(this.$refs.taskDialog as any).openDialog({
				dialogStatus: 'create',
				deviceNumber: this.temp.number,
			});
		},
		handleUpdate(row: any) {
			(this.$refs.taskDialog as any).openDialog({
				dialogStatus: 'update',
				row,
				deviceNumber: this.temp.number,
			});
		},
		// 码流
		initEv() {
			if (this.evsrc) return;
			// this.evsrc = new EventSource(`http://one.server.mydig.net/debug?number=${this.temp.number}`);
			this.evsrc = new EventSource(`${getOrigin(import.meta.env.VITE_MODBUS_API)}/debug?number=${this.temp.number}`);
			let that = this;
			this.evsrc.onmessage = function (ev: any) {
				try {
					let obj = JSON.parse(ev.data);
					if (obj.deviceId === that.temp.number) {
						let color = obj.type === 'request' ? '#F56C6C' : '#409EFF';
						let content = `${obj.type === 'request' ? '请求：' : '应答：'} ${obj.msg}`;
						this.$refs.logContainer.insertAdjacentHTML('afterbegin', `<li style="color: ${color}">${content}</li>`);
					}
				} catch (_e) {
					// @ts-ignore
					// console.log('error', e);
				}
			};
			// this.evsrc.onerror = function (_ev: any) {
				// @ts-ignore
				// console.log('readyState = ' + ev.currentTarget.readyState);
			// };
		},
		openEv() {
			(this.$refs.logContainer as any).insertAdjacentHTML('beforeEnd', `<li style="color: #000;">开始...</li>`);
			this.initEv();
		},
		closeEv(log = true) {
			this.evsrc && this.evsrc.close();
			this.evsrc = null;
			this.count = 0;
			// this.clearLog()
			if (log) {
				(this.$refs.logContainer as any).insertAdjacentHTML('beforeEnd', `<li style="color: #000;">停止...</li>`);
			}
		},
		// 清空码流
		clearLog() {
			(this.$refs.logContainer as any).innerHTML = '';
		},
		getCodingLabel(row: any) {
			const item = this.formatOptions.find((item: any) => item.value === row.Job.encoding) as any;
			return item.title;
		},
	},
};
</script>

<style lang="scss" scoped>
.filter-container {
	margin-bottom: 10px;
}

.filter-item {
	margin-right: 10px;
}

#logContainer {
	height: 400px;
	overflow: auto;
	border: 1px solid #ddd;
	padding: 10px;
	padding-left: 20px;
	border-radius: 8px;
	margin-top: 10px;
	word-wrap: break-word;
	word-break: normal;
	background-color: #f2f2f2;
	line-height: 22px;
}
</style>
