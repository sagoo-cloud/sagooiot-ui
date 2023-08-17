<template>
	<div class="system-dic-container">
		<div class="content">
			<div class="cont_box">
				<div class="title">数据源名称：{{ detail.name }}</div>
				<div class="pro-status"><span :class="developer_status == 1 ? 'on' : 'off'"></span>{{ developer_status == 1 ? '已发布' : '未发布' }}</div>

				<div class="pro-option" v-auth="'pro-status'" @click="CkOption">{{ developer_status == 1 ? '停用' : '发布' }}</div>
			</div>
		</div>

		<div class="content-box">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="数据源信息" name="1">
					<el-form size="default" label-width="110px" :inline="true">
						<el-divider content-position="left">基本信息</el-divider>

						<el-form-item label="数据源标识:">
							{{ detail.key }}
						</el-form-item>

						<el-form-item label="数据源名称:">
							{{ detail.name }}
						</el-form-item>
						<el-form-item label="数据源描述:">
							{{ detail.desc }}
						</el-form-item>
						<el-form-item label="数据来源:">
							<span v-if="detail.from == 1">api导入</span>
							<span v-if="detail.from == 2">数据库</span>
							<span v-if="detail.from == 3">文件</span>
							<span v-if="detail.from == 4">设备</span>
						</el-form-item>


						<div v-if="detail.from == 4">
							<el-divider content-position="left">数据源配置</el-divider>
							<el-form-item label="设备key:" prop="deviceKey">
								{{ detail.deviceConfig.deviceKey }}
							</el-form-item>
							<el-form-item label="产品key:" prop="productKey">
								{{ detail.deviceConfig.productKey }}
							</el-form-item>
						</div>

						<div v-if="detail.from == 2">
							<el-divider content-position="left">数据源配置</el-divider>
							<el-form-item label="数据来源:" prop="type">
								{{ detail.dbConfig.type }}
							</el-form-item>

							<el-form-item label="主机地址:" prop="host">
								{{ detail.dbConfig.host }}
							</el-form-item>

							<el-form-item label="端口号:" prop="port">
								{{ detail.dbConfig.port }}
							</el-form-item>

							<el-form-item label="用户名:" prop="user">
								{{ detail.dbConfig.user }}
							</el-form-item>
							<el-form-item label="密码:" prop="passwd">
								{{ detail.dbConfig.passwd }}
							</el-form-item>
							<el-form-item label="数据库名称:" prop="dbName">
								{{ detail.dbConfig.dbName }}
							</el-form-item>

							<el-form-item label="表名称:" prop="tableName">
								{{ detail.dbConfig.tableName }}
							</el-form-item>
							<el-form-item label="主键字段:" prop="pk">
								{{ detail.dbConfig.pk }}
							</el-form-item>

							<el-form-item label="每次获取数量:" prop="num">
								{{ detail.dbConfig.num }}
							</el-form-item>

							<el-form-item label="任务表达式:" prop="cronExpression">
								{{ detail.dbConfig.cronExpression }}
							</el-form-item>

						</div>
						<div v-if="detail.from == 1">

							<el-divider content-position="left">规则表达式</el-divider>

							<div v-for="(item, index) in rule" :key="index">
								<el-form-item label="表达式:">
									{{ item.expression }}
								</el-form-item>

								<el-form-item label="参数:"> {{ item.params.name }}~ {{ item.params.value }} </el-form-item>

								<el-divider content-position="left">数据源配置</el-divider>

								<el-form-item label="请求方法:" prop="method">
									{{ config.method }}
								</el-form-item>
								<el-form-item label="请求地址:" prop="method">
									{{ config.url }}
								</el-form-item>
								<el-form-item label="更新时间:" prop="method">
									{{ config.interval }}
									{{ config.intervalUnit }}
								</el-form-item>

								<el-divider content-position="left">请求参数</el-divider>

								<div class="content-f" v-for="(item, index) in requestParams" :key="index" style="    border: 1px solid #d9d9d9; padding: 10px;margin-bottom: 10px;">

									<div v-for="(aa) in item" :key="aa.type">
										<el-form-item label="参数类型:">
											{{ aa.type }}
										</el-form-item>
										<el-form-item label="参数标题:">
											{{ aa.name }}
										</el-form-item>
										<el-form-item label="参数名:">
											{{ aa.key }}
										</el-form-item>
										<el-form-item label="参数值:">
											{{ aa.value }}
										</el-form-item>
									</div>
								</div>
							</div>

						</div>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="数据节点" name="2">
					<div class="wu-box">
						<div class="wu-title">
							<div class="title">数据节点</div>
							<div v-if="developer_status == 0" v-auth="'add'"><el-button type="primary" @click="onOpenEdit()">添加</el-button></div>
						</div>

						<el-table :data="tableData.data" style="width: 100%" v-loading="tableData.loading">
							<el-table-column label="ID" align="center" prop="nodeId" width="80" v-col="'id'" />
							<el-table-column label="数据标识" prop="key" :show-overflow-tooltip="true" v-col="'key'" />
							<el-table-column label="数据名称" prop="name" :show-overflow-tooltip="true" v-col="'name'" />
							<el-table-column label="数据类型" prop="dataType" :show-overflow-tooltip="true" v-col="'dataType'" />
							<el-table-column label="数据取值项" prop="value" :show-overflow-tooltip="true" v-col="'value'" />

							<el-table-column prop="createdAt" label="创建时间" align="center" v-col="'createdAt'" width="180"></el-table-column>

							<el-table-column label="操作" width="200" align="center" fixed="right">
								<template #default="scope">
									<el-button size="small" text type="warning" @click="onOpenEdit1(scope.row)" v-if="developer_status == 0" v-auth="'edit'">修改</el-button>
									<el-button size="small" text type="danger" @click="onRowDel(scope.row)" v-if="developer_status == 0" v-auth="'del'">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" @pagination="typeList" />
					</div>
				</el-tab-pane>
				<el-tab-pane label="查看数据" name="3">
					<div class="wu-box">
						<JsonViewer :value="jsonData" boxed sort theme="jv-dark" @click="onKeyclick" />
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<EditDic ref="editDicRef" @typeList="typeList" />

	</div>
