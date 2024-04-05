<template>
	<div class="login-container flex-row">
		<div class="part">
			<div class="title">SSO</div>
		</div>
	</div>
</template>

<script lang="ts"  setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '/@/store/index';
import dayjs from 'dayjs';
import api from '/@/api/system';
import { Session, Local } from '/@/utils/storage';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { formatAxis } from '/@/utils/formatTime';
import { ElMessage } from 'element-plus';

const getQueryString = (params:string) => {
		var urlObj:any = {};
		if (!window.location.search) {
			return false;
		}
		var urlParams = window.location.search.substring(1);
		var urlArr = urlParams.split('&');
		for (var i = 0; i < urlArr.length; i++) {
			var urlArrItem = urlArr[i].split('=');
			urlObj[urlArrItem[0]] = urlArrItem[1]
		}
		return urlObj[params]
}

const toLogin = async (code:string) => {
	const res = await api.login.oauth({ "code": code, "isCreate": 0, "types": "gitee"});
	console.log(res)
}

// 页面加载时
onMounted(() => {
	const code:string = getQueryString('code');
	console.log(code)
	if(code) {
		toLogin(code);
	}
	
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
