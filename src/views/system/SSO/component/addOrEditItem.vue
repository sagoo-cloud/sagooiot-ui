<!-- 添加或者编辑单点登录应用 -->
<template>
	<el-dialog :title="ruleForm.id ? '修改单点登录' : '添加单点登录'" v-model="dialogVisible" width="600px" :before-close="closeDialog" :close-on-click-modal="false">
		<el-form ref="formRef" :rules="formRules" :model="ruleForm" label-position="right" label-width="120px" style="width: 90%; margin: 0 auto">
      <el-form-item label="图标" prop="img">
        <uploadVue :img="ruleForm.img" @set-img="handleAvatarSuccess"></uploadVue>
			</el-form-item>
      <el-form-item label="名称" prop="name">
        <el-select  class="width100" v-model="ruleForm.name" filterable clearable placeholder="请选择名称" @change="seletChange">
          <el-option v-for="item in oauth_name_list" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> 
      </el-form-item>
			<el-form-item label="Client Secret" prop="clientSecret">
				<el-input v-model="ruleForm.clientSecret" placeholder="请输入Client Secret" />
			</el-form-item>
      <el-form-item label="Client Id" prop="clientId">
				<el-input v-model="ruleForm.clientId" placeholder="请输入Client Id" />
			</el-form-item>
      <el-form-item label="回调地址" prop="redirectUrl">
				<el-input v-model="ruleForm.redirectUrl" placeholder="请输入回调地址" />
			</el-form-item>
      <el-form-item label="授权url" prop="codeUrl">
				<el-input v-model="ruleForm.codeUrl" placeholder="请输入授权url" />
			</el-form-item>
      <el-form-item label="获取token的url" prop="oauthUrl">
				<el-input v-model="ruleForm.oauthUrl" placeholder="请输入获取token的url" />
			</el-form-item>
			<el-form-item label="默认角色" prop="defRole">
				<el-select class="width100" v-model="ruleForm.defRole" filterable clearable placeholder="请选择默认角色">
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
			</el-form-item>
      <el-form-item label="默认岗位" prop="defPost">
				<el-select class="width100" v-model="ruleForm.defPost" filterable clearable placeholder="请选择默认岗位">
          <el-option v-for="item in postList" :key="item.postId" :label="item.postName" :value="item.postId" />
        </el-select>
			</el-form-item>
      <el-form-item label="默认部门" prop="defDept">
				<el-select class="width100" v-model="ruleForm.defDept" filterable clearable placeholder="默认部门">
          <el-option v-for="item in deptList" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
        </el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="closeDialog()"> 取 消 </el-button>
			<el-button :loading="btnLoading" type="primary" @click="submitData"> 保 存 </el-button>
		</template>
	</el-dialog>
</template>
<script lang="ts" setup>
import { computed, ref, getCurrentInstance, defineAsyncComponent, onMounted } from 'vue';
import { ElMessage, UploadProps } from 'element-plus';
import api from '/@/api/system';
import apiSystem from '/@/api/SSO';

const { proxy } = getCurrentInstance() as any;
const uploadVue =  defineAsyncComponent(() => import('/@/components/upload/index.vue'));
const { oauth_name_list } = proxy.useDict('oauth_name_list');
const dialogVisible = ref(false);
const btnLoading = ref(false);
const formRef = ref();
const roleList= ref([]);
const postList= ref([]);
const deptList = ref([]);
const ruleForm = ref({
	id: 0,
	name: "",
  clientSecret: "",
  clientId: "",
  defRole: 0,
  img: "",
  redirectUrl: "",
  codeUrl: "",
  oauthUrl: "",
  defPost: 0,
  defDept: 0
});
const emit = defineEmits(['updateList']);

const formRules = computed(() => ({
	name: [{ required: true, trigger: 'change', message: '请选择名称' }],
	clientSecret: [{ required: true, trigger: 'change', message: '请输入Client Secret' }],
	clientId: [{ required: true, trigger: 'change', message: '请输入Client Id' }],
	defRole: [{ required: true, trigger: 'change', message: '请选择默认角色' }],
  img: [{ required: true, trigger: 'change', message: '请上传图标' }],
  redirectUrl: [{ required: true, trigger: 'change', message: '请输入回调地址' }],
  codeUrl: [{ required: true, trigger: 'change', message: '请输入授权url' }],
  oauthUrl: [{ required: true, trigger: 'change', message: '请输入获取token的url' }],
  defPost: [{ required: true, trigger: 'change', message: '请选择默认岗位' }],
  defDept: [{ required: true, trigger: 'change', message: '请选择默认部门' }],
}));

/**
 * 上传图标
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  ruleForm.value.img = response;
}

/**
 * 获取角色
 */
const getRoleList = () => {
	api.role.getList({status: -1}).then((res: any) => {
    roleList.value = res;
    if(!ruleForm.value.id) {
      ruleForm.value.defRole = res[0].id;
    }
	});
}
/**
 * 获取岗位
 */
const getPostList = () => {
	api.post.getList({status: -1}).then((res: any) => {
    postList.value = res;
    if(!ruleForm.value.id) {
      ruleForm.value.defPost = res[0].postId;
    }
	});
}
/**
 * 获取部门
 */
const getDeptList = () => {
	api.dept.getList({status: -1}).then((res: any) => {
    deptList.value = res;
    if(!ruleForm.value.id) {
      ruleForm.value.defDept = res[0].deptId;
    }
	});
}

const submitData = async () => {
	formRef.value.validate((valid: boolean) => {
		if (!valid) return
		btnLoading.value = true
		if (ruleForm.value.id) {
			// 修改
			apiSystem.SSO.editItem({
				...ruleForm.value,
			})
				.then(() => {
					ElMessage({ type: 'success', message: '修改成功' })
					emit('updateList')
					closeDialog()
				})
				.finally(() => (btnLoading.value = false))
		} else {
			// 新增
      const data:any = { ...ruleForm.value };
      delete data.id;
			apiSystem.SSO.addItem(data)
				.then(() => {
					ElMessage({ type: 'success', message: '添加成功' })
					emit('updateList')
					closeDialog()
				})
				.finally(() => (btnLoading.value = false))
		}
	})
}

/**
 * 关闭弹窗
 */
const closeDialog = () => {
	dialogVisible.value = false;
	ruleForm.value = {
    id: 0,
    name: "",
    clientSecret: "",
    clientId: "",
    defRole: 0,
    img: "",
    redirectUrl: "",
    codeUrl: "",
    oauthUrl: "",
    defPost: 0,
    defDept: 0
	}
}

onMounted(() => {
	getRoleList();
  getPostList();
  getDeptList();
})


const open = async (row: any) => {
	if(row) {
    // 修改
		ruleForm.value = row;
	}
  dialogVisible.value = true
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.width100 {
	width: 100%;
}
</style>