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
						<el-button size="default" type="primary" class="ml10" @click="onOpenAdd">
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
												src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABYCAYAAABxlTA0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA6MSURBVHgB7ZxrbBzVFcfPfczsw/Y6NnYSuziBPIAQigsFCQJIfIAWqZ/KK6USVSslIDWqSgsfWrUqgs9NaVGpSqGR2kptQ/r4QlsQUhEUUqRAo1CiQF4lMSQhCYl3vfbuztx7T8+d9WzWjjfZXc/sbh5/ad/zsH975vzPPXd2AC7qos5lMThH9NDb6OS2TT0IiLcD8h/8cUN6DM4BdTxgC3Zi++Qq9PAKzvgjiHALl/h1zfgeJ5na8buvsUnoYHU04AeeLV3FjPc5QHYcQO0H5g4gM72CsfeMhmEQbJlh8HEng+5IwA88l19k0NzIjWAc5D7G1Mm5ljPaTwmZGPGMuoQLtvcP67vfhQ5TRwH+6i+wT4vJGwXwXoZiZy2ws2VBA8hlmmMGmN6x+eEF+6BD1BGAAwPbMTUqFF6hfb5POngQmpAFzaQ7qgxlaMHepIj+BNqstgKuNjDBxWFt4KCUqGCe6qT83DbAa58dXy6MuDE0MC6cAkQs5rMl2oEl7QTdcsCBgRkY5cgSZzKwqFSdn9thhC0D3KyBRaV2GWHsgKsNDAw/wDjuhzaK+7pHOXJUo9atMMLYAMdlYFGpVUYYC+DAwFCMcmBTxqjdcRhYVIrbCCMF3GoDi0pxGmEkgB/8LXZ5hclb2mVgUSkOI5wX4E4zsKiEKPuQ6dXWCIXRr/7+mwuaDpimAIcGxhRezUCMdZqBRaUojLBhwKGBIRU8zPg7O9nAohIatgw5DDcDum7A56qBRaUZ+VmXdm3eMLCrnvXOCrjawFCbD4Rgx+ACVqNGWBPwbAM7X/Nss6o2Qjfd/XKttMFrbSD31tSHrAi/0or/y1YHF+HOlE2RHPANofm1amIq/8DPi3fOtVxNwJzDYdrMOGf6Jno5BBc1Q4zzJIXxNYi4hB6PolPKzbWcrLkFjk8LBq8YzYcNsOWg9XKaIKNBBL+gzG22LFjKCiuMMpd5BnMUor/hCC8CJI7Ptbw82wa5gEOUcQ4Z4MPI2GowWABm9l9ooJVi0pGwVGm9UmmcAoa7KXWW0ybWrhXOCjhUBTRS8c3FBQM6BMuEWVlUFizsr4CtQ3UDDnUaaGQn6L39aEwROkRHDpublTIjXLLs8JB4GZrQfMGGahhwqApog8OasRsY8raDPnZMjRTy8BSZzmoaebGSwMwHn+IYl7BxZa98oZ5thGAFx1U+w6LW2BTYUE0DDtUJoC3YYoGtQ4XrbTpUSXtjdHAFuXGEavgn92T1pSt7xU9qbcOCZTZiGV7lGyzR2vuMpsd59hvnDThUCJopWKIZtAw0R/7E8KCz3j6fmDRwyDegEHJUPmXprZHpxTIE+bG9OTO2IsO3VK9vwQqultCsy5XaoE+A9xvAEkQkDhEL7Ukj2nuHDtMi/cE3IPKrg5oxBrmCP+EIWM85A3vr7RGwqt+BAYpeGgmU4SKGZ2HmyP2fPF7QGfvCgkWjl1EquJO+EEoH6ogBs19HCNcqcsDBRqnDFvSGYwTtSpFhCOvn+my4S2b63Ol/LQRNUUy33pOlYJ0h4OZ2iuqrLFhKK7son2QhBkWWIuZSuZWJ+1H7h9E2SABuo/7xx1GkDm7YagQMnk/mDfz3rSI4LsCq65OQ7ubwGbrlxw1QxqjIocBOCriXjGun4foT4AQV451YjyWCT9sJgaa5rp1g1Bt0WDKt9W328JxPRBO6JeHzd98qwKEDPhzY48Prf5uEKQIuyJ0Wp8r/ngXbRaGUkAx8hKXjSk3EFbGz1RLAlZ1Vg0ae0r66oVnQFLsVQBMnTKUPYOG+/dpU8LyPwjUEq2mFEt0Fjx5fAS1SSwFXdhqCBv1Os6AZl1vD5z39PFP9WfakgRLlBk0zBCmCG4Jth9oCuLLzOUBDnZ07T+kcHfkB5BWrE8F7ToJB/yIBfQsF+StNalGaSIhZORYxzznmoUVqK+BQ1aCpuO832twKdYHmG+39wJCEK6936ZHAkpPmczovnTJYMXukwFi+P8W2Q4vUEYBDNQq6oL33lTHv2VRw1WgCFo9I6O5lcOW1ie4Q8GwlhXkaWqhYy7RmNT1TvdNolaKiYxkd18u54PtokDB50oN1hO7LDsOhLoePLU6zwRDl0pVucKvWlConX0oX21MObOpP8JZFr1VbAP9vwtzsabgfjOmlmvilWo2YEHRW86WTk/qHacG/+Bkqc8ep1rLckoJdeaYq1tbARY3bu1xGYLGlYEO1FHAAVuGj9PQa+9o2Y2g0ddf7J9SjvSl5z1AKPpqxgqZhrZTruDIPCRqJMbTGxaFEKYHgQl/iVIbL5yn5Uk8xScNkSZUD1XHb857etDDdHrChWgI4V2I3Tyr9KNo5rPKQdaYYy2SL+hWypDurIbuO8wqhGnGTHC6h1x7VWseK5aHZ4tSp2FUUziepNKOOnmV8pGcBfCvRxQ+7DrRdsQNOCP7UYArWDk7v6kRRw5HCzCEsqdfeZQvqzw6wOwdSIicZu9/CpS/l1LYkpz4DA2qAg8NtxVX+7NNPdRkuiYbLmyxc6BDFWkVYSHSorq1+r59GVysyMgB0mqgxY5sxpckC9cbgKyFA5RPEI7qyWJJSAJsuv3I5A0WKakM5pETwdTfrGLhWsUYw1aBzdrtcyp8W8u6sOn2E5cP64+Pi8lQSb3LoW7CNnH/+NQ8+DRxsE+fWL6Uh3VX+dmzNe5J6wD6BNQTdbsrXbCXFdlvzbrXiroNX2zsL6aXNOfjLr7NBY8bKQl6UOrV7TpMyiTxCYsJQc5zdHUZolg5/C9fK9hm2vXrqXMMTHkVvmqK2bGrB6Iya5Z9XnnbRdMaPLFtickc/8nNTeQzMbe9OL3jv2ptSMJgSME75OKmDNiK4fQISVBlYc7INdKsQrhUVEGPFKTNy9JCChcM0qKCe7wmvnDqo69htHwlwmnN6qU2SzE8LKXxar02diNgjGIOKwAshMbBdr5yFbMHZHLuiT8KlAxIGBxzozQhIJlgFrtXwUoeMq/yaojJonp88Vp6DPK3PMC1OUDHBi1JaIzQJStgC2qR4ATP2D/vQPyjLpRkGJVqGS5w4uNebXuSUYc0lC3fFatce76ddgMPydeyXQQ0cup8obw/2BI8UyjRS8ZjDS6CVMDaidetBxwqYJj5fso+D1IwZWCzsIQ5CBic093glnAFWUzQXqPw6QRXBuIdbqcH4HaL6nP3MzlIsW+0G0SsofSyZNRymDXXTMdJDU0j5HhdnTGqGoClL+NJo14K2U/rQIsWag4tG/TvJ+VaDuOamO9K5116chImsydiMOLD41K53jfs5SqWVAUhvUjxCfdyPXMkyVBvcRcuPjFLOvvq6JCVXmnyabuTYCsQ3lfR6JOPC93ucGjWwEBoEFBiSJZYomrE1+TlWwKVCyWGu+4wj+Ro61DNrvtAFxw8ryPSLbN+ACAYXNnJDuBTRY1Q7bwxHc7bnS921ex3G/mQh236vqcKR94MXR8jrNi3qgr/X8zdROlbggOJKO60wwlgAY6koUAnXoSGucfjr1ED4ER2qT3b1MOjqCQ7v3nDZ7LQBUs28uS+Bjw+k+IzTQKltOebTRCVlhp8SnpvD9ymb5KeU2jTSw+o6Y2e2AiPkoCSBNmSEBN6nXK4hYkUK2I7AHJAJRwrGE9rzRVLZkPMMPu/SMNdCrl7eRu/JEm6mlLDxtEZPlSzkEsA95HdraHO3GM6mlO+9kUmwCZiHKkZoc7JSBJo5NF3qSxEd6EgAK8/+gZ6bAEca1/gi5fqecmYccp4yz9Ph/rIEto4FJy7D2HhJv3BpN99a7348xK2+goPIlQs8Op+qGKHWggdGSKle8lIUaWNegC1YXvIczblDTRbfTckpTwF6NU6Vs5HoAT4evu52O2pCZaYRqmjyc9OArYFRh8XlaWZ6EmcGe65pthFSp04xLlQzoBsGXG1gzHGKzKA+X8DOVmiEfNoIKYM0nJ/rBlzLwM53VRuhtEaoGzPCswIO82yC0mwtA7sQ1KwR1nQZ1Ox7ysefaV+lqZnN3F45xR3Xs7kWLmRZI3R4gTmUl+2wWwl7sdIfozp1rly1zhTBg1QJ9ad7zy8Di0rWCNEFiujg57KLsAbKmoCNwDuo9TRa8vTlXDqHOulHLp0gLflEskhjP2F2E+27tZnYNtdyZ6zW73vmaDfjyVGJbNie+EFvtX2+iwYalyLXLrRJ1F8uci4VMRmhjrZPk7c7tmzoPlJr+bqGQ50Eul2ALVgyuYKLfJlijBrUfMfmh5NnveRMQ+PN+57JL3YEX0NDMtGun9W2GjDV+Z4SifE094epgBjSzOwy/R/u2nL/NV5d60MTWvtscblAM0pzEdlW/2SrVYA5R6WRT7iIfZqxIZoe2NMI2FDz6pi0A3TcgGny1BCWbMLgJVT4jvjMHMBLDm5rFGyoebekbH7mIk2gcRUKeZhm0A/GCTouwCHYJPC0NuZyqgxyfkFv2/Ld3hMwD0XW86s2QmPMQenIpi6yfDbFATgsuUCypfVUBo0o8sm/uCuOKAFXl1y2MqAJ0a1RgQ0V2+zqfc9n+x3fXoDZXq4wOtBRAK6UXCCHEHFQG71j84aeuq4i1ahin76uGCGixyXfOd/8PB/AYcmVRG/hfCqDhvYJLVJUFUczgKtLLmrMLFVS7zELxnbECTZUy0+QW/vL/KgAvrxZ0I0AnrMyMFNvbtmwsGU/42rLGYjVRsgYHqLpmLovKloP4ApYKmQN8MuirgwaUVtP8Wym4jgb4OqSK67KoBF1xDm0FrTD07fUU3HUAhxUBsDzCc4vN8gXxFkZNKKOAByquuJQWu92HHHaiSWzAVuwhidztjKgsB1ptBkTtzoKcKgzVRwh4OqSK6gMqLvXSWBDdSTgUGufm1gltFhVAe37rs/YdZ7A/3Sj7KP8utxHPIxQ2NbKyqARdTRgq6CZ5HStEoaaSZo9Rm99ltLCt7lgH7SrMmhEHQ84lAUtWfc3KD9f7QM+0elgL+qizg/9HxoamjcDhp6uAAAAAElFTkSuQmCC"
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
	components: { EditDic },

	setup() {
		const addDicRef = ref();
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
