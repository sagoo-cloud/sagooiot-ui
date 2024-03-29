<template>
	<div class="page padding bg page-full">
		<el-form :model="tableData.param" ref="queryRef" inline>
			<el-form-item class="mb-0">
				<el-button type="primary" @click="onOpenAdd" v-auth="'add'">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增告警
				</el-button>
			</el-form-item>
		</el-form>
		<el-divider class="my-5" />
		<el-row class="page-full-part">
			<el-col :span="6" v-for="(item, index) in tableData.data" :key="index">
				<div class="card">
					<div class="ant-card">
						<div class="ant-card-body">
							<div class="pro-table-card-item">
								<div class="card-item-avatar" v-col="'image'">
									<img width="88" height="88" src="/src/assets/img/alarm.svg" />
								</div>
								<div class="card-item-body">
									<div class="card-item-header">
										<div v-col="'name'">
											<div class="ellipsis card-item-header-name" style="width: 100%; height: 45px">{{ item.name }}</div>
										</div>
									</div>
									<div class="card-item-content" v-col="'alarm'">
										<div>
											<label>触发：</label>
											<div>
												<div>级别：</div>
											</div>
										</div>
										<div>
											<label>{{ item.triggerTypeName }}</label>
											<div>
												<div>{{ item.alarmLevel.name }}</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div class="card-state success" v-if="item.status == 1" v-col="'liststatus'">
								<div class="card-state-content">
									<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper">
										<span class="ant-badge-status-dot ant-badge-status-success"></span>
										<span class="ant-badge-status-text">已启用</span>
									</span>
								</div>
							</div>
							<div class="card-state error" v-if="item.status == 0" v-col="'liststatus'">
								<div class="card-state-content">
									<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper"><span class="ant-badge-status-dot ant-badge-status-error"></span><span class="ant-badge-status-text">未启用</span></span>
								</div>
							</div>
						</div>
					</div>
					<div class="card-tools">
						<el-button type="primary" text bg @click="onOpenEdit(item)" v-auth="'edit'">
							<el-icon>
								<ele-Edit />
							</el-icon>
							修改
						</el-button>

						<el-button type="warning" text bg @click="onActionStatus(item)" v-if="item.status == 0" v-auth="'status'">
							<el-icon>
								<ele-Check />
							</el-icon>
							启用
						</el-button>

						<el-button type="info" text bg @click="onActionStatus(item)" v-if="item.status == 1" v-auth="'status'">
							<el-icon>
								<ele-Close />
							</el-icon>
							禁用
						</el-button>

						<el-button type="info" text bg @click="onRowDel(item)" v-auth="'del'">
							<el-icon>
								<ele-Delete />
							</el-icon>
							删除
						</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="dataList" />
		<EditDic ref="editDicRef" @dataList="dataList" />
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import alarm from '/@/api/alarm';

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	status: number;
	name: string;
	key: string;
	createBy: string;
}
interface TableDataState {
	tableData: {
		data: any[];
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			name: string;
			level: string;
			triggerType: string;
		};
	};
}

export default defineComponent({
	name: 'setlist',
	components: { EditDic },

	setup() {
		const addDicRef = ref();
		const levelDicRef = ref();
		const editDicRef = ref();
		const detailRef = ref();
		const queryRef = ref();
		const state = reactive<TableDataState>({
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 20,
					name: '',
					level: '',
					triggerType: '',
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			dataList();
		};
		const dataList = () => {
			state.tableData.loading = true;
			alarm.common
				.getList(state.tableData.param)
				.then((res: any) => {
					state.tableData.data = res.list;
					state.tableData.total = res.Total;
				})
				.finally(() => (state.tableData.loading = false));
		};
		// 打开新增菜单弹窗
		const onOpenAdd = () => {
			editDicRef.value.openDialog();
		};
		// 打开修改模型弹窗
		const onOpenEdit = (row: TableDataRow) => {
			editDicRef.value.openDialog({ ...row });
		};
		//打开数据记录
		const onOpenRecord = (row: TableDataRow) => {
			detailRef.value.openDialog(row);
		};
		const onRowDel = (row?: TableDataRow) => {
			let msg = '你确定要删除所选数据？';
			let ids: number[] | number = [];
			if (!row?.id) {
				ElMessage.error('请选择要删除的数据。');
				return;
			}
			msg = `此操作将永久删除告警：“${row.name}”，是否继续?`;
			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					alarm.common.delete(row.id).then(() => {
						ElMessage.success('删除成功');
						dataList();
					});
				})
		};

		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			dataList();
		};
		const onActionStatus = (item: TableDataRow) => {
			if (item.status === 0) {
				alarm.common.deploy({ id: item.id }).then(() => {
					dataList();
				});
			} else {
				alarm.common.undeploy({ id: item.id }).then(() => {
					dataList();
				});
			}
		}

		return {
			onActionStatus,
			addDicRef,
			editDicRef,
			detailRef,
			queryRef,
			levelDicRef,
			onOpenRecord,
			onOpenAdd,
			onOpenEdit,
			onRowDel,
			dataList,
			resetQuery,
			...toRefs(state),
		};
	},
});
</script>
<style scoped lang="scss">

