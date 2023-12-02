<template>
	<div class="system-dic-container page-full">
		<el-card class="page-full-part" shadow="never">
			<el-form :model="form" ref="queryRef" label-width="155px">
				<div :style="{ width: '450px' }">
					<el-descriptions title="安全控制"></el-descriptions>
					<el-form-item label="是否启用安全控制" prop="security">
						<el-radio-group v-model="form.security">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-descriptions title="登录设置"></el-descriptions>
					<el-form-item label="是否单一登录" prop="singleLogin">
						<el-radio-group v-model="form.singleLogin">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="首次登录是否更改密码" prop="changePwdFirstLogin">
						<el-radio-group v-model="form.changePwdFirstLogin">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="TOKEN过期时间" prop="expiryDate">
						<el-input type="number" v-model="form.expiryDate" placeholder="请输入">
							<template #append>分钟</template>
						</el-input>
					</el-form-item>
					<el-form-item label="密码输入错误次数" prop="errorNum">
						<el-input type="number" v-model="form.errorNum" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="允许再次登录时间" prop="againLoginDate">
						<el-input type="number" v-model="form.againLoginDate" placeholder="请输入">
							<template #append>分钟</template>
						</el-input>
					</el-form-item>
					<el-form-item label="密码更换周期开关" prop="changePeriodSwitch">
						<el-radio-group v-model="form.changePeriodSwitch">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="密码更换周期" prop="changePeriod">
						<el-input type="number" v-model="form.changePeriod" placeholder="请输入">
							<template #append>天</template>
						</el-input>
					</el-form-item>
					<el-descriptions title="密码策略设置"></el-descriptions>
					<el-form-item label="是否包含大写字母" prop="uppercase">
						<el-radio-group v-model="form.uppercase">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="是否包含小写字母" prop="lowercase">
						<el-radio-group v-model="form.lowercase">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="是否包含数字" prop="digit">
						<el-radio-group v-model="form.digit">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="是否包含复杂字符" prop="complexity">
						<el-radio-group v-model="form.complexity">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="密码长度" prop="minimum">
						<el-input type="number" v-model="form.minimum" placeholder="请输入密码长度"></el-input>
					</el-form-item>
					<el-descriptions title="权限设置"></el-descriptions>
					<el-form-item label="按钮开关" prop="button">
						<el-radio-group v-model="form.button">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="列表开关" prop="column">
						<el-radio-group v-model="form.column">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="API开关" prop="api">
						<el-radio-group v-model="form.api">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" class="ml10" @click="saveEmailConfig">确认</el-button>
					</el-form-item>
				</div>
			</el-form>
		</el-card>

	</div>
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

	form.singleLogin = emailConfigMap['sys.is.single.login']?.configValue
	form.expiryDate = emailConfigMap['sys.token.expiry.date']?.configValue
	form.uppercase = emailConfigMap['sys.require.uppercase.letter']?.configValue
	form.lowercase = emailConfigMap['sys.require.lowercase.letter']?.configValue
	form.digit = emailConfigMap['sys.require.digit']?.configValue
	form.complexity = emailConfigMap['sys.require.complexity']?.configValue
	form.minimum = emailConfigMap['sys.password.minimum.length']?.configValue
	form.errorNum = emailConfigMap['sys.password.error.num']?.configValue
	form.againLoginDate = emailConfigMap['sys.again.login.date']?.configValue
	form.changePeriod = emailConfigMap['sys.password.change.period']?.configValue
	form.changePeriod = emailConfigMap['sys.password.change.period']?.configValue
	form.changePeriod = emailConfigMap['sys.password.change.period']?.configValue
	form.changePeriodSwitch = emailConfigMap['sys.password.change.period.switch']?.configValue
	form.changePwdFirstLogin = emailConfigMap['sys.change.password.for.first.login']?.configValue
	form.button = emailConfigMap['sys.button.switch']?.configValue
	form.column = emailConfigMap['sys.column.switch']?.configValue
	form.api = emailConfigMap['sys.api.switch']?.configValue
	form.security = emailConfigMap['sys.is.security.control.enabled']?.configValue
});

function saveEmailConfig() {
	emailConfigMap['sys.is.single.login'] && (emailConfigMap['sys.is.single.login'].configValue = form.singleLogin)
	emailConfigMap['sys.token.expiry.date'] && (emailConfigMap['sys.token.expiry.date'].configValue = form.expiryDate)
	emailConfigMap['sys.require.uppercase.letter'] && (emailConfigMap['sys.require.uppercase.letter'].configValue = form.uppercase)
	emailConfigMap['sys.require.lowercase.letter'] && (emailConfigMap['sys.require.lowercase.letter'].configValue = form.lowercase)
	emailConfigMap['sys.require.digit'] && (emailConfigMap['sys.require.digit'].configValue = form.digit)
	emailConfigMap['sys.require.complexity'] && (emailConfigMap['sys.require.complexity'].configValue = form.complexity)
	emailConfigMap['sys.password.minimum.length'] && (emailConfigMap['sys.password.minimum.length'].configValue = form.minimum)
	emailConfigMap['sys.password.error.num'] && (emailConfigMap['sys.password.error.num'].configValue = form.errorNum)
	emailConfigMap['sys.again.login.date'] && (emailConfigMap['sys.again.login.date'].configValue = form.againLoginDate)
	emailConfigMap['sys.password.change.period'] && (emailConfigMap['sys.password.change.period'].configValue = form.changePeriod)
	emailConfigMap['sys.password.change.period.switch'] && (emailConfigMap['sys.password.change.period.switch'].configValue = form.changePeriodSwitch)
	emailConfigMap['sys.change.password.for.first.login'] && (emailConfigMap['sys.change.password.for.first.login'].configValue = form.changePwdFirstLogin)
	emailConfigMap['sys.button.switch'] && (emailConfigMap['sys.button.switch'].configValue = form.button)
	emailConfigMap['sys.column.switch'] && (emailConfigMap['sys.column.switch'].configValue = form.column)
	emailConfigMap['sys.api.switch'] && (emailConfigMap['sys.api.switch'].configValue = form.api)
	emailConfigMap['sys.is.security.control.enabled'] && (emailConfigMap['sys.is.security.control.enabled'].configValue = form.security)
	api.basicConfig.setDetails({ ConfigInfo: Object.values(emailConfigMap) }).then(() => {
		ElMessage.success('操作成功');
	});
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
