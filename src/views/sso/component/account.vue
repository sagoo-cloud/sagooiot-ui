<template>
	<el-form ref="loginForm" size="large" class="login-content-form" :model="ruleForm" :rules="formRules">
		<el-form-item class="login-animation1" prop="userName">
			<el-input type="text" :placeholder="$t('message.account.accountPlaceholder1')" v-model="ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-User />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="password">
			<el-input :type="isShowPassword ? 'text' : 'password'" :placeholder="$t('message.account.accountPlaceholder2')" v-model="ruleForm.password" autocomplete="off" @keyup.enter="onSignIn">
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-Unlock />
					</el-icon>
				</template>
				<template #suffix>
					<i class="iconfont el-input__icon login-content-password" :class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'" @click="isShowPassword = !isShowPassword">
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation3" prop="captcha">
			<el-col :span="15">
				<el-input type="text" maxlength="4" :placeholder="$t('message.account.accountPlaceholder3')" v-model="ruleForm.captcha" clearable autocomplete="off" @keyup.enter="onSignIn">
					<template #prefix>
						<el-icon class="el-input__icon">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<div class="login-content-code">
					<el-image class="login-content-code-img" @click="getCaptcha" width="130" height="38" :src="captchaSrc" style="cursor: pointer" />
				</div>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" @click="onSignIn" :loading="loading.signIn">
				<span>{{ $t('message.account.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
		<changePwd ref="changePwdRef"></changePwd>
	</el-form>
</template>

<script lang="ts">
import { ref, toRefs, reactive, defineComponent, computed, onMounted, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { useStore } from '/@/store/index';
import { Session, Local } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { encrypt } from '/@/utils/rsa'
import api from '/@/api/system';

// 是否是开源版本
const ISOPEN = import.meta.env.VITE_ISOPEN

export default defineComponent({
	name: 'loginAccount',
	setup() {
		const changePwdRef = ref();
		const { t } = useI18n();
		const store = useStore();
		const route = useRoute();
		const router = useRouter();
		const { proxy } = getCurrentInstance() as any;
		const state = reactive({
			isShowPassword: false,
			ruleForm: {
				userName: ISOPEN ? 'demo' : '',
				password: ISOPEN ? 'demo123456' : '',
				captcha: '',
				VerifyKey: '',
			},
			formRules: {
				userName: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
				password: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
				captcha: [{ required: true, trigger: 'blur', message: '验证码不能为空' }],
			},
			loading: {
				signIn: false,
			},
			captchaSrc: '',
		});
		onMounted(() => {
			getCaptcha();
		});
		// 时间获取
		const currentTime = computed(() => {
			return formatAxis(new Date());
		});

		const getCaptcha = () => {
			api.login.captcha().then((res: any) => {
				state.captchaSrc = res.img;
				state.ruleForm.VerifyKey = res.key;
			});
		};

		// 登录
		const onSignIn = () => {
			// 验证表单
			proxy.$refs.loginForm
				.validate(async (valid: boolean) => {
					if (valid) {
						state.loading.signIn = true;
						let password: string
						if (sessionStorage.isRsaEnabled) {
							password = await encrypt(state.ruleForm.password)
						} else {
							password = state.ruleForm.password
						}
						api.login
							.login({
								...state.ruleForm,
								password
							})
							.then(async (res: any) => {
								// 检查是否需要更换密码
								if (res.isChangePwd) {
									ElMessage.error(`密码已超过${sessionStorage.sysPasswordChangePeriod}天未修改，请先修改密码再登录`)
									state.loading.signIn = false;
									getCaptcha();
									return changePwdRef.value.toShow({
										userName: state.ruleForm.userName,
										oldUserPassword: state.ruleForm.password,
									})
								}

								localStorage.setItem('token', res.token);
								const userInfos = res.userInfo;
								userInfos.avatar = proxy.getUpFileUrl(userInfos.avatar);
								// 存储 token 到浏览器缓存
								Local.set('userInfo', userInfos);
								// 存储用户信息到浏览器缓存
								Session.set('userInfo', userInfos);


								// 获取权限配置，上传文件类型等
								const [columnRes, buttonRes, uploadFileRes] = await Promise.all([api.getInfoByKey('sys.column.switch'), api.getInfoByKey('sys.button.switch'), api.getInfoByKey('sys.uploadFile.way')])

								const isSecurityControlEnabled = sessionStorage.isSecurityControlEnabled || null
								localStorage.setItem('btnNoAuth', (isSecurityControlEnabled && Number(buttonRes?.data?.configValue)) ? '' : '1');
								localStorage.setItem('colNoAuth', (isSecurityControlEnabled && Number(columnRes?.data?.configValue)) ? '' : '1');
								localStorage.setItem('uploadFileWay', uploadFileRes?.data?.configValue || '0');

								await store.dispatch('userInfos/setUserInfos', userInfos);

								currentUser();
							})
							.catch(() => {
								state.loading.signIn = false;
								getCaptcha();
							});
					}
				})
				.catch(() => { });
		};
		// 获取登录用户信息
		const currentUser = async () => {
			api.login.currentUser().then(async (res: any) => {
				localStorage.setItem('userId', res.Info.id);
				// 设置用户菜单
				Session.set('userMenu', res.Data || []);
				store.dispatch('requestOldRoutes/setBackEndControlRoutes', res || []);
				if (!store.state.themeConfig.themeConfig.isRequestRoutes) {
					// 前端控制路由，2、请注意执行顺序
					await initFrontEndControlRoutes();
					signInSuccess();
				} else {
					// 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
					// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
					await initBackEndControlRoutes();
					// 执行完 initBackEndControlRoutes，再执行 signInSuccess
					signInSuccess();
				}
			});
			// // 设置按钮权限
			// Session.set('permissions', res.data.permissions);
			// // 1、请注意执行顺序(存储用户信息到vuex)
			// await store.dispatch('userInfos/setPermissions', res.data.permissions);
		};
		// 登录成功后的跳转
		const signInSuccess = () => {
			// 修改首页重定向的地址，从后台配置中获取首页的地址并在登录之后和刷新页面时进行修改
			const sysinfo = JSON.parse(localStorage.sysinfo || '{}');
			const homePage = router.getRoutes().find((item) => item.path === '/');
			homePage && (homePage.redirect = sysinfo.systemHomePageRoute || '/home');
			// 初始化登录成功时间问候语
			let currentTimeInfo = currentTime.value;
			// 登录成功，跳到转首页
			// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
			// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
			if (route.query?.redirect) {
				router.push({
					path: route.query?.redirect as string,
					query: route.query.params ? (Object.keys(route.query?.params as string).length > 0 ? JSON.parse(route.query?.params as string) : '') : '',
				});
			} else {
				router.push('/');
			}
			// 登录成功提示
			// 关闭 loading
			state.loading.signIn = false;
			const signInText = t('message.signInText');
			ElMessage.success(`${currentTimeInfo}，${signInText}`);
		};
		return {
			changePwdRef,
			onSignIn,
			getCaptcha,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.login-content-form {
	width: 400px;
	margin-top: 20px;

	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}

	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;

		&:hover {
			color: #909399;
		}
	}

	.login-content-code {
		display: flex;
		align-items: center;
		justify-content: space-around;

		.login-content-code-img {
			width: 100%;
			height: 40px;
			line-height: 40px;
			background-color: #ffffff;
			border: 1px solid rgb(220, 223, 230);
			cursor: pointer;
			transition: all ease 0.2s;
			border-radius: 4px;
			user-select: none;

			&:hover {
				border-color: #c0c4cc;
				transition: all ease 0.2s;
			}
		}
	}

	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
