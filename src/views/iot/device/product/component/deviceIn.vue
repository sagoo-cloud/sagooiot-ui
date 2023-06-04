<template>
	<div class="title">接入方式</div>
	<div class="text">{{ data.name }}</div>
	<div class="title">消息协议</div>
	<div class="text">{{ data.protocol }}</div>
	<div class="title">认证说明</div>
	<div class="text">{{ data.description }}</div>
	<div class="title">链接信息</div>
	<div class="text">{{ data.link }}</div>
	<div class="title">认证配置</div>

	<template v-if="!isAdmin">请联系管理员</template>
	<template v-else-if="data.authType === 1 || data.authType === 2">
		<el-form-item label="认证方式" prop="authType" label-width="80px" style="margin-bottom: 0;">
			{{ data.authType === 1 ? 'Basic' : 'AccessToken' }}
		</el-form-item>
		<template v-if="data.authType === 1">
			<el-form-item label="用户名" prop="authUser" label-width="80px" style="margin-bottom: 0;">
				{{ data.authUser }}
			</el-form-item>
			<el-form-item label="密码" prop="authPasswd" label-width="80px">
				{{ data.authPasswd }}
			</el-form-item>
		</template>
		<template v-else>
			<el-form-item label="Aceess Token" prop="accessToken">
				{{ data.accessToken }}
			</el-form-item>
		</template>
	</template>
	<template v-else-if="data.authType === 3">
		<el-form-item label="认证证书" prop="certificateName">
			{{ data.certificateName }}
		</el-form-item>
	</template>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, watch } from 'vue';
import api from '/@/api/device';
import { useRoute } from 'vue-router';

const route = useRoute();

const isAdmin = localStorage.userId == '1'
const data = reactive({
	"name": "",
	"protocol": "",
	"description": "",
	"link": "",
	"authType": 0,
	"authUser": "",
	"authPasswd": "",
	"accessToken": "",
	"certificateName": "",
	"certificateId": 0
})

api.product.connect_intro(route.params.id as string).then((res: any) => {
	console.log(res.data)
	Object.assign(data, res.data)
})

</script>
<style lang="scss" scoped>
.title {
	font-weight: bold;
	line-height: 1.2;
	border-left: 4px solid #409eff;
	padding-left: 8px;
	margin: 20px 0 14px;
}
</style>