</template>            
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Edit } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import "vue3-json-viewer/dist/index.css";

import EditDic from './component/editNode.vue';
import api from '/@/api/datahub';

interface TableDataState {
	ids: number[];
	tableData: {
		data: [];
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			name: string;
			deviceType: string;
			status: string;
			dateRange: string[];
		};
	};
}
export default defineComponent({
	name: 'dataDetail',
	components: { EditDic },
	setup() {
		const editDicRef = ref();

		const route = useRoute();
		const state = reactive<TableDataState>({
			config: {},
			jsonData: {},
			ruledata: [
				{
					expression: '',
					params: {},
				},
			],
			rule: [
				{
					expression: '',
					params: {
						name: '',
						value: '',
					},
				},
			],
			requestParams: [
				{
					type: '',
					key: '',
					name: '',
					value: '',
				},
			],

			isShowDialog: false,
			detail: [],
			activeName: '1',
			developer_status: 0,
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					sourceId: route.params && route.params.sourceId,
					status: '',
					dateRange: [],
				},
			},
		});

		onMounted(() => {
			const ids = route.params && route.params.sourceId;
			api.common.detail(ids).then((res: any) => {
				state.detail = res.data;
				state.developer_status = res.data.status;
				state.config = res.data.apiConfig;
				state.requestParams = res.data.apiConfig.requestParams;
			});

			typeList();
		});

		const typeList = () => {
			state.tableData.loading = true;
			api.node.getList(state.tableData.param).then((res: any) => {
				state.tableData.data = res.list;
				state.tableData.total = res.Total;
			}).finally(() => (state.tableData.loading = false));
		};

		const CkOption = () => {
			if (state.developer_status == 1) {
				api.common.undeploy({ sourceId: route.params.sourceId }).then(() => {
					ElMessage.success('操作成功');
					state.developer_status = 0;
				});
			} else {
				api.common.deploy({ sourceId: route.params.sourceId }).then(() => {
					ElMessage.success('操作成功');
					state.developer_status = 1;
				});
			}
		};
		const handleClick = (tab: any) => {
			if (tab.props.name == 3) {
				if (state.detail.from == 1) {
					api.common.api(state.detail.sourceId).then((res: any) => {
						state.jsonData = JSON.parse(res.data);
					})
				} else if (state.detail.from == 4) {
					api.common.devapi(state.detail.sourceId).then((res: any) => {
						state.jsonData = JSON.parse(res.data);
					})
				} else if (state.detail.from == 2) {
					api.common.devdb(state.detail.sourceId).then((res: any) => {
						state.jsonData = JSON.parse(res.data);
					})
				}
			}
		};

		const onRowDel = (row: any) => {
			let msg = '你确定要删除所选数据？';
			let ids: number[] = [];
			if (row) {
				msg = `此操作将永久删除数据节点：“${row.name}”，是否继续?`;
				ids = row.nodeId;
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
					api.node.delete(ids).then(() => {
						ElMessage.success('删除成功');
						typeList();
					});
				})
		};

		// 打开修改数据源弹窗
		const onOpenEdit = () => {
			editDicRef.value.openDialog({ sourceId: route.params.sourceId, nodeId: 0, isPk: 0 });
		};
		const onOpenEdit1 = (row: any) => {
			editDicRef.value.openDialog(row);
		};

		return {
			Edit,
			editDicRef,
			typeList,
			onRowDel,
			onOpenEdit,
			onOpenEdit1,
			handleClick,
			CkOption,
			...toRefs(state),
		};
	},
});
</script>
<style>
.content {
	background: #fff;
	width: 100%;
	padding: 20px;
}

