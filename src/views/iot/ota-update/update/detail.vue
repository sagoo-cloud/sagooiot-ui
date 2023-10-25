<template>
	<div>
    <el-card class="system-dic-container" style="position: relative">
      <div class="content">
        <div class="flex cont_box">
          <div class="font26">升级包名称：{{detail.name}}</div>
          <div class="pro-status"><span :class="detail.checkres == 1 ? 'on' : 'off'"></span>{{ detail.checkres == 1 ? '已验证' : '未验证' }}</div>
        </div>
        <div class="mt20"></div>
        <div class="container">
          <div class="item">升级包类型：{{detail.typo==1?'整包':'差分'}}</div>
          <div class="item">升级包签名：d52b637c5eaf2bc9c24008bc4b723600</div>
        </div>
        <div class="container">
          <div class="item">签名算法：{{detail.are}}</div>
          <div class="item">模块名称：{{detail.moduleName}}</div>
        </div>

        <!-- <div class="mt20"></div>
        <div class="status_list">
          <div class="otaflex">
            <div class="otaflex_div1">
                <div class="otaflex_div2">
                  <span class="title">目标设备总数</span>
                  <div class="count otaflex_div3">0</div>
                </div>
              </div>
              <div class="otaflex_div1">
                <div class="otaflex_div2">
                  <span class="title"><span class="on"></span>目标成功数</span>
                  <div class="count otaflex_div3">0</div>
                </div>

              </div>
              <div class="otaflex_div1">
                <div class="otaflex_div2">
                  <span class="title"><span class="off"></span>目标失败数</span>
                  <div class="count otaflex_div3">0</div>
                </div>
              </div>
              <div class="otaflex_div1">
                <div class="otaflex_div2">
                  <span class="title"><span class="ofn"></span>目标取消数</span>
                  <div class="count otaflex_div3">0</div>
                </div>

              </div>
          </div>
        </div> -->
      </div>
    </el-card>
	  <div class="mt10"></div>
    <el-card class="system-dic-container" style="position: relative">
      <el-tabs v-model="activeTab">
          <el-tab-pane label="批次管理" name="tab1">
            <BatchList v-if="detail.id" :detail="detail" />
          </el-tab-pane>
          <el-tab-pane label="设备列表" name="tab2">
            <DeviceList v-if="detail.id" :detail="detail" />
          </el-tab-pane>
          <el-tab-pane label="升级包信息" name="tab3">
            <InfoList v-if="detail.id" :detail="detail" />
          </el-tab-pane>
        </el-tabs>
    </el-card>
  </div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'
import { EditPen, DocumentAdd } from '@element-plus/icons-vue'
// import EditForm from './edit.vue'
import EditForm from '/@/views/iot/ota-update/update/component/edit.vue';
import InfoList from './component/info.vue'
import DeviceList from './component/device.vue'
import BatchList from './component/batch.vue'
import api from '/@/api/ota'

const editFormRef = ref()

export default defineComponent({
	components: { EditPen, EditForm, DocumentAdd, InfoList, DeviceList, BatchList},
	setup(props) {
		const route = useRoute()
		const state = reactive({
			activeTab:'tab1',
			developer_status: 2,
			detail: {
				id: '',
				name: '',
				typo: 1,
				are: '',
				moduleName: '',
				checkres: 0,
        productId: 0,
			},
			
		})
		const getDetail = () => {
      const id = route.params && route.params.id
			api.manage.detail(Number(id)).then((res: any) => {
				state.detail = res
			})
		}
		const addOrEdit = async (row?: any) => {
			editFormRef.value.open(row)
		}

		onMounted(() => {
			getDetail()
		})
		const handleClick = (tab: TabsPaneContext, event: Event) => {
			// console.log(tab, event)
		}

		return {
			addOrEdit,
			editFormRef,
			getDetail,
			handleClick,
			...toRefs(props),
			...toRefs(state),
		}
	},
})
</script>

<style scoped lang="scss">
.status_list{
	width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
	padding: 10px;
	.otaflex{
		font-size: 12px;
		display: flex;
		align-items: center;
		margin-left: -6px;
		.otaflex_div1{
			padding: 0 24px;
			min-width: 200px;
			width: fit-content;
			.otaflex_div2 {
				align-items: center;
				.title{
					color: #666;
					font-size: 14px;
				}
				span {
					display: block;
					border-radius: 50%;
					.on {
						background: #52c41a;
					}

					.off {
						background: #c41a1a;
					}
					.ofn {
						background: rgb(255, 138, 0);
					}

					span {
						position: relative;
						top: -1px;
						display: inline-block;
						width:10px;
						height: 10px;
						vertical-align: middle;
						border-radius: 50%;
						margin-right: 5px;
					}

				}
				.otaflex_div3{
					font-size: 24px;
					margin-top: 10px;
					color: #373d41;
				}
			}
	
	
		}
		
	}
}
.container {
	display: flex;
	padding: 10px;
}

.item {
	flex: 1;
}
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
