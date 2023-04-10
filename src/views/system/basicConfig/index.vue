<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
        <el-form :model="state.tableData.param" label-position="top" ref="queryRef" :inline="true" label-width="100px">
			<div class="form-inner-wrap">
				<div class="left-wrap">
					<el-form-item label="系统名称" prop="keyWord">
						<el-input v-model="state.tableData.param.keyWord" placeholder="请输入系统名称" clearable size="default" />
					</el-form-item>
					<el-form-item label="主题色" prop="keyWord">
						<el-input v-model="state.tableData.param.keyWord" placeholder="请输入主题色" clearable size="default" />
					</el-form-item>
					<el-form-item label="高德API Key" prop="keyWord">
						<el-input v-model="state.tableData.param.keyWord" placeholder="请输入高德API Key" clearable size="default" />
					</el-form-item>
					<el-form-item label="base-path" prop="keyWord">
						<el-input v-model="state.tableData.param.keyWord" placeholder="请输入base-path" clearable size="default" />
					</el-form-item>
					<el-row>
						<el-col :span="12">
							<el-form-item label="系统logo" prop="keyWord">
								<uploadVue @set-img="setImg">
									<img  style="width:140px;height:140px" :src="state.info.avatar1" />
									<div class="tips">点击上方照片，即可更改头像</div>
								</uploadVue>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item label="浏览器页签" prop="keyWord">
								<uploadVue @set-img="setImg">
									<img  style="width:140px;height:140px" :src="state.info.avatar2" />
									<div class="tips">点击上方照片，即可更改头像</div>
								</uploadVue>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item>
						<el-button size="default" type="primary" class="ml10" @click="queryList">保存</el-button>
					</el-form-item>
				</div>
				<div class="right-wrap">
					<el-form-item label="登录背景图" prop="keyWord">
						<uploadVue @set-img="setImg">
							<img  style="width:140px;height:140px" :src="state.info.avatar3" />
							<div class="tips">点击上方照片，即可更改头像</div>
						</uploadVue>
					</el-form-item>
				</div>
			</div>
        </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, onMounted, ref, defineComponent, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/certificateManagement';
import uploadVue from '/@/components/upload-wrapper/index.vue';


const { proxy } = getCurrentInstance() as any;
const { network_certificate } = proxy.useDict('network_certificate');
console.log(network_certificate)

const addDicRef = ref();
const editDicRef = ref();
const detailRef = ref();
const previewRef = ref();
const editParamsRef = ref();
const buildConfigRef = ref();
const queryRef = ref();
const state = reactive({
	ids: [],
	info: {},
	tableData: {
		data: [],
		loading: false,
		param: {
			pageNum: 1,
			PageSize: 10,
            status: -1,
			keyWord: ""
		},
        total: 0
	},
});
// 初始化表格数据
const initBasicConfigInfo = () => {
	queryList();
};
const queryList = () => {
	state.tableData.loading = true
	api.certificateManagement.getList(state.tableData.param).then((res: any) => {
		console.log(res)
		state.tableData.data = res.Info || [];
		state.tableData.loading = false
		state.tableData.total = res.total
	});
};

const setImg = (img: string) => {
	console.log(img)
//   api.user.setAvatar(info.value.id, img).then((res: any) => {
//     ElMessage.success('更新成功')
//     info.value.avatar = img
//   })
}

// 页面加载时
onMounted(() => {
	initBasicConfigInfo();
});

</script>


<style scoped lang="scss">
:deep(.el-form) {
	width: 100%;
}
:deep(.form-inner-wrap) {
	width: 100%;
	display: flex;
	justify-content: space-between;
	.left-wrap,
	.right-wrap {
		width: 100%;
	}

}
</style>
