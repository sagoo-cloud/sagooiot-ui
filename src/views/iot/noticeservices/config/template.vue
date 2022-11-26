<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
				<el-form :model="tableData.param" ref="queryRef" :inline="true">
					<el-form-item label="配置名称" prop="name">
						<el-input
							v-model="tableData.param.title"
							placeholder="请输入配置名称"
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
							新增模版
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
												:src="'/imgs/notice/'+tableData.param.sendGateway+'.svg'"
												alt=""
											/>
										</div>
										<div class="card-item-body">
											<div class="card-item-header">
												<div class="ellipsis">
													<div class="ellipsis card-item-header-name" style="width: 100%; height: 45px">{{ item.title }}</div>
													<div class="card-item-header-name" style="display: none"></div>
												</div>
											</div>
											<div class="card-item-content">
												<div>
													<label>通知方式</label>
													<div class="">
														<div style="width: 100%">{{item.types==1?'即时发送':'预约发送'}}</div>
													</div>
												</div>
												<div>
													<label>说明</label>
													<div class="ellipsis">
														<div style="width: 100%"></div>
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
								<!-- <div class="card-button" @click="onOpenEdit(item)">
									<el-button size="default" type="primary" text bg>
										<el-icon>
											<ele-View />
										</el-icon>
										调试
									</el-button>
								</div>-->

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

		<EditDic ref="editDicRef" @dataList="dataList" />
	<!-- 	<LevelDic ref="levelDicRef" @dataList="dataList" /> -->
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref,getCurrentInstance,defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import EditDic from './component/temEdit.vue';
// import LevelDic from './component/level.vue';

import api from '/@/api/notice';
import { useRoute } from 'vue-router';

// 定义接口来定义对象的类型
interface TableDataRow {
	id: number;
	title: string;
	types: string;
	sendGateway: string;
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
			title: string;
			sendGateway: string;
			types: number;
		};
	};
}

export default defineComponent({
	name: 'setlist',
	components: { EditDic },

	setup() {
		
   		 const { proxy } = getCurrentInstance() as any;
		// const { notice_send_gateway } = proxy.useDict('notice_send_gateway');
		const addDicRef = ref();
		const editDicRef = ref();
		const detailRef = ref();
		const queryRef = ref();
		const route = useRoute();

		const state = reactive<TableDataState>({
			type:'',
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 20,
					title: '',
					sendGateway: '',
					types: '',
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			state.tableData.param.sendGateway=route.params.id;
			dataList();
		};
		const dataList = () => {
			state.tableData.loading = true;
			api.template
				.getList(state.tableData.param)
				.then((res: any) => {
					state.tableData.data = res.Data;
					state.tableData.total = res.Total;
				})
				.finally(() => (state.tableData.loading = false));
		};
		// 打开新增菜单弹窗
		const onOpenAdd = (row?: TableDataRow ) => {
			editDicRef.value.openDialog(null,state.tableData.param.sendGateway);
		};
	
		// 打开修改模型弹窗
		const onOpenEdit = (row: TableDataRow ) => {
			editDicRef.value.openDialog({ ...row },state.tableData.param.sendGateway);
		};

		const onRowDel = (row?: TableDataRow) => {
			let msg = '你确定要删除所选数据？';
			let ids: number[] = [];
			if (row) {
				msg = `此操作将永久删除：“${row.title}”，是否继续?`;
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
					api.template.delete(ids).then(() => {
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
.el-col-12 {
	padding: 10px;
}

.el-button.is-text:not(.is-disabled).is-has-bg {
	background-color: var(--next-border-color-light);
}
.card {
	padding: 10px;
}
.ant-card {
	box-sizing: border-box;
	margin: 10px;
	width: 98%;
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