.content-box {
	background: #fff;
	width: 100%;
	padding: 20px;
	margin-top: 20px;
}

.cont_box {
	display: flex;
}

.cont_box .title {
	font-size: 18px;
}

.cont_box .pro-status {
	line-height: 30px;
	margin-left: 30px;
}

.cont_box .pro-status .on {
	background: #52c41a;
}

.cont_box .pro-status .off {
	background: #c41a1a;
}

.cont_box .pro-status span {
	position: relative;
	top: -1px;
	display: inline-block;
	width: 6px;
	height: 6px;
	vertical-align: middle;
	border-radius: 50%;
	margin-right: 5px;
}

.cont_box .pro-option {
	line-height: 30px;
	margin-left: 10px;
	color: #1890ff;
	cursor: pointer;
}

.content-box .pro-box {
	display: flex;
	padding: 10px;
}

.content-box .pro-box .protitle {
	font-size: 18px;
	font-weight: bold;
	line-height: 35px;
}

.content-box .pro-box .buttonedit {
	border: 0px;
	color: #1890ff;
}

table {
	border-collapse: collapse;
	text-indent: initial;
	border-spacing: 2px;
}

tbody {
	box-sizing: border-box;
	display: table-row-group;
	vertical-align: middle;
	border-color: inherit;
}

tr {
	display: table-row;
	vertical-align: inherit;
	border-color: inherit;
}

.ant-descriptions-view {
	width: 100%;
	overflow: hidden;
	border-radius: 4px;
}

.ant-descriptions-view {
	border: 1px solid #e8e8e8;
}

.ant-descriptions-view table {
	width: 100%;
	table-layout: fixed;
}

.ant-descriptions-view>table {
	table-layout: auto;
}

.ant-descriptions-row {
	border-bottom: 1px solid #e8e8e8;
}

.ant-descriptions-item-label {
	color: rgba(0, 0, 0, 0.85);
	font-weight: 400;
	font-size: 14px;
	line-height: 1.5;
}

.ant-descriptions-item-label {
	padding: 16px 24px;
	border-right: 1px solid #e8e8e8;
}

.ant-descriptions-item-label {
	background-color: #fafafa;
}

.ant-descriptions-item-content {
	padding: 16px 24px;
	border-right: 1px solid #e8e8e8;
	display: table-cell;
	color: rgba(0, 0, 0, 0.65);
	font-size: 14px;
	line-height: 1.5;
}

.wu-box {
	border: #e8e8e8 solid 1px;
	padding: 20px;
	width: 100%;
}

.wu-box .wu-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 20px;
	border-bottom: #e8e8e8 1px solid;
}

.wu-box .wu-title .title {
	font-size: 18px;
}
</style>