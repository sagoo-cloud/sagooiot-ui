<template>
	<div class="login-container flex-row">
		<div class="part">
			<div class="title">SSO</div>
		</div>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, computed, defineComponent, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '/@/store/index';
import dayjs from 'dayjs';
import api from '/@/api/system';
import { Session, Local } from '/@/utils/storage';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { formatAxis } from '/@/utils/formatTime';
import { ElMessage } from 'element-plus';

// 定义接口来定义对象的类型
interface LoginState {
	tabsActiveName: string;
	isScan: boolean;
}

export default defineComponent({
	components: {
	},
	data: function () {
		return {
			dayjs,
			sysinfo: {
				buildVersion: '',
				systemName: '',
				buildTime: '',
				systemCopyright: '',
				systemLogo: '',
				systemLoginPIC: '',
			},
		};
	},
	mounted() {
		this.sysinfo = JSON.parse(localStorage.sysinfo || '{}');
	},
	setup() {
		const route = useRoute()
		const router = useRouter();
		const store = useStore();
		const { proxy } = getCurrentInstance() as any;

		// 时间获取
		const currentTime = computed(() => {
			return formatAxis(new Date());
		});

		api.login.oauth({
			code: location.search.split('=')[1],
			types: route.params.type,
			state: ''
		}).then(async (res: any) => {

			sessionStorage.setItem('token', res.token);
			const userInfos = res.userInfo;
			userInfos.avatar = proxy.getUpFileUrl(userInfos.avatar);
			// 存储 token 到浏览器缓存
			Local.set('userInfo', userInfos);
			// 存储用户信息到浏览器缓存
			Session.set('userInfo', userInfos);


			// 获取权限配置，上传文件类型等
			// const [columnRes, buttonRes, uploadFileRes] = await Promise.all([api.getInfoByKey('sys.column.switch'), api.getInfoByKey('sys.button.switch'), api.getInfoByKey('sys.uploadFile.way')])

			// const isSecurityControlEnabled = sessionStorage.isSecurityControlEnabled || null
			// localStorage.setItem('btnNoAuth', (isSecurityControlEnabled && Number(buttonRes?.data?.configValue)) ? '' : '1');
			// localStorage.setItem('colNoAuth', (isSecurityControlEnabled && Number(columnRes?.data?.configValue)) ? '' : '1');
			// localStorage.setItem('uploadFileWay', uploadFileRes?.data?.configValue || '0');

			await store.dispatch('userInfos/setUserInfos', userInfos);

			currentUser();
		})

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
			if (route.query?.redirect) {
				router.push({
					path: route.query?.redirect as string,
					query: route.query.params ? (Object.keys(route.query?.params as string).length > 0 ? JSON.parse(route.query?.params as string) : '') : '',
				});
			} else {
				router.push('/');
			}
			// 登录成功提示
			ElMessage.success('登录成功');
		};

		return {};
	},
});
</script>

<style scoped lang="scss">
html[data-theme='dark'] {
	.login-container {
		background: #293146;
	}

	.left {
		background-image: url(/@/assets/login-bg-dark.svg);
	}

	.title {
		color: #aaa;
	}
}

.flex {
	display: flex;
	align-items: center;
}

.text {
	color: #fff;
}

.switch {
	position: fixed;
	right: 20px;
	top: 20px;
}

.login-container {
	width: 100vw;
	height: 100vh;
	position: relative;
	background: #fff;

	.title {
		font-size: 30px;
		color: #333;
		font-weight: bold;
		letter-spacing: 20px;
	}

	.logo {
		font-size: 30px;
		color: #fff;

		.logoimg {
			height: 50px;
			display: block;
			margin-right: 12px;
		}
	}

	.img {
		width: 50%;
		display: block;
		margin: 15vh 0;
	}

	.part {
		flex: 1;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
	}

	.left {
		height: 100vh;
		background-image: url(/@/assets/login-bg.svg);
		background-repeat: no-repeat;
		background-size: auto 100%;
		background-position: right center;
		align-items: flex-start;
		padding-left: 8%;
	}

	.login-icon-group {
		width: 100%;
		height: 100%;
		position: relative;

		.login-icon-group-title {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 12px 0;

			img {
				width: auto;
				height: 40px;
			}

			&-text {
				padding-left: 20px;
				color: var(--el-color-primary);
			}
		}

		&-icon {
			width: 60%;
			height: 70%;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}

	.login-content-out {
		width: 100%;
		height: 100%;
		padding-top: calc(50vh - 227px);
	}

	.login-content {
		width: 500px;
		padding: 20px;
		margin-left: calc(50% - 500px);
		background-color: rgba(255, 255, 255, 0.8);
		border: 5px solid var(--el-color-primary-light-8);
		border-radius: 5px;
		overflow: hidden;
		z-index: 1;
		position: relative;

		.login-content-main {
			margin: 0 auto;
			width: 80%;

			.login-content-title {
				color: var(--el-text-color-primary);
				font-weight: 500;
				font-size: 22px;
				text-align: center;
				letter-spacing: 4px;
				margin: 15px 0 30px;
				white-space: nowrap;
				z-index: 5;
				position: relative;
				transition: all 0.3s ease;
			}
		}

		.login-content-main-sacn {
			position: absolute;
			top: 0;
			right: 0;
			width: 50px;
			height: 50px;
			overflow: hidden;
			cursor: pointer;
			transition: all ease 0.3s;
			color: var(--el-text-color-primary);

			&-delta {
				position: absolute;
				width: 35px;
				height: 70px;
				z-index: 2;
				top: 2px;
				right: 21px;
				background: var(--el-color-white);
				transform: rotate(-45deg);
			}

			&:hover {
				opacity: 1;
				transition: all ease 0.3s;
				color: var(--el-color-primary) !important;
			}

			i {
				width: 47px;
				height: 50px;
				display: inline-block;
				font-size: 48px;
				position: absolute;
				right: 2px;
				top: -1px;
			}
		}
	}

	.login-footer {
		position: absolute;
		bottom: 5px;
		width: 100%;

		&-content {
			width: 100%;
			display: flex;

			&-warp {
				margin: auto;
				color: #e0e3e9;
				text-align: center;
				animation: error-num 1s ease-in-out;
			}
		}
	}
}
</style>
