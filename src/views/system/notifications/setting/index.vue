<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true">
					<!-- 
					<el-form-item label="名称" prop="name">
						<el-input
							v-model="tableData.param.name"
							placeholder="请输入模型名称"
							clearable
							size="default"
							style="width: 240px"
							@keyup.enter.native="dataList"
						/>
					</el-form-item> -->
					<!-- <el-form-item label="触发方式" prop="name">
						<el-input
							v-model="tableData.param.triggerType"
							placeholder="请输入模型名称"
							clearable
							size="default"
							style="width: 240px"
							@keyup.enter.native="dataList"
						/>
					</el-form-item> -->
					<!-- <el-form-item label="级别" prop="level">
						<el-input
							v-model="tableData.param.level"
							placeholder="请输入模型名称"
							clearable
							size="default"
							style="width: 240px"
							@keyup.enter.native="dataList"
						/>
					</el-form-item> -->
					<el-form-item>
						<!-- <el-button size="default" type="primary" class="ml10" @click="dataList">
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
						</el-button> -->
						<el-button size="default" type="success" class="ml10" @click="onOpenAdd">
							<el-icon>
								<ele-FolderAdd />
							</el-icon>
							新增告警
						</el-button>
						<el-button size="default" type="primary" class="ml10" @click="onOpenLevel">
							<el-icon>
								<ele-Setting />
							</el-icon>
							级别设置
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<div style="border: 1px solid var(--next-border-color-light)"></div>
				<el-row>
					<el-col :span="6" v-for="(item, index) in tableData.data" :key="index"
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
													<label>触发方式</label>
													<div class="ellipsis-warp___1lAFU">
														<div style="width: 100%">设备触发</div>
														<div class="ellipsis-max___Lis-o" style="display: none"></div>
													</div>
												</div>
												<div>
													<label>级别</label>
													<div class="ellipsis-warp___1lAFU">
														<div style="width: 100%">{{ item.alarmLevel.name }}</div>
														<div class="ellipsis-max___Lis-o"></div>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div class="card-state success" v-if="item.status == 1">
										<div class="card-state-content">
											<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper">
												<span class="ant-badge-status-dot ant-badge-status-success"></span>
												<span class="ant-badge-status-text">已启用</span>
											</span>
										</div>
									</div>
									<div class="card-state error" v-if="item.status == 0">
										<div class="card-state-content">
											<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper"
												><span class="ant-badge-status-dot ant-badge-status-error"></span><span class="ant-badge-status-text">未启用</span></span
											>
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


								<div class="card-button" v-if="item.status==0">
									<el-button size="default" type="warning" text bg  @click="onActionStatus(item)">
										<el-icon>
											<ele-Check />
										</el-icon>
										启用
									</el-button>
								</div>

                <div class="card-button" v-if="item.status==1">
									<el-button size="default" type="info" text bg  @click="onActionStatus(item)">
										<el-icon>
											<ele-Close />
										</el-icon>
										禁用
									</el-button>
								</div>



								<div class="card-button" @click="onRowDel(item)" >
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

		<EditDic ref="editDicRef" @dataList="dataList" />
		<LevelDic ref="levelDicRef" @dataList="dataList" />
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/edit.vue';
import LevelDic from './component/level.vue';

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
	components: { EditDic,LevelDic },

	setup() {
		const addDicRef = ref();
    const levelDicRef=ref();
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
    }

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
    background-color: rgba(229,0,18,.1);
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
