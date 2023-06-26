<template>
	<div class="login-container flex-row">
		<el-switch
			class="switch"
			v-model="getThemeConfig.isIsDark"
			size="large"
			inline-prompt
			@change="onAddDarkChange"
			:active-icon="Sunny"
			:inactive-icon="Moon"
			style="--el-switch-on-color: #fff; --el-switch-off-color: #151515"
		></el-switch>
		<div class="part left">
			<div class="flex logo">
				<img v-if="sysinfo.systemLogo" class="logoimg" :src="sysinfo.systemLogo" />
				<img v-else class="logoimg" src="/imgs/logo.png" />
				{{ sysinfo.systemName }}</div>
			<img class="img" v-if="sysinfo.systemLoginPIC" :src="sysinfo.systemLoginPIC" />
			<img class="img" v-else src="/imgs/login-box-bg.svg" />
			<span class="text" v-if="sysinfo.buildTime">{{ sysinfo.buildVersion }} </span>
			<span class="text" v-if="sysinfo.buildTime">{{ dayjs(sysinfo.buildTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
		</div>
		<div class="part">
			<!-- <img :src="logoMini" />
							<div class="login-icongroup-title-text font25">{{ getThemeConfig.globalViceTitle }}</div> -->
			<div class="title">登录</div>
			<Account />
		</div>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, computed, defineComponent } from 'vue';
import Account from '/@/views/login/component/account.vue';
import { useStore } from '/@/store/index';
import logoMini from '/imgs/logo.png';
import { Sunny, Moon } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

// 定义接口来定义对象的类型
interface LoginState {
	tabsActiveName: string;
	isScan: boolean;
}

export default defineComponent({
	name: 'loginIndex',
	components: {
		Account,
	},
	data: function () {
		return {
			Sunny,
			Moon,
			dayjs,
			sysinfo: {
				buildVersion: '',
				systemName: '',
				buildTime: '',
				systemCopyright: '',
				systemLogo: '',
				systemLoginPIC: '',
			},
			amisjson: {
				type: 'page',
				title: '表单页面',
				body: {
					type: 'form',
					mode: 'horizontal',
					api: '/saveForm',
					body: [
						{
							label: 'Name1Name1Name1Name1',
							type: 'input-text',
							name: 'name123',
						},
						{
							label: 'Email2Email2Email2Email2',
							type: 'input-email',
							name: 'email1',
						},
					],
				},
			},
		};
	},
	mounted() {
		this.sysinfo = JSON.parse(localStorage.sysinfo || '{}');
	},
	setup() {
		const store = useStore();
		const state = reactive<LoginState>({
			tabsActiveName: 'account',
			isScan: false,
		});
		// 获取布局配置信息
		const getThemeConfig = computed(() => {
			return store.state.themeConfig.themeConfig;
		});

		// 4、界面显示 --> 深色模式
		const onAddDarkChange = () => {
			const body = document.documentElement as HTMLElement;
			if (getThemeConfig.value.isIsDark) {
				body.setAttribute('data-theme', 'dark');
				document.querySelector('html')!.className = 'dark'
			} else {
				body.setAttribute('data-theme', '');
				document.querySelector('html')!.className = ''
			}
		};

		return {
			onAddDarkChange,
			logoMini,
			getThemeConfig,
			...toRefs(state),
		};
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
