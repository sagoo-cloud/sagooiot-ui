<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true">
					<el-form-item label="模板名称" prop="name">
						<el-input
							v-model="tableData.param.name"
							placeholder="请输入模板名称"
							clearable
							size="default"
							style="width: 240px"
							@keyup.enter.native="dataList"
						/>
					</el-form-item>
					<el-form-item label="通知方式" prop="name">
						<el-input
							v-model="tableData.param.triggerType"
							placeholder="请输入通知方式"
							clearable
							size="default"
							style="width: 240px"
							@keyup.enter.native="dataList"
						/>
					</el-form-item>

					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="dataList">
							<el-icon>
								<ele-Search />
							</el-icon>
							查询
						</el-button>
						<el-button size="default" @click="resetQuery(queryRef)">
							<el-icon>
								<ele-Refresh />
							</el-icon>
							重置
						</el-button>
						<el-button size="default" type="success" class="ml10" @click="onOpenAdd">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增模板
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<div style="border: 1px solid var(--next-border-color-light)"></div>
				<el-row>
					<el-col :span="8" v-for="(item, index) in tableData.data" :key="index"
						><div class="grid-content card">
							<div class="ant-card">
								<div class="ant-card-body">
									<div class="pro-table-card-item">
										<div class="card-item-avatar">
											<img
												width="88"
												height="88"
												src="data:image/png;base64,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"
												alt=""
											/>
										</div>
										<div class="card-item-body">
											<div class="card-item-header">
												<div class="ellipsis-warp___1lAFU">
													<div class="ellipsis card-item-header-name" style="width: 100%; height: 45px">{{ item.name }}</div>
													<div class="card-item-header-name" style="display: none"></div>
												</div>
											</div>
											<div class="card-item-content">
												<div>
													<label>通知方式</label>
													<div class="ellipsis-warp___1lAFU">
														<div style="width: 100%">群机器人消息</div>
														<div class="ellipsis-max___Lis-o" style="display: none"></div>
													</div>
												</div>
												<div>
													<label>说明</label>
													<div class="ellipsis-warp___1lAFU">
														<div style="width: 100%"></div>
														<div class="ellipsis-max___Lis-o"></div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="card-tools">
								<div class="card-button" @click="onOpenEdit(item)">
									<el-button size="default" type="primary" class="ml10" text bg>
										<el-icon>
											<ele-Edit />
										</el-icon>
										修改
									</el-button>
								</div>
								<div class="card-button" @click="onOpenEdit(item)">
									<el-button size="default" type="primary" text bg>
										<el-icon>
											<ele-View />
										</el-icon>
										调试
									</el-button>
								</div>

								<div class="card-button" @click="onOpenEdit(item)">
									<el-button size="default" type="info" text bg>
										<el-icon>
											<ele-Document />
										</el-icon>
										通知记录
									</el-button>
								</div>

								<div class="card-button" @click="onRowDel(item)">
									<el-button size="default" type="danger" text bg>
										<el-icon>
											<ele-Delete />
										</el-icon>
										删除
									</el-button>
								</div>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
			<pagination
				v-show="tableData.total > 0"
				:total="tableData.total"
				v-model:page="tableData.param.pageNum"
				v-model:limit="tableData.param.pageSize"
				@pagination="dataList"
			/>
		</el-card>

		<!-- <EditDic ref="editDicRef" @dataList="dataList" />
		<LevelDic ref="levelDicRef" @dataList="dataList" /> -->
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
// import EditDic from './component/edit.vue';
// import LevelDic from './component/level.vue';

import alarm from '/@/api/alarm';

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	name: string;
	key: string;
	createBy: string;
}
interface TableDataState {
	ids: number[];
	tableData: {
		data: Array<TableDataRow>;
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			name: string;
			level: number;
			triggerType: number;
		};
	};
}

export default defineComponent({
	name: 'setlist',
	// components: { EditDic,LevelDic },

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
		const onOpenAdd = (row?: TableDataRow) => {
			editDicRef.value.openDialog();
		};
		const onOpenLevel = (row?: TableDataRow) => {
			levelDicRef.value.openDialog();
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
			let ids: number[] = [];
			if (row) {
				msg = `此操作将永久删除模型：“${row.name}”，是否继续?`;
				ids = row.id;
			} else {
				ids = state.ids;
			}
			if (ids.length === 0) {
				ElMessage.error('请选择要删除的数据。');
				return;
			}
			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					alarm.common.delete(ids).then(() => {
						ElMessage.success('删除成功');
						dataList();
					});
				})
				.catch(() => {});
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
		const onActionStatus = (item: TableDataRow[]) => {
			if (item.status == 0) {
				alarm.common.deploy({ id: item.id }).then((res: any) => {
					dataList();
				});
			} else {
				alarm.common.undeploy({ id: item.id }).then((res: any) => {
					dataList();
				});
			}
		};

		return {
			onActionStatus,
			addDicRef,
			editDicRef,
			detailRef,
			queryRef,
			levelDicRef,
			onOpenRecord,
			onOpenLevel,
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
<style>
.el-button.is-text:not(.is-disabled).is-has-bg {
	background-color: var(--next-border-color-light);
}
.card {
	padding: 10px;
}
.ant-card {
	box-sizing: border-box;
	margin: 10px;
	width: 97%;
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
	padding: 24px;
	zoom: 1;
	overflow: hidden;
}
.pro-table-card-item {
	display: flex;
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
	width: calc(100% - 86px);
	margin-bottom: 12px;
}
.pro-table-card-item .card-item-body .card-item-content {
	display: flex;
	flex-wrap: wrap;
}
.pro-table-card-item .card-item-body .card-item-content > div {
	width: 50%;
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
	top: 30px;
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
}
.iot-card .card-warp .card-content .card-state.error {
	background-color: rgba(229, 0, 18, 0.1);
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
	margin-top: 2px;
}
.card-tools .card-button:not(:last-child) {
	margin-right: 8px;
}
.card-tools .card-button {
	display: flex;
	flex-grow: 1;
}
.card-tools .card-button > span,
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
	color: rgba(0, 0, 0, 0.85);
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

}
.ant-btn > .anticon {
	line-height: 1;
}
.ant-btn > span {
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
