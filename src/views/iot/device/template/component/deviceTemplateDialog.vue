<template>
	<div class="component-container">
		<div class="filter-container">
			<el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="openDialog('create')"> 添加变量列表 </el-button>
		</div>
		<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
			<el-table-column label="序号" type="index" width="50" />
			<!-- <el-table-column label="监控设备" prop="templateNumber" align="center" /> -->
			<el-table-column label="变量名" prop="title" align="center" />
			<el-table-column label="变量编码" prop="dataAttribName" align="center" />
			<el-table-column label="数据地址" prop="dataAddressTitle" align="center" />
			<el-table-column label="系数" prop="dataCoef" align="center" />
			<el-table-column label="存盘周期" prop="saveCycle" align="center" />
			<el-table-column label="操作" align="center" width="200">
				<template slot-scope="{ row, $index }">
					<el-button type="primary" size="mini" @click="handleUpdate(row)"> 修改 </el-button>
					<el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)"> 删除 </el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="listQuery.page"
			:limit.sync="listQuery.size"
			@pagination="getList"
			style="padding: 10px 20px 20px !important"
		/>

		<el-dialog
			:title="textMap[dialogStatus]"
			:visible.sync="dialogVisible"
			width="850px"
			:before-close="clsoeDialog"
			close="var-dialog"
			append-to-body
			:close-on-click-modal="false"
		>
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
				<el-row>
					<el-col :span="8">
						<el-form-item label="变量名称" prop="title">
							<el-input v-model="temp.title" placeholder="请输入变量名称" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="变量编码" prop="dataAttribName">
							<el-input v-model="temp.dataAttribName" placeholder="请输入变量编码" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="单位" prop="unit">
							<el-input v-model="temp.unit" placeholder="请输入单位" />
						</el-form-item>
					</el-col>
				</el-row>
				<div class="label">数据来源</div>
				<el-row>
					<el-col :span="8" v-if="mode === 1">
						<el-form-item label="数据区" prop="area">
							<el-select v-model="temp.area" placeholder="请选择数据区" filterable class="filter-item" @change="handleAreaChange" style="width: 100%">
								<el-option v-for="(item, index) in dataAreaOptions" :key="index" :label="item.name" :value="item.name" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="mode === 1">
						<el-form-item label="数据地址" prop="dataAddress">
							<el-select
								v-model="temp.dataAddress"
								placeholder="请选择数据地址"
								filterable
								class="filter-item"
								@change="handleSelectChange"
								style="width: 100%"
							>
								<el-option v-for="(item, index) in dataAddressOptions" :key="index" :label="item.title" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8" v-if="mode === 0">
						<el-form-item label="数据地址" prop="dataAddress">
							<el-input v-model="temp.dataAddress" placeholder="请输入数据地址" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="数据类型" prop="dataType">
							<el-select v-model="temp.dataType" placeholder="请选择数据类型" filterable class="filter-item" style="width: 100%">
								<el-option v-for="(item, index) in dataTypeOptions" :key="index" :label="item.title" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="label">数据处理</div>
				<el-row>
					<el-col :span="8">
						<el-form-item label="初始值" prop="dataInitial">
							<el-input v-model="temp.dataInitial" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="基值" prop="dataBaseline">
							<el-input v-model="temp.dataBaseline" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="系数" prop="dataCoef">
							<el-input v-model="temp.dataCoef" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">
						<el-form-item label="存盘周期" prop="saveCycle">
							<el-input v-model="temp.saveCycle" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="clsoeDialog"> 取 消 </el-button>
				<el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()"> 保 存 </el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import api from '/@/api/device/modbus';

