<template>
	<div class="system-dic-container">
		<div class="content">
			<div class="cont_box">
				<div class="title">产品：{{ detail.name }}</div>
				<div class="pro-status"><span class="on"></span>已发布</div>
				<div class="pro-option">停用</div>
			</div>
		</div>

		<div class="content-box">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="产品信息" name="1">
					<div class="pro-box">
						<div class="protitle">产品信息</div>
						<el-button type="" :icon="Edit" class="buttonedit" @click="onOpenEditDic(detail)">编辑</el-button>
					</div>

					<div class="ant-descriptions-view">
						<table>
							<tbody>
								<tr class="ant-descriptions-row">
									<th class="ant-descriptions-item-label ant-descriptions-item-colon">产品名称</th>
									<td class="ant-descriptions-item-content" colspan="1">{{ detail.name }}</td>
									<th class="ant-descriptions-item-label ant-descriptions-item-colon">所属品类</th>
									<td class="ant-descriptions-item-content" colspan="1">{{ detail.categoryName }}</td>
									<th class="ant-descriptions-item-label ant-descriptions-item-colon">所属部门</th>
									<td class="ant-descriptions-item-content" colspan="1">{{ detail.deptName }}</td>
								</tr>
								<tr class="ant-descriptions-row">
									<th class="ant-descriptions-item-label ant-descriptions-item-colon">消息协议</th>
									<td class="ant-descriptions-item-content" colspan="1">{{ detail.messageProtocol }}</td>
									<th class="ant-descriptions-item-label ant-descriptions-item-colon">链接协议</th>
									<td class="ant-descriptions-item-content" colspan="1">{{ detail.transportProtocol }}</td>
									<th class="ant-descriptions-item-label ant-descriptions-item-colon">设备类型</th>
									<td class="ant-descriptions-item-content" colspan="1">{{ detail.deviceType }}</td>
								</tr>
								<tr class="ant-descriptions-row">
									<th class="ant-descriptions-item-label ant-descriptions-item-colon">描述</th>
									<td class="ant-descriptions-item-content" colspan="5">{{ detail.desc }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</el-tab-pane>
				<el-tab-pane label="物模型" name="2">
					<div class="wu-box">
						<el-tabs type="border-card" v-model="activetab" @tab-click="wuhandleClick">
							<el-tab-pane label="属性定义" name="attr">
								<div class="wu-title">
									<div class="title">属性定义</div>
									<div><el-button type="primary" @click="onOpenEditAttr()">添加</el-button></div>
								</div>

								<el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'attr'">
									<el-table-column label="属性标识" align="center" prop="key" />
									<el-table-column label="属性名称" prop="name" :show-overflow-tooltip="true" />
									<el-table-column prop="valueType" label="数据类型" width="120" align="center">
										<template #default="scope">
											<span>{{ scope.row.valueType.type }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="accessMode" label="是否只读" width="120" align="center">
										<template #default="scope">
											<el-tag type="info" size="small" v-if="scope.row.accessMode">只读</el-tag>
											<el-tag type="success" size="small" v-else>读写</el-tag>
										</template>
									</el-table-column>
									<el-table-column label="说明" prop="desc" :show-overflow-tooltip="true" />
									<el-table-column label="操作" width="300" align="center">
										<template #default="scope">
											<el-button size="small" text type="warning">修改</el-button>
											<el-button size="small" text type="danger" @click="onRowDel(scope.row.key,'attr')">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="功能定义" name="fun">
								<div class="wu-title">
									<div class="title">功能定义</div>
									<div><el-button type="primary" @click="onOpenEditFun()">添加</el-button></div>
								</div>

								<el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'fun'">
									<el-table-column label="功能标识" align="center" prop="key" />
									<el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />

									<el-table-column label="描述" prop="desc" :show-overflow-tooltip="true" />
									<el-table-column label="操作" width="300" align="center">
										<template #default="scope">
											<el-button size="small" text type="warning">修改</el-button>
											<el-button size="small" text type="danger" @click="onRowDel(scope.row.key,'fun')">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="事件定义" name="event">
								<div class="wu-title">
									<div class="title">事件定义</div>
									<div><el-button type="primary" @click="onOpenEditEvent()">添加</el-button></div>
								</div>

								<el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'event'">
									<el-table-column label="事件标识" align="center" prop="key" />
									<el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />
									<el-table-column prop="level" label="事件级别" width="120" align="center">
										<template #default="scope">
											<el-tag type="primary" size="small" v-if="scope.row.level == 0">普通</el-tag>
											<el-tag type="warning" size="small" v-if="scope.row.level == 1">警告</el-tag>
											<el-tag type="danger" size="small" v-if="scope.row.level == 2">紧急</el-tag>
										</template>
									</el-table-column>
									<el-table-column label="描述" prop="desc" :show-overflow-tooltip="true" />

									<el-table-column label="操作" width="300" align="center">
										<template #default="scope">
											<el-button size="small" text type="warning">修改</el-button>
											<el-button size="small" text type="danger" @click="onRowDel(scope.row.key,'event')">删除</el-button>
										</template>
									</el-table-column>
								</el-table></el-tab-pane
							>
							<el-tab-pane label="标签定义" name="tab"
								><div class="wu-title">
									<div class="title">标签定义</div>
									<div><el-button type="primary" @click="onOpenEditTab()">添加</el-button></div>
								</div>

								<el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'tab'">
									<el-table-column label="属性标识" align="center" prop="key" />
									<el-table-column label="属性名称" prop="name" :show-overflow-tooltip="true" />
									<el-table-column prop="valueType" label="数据类型" width="120" align="center">
										<template #default="scope">
											<span>{{ scope.row.valueType.type }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="accessMode" label="是否只读" width="120" align="center">
										<template #default="scope">
											<el-tag type="info" size="small" v-if="scope.row.accessMode">只读</el-tag>
											<el-tag type="success" size="small" v-else>读写</el-tag>
										</template>
									</el-table-column>
									<el-table-column label="描述" prop="desc" :show-overflow-tooltip="true" />
									<el-table-column label="操作" width="300" align="center">
										<template #default="scope">
											<el-button size="small" text type="warning">修改</el-button>
											<el-button size="small" text type="danger" @click="onRowDel(scope.row.key,'tab')">删除</el-button>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
						</el-tabs>
						<pagination
							v-show="tableData.total > 0"
							:total="tableData.total"
							v-model:page="tableData.param.pageNum"
							v-model:limit="tableData.param.pageSize"
							@pagination="typeList"
						/>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<EditDic ref="editDicRef" @typeList="typeList" />
		<EditAttr ref="editAttrRef" @typeList="getproperty" />
		<EditFun ref="editFunRef" @typeList="getfunction" />
		<EditEvent ref="editEventRef" @typeList="getevent" />
		<EditTab ref="editTabRef" @typeList="gettab" />
	</div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';

import EditDic from './component/editPro.vue';
import EditAttr from './component/editAttr.vue';
import EditFun from './component/editFun.vue';
import EditEvent from './component/editEvent.vue';
import EditTab from './component/editTab.vue';

import { useRoute } from 'vue-router';

import api from '/@/api/device';

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
	name: 'deviceEditPro',
	components: { EditDic, EditAttr, EditFun, EditEvent, EditTab },

	setup(prop, context) {
		const route = useRoute();
		const editDicRef = ref();
		const editAttrRef = ref();
		const editFunRef = ref();
		const editEventRef = ref();
		const editTabRef = ref();
		const state = reactive<TableDataState>({
			isShowDialog: false,
			activeName: '2', // 分类数据
			activetab: 'attr', // 分类数据
			detail: [],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					productId: route.params && route.params.id,
					pageSize: 10,
					status: '',
					dateRange: [],
				},
			},
		});

		onMounted(() => {
			const ids = route.params && route.params.id;
			api.product.detail(ids).then((res: any) => {
				state.detail = res.data;
			});

			//第一次加载
			api.model.property(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.Total;
			});
		});

		//打开添加属性弹窗
		const onOpenEditAttr = () => {
			editAttrRef.value.openDialog({ product_id: route.params.id, id: 0 });
		};

		//打开添加功能弹窗
		const onOpenEditFun = () => {
			editFunRef.value.openDialog({ product_id: route.params.id, id: 0 });
		};
		//打开添加事件弹窗
		const onOpenEditEvent = () => {
			editEventRef.value.openDialog({ product_id: route.params.id, id: 0 });
		};

		//打开添加事件弹窗
		const onOpenEditTab = () => {
			editTabRef.value.openDialog({ product_id: route.params.id, id: 0 });
		};

		// 打开修改产品弹窗
		const onOpenEditDic = (row: TableDataRow) => {
			editDicRef.value.openDialog(row);
		};


		// 删除产品
		const onRowDel = (key,type) => {
			let msg = `此操作将永久删除该数据吗？，是否继续?`;
			
			if (key.length === 0) {
				ElMessage.error('请选择要删除的数据。');
				return;
			}
			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					if(type=='attr'){
						api.model.propertydel(route.params.id,key).then(() => {
							ElMessage.success('删除成功');
							getproperty();
						});
					}
					if(type=='fun'){
						api.model.functiondel(route.params.id,key).then(() => {
							ElMessage.success('删除成功');
							getfunction();
						});
					}
					if(type=='event'){
						api.model.eventdel(route.params.id,key).then(() => {
							ElMessage.success('删除成功');
							getevent();
						});
					}
					if(type=='tab'){
						api.model.eventdel(route.params.id,key).then(() => {
							ElMessage.success('删除成功');
							tagdel();
						});
					}
				})
				.catch(() => {});
		};


		const getproperty=()=>{
			api.model.property(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.Total;
			});
		};

		const getfunction=()=>{
			api.model.function(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.Total;
			});
		};
		const getevent=()=>{
			api.model.event(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.Total;
			});
		};

		const gettab=()=>{
			api.model.tag(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.Total;
			});
		};

		const wuhandleClick = (tab: TabsPaneContext) => {
			state.activetab = tab.props.name;
			switch (tab.props.name) {
				case 'attr':
					getproperty();
					break;
				case 'fun':
					getfunction();
					break;
				case 'event':
					getevent();
					break;
				case 'tab':
					gettab();
					break;
			}
		};

		const handleClick = (tab: TabsPaneContext, event: Event) => {
			console.log(tab, event);
		};

		return {
			Edit,
			editDicRef,
			editAttrRef,
			editFunRef,
			editEventRef,
			editTabRef,
			onRowDel,
			getproperty,
			getfunction,
			getevent,
			gettab,
			wuhandleClick,
			onOpenEditTab,
			onOpenEditEvent,
			onOpenEditAttr,
			onOpenEditFun,
			onOpenEditDic,
			handleClick,
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
	font-size: 24px;
}
.cont_box .pro-status {
	line-height: 40px;
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
	line-height: 40px;
	margin-left: 10px;
	color: #1890ff;
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
.ant-descriptions-view > table {
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


