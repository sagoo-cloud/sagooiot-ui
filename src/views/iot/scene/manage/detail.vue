<template>
	<el-card class="system-dic-container" style="position: relative;">
		<div class="content">
			<div class="flex cont_box">
				<div class="font26">场景名称：{{ detail.name }}</div>
				<div class="pro-status"><span :class="detail.status == 1 ? 'on' : 'off'"></span>{{ detail.status == 1
					? '启用' : '未启用' }}</div>
			</div>
			<div class="flex">
				<div class="desc">场景描述：{{ detail.description }}</div>
				<div class="edit" @click="addOrEdit(detail)"><el-link type="primary"> <el-icon>
							<EditPen color="#409eff" />
						</el-icon>修改</el-link></div>
			</div>
		</div>
	</el-card>
	<el-card style="  margin-top: 15px;" v-if="detail.sceneType==='device'">
		<div class="font20">场景定义</div>
		<SceneItem v-if="showstatus && sourceData.length>0" :sceneList="sceneList" :sourceData="sourceData" :sceneType="detail.sceneType" @addScenesDetail="addScenesDetail"
			@delScenesDetail="delScenesDetail" @editScenesDetail="editScenesDetail"></SceneItem>
	</el-card>
	<el-card style="  margin-top: 15px;" v-if="detail.sceneType==='timer'">
		<el-form-item label="定时触发">
          <div style="display:flex">
            <el-input v-model="timerData.timer" placeholder="请输入cron表达式" />
            <el-dialog v-model="dialogVisible" title="选择Cron规则" width="60%">
              <vue3cron @handlelisten="handlelisten"  @close="cronclose"></vue3cron>
            </el-dialog>
            <el-button type="success" @click="showCron()" style="margin-left: 5px;">设置</el-button>

          </div>
        </el-form-item>
	</el-card>
	<el-card style="  margin-top: 15px;">
		<div class="font20">场景动作</div>
		<ActionItem v-if="detail.id" :scene_id="detail.id"  :sourceData="sourceData"></ActionItem>
	</el-card>

	<EditForm ref="editFormRef" @getList="getDetail()"></EditForm>
</template>
<script lang="ts">
import { toRefs, reactive, ref, defineComponent,onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { EditPen, DocumentAdd } from '@element-plus/icons-vue';
import ActionItem from './component/actionItem.vue';
import SceneItem from './component/sceneItem.vue';
import EditForm from './edit.vue';
import api from '/@/api/scene';
import product from '/@/api/device';
import vue3cron from '/@/components/vue3cron/vue3cron.vue';
import { stat } from 'fs';


const editFormRef = ref();
//原始
const sceneList = {
	'productKey': '',
	'deviceKey': '',
	'triggerType': '',
	'timer': '',
	'triggerSwitch': false,
	'condition': [[{
		'parameter': '',
		'operator': '',
		'value': ''

	}]]
};
const originalSceneList = ref([{
	id: 0
}]);
export default defineComponent({
	components: { EditPen, EditForm, DocumentAdd, SceneItem, ActionItem,vue3cron},
	setup(props, context) {
		const route = useRoute();
		const router = useRouter();
		const state = reactive({
			timer:'',
			timer_id:0,
			dialogVisible:false,
			developer_status: 2,
			showstatus: false,
			sourceData: [],
			timerData: {
					triggerType:'timer',
					timer:'',
				},
			detail: {
				id: '',
				name: '',
				status: 0,
				description: '',
				sceneType: ''
			},
			actionList: [{
				'seriallist': [{

				}],
				'parallellist': [{

				}]
			}],
			sceneList: [{
				'productKey': '',
				'deviceKey': '',
				'triggerType': '',
				'timer': '',
				'triggerSwitch': false,
				'condition': [[{
					'parameter': '',
					'operator': '',
					'value': ''

				}]]
			}],

		});

		const handlelisten = (e: any) => {
			state.timerData.timer=e.cron
			api.manage.editDetail({ id: state.timer_id, bodyjson: state.timerData })
		};
		const showCron = () => {
			state.dialogVisible = true;
		};
		const cronclose = () => {
			state.dialogVisible = false;
		}
		const activeName = ref('first')
		const getDetail = () => {
			const id = route.params && route.params.id;
			api.manage.getDetail({ "id": id }).then((res: any) => {
				state.detail = res
				getOneDetail();

			})
		};
		const getProductList = () => {
			product.product.getSubList().then((res: any) => {
				state.sourceData = res.product;
			});
		};

		const getOneDetail = () => {

			const id = route.params && route.params.id;
			if(state.detail.sceneType==='device'){
				api.manage.getOneDetail({ "sceneId": id, 'group': 'definition' }).then((res: any) => {
					if (!res) {
						addScenesDetail('definition');
						// getOneDetail();
					}
					originalSceneList.value = res;
					const scenes = res.map((scene: any) => {
						const parsedBodyJson = JSON.parse(scene.bodyjson);
						return {
							...parsedBodyJson
						};
					});
					getProductList();
					state.sceneList = scenes;
					state.showstatus = true;
				})
			}
			//定时触发
			if(state.detail.sceneType=='timer'){
				api.manage.getOneDetail({ "sceneId": id, 'group': 'timer' }).then((res: any) => {
					if (!res) {
						let data = {
							sceneId: id,
							group: 'timer',
							bodyjson:state.timerData,
						}
						api.manage.addDetail(data).then((res: any) => {
							getOneDetail();
						});
					}
					state.timer_id=res[0].id
					state.timerData=JSON.parse(res[0].bodyjson);

				})
			}




		};
		//新增一条场景定义
		const addScenesDetail = (type: String) => {
			let data = {
				sceneId: route.params && route.params.id,
				group: type,
				bodyjson: sceneList,
			}
			api.manage.addDetail(data).then((res: any) => {
				getOneDetail();
			});
		}

		//删除一条场景
		const delScenesDetail = (index: number) => {
			let ids = originalSceneList.value[index].id;
			api.manage.delDetail(ids).then((res: any) => {
				// getOneDetail();
			});
		}
		//修改一条场景
		const editScenesDetail = (index: number) => {
			let saveData = state.sceneList[index];
			let ids = originalSceneList.value[index].id;
			api.manage.editDetail({ id: ids, bodyjson: saveData }).then((res: any) => {
				getOneDetail();
			});

		}
		const addOrEdit = async (row?: any) => {
			editFormRef.value.open(row);
		};


		onMounted(() => {
			getDetail();
		});
		return {
			cronclose,
			showCron,
			handlelisten,
			addOrEdit,
			delScenesDetail,
			addScenesDetail,
			editScenesDetail,
			editFormRef,
			activeName,
			getDetail,
			...toRefs(props),
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.desc {
	margin-top: 15px;
}

.edit {
	line-height: 40px;
	margin-top: 15px;
	margin-left: 30px;
}

.cont_box .pro-status {
	line-height: 40px;
	margin-left: 30px;
	margin-top: 5px;

	.on {
		background: #52c41a;
	}

	.off {
		background: #c41a1a;
	}

	span {
		position: relative;
		top: -1px;
		display: inline-block;
		width: 6px;
		height: 6px;
		vertical-align: middle;
		border-radius: 50%;
		margin-right: 5px;
	}
}
</style>
