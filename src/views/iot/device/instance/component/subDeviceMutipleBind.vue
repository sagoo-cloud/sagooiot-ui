<template>
	<div class="mutiple-bind-dialog-wrap">
		<el-dialog title="批量绑定子设备" v-model="isShowDialog" width="90%">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="small" label-width="110px">
				<el-form-item label="所属产品" prop="productId">
					<el-select @change="handleChange" v-model="ruleForm.productId" placeholder="请选择所属产品" style="width: 300px;">
						<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
					<el-button style="margin-left: 20px;" :disabled="!deviceKeyList.length" v-auth="'mutipleBind'" type="primary" @click="confirmBind()">批量绑定</el-button>

				</el-form-item>
			</el-form>
			<el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="标识" prop="key" width="130" :show-overflow-tooltip="true" v-col="'key'" />
				<el-table-column label="设备名称" prop="name" :show-overflow-tooltip="true" v-col="'name'" />
				<el-table-column label="产品名称" prop="productName" :show-overflow-tooltip="true" v-col="'productName'" />

				<el-table-column prop="status" label="状态" width="100" align="center" v-col="'status'">
				<template #default="scope">
					<el-tag type="info" size="small" v-if="scope.row.status==1">离线</el-tag>
					<el-tag type="success" size="small" v-if="scope.row.status==2">在线</el-tag>
					<el-tag type="info" size="small" v-if="scope.row.status==0">未启用</el-tag>
				</template>
				</el-table-column>
				<el-table-column prop="registryTime" label="激活时间" align="center" width="150" v-col="'registryTime'"></el-table-column>
				<el-table-column prop="desc" label="说明" v-col="'desc'"></el-table-column>

			</el-table>
			<pagination
				v-show="tableData.total > 0"
				:total="tableData.total"
				v-model:page="tableData.param.pageNum"
				v-model:limit="tableData.param.pageSize"
				@pagination="getDeviceList"
			/>

		</el-dialog>
	</div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue'
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus'

import 'vue3-json-viewer/dist/index.css'

import { useRoute } from 'vue-router'

import api from '/@/api/device'

interface TableDataState {
    isShowDialog: boolean,
	productData: object[],
	deviceKeyList: string[];
	gatewayKey: string;
	tableData: {
		data: []
		total: number
		loading: boolean
		param: {
			pageNum: number
			pageSize: number
			productId: number
			status: string
			dateRange: string[]
		}
	},
	ruleForm: {
		productId: string|number
	},
	rules: {}


}
export default defineComponent({
	name: 'MutipleBindDialog',
	// components: { EditDic, EditAttr, EditFun, EditEvent, EditTab, devantd, ListDic, functionCom },

	setup(prop, { emit }) {
		console.log(prop)
		const route = useRoute()
		// const editDicRef = ref()
		const state = reactive<TableDataState>({
			gatewayKey: '',
			deviceKeyList: [],
			isShowDialog: false,
			productData: [],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					productId: 0,
					status: '',
					dateRange: [],
				},
			},
			ruleForm: {
				productId: ''
			},
			rules: {
				productId: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
			}
		})

		onMounted(() => {
			console.log('第一次加载')
			// getProductList()
		})

		const getDeviceList = () => {
			if(!state.ruleForm.productId) {
				state.tableData.data = [];
				state.tableData.total = 0;
				return;
			}

			state.tableData.loading = true;
			api.device.getSubList({
				"productId": state.ruleForm.productId,
				"pageSize": state.tableData.param.pageSize,
				"pageNum": state.tableData.param.pageNum
			}).then((res: any) => {
				console.log(res)
				state.tableData.data = res.device;
				state.tableData.total = res.Total;
			}).finally(() => (state.tableData.loading = false));

		};

		const getProductList = () => {
			api.product.getSubList().then((res: any) => {
				let productDataList = [{id: "", name: "全部"}].concat(res.product)
				state.productData = productDataList;
				state.ruleForm.productId = state.productData[0].id
				getDeviceList()
				state.isShowDialog = true;
			});
		};

		const openDialog = (gatewayKey: any) => {
			console.log('第二次加载')
			state.gatewayKey = gatewayKey;
			getProductList()
			// state.isShowDialog = true;
		};

		    // 多选框选中数据
		const handleSelectionChange = (selection: any[]) => {
			console.log(selection)
			console.log(typeof selection)
			// selection.forEach((item:any) => {
			//   console.log(item)
			//   state.deviceKeyList.push(item.key)
			// })
			state.deviceKeyList = selection.map((item) => item.key);
			console.log(state.deviceKeyList)
			console.log(typeof state.deviceKeyList)
		};

		const confirmBind = () => {
			let msg = '是否进行批量绑定？';
			if (state.deviceKeyList.length === 0) {
				ElMessage.error('请选择要批量绑定的数据。');
				return;
			}
				// return
			ElMessageBox.confirm(msg, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
			.then(() => {
				api.device.mutipleBind({
					"gatewayKey":state.gatewayKey,
					"subKeys": state.deviceKeyList
				}).then(() => {
					ElMessage.success('绑定成功');
					emit('bindSuccess')
					state.isShowDialog = false;
				});
			})
			.catch(() => { });
		};

		const handleChange = (productId: number) => {
			state.ruleForm.productId = productId;
			getDeviceList()
		}

		return {
			openDialog,
			getProductList,
			confirmBind,
			getDeviceList,
			handleSelectionChange,
			handleChange,
			...toRefs(state),
		}
	},
})
</script>

<style lang="scss" scoped>
.mutiple-bind-dialog-wrap {
	background: pink;
}

</style>


