<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
        <el-form :model="state.tableData.param" label-position="top" ref="queryRef" :inline="true" label-width="100px">
			<div class="form-inner-wrap">
				<div class="left-wrap">
					<el-form-item label="系统名称" prop="keyWord">
						<el-input v-model="state.info.name" placeholder="请输入系统名称" clearable size="default" />
					</el-form-item>
					<el-form-item label="系统版权" prop="keyWord">
						<el-input v-model="state.info.copyright" placeholder="请输入主题色" clearable size="default" />
					</el-form-item>
					<el-form-item label="开放接口AK" prop="keyWord">
						<el-input v-model="state.info.accesskey" placeholder="请输入高德API Key" clearable size="default" />
					</el-form-item>
					<el-form-item label="开放接口SK" prop="keyWord">
						<el-input v-model="state.info.secretkey" placeholder="请输入base-path" clearable size="default" />
					</el-form-item>
					<el-row>
						<el-col :span="12">
							<el-form-item label="系统LOGO" prop="keyWord">
								<uploadVue accept=".jpg,.png,.jpeg,.gif,.svg" :name="'logo'" @set-img="setImg">
									<img  style="width: 100%;" :src="state.info.logo" />
									<!-- <div class="tips">点击上方照片，即可更改头像</div> -->
								</uploadVue>
							</el-form-item>
						</el-col>

						<el-col :span="12">
							<el-form-item label="系统LOGO（小图标）" prop="keyWord">
								<uploadVue accept=".jpg,.png,.jpeg,.gif,.svg" :name="'mini'" @set-img="setImg">
									<img  style="width: 100%;" :src="state.info.mini" />
									<!-- <div class="tips">点击上方照片，即可更改头像</div> -->
								</uploadVue>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item>
						<el-button v-auth="'save'"  size="default" type="primary" class="ml10" @click="setDetails">保存</el-button>
					</el-form-item>
				</div>
				<div class="right-wrap">
					<el-form-item label="登录展示图" prop="keyWord">
						<uploadVue accept=".jpg,.png,.jpeg,.gif,.svg" :name="'pic'" @set-img="setImg">
							<img  style="width: 100%;" :src="state.info.pic" />
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
import api from '/@/api/system';
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
	api.basicConfig.getDetails().then((res: any) => {
		// console.log(res)
		state.data = res.data;
		res.data.forEach((element: object) => {
			if(element.configName == '系统名称') {
				state.info.name = element.configValue
			}else if(element.configName == '系统版权') {
				state.info.copyright = element.configValue
			}else if(element.configName == '开放接口AK') {
				state.info.accesskey = element.configValue
			}else if(element.configName == '开放接口SK') {
				state.info.secretkey = element.configValue
			}else if(element.configName == '系统LOGO') {
				state.info.logo = element.configValue
			}else if(element.configName == '系统LOGO（小图标）') {
				state.info.mini = element.configValue
			}else if(element.configName == '登录展示图') {
				state.info.pic = element.configValue
			}
		});
		// console.log(state.info)
	});
};

const setDetails = () => {
	if(!state.info.name) {
		ElMessage.error('请填写系统名称');
		return;
	}
	if(!state.info.copyright) {
		ElMessage.error('请填写系统版权');
		return;
	}
	if(!state.info.accesskey) {
		ElMessage.error('请填写开放接口AK');
		return;
	}
	if(!state.info.secretkey) {
		ElMessage.error('请填写开放接口SK');
		return;
	}
	if(!state.info.logo) {
		ElMessage.error('请上传系统LOGO');
		return;
	}

	if(!state.info.mini) {
		ElMessage.error('请上传LOGO（小图标）');
		return;
	}if(!state.info.pic) {
		ElMessage.error('请上传登录展示图');
		return;
	}
	state.data.forEach((element: object) => {
		if(element.configName == '系统名称') {
			element.configValue = state.info.name
		}else if(element.configName == '系统版权') {
			element.configValue = state.info.copyright
		}else if(element.configName == '开放接口AK') {
			element.configValue = state.info.accesskey
		}else if(element.configName == '开放接口SK') {
			element.configValue = state.info.secretkey
		}else if(element.configName == '系统LOGO') {
			element.configValue = state.info.logo
		}else if(element.configName == '系统LOGO（小图标）') {
			element.configValue = state.info.mini
		}else if(element.configName == '登录展示图') {
			element.configValue = state.info.pic
		}
	})
	// console.log(state.data)
	api.basicConfig.setDetails({ ConfigInfo: state.data}).then((res: any) => {
		console.log(res)
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
