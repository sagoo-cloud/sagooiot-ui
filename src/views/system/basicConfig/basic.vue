<template>
	<el-form :model="state.tableData.param" label-position="top" ref="queryRef" :inline="true" label-width="100px">
		<div class="form-inner-wrap">
			<div class="left-wrap">
				<el-form-item label="系统名称" prop="keyWord">
					<el-input v-model="state.info.name" placeholder="请输入系统名称" clearable size="default" />
				</el-form-item>
				<el-form-item label="系统版权" prop="keyWord">
					<el-input v-model="state.info.copyright" placeholder="请输入系统版权" clearable size="default" />
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="系统LOGO" prop="keyWord">
							<uploadVue accept=".jpg,.png,.jpeg,.gif,.svg" :name="'logo'" @set-img="setImg">
								<el-image style="width: 100%;" :src="state.info.logo" />
								<!-- <div class="tips">点击上方照片，即可更改头像</div> -->
							</uploadVue>
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="系统LOGO（小图标）" prop="keyWord">
							<uploadVue accept=".jpg,.png,.jpeg,.gif,.svg" :name="'mini'" @set-img="setImg">
								<el-image style="width: 100%;" :src="state.info.mini" />
								<!-- <div class="tips">点击上方照片，即可更改头像</div> -->
							</uploadVue>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item>
					<el-button v-auth="'save'" size="default" type="primary" class="ml10" @click="setDetails">保存</el-button>
				</el-form-item>
			</div>
			<div class="right-wrap">
				<el-form-item label="登录展示图" prop="keyWord">
					<uploadVue accept=".jpg,.png,.jpeg,.gif,.svg" :name="'pic'" @set-img="setImg">
						<el-image style="width: 100%;" :src="state.info.pic" fit="contain" />
					</uploadVue>
				</el-form-item>
			</div>
		</div>
	</el-form>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import api from '/@/api/system';
import uploadVue from '/@/components/upload-wrapper/index.vue';


const queryRef = ref();
const state = reactive({
	ids: [],
	info: {
		name: "",
		copyright: "",
		accesskey: "",
		secretkey: "",
		logo: "",
		mini: "",
		pic: ""
	},
	data: [],
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
	queryBasicConfigInfo();
};
const queryBasicConfigInfo = () => {
	state.tableData.loading = true
	api.basicConfig.getDetails({ types: 0 }).then((res: any) => {
		state.data = res.data;
		res.data.forEach((element: any) => {
			if (element.configName == '系统名称') {
				state.info.name = element.configValue
			} else if (element.configName == '系统版权') {
				state.info.copyright = element.configValue
			} else if (element.configName == '系统LOGO') {
				state.info.logo = element.configValue
			} else if (element.configName == '系统LOGO（小图标）') {
				state.info.mini = element.configValue
			} else if (element.configName == '登录展示图') {
				state.info.pic = element.configValue
			}
		});
	});
};

const setDetails = () => {
	if (!state.info.name) {
		ElMessage.error('请填写系统名称');
		return;
	}
	if (!state.info.copyright) {
		ElMessage.error('请填写系统版权');
		return;
	}
	if (!state.info.logo) {
		ElMessage.error('请上传系统LOGO');
		return;
	}

	if (!state.info.mini) {
		ElMessage.error('请上传LOGO（小图标）');
		return;
	} if (!state.info.pic) {
		ElMessage.error('请上传登录展示图');
		return;
	}
	state.data.forEach((element: object) => {
		if (element.configName == '系统名称') {
			element.configValue = state.info.name
		} else if (element.configName == '系统版权') {
			element.configValue = state.info.copyright
		} else if (element.configName == '系统LOGO') {
			element.configValue = state.info.logo
		} else if (element.configName == '系统LOGO（小图标）') {
			element.configValue = state.info.mini
		} else if (element.configName == '登录展示图') {
			element.configValue = state.info.pic
		}
	})
	api.basicConfig.setDetails({ ConfigInfo: state.data }).then(() => {
		ElMessage.success('设置成功');

	});
};

const setImg = (img: string, name: string) => {
	state.info[name] = img;
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
