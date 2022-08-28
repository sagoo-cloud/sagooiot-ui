<template>
	<div class="system-add-user-container">
		<el-dialog :title="ruleForm.item_code ? '编辑指标' : '新增指标'" v-model="isShowDialog" width="769px">
			<el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" size="default" label-width="90px">
				<!-- <el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20"> -->
						<el-form-item label="评价名称" prop="title" class="mb20">
							<el-input size="small" v-model="ruleForm.title" placeholder="请输入评价名称" clearable></el-input>
						</el-form-item>
					<!-- </el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20"> -->
						<el-form-item label="描述">
							<el-input width="400"  size="small" v-model="ruleForm.explain" type="textarea" placeholder="请输入描述" maxlength="150"></el-input>
						</el-form-item>
					<!-- </el-col>
				</el-row> -->
			</el-form>
			<el-button size="default" type="primary" class="mb10 mt10" @click="onOpenAddSign">
				<el-icon>
					<ele-FolderAdd />
				</el-icon>
				增加
			</el-button>
			<el-table border stripe :data="tableData.data" style="width: 100%">
				<el-table-column align="center" type="index" label="序号" width="58" />
				<el-table-column align="center" prop="name" label="标识" show-overflow-tooltip></el-table-column>
				<el-table-column align="center" prop="title" label="数据项" show-overflow-tooltip></el-table-column>
				<el-table-column align="center" prop="weight" label="权重(%)" width="90" show-overflow-tooltip></el-table-column>
				<el-table-column align="center" prop="description" label="取值范围" show-overflow-tooltip width="200" >
					<template #default="scope">
						<el-tag size="small" class="mr6" v-for="(item, index) in scope.row.ranges" :key="index">{{`${item.start_value}~${item.end_value}`}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="160">
					<template #default="scope">
						<el-button size="small" type="text" @click="onOpenEditSign(scope.row, scope.$index)">编辑</el-button>
						<el-button size="small" type="text" @click="onRowDel(scope.row, scope.$index)">删除</el-button>
						<el-button size="small" type="text" @click="onRowDetail(scope.row)">任务接口</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30]"
				v-model:current-page="tableData.param.pageNum"
				background
				v-model:page-size="tableData.param.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableData.total"
			>
			</el-pagination> -->

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">保 存</el-button>
				</span>
			</template>
		</el-dialog>
		<AddSign ref="addSignRef" @handleChange="handleChange" />
		<SetTask ref="setTaskRef" />
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, ref, defineComponent } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus';
import AddSign from './addSign.vue';
import SetTask from './setTask.vue';


import api from '/@/api/assess';



// 定义接口来定义对象的类型
interface DeptData {
	deptName: string;
	createTime: string;
	status: boolean;
	sort: number | string;
	describe: string;
	id: number;
	children?: DeptData[];
}
// 定义接口来定义对象的类型
interface TableDataRow {
	title: string;
	description: string;
	dataType: string;
	createTime: string;
	num: string;
	range: string;
}
// 定义整个dialog的数据类型
interface ItemState {
	isShowDialog: boolean;
	ruleForm: {
		title: string;
		explain: string;
		config: string;
		item_code: string;
		targets: Array<any>
	};
	tableData: {
		data: Array<TableDataRow>;
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
		};
	};
}




export default defineComponent({
	name: 'systemAddUser',
	components: { AddSign, SetTask},
	setup(prop, { emit }) {
		const addSignRef = ref();
		const setTaskRef = ref();
		const state = reactive<ItemState>({
			isShowDialog: false,
			ruleForm: {
				title: '', // 评价名称
				explain: '', // 描述
				config: '',
				item_code: '',
				targets: []
			},
			// deptData: [], // 部门数据
			// 标识列表数据
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
				},
			}
		});
		const ruleFormRef = ref<FormInstance>()
		const rules = reactive<FormRules>({
			title: [
				{ required: true, message: '评价名称', trigger: 'blur' },
			]
		})
		// 打开弹窗
		const openDialog = (row:any) => {
			state.isShowDialog = true;
			if(!row) return
			console.log(row.item_code)
			api.getList({itemcode: row.item_code}).then((res: any) => {
				console.log(res)
				state.ruleForm = res;
				state.tableData.data = res.targets
			});
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		// 新增
		const onSubmit = async (formEl: FormInstance | undefined) => {
			if (!formEl) return
			await formEl.validate((valid, fields) => {
				console.log(valid)
				if (valid) {
					state.ruleForm.targets = state.tableData.data
					
					api.setItem(state.ruleForm).then((res: any) => {
						console.log(res);
						ElMessage.success('提交成功');
						emit('fetchList');
						closeDialog(); // 关闭弹窗
					});
					console.log('submit!')
				} else {
					console.log('error submit!', fields)
				}
			})
		}
		// 打开新增用户弹窗
		const onOpenAddSign = () => {
			addSignRef.value.openDialog(null, null, false);
		};
				
		// 打开编辑弹窗
		const onOpenEditSign = (row: TableDataRow, index: number) => {
			console.log(index)
			addSignRef.value.openDialog(row, index, true);
		};
		// 打开任务接口弹窗
		const onRowDetail = (row: TableDataRow) => {
			setTaskRef.value.openDialog(row);
		};
		// 接收数据
		const handleChange = (data: any, index: any, isEdit: Boolean) => {
			if(!isEdit) {
				// 新增
				state.tableData.data.push(data)
			}else {
				state.tableData.data[index] = data
			}
			console.log(data);
			console.log(index)
			console.log(isEdit)
		};
		// 删除标识项
		const onRowDel = (row: TableDataRow, index: number) => {
			ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.title}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					state.tableData.data.splice(index, 1)
					ElMessage.success('删除成功');
				})
				.catch(() => {});
		};
		// 分页改变
		const onHandleSizeChange = (val: number) => {
			state.tableData.param.pageSize = val;
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.tableData.param.pageNum = val;
		};
		// 初始化部门数据
		const initTableData = () => {
			const data: Array<TableDataRow> = [];
			for (let i = 0; i < 6; i++) {
				data.push({
					userName: '这里是标识',
					dataType: '设备评分',
					description: '这里是描述这里是描述这里是描述这里是描述',
					num: '88',
					range: '10~20, 30~40',
					createTime: new Date().toLocaleString(),

				});
			}
			state.tableData.data = data;
			state.tableData.total = data.length;
		};
		// 页面加载时
		onMounted(() => {
			// initTableData();
		});
		return {
			rules,
			ruleFormRef,
			setTaskRef,
			addSignRef,
			onOpenAddSign,// 打开添加标识项弹窗
			onOpenEditSign,// 打开编辑某一个标识项弹窗
			onRowDel,// 删除某一个标识项
			onRowDetail,// 打开数据源配置接口弹窗

			onHandleSizeChange,// 标识项分页每页展示条数变化
			onHandleCurrentChange,// 标识项分页页数变化变化

			handleChange,

			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			...toRefs(state),
		};
	},
});
</script>

<style lang="scss" scoped>


::v-deep .el-form {
	// display: flex;
	// justify-self: center;
	// flex-direction: column;
	// align-content: center;
	.el-form-item {
		width: 500px;
		margin: 8px auto;
	}
	::v-deep .el-input__inner,
	::v-deep .el-textarea__inner {
		width: 400px;
		// flex-grow: 0;
	}
	::v-deep .el-input__inner {
		padding: 1px 10px;
	}
	::v-deep .el-input__wrapper {
		flex-grow: 0;
		padding: 0
	}
}


</style>
