<template>
	<div class="login-container flex-row">
		<div class="part left">
			<div class="flex logo"><img class="logoimg" src="/@/assets/logo.png" />IOT管理系统</div>
			<img class="img" src="/@/assets/login-box-bg.svg" />
		</div>
		<div class="part">
			<!-- <img :src="logoMini" />
							<div class="login-icongroup-title-text font25">{{ getThemeConfig.globalViceTitle }}</div> -->
			<div class="title">登录</div>
			<Account />
		</div>
		<!-- <amis :json="amisjson" /> -->
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, computed, defineComponent } from 'vue';
import Account from '/@/views/login/component/account.vue';
import { useStore } from '/@/store/index';
import logoMini from '/@/assets/logo.png';
// import amis from '/@/components/amis/index.vue';

// 定义接口来定义对象的类型
interface LoginState {
	tabsActiveName: string;
	isScan: boolean;
}

export default defineComponent({
	name: 'loginIndex',
	components: {
		Account,
		// amis,
	},
	data: function () {
		return {
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
		return {
			logoMini,
			getThemeConfig,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.flex {
	display: flex;
	align-items: center;
}
.login-container {
	width: 100vw;
	height: 100vh;
	position: relative;
	background: #293146;
	.title {
		font-size: 30px;
		color: #fff;
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
		background-image: url(/@/assets/login-bg-dark.svg);
		background-repeat: no-repeat;
		background-size: auto 100%;
		background-position: right center;
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
