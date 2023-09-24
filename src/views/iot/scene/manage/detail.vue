<template>
	<el-card class="system-dic-container" style="position: relative;">
		<div class="content">
			<div class="flex cont_box">
				<div class="font26">场景名称：店里车间场景</div>
				<div class="pro-status"><span :class="developer_status == 2 ? 'on' : 'off'"></span>{{ developer_status == 2
					? '启用' : '禁用' }}</div>
			</div>

			<div class="flex">
				<div class="desc">场景描述：这个组队电力车间整个场景进行模拟计算</div>
				<div class="edit" @click="addOrEdit({})"><el-link type="primary"> <el-icon>
							<EditPen color="#409eff" />
						</el-icon>修改</el-link></div>
			</div>

		</div>

	</el-card>
	<el-card style="  margin-top: 15px;" >
		<SceneItem :sceneList="sceneList"></SceneItem>
	</el-card>
	
	<EditForm ref="editFormRef" @getList="getDetail()"></EditForm>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import type { TabsPaneContext } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import { EditPen, DocumentAdd } from '@element-plus/icons-vue';
import SceneItem from './component/sceneItem.vue';
import EditForm from './edit.vue';
import api from '/@/api/network';

const editFormRef = ref();
const sceneList = [{
	'product_key': '',
	'device_key': '',
	'type': '',
	'where': false,
	'condition': [{
		'list': [{
			'param': '',
			'operator': '',
			'value': ''
		}]
	}]
}];


export default defineComponent({
	components: { EditPen, EditForm, DocumentAdd, SceneItem },
	setup(props, context) {
		const route = useRoute();
		const router = useRouter();
		const state = reactive({
			developer_status: 2,
			detail: {},
			sceneList: [{
				'product_key': '',
				'device_key': '',
				'type': '',
				'action': [{}],
				'where': false,
				'condition': [{
					'list': [{
						'param': '',
						'operator': '',
						'value': ''
					}]
				}]
			}],

		});
		const activeName = ref('first')
		const getDetail = () => {
			const id = route.params && route.params.id;
			api.server.getDetail({ "id": id }).then((res: any) => {
				state.detail = res
			})
		};
		const addOrEdit = async (row?: any) => {
			editFormRef.value.open(row);
		};

		const freshData = () => {
			getDetail()
			ElMessage.success('刷新成功');
		};
		const toEdit = () => {
			router.push(`/iotmanager/network/server/edit/${route.params && route.params.id}`)
		};
		onMounted(() => {
			// getDetail()
		});
		const handleClick = (tab: TabsPaneContext, event: Event) => {
			// console.log(tab, event)
		}



		return {
			toEdit,
			addOrEdit,

			editFormRef,
			activeName,
			freshData,
			getDetail,
			handleClick,
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