.el-button.is-text:not(.is-disabled).is-has-bg {
	background-color: var(--next-border-color-light);
}

.card {
	margin: 0 10px 20px;
}

.ant-card {
	box-sizing: border-box;
	font-size: 14px;
	font-variant: tabular-nums;
	border: 1px solid var(--next-border-color-light);

	line-height: 1.5;
	list-style: none;
	font-feature-settings: 'tnum';
	position: relative;
	border-radius: 2px;
	transition: all 0.3s;
	overflow: hidden;
}

.ant-card-body {
	padding: 12px;
	zoom: 1;
	overflow: hidden;
}

.pro-table-card-item {
	display: flex;
	justify-content: stretch;

	.card-item-avatar {
		display: flex;
		align-items: center;
	}
}

.pro-table-card-item .card-item-avatar {
	margin-right: 16px;
}

.pro-table-card-item .card-item-body {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	width: 0;
}

.pro-table-card-item .card-item-body .card-item-header {
	display: flex;
	margin-bottom: 12px;
	margin-top: 10px;
}

.pro-table-card-item .card-item-body .card-item-content {
	display: flex;
	flex-wrap: wrap;
	font-weight: bolder;
	line-height: 25px;
}

.ellipsis {
	display: -webkit-box;
	overflow: hidden;
	text-align: left;
	text-overflow: ellipsis;
	word-break: break-all;
}

.card-item-body .card-item-header .card-item-header-name {
	font-weight: 700;
	font-size: 16px;
}

.card-state {
	position: absolute;
	top: 0px;
	right: -12px;
	display: flex;
	justify-content: center;
	width: 100px;
	padding: 2px 0;
	background-color: rgba(89, 149, 245, 0.15);
	transform: skewX(45deg);
}

.card-state.success {
	background-color: #f6ffed;
	color: #000;
}

.iot-card .card-warp .card-content .card-state.error {
	background-color: rgba(229, 0, 18, .1);
}

.card-state .card-state-content {
	transform: skewX(-45deg);
}

.ant-badge-status-success {
	background-color: #52c41a;
}

.ant-badge-status-error {
	background-color: #ff4d4f;
}

.ant-badge-status-dot {
	position: relative;
	top: -1px;
	display: inline-block;
	width: 6px;
	height: 6px;
	vertical-align: middle;
	border-radius: 50%;
}

.card-tools {
	display: flex;
	margin-top: 8px;
	justify-content: space-between;
	overflow: hidden;
	gap: 8px;

	.el-button {
		flex: 1;
		margin-left: 0;
	}
}

/* /* .card-tools .card-button:not(:last-child) {
	margin-right: 8px;
} */

.card-tools .card-button {
	display: flex;
	flex-grow: 1;
}

.card-tools .card-button>span,
.card-tools .card-button button {
	width: 100%;
	border-radius: 0;
}

.ant-btn-link {
	color: #1d39c4;
	border-color: transparent;
	background: transparent;
	box-shadow: none;
}

.ant-badge-status-text {
	margin-left: 8px;
	font-size: 14px;
}

.ant-btn {
	line-height: 1.5715;
	position: relative;
	display: inline-block;
	font-weight: 400;
	white-space: nowrap;
	text-align: center;
	background-image: none;
	box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	touch-action: manipulation;
	height: 32px;
	padding: 4px 15px;
	font-size: 14px;
	border-radius: 2px;
	color: rgba(0, 0, 0, 0.85);
	border: 1px solid #d9d9d9;
	background: #fff;
}

.ant-btn>.anticon {
	line-height: 1;
}

.ant-btn>span {
	display: inline-block;
}

.cardflex {
	display: flex;
	justify-content: space-between;
}

.statusname {
	font-size: 30px;
	margin-top: 10px;
	margin-bottom: 15px;
}

.comtest {
	margin-top: 20px;
	height: 30px;
	line-height: 30px;
}
</style>
