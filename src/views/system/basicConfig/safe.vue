<template>
	<el-form :model="form" ref="queryRef" label-width="155px">
		<div :style="{ width: '450px' }">
			<el-descriptions title="安全控制" v-if="form.security || form.rsaEnabled"></el-descriptions>
			<el-form-item label="是否启用安全控制" prop="security" v-if="form.security">
				<el-radio-group v-model="form.security">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否启用RSA" prop="rsaEnabled" v-if="form.rsaEnabled">
				<el-radio-group v-model="form.rsaEnabled">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-descriptions title="登录设置" v-if="form.singleLogin || form.changePwdFirstLogin || form.expiryDate || form.errorNum || form.againLoginDate || form.changePeriodSwitch || form.changePeriod"></el-descriptions>
			<el-form-item label="是否单一登录" prop="singleLogin" v-if="form.singleLogin">
				<el-radio-group v-model="form.singleLogin">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="首次登录是否更改密码" prop="changePwdFirstLogin" v-if="form.changePwdFirstLogin">
				<el-radio-group v-model="form.changePwdFirstLogin">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="TOKEN过期时间" prop="expiryDate" v-if="form.expiryDate">
				<el-input type="number" v-model="form.expiryDate" placeholder="请输入">
					<template #append>分钟</template>
				</el-input>
			</el-form-item>
			<el-form-item label="密码输入错误次数" prop="errorNum" v-if="form.errorNum">
				<el-input type="number" v-model="form.errorNum" placeholder="请输入"></el-input>
			</el-form-item>
			<el-form-item label="允许再次登录时间" prop="againLoginDate" v-if="form.againLoginDate">
				<el-input type="number" v-model="form.againLoginDate" placeholder="请输入">
					<template #append>分钟</template>
				</el-input>
			</el-form-item>
			<el-form-item label="密码更换周期开关" prop="changePeriodSwitch" v-if="form.changePeriodSwitch">
				<el-radio-group v-model="form.changePeriodSwitch">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="密码更换周期" prop="changePeriod" v-if="form.changePeriod">
				<el-input type="number" v-model="form.changePeriod" placeholder="请输入">
					<template #append>天</template>
				</el-input>
			</el-form-item>
			<el-descriptions title="密码策略设置" v-if="form.uppercase || form.lowercase || form.digit || form.complexity || form.minimum"></el-descriptions>
			<el-form-item label="是否包含大写字母" prop="uppercase" v-if="form.uppercase">
				<el-radio-group v-model="form.uppercase">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否包含小写字母" prop="lowercase" v-if="form.lowercase">
				<el-radio-group v-model="form.lowercase">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否包含数字" prop="digit" v-if="form.digit">
				<el-radio-group v-model="form.digit">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="是否包含复杂字符" prop="complexity" v-if="form.complexity">
				<el-radio-group v-model="form.complexity">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="密码长度" prop="minimum" v-if="form.minimum">
				<el-input type="number" v-model="form.minimum" placeholder="请输入密码长度"></el-input>
			</el-form-item>
			<el-descriptions title="权限设置" v-if="form.button || form.column || form.api"></el-descriptions>
			<el-form-item label="按钮开关" prop="button" v-if="form.button">
				<el-radio-group v-model="form.button">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="列表开关" prop="column" v-if="form.column">
				<el-radio-group v-model="form.column">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="API开关" prop="api" v-if="form.api">
				<el-radio-group v-model="form.api">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">禁用</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" class="ml10" @click="saveEmailConfig">保存</el-button>
			</el-form-item>
		</div>
	</el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import api from '/@/api/system';

const emailConfigMap: any = {}

const form = reactive({
	singleLogin: '',
	expiryDate: '',
	uppercase: '',
	lowercase: '',
	digit: '',
	complexity: '',
	minimum: '',
	errorNum: '',
	againLoginDate: '',
	changePeriod: '',
	button: '',
	column: '',
	api: '',
	security: '',
	changePeriodSwitch: '',
	changePwdFirstLogin: '',
	rsaEnabled: '',
})

// 是否包含大写字母
// 是否包含小写字母
// 是否包含数字
// 是否包含复杂字符
// 密码长度
// 密码输入错误次数
// 允许再次登录时间
// 密码更换周期
api.basicConfig.getDetails({ types: 1 }).then((res: any) => {
	res.data.forEach((item: any) => {
		emailConfigMap[item.configKey] = item
	})

	form.singleLogin = get('sys.is.single.login')
	form.expiryDate = get('sys.token.expiry.date')
	form.uppercase = get('sys.require.uppercase.letter')
	form.lowercase = get('sys.require.lowercase.letter')
	form.digit = get('sys.require.digit')
	form.complexity = get('sys.require.complexity')
	form.minimum = get('sys.password.minimum.length')
	form.errorNum = get('sys.password.error.num')
	form.againLoginDate = get('sys.again.login.date')
	form.changePeriod = get('sys.password.change.period')
	form.changePeriodSwitch = get('sys.password.change.period.switch')
	form.changePwdFirstLogin = get('sys.change.password.for.first.login')
	form.button = get('sys.button.switch')
	form.column = get('sys.column.switch')
	form.api = get('sys.api.switch')
	form.security = get('sys.is.security.control.enabled')
	form.rsaEnabled = get('sys.is.rsa.enabled')
});

function saveEmailConfig() {
	set('sys.is.single.login', form.singleLogin)
	set('sys.token.expiry.date', form.expiryDate)
	set('sys.require.uppercase.letter', form.uppercase)
	set('sys.require.lowercase.letter', form.lowercase)
	set('sys.require.digit', form.digit)
	set('sys.require.complexity', form.complexity)
	set('sys.password.minimum.length', form.minimum)
	set('sys.password.error.num', form.errorNum)
	set('sys.again.login.date', form.againLoginDate)
	set('sys.password.change.period', form.changePeriod)
	set('sys.password.change.period.switch', form.changePeriodSwitch)
	set('sys.change.password.for.first.login', form.changePwdFirstLogin)
	set('sys.button.switch', form.button)
	set('sys.column.switch', form.column)
	set('sys.api.switch', form.api)
	set('sys.is.security.control.enabled', form.security)
	set('sys.is.rsa.enabled', form.rsaEnabled)
	api.basicConfig.setDetails({ ConfigInfo: Object.values(emailConfigMap) }).then(() => {
		ElMessage.success('操作成功');
	});
}

function get(key: string) {
	return emailConfigMap[key]?.configValue
}

function set(key: string, value: string) {
	emailConfigMap[key] && (emailConfigMap[key].configValue = value)
}

</script>

<style scoped lang="scss">
:deep(.el-form) {
	width: 100%;
}

.el-form-item {
	margin-bottom: 10px;
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
