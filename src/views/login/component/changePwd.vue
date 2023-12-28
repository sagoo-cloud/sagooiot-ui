<template>
	<el-dialog title="更新密码" v-model="show" width="500px" :show-close="false" destroy-on-close :close-on-click-modal="false" :close-on-press-escape="false">
		<el-form ref="formRef" :model="ruleForm" :rules="formRules">
			<el-form-item prop="userName">
				<el-input type="text" placeholder="请输入用户名" v-model="ruleForm.userName" clearable autocomplete="off">
					<template #prefix><el-icon><ele-User /></el-icon></template>
				</el-input>
			</el-form-item>
			<el-form-item class="login-animation2" prop="oldUserPassword">
				<el-input :type="isShowPassword1 ? 'text' : 'password'" placeholder="请输入旧密码" v-model="ruleForm.oldUserPassword" autocomplete="off">
					<template #prefix><el-icon><ele-Unlock /></el-icon></template>
					<template #suffix><i class="iconfont" :class="isShowPassword1 ? 'icon-yincangmima' : 'icon-xianshimima'" @click="isShowPassword1 = !isShowPassword1"></i></template>
				</el-input>
			</el-form-item>
			<el-form-item class="login-animation2" prop="userPassword">
				<!--suppress TypeScriptValidateTypes -->
				<el-input :type="isShowPassword2 ? 'text' : 'password'" placeholder="请输入新密码" v-model="ruleForm.userPassword" autocomplete="off">
					<template #prefix><el-icon><ele-Unlock /></el-icon></template>
					<template #suffix><i class="iconfont" :class="isShowPassword2 ? 'icon-yincangmima' : 'icon-xianshimima'" @click="isShowPassword2 = !isShowPassword2"></i></template>
				</el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="onSubmit">更 换</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { encrypt } from '/@/utils/rsa'
import api from '/@/api/system';
import { ElMessage } from "element-plus";

const formRef = ref()
const show = ref(false)
const isShowPassword1 = ref(false)
const isShowPassword2 = ref(false)

const ruleForm = reactive({
	userName: '',
	oldUserPassword: '',
	userPassword: '',
})

const formRules = computed(() => ({
	userName: [{ required: true, trigger: 'change', message: '用户名不能为空' }],
	oldUserPassword: [{ required: true, trigger: 'change', message: '旧密码不能为空' }],
	userPassword: [{ required: true, trigger: 'change', message: '新密码不能为空' }],
}))

async function onSubmit() {
	await formRef.value.validate()

	let oldUserPassword: string
	let userPassword: string
	if (sessionStorage.isRsaEnabled) {
		oldUserPassword = await encrypt(ruleForm.oldUserPassword)
		userPassword = await encrypt(ruleForm.userPassword)
	} else {
		oldUserPassword = ruleForm.oldUserPassword
		userPassword = ruleForm.userPassword
	}

	api.login.editPassword({
		userName: ruleForm.userName,
		oldUserPassword,
		userPassword,
	}).then(() => {
		show.value = false
		ElMessage.success('修改成功')
	})

}
function toShow(data: any) {
	ruleForm.userName = data.userName
	ruleForm.oldUserPassword = data.oldUserPassword
	show.value = true
}

defineExpose({ toShow })
</script>

<style scoped lang="scss"></style>