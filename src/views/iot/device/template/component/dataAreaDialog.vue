<template>
	<div class="component-container">
		<div class="filter-container">
			<el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd"> 添加数据区 </el-button>
		</div>
		<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
			<el-table-column label="名称" prop="name" align="center">
				<template slot-scope="{ row }">
					<el-input v-model="row.name" placeholder="请输入" />
				</template>
			</el-table-column>
			<el-table-column label="起始地址" prop="address" align="center">
				<template slot-scope="{ row }">
					<el-input-number v-model="row.address" controls-position="right" :min="0" style="width: 100%" />
				</template>
			</el-table-column>
			<el-table-column label="长度" prop="length" align="center">
				<template slot-scope="{ row }">
					<el-input-number v-model="row.length" controls-position="right" :min="0" style="width: 100%" />
				</template>
			</el-table-column>
			<el-table-column label="寄存器区" prop="regArea" align="center">
				<template slot-scope="{ row }">
					<el-select v-model="row.regArea">
						<el-option label="HOLDING" value="holding" />
						<el-option label="INPUT" value="input" />
						<el-option label="DISCRETE" value="discrete" />
						<el-option label="COIL" value="coil" />
					</el-select>
				</template>
			</el-table-column>
			<el-table-column label="读取属性" prop="" align="center">
				<template slot-scope="{ row }">
					<span v-if="row.regArea === 'input' || row.regArea === 'discrete'">只读</span>
					<span v-else-if="row.regArea === 'holding' || row.regArea === 'coil'">读写</span>
				</template>
			</el-table-column>
			<el-table-column label="备注" prop="remarks" align="center">
				<template slot-scope="{ row }">
					<el-input v-model="row.remarks" placeholder="请输入" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="150px">
				<template slot-scope="{ row, $index }">
					<el-button type="primary" size="mini" @click="handleSubmit(row, $index)"> 保存 </el-button>
					<el-button type="danger" size="mini" @click="handleDelete(row, $index)"> 删除 </el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script lang="ts">
import api from '/@/api/device/modbus';
import { ElMessage } from 'element-plus';

export default {
	props: {
		templateNumber: String,
	},
	data() {
		return {
			tableKey: 0,
			list: [] as any[],
			total: 0,
			listLoading: false,
			listQuery: {
				page: 1,
				size: 20,
			},
		};
	},

	mounted() {
		this.getList();
	},

	methods: {
		getList() {
			this.listLoading = true;
			api.template
				.getList({ template_number: this.templateNumber })
				.then((res: any) => {
					this.list = res.list || [];
					this.total = res.Total;
				})
				.finally(() => {
					this.listLoading = false;
				});
		},
		//
		handleAdd() {
			this.list.push({
				name: '',
				address: '',
				length: '',
				regArea: '',
				remarks: '',
				templateNumber: this.templateNumber,
			});
		},
		handleDelete(row: any, index: number) {
			this.$confirm('是否确认删除数据区名称为"' + row.name + '"的数据项?', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				if (row.taId) {
					api.area.deleteDataArea({ ta_id: row.taId }).then(() => {
						this.getList();
						ElMessage.success('删除成功');
					});
				} else {
					this.list.splice(index, 1);
				}
			});
		},
		handleSubmit(row: any, index: number) {
			if (row.taId) {
				api.area.editDataArea(row).then(() => {
					this.getList();
					ElMessage.success('操作成功！');
				});
			} else {
				api.area.addDataArea(row).then(() => {
					this.getList();
					ElMessage.success('操作成功！');
				});
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
</style>