export default {
	props: {
		templateNumber: '',
		mode: '',
	},
	data() {
		return {
			tableKey: 0,
			list: null,
			total: 0,
			listLoading: false,
			listQuery: {
				page: 1,
				size: 20,
			},
			temp: {
				title: '',
				unit: '',
				dataAttribName: '',
				area: '',
				dataAddress: '',
				dataAddressTitle: '',
				dataType: '',
				dataInitial: 0,
				dataBaseline: 0,
				dataCoef: 1,
				saveCycle: '',
			},
			rules: {
				title: [{ required: true, message: '变量名称', trigger: 'blur' }],
				dataAttribName: [{ required: true, message: '请输入变量编码', trigger: 'blur' }],
				area: [{ required: true, message: '请选择数据区', trigger: 'change' }],
				dataAddress: [{ required: true, message: '请选择数据地址', trigger: 'change' }],
				dataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
			},
			dialogVisible: false,
			dialogStatus: '',
			textMap: {
				update: '变量详情',
				create: '添加变量',
			},
			dataAreaOptions: [], // 数据区
			dataAddressOptions: [], // 数据字典
			dataTypeOptions: [], // 数据类型
			normalizer(node: any) {
				return {
					id: node.value,
					label: node.title,
					children: node.children,
				};
			},
		};
	},

	mounted() {
		this.listQuery.template_number = this.templateNumber;
		this.getDict();
		this.getList();
		this.getDataAreaList();
	},

	methods: {
		// 获取字典数据
		getDict() {
			api.getDict({ code: 'dataType' }).then((res) => {
				this.dataTypeOptions = res.data.list || [];
			});
		},
		getList() {
			this.listLoading = true;
			api.template.getList(this.listQuery)
				.then((response) => {
					this.list = response.data.list || [];
					this.total = response.data.Total;
				})
				.finally(() => {
					this.listLoading = false;
				});
		},
		getDataAreaList() {
			getDataAreaList({ template_number: this.templateNumber })
				.then((response) => {
					this.dataAreaOptions = response.data.list || [];
				})
				.finally(() => {});
		},
		handleFilter() {
			// this.listQuery.page = 1
			this.getList();
		},
		handleDelete(row, index) {
			this.$confirm('是否确认删除变量名称为"' + row.title + '"的数据项?', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(function () {
					return deleteDeviceTemplate({ dt_id: row.dtId });
				})
				.then(() => {
					this.getList();
					this.msgSuccess('删除成功');
				})
				.catch(function () {});
		},
		openDialog(dialogStatus, row) {
			this.dialogStatus = dialogStatus;
			if (row) {
				this.temp = Object.assign({}, row);
				this.handleAreaChange(this.temp.area);
			}
			this.temp.templateNumber = this.templateNumber;
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate();
			});
		},
		clsoeDialog() {
			this.dialogVisible = false;
			// this.$refs.dataForm.resetFields()
			this.temp = {
				title: '',
				unit: '',
				dataAttribName: '',
				area: '',
				dataAddress: '',
				dataAddressTitle: '',
				dataType: '',
				dataInitial: 0,
				dataBaseline: 0,
				dataCoef: 1,
				saveCycle: '',
			};
		},
		createData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					this.handleSelectChange(this.temp.dataAddress);
					const tempData = Object.assign({}, this.temp);
					api.data.addDeviceTemplate(tempData).then(() => {
						this.handleFilter();
						this.clsoeDialog();
						ElMessage.success('添加成功！');
					});
				}
			});
		},
		handleUpdate(row) {
			this.openDialog('update', row);
		},
		updateData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					this.handleSelectChange(this.temp.dataAddress);
					const tempData = Object.assign({}, this.temp);
					api.data.editDeviceTemplate(tempData).then(() => {
						this.handleFilter();
						this.clsoeDialog();
						ElMessage.success('操作成功！');
					});
				}
			});
		},
		handleAreaChange(value) {
			let item = this.dataAreaOptions.find((item) => item.name === value);
			let arr = [];
			if (!item) {
				this.dataAddressOptions = arr;
				return;
			}
			let len = item.length || 0;
			for (let i = 0; i <= len; i++) {
				arr.push({ title: `${item.name}[${i}]`, value: i });
			}
			this.dataAddressOptions = arr;
		},
		handleSelectChange(value) {
			let item = this.dataAddressOptions.find((item) => item.value === value);
			if (item) {
				this.temp.dataAddressTitle = item.title;
			} else {
				this.temp.dataAddressTitle = this.temp.dataAddress;
			}
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

.label {
	font-size: 16px;
	border-bottom: 1px solid #ddd;
	color: #666;
	font-weight: bold;
	padding: 5px 0;
	margin: 10px;
}

::v-deep {
	.el-form-item__label {
		text-align: right;
	}
}
</style>
