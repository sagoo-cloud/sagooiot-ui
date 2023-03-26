<template>
	<div class="layout-navbars-breadcrumb-user-news">
		<div class="head-box">
			<div class="head-box-title">{{ $t('message.user.newTitle') }}</div>
			<!-- <div class="head-box-btn" v-if="newsList.length > 0" @click="onAllReadClick">{{ $t('message.user.newBtn') }}</div> -->
		</div>
		<div class="content-box">
			<template v-if="newsList.length > 0">
				<div class="content-box-item" v-for="(v, k) in newsList" :key="k">
					<div>{{ v.title }}</div>
					<div class="content-box-msg">
						{{ v.content }}
					</div>
					<div class="content-box-time">{{ v.createdAt }}</div>
				</div>
			</template>
			<el-empty :description="$t('message.user.newDesc')" v-else></el-empty>
		</div>
		<div class="foot-box" @click="onGoToGiteeClick" v-if="newsList.length > 0">{{ $t('message.user.newGo') }}</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import getOrigin from '/@/utils/origin';
import api from '/@/api/message';
import { ElNotification } from 'element-plus'

const router = useRouter();
const emit = defineEmits(['closePopover']);


const newsList = ref<any[]>([
	// {
	// 	title: '关于发布的通知',
	// 	content: '内容。。。',
	// 	createdAt: '2022-08-07',
	// },
]);

api.allUnRead().then((res: any) => {
	// console.log(res.Info)
	newsList.value = res.Info.map((item: any) => item.MessageInfo).slice(0, 5)
  // ElNotification({
  //   title: '测试消息',
  //   message: '测试消息',
  //   type: 'error',
  // })
})

// 监听系统消息的SSE
const es = new EventSource(getOrigin(import.meta.env.VITE_SERVER_URL + '/subscribe/sysMessage'));
es.addEventListener('lastUnRead', ({ data }) => {
	if (!data || data === 'null') return;
	console.log(data);
});

// 全部已读点击
const onAllReadClick = () => {
	newsList.value = [];
};
// 前往通知中心点击
const onGoToGiteeClick = () => {
	router.push('/monitor/notice');
	emit('closePopover');
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-news {
	.head-box {
		display: flex;
		border-bottom: 1px solid var(--el-border-color-lighter);
		box-sizing: border-box;
		color: var(--el-text-color-primary);
		justify-content: space-between;
		height: 35px;
		align-items: center;
		.head-box-btn {
			color: var(--el-color-primary);
			font-size: 13px;
			cursor: pointer;
			opacity: 0.8;
			&:hover {
				opacity: 1;
			}
		}
	}
	.content-box {
		font-size: 13px;
		.content-box-item {
			padding-top: 12px;
			&:last-of-type {
				padding-bottom: 12px;
			}
			.content-box-msg {
				color: var(--el-text-color-secondary);
				margin-top: 5px;
				margin-bottom: 5px;
			}
			.content-box-time {
				color: var(--el-text-color-secondary);
			}
		}
	}
	.foot-box {
		height: 35px;
		color: var(--el-color-primary);
		font-size: 13px;
		cursor: pointer;
		opacity: 0.8;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1px solid var(--el-border-color-lighter);
		&:hover {
			opacity: 1;
		}
	}
	::v-deep(.el-empty__description p) {
		font-size: 13px;
	}
}
</style>
