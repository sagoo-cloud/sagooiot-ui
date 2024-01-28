<template>
	<div class="page bg page-full">
		<div class="content">
			<div class="cont_box">
				<div class="title">产品：{{ detail.name }}</div>
				<div class="pro-status"><span :class="developer_status == 1 ? 'on' : 'off'"></span>{{ developer_status == 1
					? '已发布' : '未发布' }}</div>
				<div class="pro-option" @click="CkOption" v-auth="'startOrStop'"> {{ developer_status == 1 ? '停用' : '启用' }}
				</div>
			</div>
		</div>

		<el-tabs v-model="activeName" style="padding: 0 20px;" @tab-click="handleClick">
			<el-tab-pane label="产品信息" name="1">
				<div class="pro-box">
					<div class="protitle">产品信息</div>
					<el-button type="" :icon="Edit" class="buttonedit" v-auth="'edit'" @click="onOpenEditDic(detail)">编辑</el-button>
				</div>

				<el-descriptions class="margin-top" :column="3" border>
					<el-descriptions-item label="产品标识">{{ detail.key }}</el-descriptions-item>
					<el-descriptions-item label="产品分类">{{ detail.categoryName }}</el-descriptions-item>
					<el-descriptions-item label="设备类型">{{ detail.deviceType }}</el-descriptions-item>
					<el-descriptions-item label="产品图片">
						<el-image style="width: 80px; height: 80px" :src="detail.icon" :previewSrcList="[detail.icon]" fit="contain">
							<template #error>
								<div class="image-slot">
									<ele-Picture style="width: 30px;" />
									加载失败
								</div>
							</template>
						</el-image>
					</el-descriptions-item>
					<el-descriptions-item label="消息协议">{{ detail.messageProtocol }}</el-descriptions-item>
					<el-descriptions-item label="接入方式">{{ detail.transportProtocol }}</el-descriptions-item>
					<el-descriptions-item label="描述">{{ detail.desc }}</el-descriptions-item>
				</el-descriptions>
			</el-tab-pane>
			<el-tab-pane label="物模型" name="2">
				<el-tabs type="border-card" v-model="activetab" @tab-click="wuhandleClick">
					<el-tab-pane label="属性定义" name="attr">
						<div class="wu-title">
							<div class="title">属性定义</div>
							<div><el-button size="small" type="primary" v-auth="'edit'" @click="onOpenEditAttr()">添加</el-button>
							</div>
						</div>

						<el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'attr'">
							<el-table-column label="属性标识" align="center" prop="key" />
							<el-table-column label="属性名称" prop="name" show-overflow-tooltip />
							<el-table-column prop="valueType" label="数据类型" width="100" align="center">
								<template #default="scope">
									<span>{{ scope.row.valueType.type }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="decimals" label="精度" width="60" align="center">
								<template #default="scope">
									<span>{{ scope.row.valueType.decimals }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="unit" label="单位" width="60" align="center">
								<template #default="scope">
									<span>{{ scope.row.valueType.unit }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="accessMode" label="是否只读" width="120" align="center">
								<template #default="scope">
									<el-tag type="info" size="small" v-if="scope.row.accessMode">只读</el-tag>
									<el-tag type="success" size="small" v-else>读写</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="说明" prop="desc" show-overflow-tooltip />
							<el-table-column label="操作" width="300" align="center" fixed="right">
								<template #default="scope">
									<el-button size="small" text type="warning" v-auth="'edit'" @click="onEditAttr(scope.row)">修改</el-button>
									<el-button size="small" text type="danger" v-auth="'del'" @click="onRowDel(scope.row.key, 'attr')">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="功能定义" name="fun">
						<div class="wu-title">
							<div class="title">功能定义</div>
							<div><el-button size="small" type="primary" v-auth="'add'" @click="onOpenEditFun()">添加</el-button>
							</div>
						</div>

						<el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'fun'">
							<el-table-column label="功能标识" align="center" prop="key" />
							<el-table-column label="名称" prop="name" show-overflow-tooltip />

							<el-table-column label="描述" prop="desc" show-overflow-tooltip />
							<el-table-column label="操作" width="300" align="center" fixed="right">
								<template #default="scope">
									<el-button size="small" text type="warning" v-auth="'edit'" @click="onEditFun(scope.row)">修改</el-button>
									<el-button size="small" text type="danger" v-auth="'del'" @click="onRowDel(scope.row.key, 'fun')">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="事件定义" name="event">
						<div class="wu-title">
							<div class="title">事件定义</div>
							<div>
								<el-button size="small" type="primary" v-auth="'add'" @click="onOpenEditEvent()">添加</el-button>
							</div>
						</div>

						<el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'event'">
							<el-table-column label="事件标识" align="center" prop="key" />
							<el-table-column label="名称" prop="name" show-overflow-tooltip />
							<el-table-column prop="level" label="事件级别" width="120" align="center">
								<template #default="scope">
									<el-tag type="primary" size="small" v-if="scope.row.level == 0">普通</el-tag>
									<el-tag type="warning" size="small" v-if="scope.row.level == 1">警告</el-tag>
									<el-tag type="danger" size="small" v-if="scope.row.level == 2">紧急</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="描述" prop="desc" show-overflow-tooltip />

							<el-table-column label="操作" width="300" align="center" fixed="right">
								<template #default="scope">
									<el-button size="small" text type="warning" v-auth="'edit'" @click="onEditEvent(scope.row)">修改</el-button>
									<el-button size="small" text type="danger" v-auth="'del'" @click="onRowDel(scope.row.key, 'event')">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label="标签定义" name="tab">
						<div class="wu-title">
							<div class="title">标签定义</div>
							<div><el-button size="small" type="primary" v-auth="'add'" @click="onOpenEditTab()">添加</el-button>
							</div>
						</div>

						<el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'tab'">
							<el-table-column label="属性标识" align="center" prop="key" />
							<el-table-column label="属性名称" prop="name" show-overflow-tooltip />
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
							<el-table-column label="描述" prop="desc" show-overflow-tooltip />
							<el-table-column label="操作" width="300" align="center" fixed="right">
								<template #default="scope">
									<el-button size="small" text type="warning" v-auth="'edit'" @click="onEditTag(scope.row)">修改</el-button>
									<el-button size="small" text type="danger" v-auth="'del'" @click="onRowDel(scope.row.key, 'tab')">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>
				<div class="import">
					<div class="row_bet">
						<el-upload accept="json" :show-file-list="false" :limit="1" :data="{ key: detail.key }" :headers="headers" :action="uploadUrl" :on-success="updateImg">
							<el-button size="small">
								<el-icon> <ele-Upload /> </el-icon>
								导入物模型
							</el-button>
						</el-upload>
						<el-button size="small" type="default" class="ml10" @click="onRowExport()">
							<el-icon>
								<ele-Download />
							</el-icon>
							导出物模型
						</el-button>
					</div>

				</div>

				<pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="getList()" />
			</el-tab-pane>
			<el-tab-pane label="设备接入" name="3">
				<deviceIn></deviceIn>
			</el-tab-pane>
			<el-tab-pane label="数据解析" name="4" lazy>
				<dataParse v-if="activeName === '4'" :script="detail.scriptInfo" @updateScript="updateScript">
				</dataParse>
			</el-tab-pane>
		</el-tabs>
		<EditDic ref="editDicRef" @typeList="typeList" />
		<EditAttr ref="editAttrRef" @typeList="getproperty" />
		<EditFun ref="editFunRef" @typeList="getfunction" />
		<EditEvent ref="editEventRef" @typeList="getevent" />
		<EditTab ref="editTabRef" @typeList="gettab" />
	</div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Edit } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import downloadFile from '/@/utils/download';
import getOrigin from '/@/utils/origin';


import EditDic from './component/editPro.vue';
import deviceIn from './component/deviceIn.vue';
import dataParse from './component/dataParse.vue';
import EditAttr from './component/editAttr.vue';
import EditFun from './component/editFun.vue';
import EditEvent from './component/editEvent.vue';
import EditTab from './component/editTab.vue';

import { useRoute } from 'vue-router';

import api from '/@/api/device';


interface TableDataState {
	ids: number[];
	detail: any;
	tableData: {
		data: [];
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			name: string;
			productKey: string;
			deviceType: string;
			status: string;
			dateRange: string[];
		};
	};
}
export default defineComponent({
	name: 'deviceEditPro',
	components: { EditDic, EditAttr, EditFun, EditEvent, EditTab, deviceIn, dataParse },

	setup(prop, context) {

		const uploadUrl: string = getOrigin(import.meta.env.VITE_API_URL + "/product/tsl/import");
		const headers = {
			Authorization: 'Bearer ' + localStorage.token,
		};
		const route = useRoute();
		const editDicRef = ref();
		const editAttrRef = ref();
		const editFunRef = ref();
		const editEventRef = ref();
		const editTabRef = ref();
		const state = reactive<TableDataState>({
			isShowDialog: false,
			activeName: '1', // 分类数据
			activetab: 'attr', // 分类数据
			detail: {},
			developer_status: 0,
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					productKey: route.params && route.params.id,
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
				state.developer_status = res.data.status
			});

			//第一次加载
			api.model.property(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.Total;
			});
		});

		//编辑属性
		const onEditAttr = (row: TableDataRow) => {
			editAttrRef.value.openDialog(row, route.params.id);
		};

		//编辑功能
		const onEditFun = (row: TableDataRow) => {
			editFunRef.value.openDialog(row, route.params.id);
		}


		//编辑事件
		const onEditEvent = (row: TableDataRow) => {
			editEventRef.value.openDialog(row, route.params.id);
		}

		//编辑标签
		const onEditTag = (row: TableDataRow) => {
			editTabRef.value.openDialog(row, route.params.id);
		}

		//打开添加属性弹窗
		const onOpenEditAttr = () => {
			editAttrRef.value.openDialog({ productKey: route.params.id, id: 0, accessMode: 1 });
		};

		//打开添加功能弹窗
		const onOpenEditFun = () => {
			editFunRef.value.openDialog({ productKey: route.params.id, id: 0 });
		};
		//打开添加事件弹窗
		const onOpenEditEvent = () => {
			editEventRef.value.openDialog({ productKey: route.params.id, id: 0, level: 0 });
		};

		//打开添加事件弹窗
		const onOpenEditTab = () => {
			editTabRef.value.openDialog({ productKey: route.params.id, id: 0, accessMode: 1 });
		};

		// 打开修改产品弹窗
		const onOpenEditDic = (row: TableDataRow) => {
			editDicRef.value.openDialog(row);
		};


		// 删除产品
		const onRowDel = (key, type) => {
			let msg = `此操作将永久删除该数据，是否继续?`;

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
					if (type == 'attr') {
						api.model.propertydel(route.params.id, key).then(() => {
							ElMessage.success('删除成功');
							getproperty();
						});
					}
					if (type == 'fun') {
						api.model.functiondel(route.params.id, key).then(() => {
							ElMessage.success('删除成功');
							getfunction();
						});
					}
					if (type == 'event') {
						api.model.eventdel(route.params.id, key).then(() => {
							ElMessage.success('删除成功');
							getevent();
						});
					}
					if (type == 'tab') {
						api.model.tagdel(route.params.id, key).then(() => {
							ElMessage.success('删除成功');
							gettab();
						});
					}
				})
				.catch(() => { });
		};


		//根据不同类型获取列表
		const getList = () => {
			switch (state.activetab) {
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

		const getproperty = () => {
			api.model.property(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.Total;
			});
		};

		const getfunction = () => {
			api.model.function(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.Total;
			});
		};
		const getevent = () => {
			api.model.event(state.tableData.param).then((res: any) => {
				state.tableData.data = res.Data;
				state.tableData.total = res.Total;
			});
		};

		const gettab = () => {
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
		};

		const updateScript = (scriptInfo: string) => {
			state.detail.scriptInfo = scriptInfo
		};

		const CkOption = () => {

			if (state.developer_status == 1) {
				api.product.undeploy({ id: route.params.id }).then((res: any) => {
					ElMessage.success('操作成功');
					state.developer_status = 0;
				});
			} else {
				api.product.deploy({ id: route.params.id }).then((res: any) => {
					ElMessage.success('操作成功');
					state.developer_status = 1;
				});
			}
		}

		// 导出
		const onRowExport = () => {

			api.product.export({ productKey: state.detail.key }).then((res: any) => downloadFile(res, "TSL-" + state.detail.key + "-" + getCurrentTime() + ".json"))
		};


		const getCurrentTime = () => {
			const date = new Date();
			const year = date.getFullYear().toString();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			const hours = date.getHours().toString().padStart(2, '0');
			const minutes = date.getMinutes().toString().padStart(2, '0');
			return year + month + day + hours + minutes;
		}
		const updateImg = (res: any) => {
			if (res.code === 0) {
				getList("attr");
				ElMessage.success('物模型导入成功');
			} else {
				ElMessage.error(res.message);
			}
		};

		return {
			updateImg,
			headers,
			uploadUrl,
			getCurrentTime,
			onRowExport,
			Edit,
			updateScript,
			editDicRef,
			editAttrRef,
			editFunRef,
			editEventRef,
			editTabRef,
			CkOption,
			onRowDel,
			onEditFun,
			onEditEvent,
			onEditTag,
			onEditAttr,
			getList,
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
<style scoped>
.import {
	position: absolute;
	top: 8px;
	right: 12px;
}

.import .row_bet {
	display: flex;
	flex-direction: row;
	align-items: center;
	flex: 1;
}

.content {
	width: 100%;
	padding: 20px;
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
	cursor: pointer;
}

.pro-box {
	display: flex;
	padding: 10px;
	align-items: center;
}

.pro-box .protitle {
	font-size: 18px;
	font-weight: bold;
	line-height: 35px;
}

.pro-box .buttonedit {
	border: 0px;
	color: #1890ff;
}

.wu-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 20px;
	border-bottom: #e8e8e8 1px solid;
}

.wu-title .title {
	font-size: 18px;
}
</style>


