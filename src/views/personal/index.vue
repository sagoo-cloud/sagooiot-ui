<template>
	<div class="personal">
		<el-row>
			<!-- 个人信息 -->
			<el-col :xs="24" :sm="24">
				<el-card shadow="nover" header="个人信息" v-loading="!info.userName">
					<div class="personal-user">
						<div class="personal-user-left">
							<el-image v-if="isEditStatus && info.avatar" style="width: 140px; height: 140px" :src="info.avatar" />
							<uploadVue v-else @set-img="setImg">
								<el-image style="width: 140px; height: 140px" :src="info.avatar" />
								<div class="tips">点击上方照片，即可更改头像</div>
							</uploadVue>
						</div>
						<div class="personal-user-right">
							<el-row>
								<el-col :span="24" class="personal-title mb18">{{ currentTime }}，{{ info.userName }} </el-col>
								<!-- 昵称 -->
								<el-col :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">姓名：</div>
									<div v-if="isEditStatus" class="personal-item-value">{{ info.userNickname }}</div>
									<el-input v-else class="personal-item-value personal-item-value-edit" v-model="info.userNickname"></el-input>
								</el-col>
								<!-- 性别 -->
								<el-col :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">性别：</div>
									<div v-if="isEditStatus" class="personal-item-value">{{ info.sex == '1' ? '男' : '女' }}</div>
									<!-- 0:保密,1:男,2:女 -->
									<el-radio-group v-else v-model="info.sex">
										<el-radio :label="0">保密</el-radio>
										<el-radio :label="1">男</el-radio>
										<el-radio :label="2">女</el-radio>
									</el-radio-group>
								</el-col>
								<!-- 生日 -->
								<el-col :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">生日：</div>
									<div v-if="isEditStatus" class="personal-item-value">{{ info.birthday }}</div>
									<el-date-picker v-else @change="dateChange" v-model="info.birthday" type="date" placeholder="请选择出生日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
								</el-col>
								<!-- 登录密码 -->
								<el-col v-if="!isEditStatus" :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">登录密码：</div>
									<el-input class="personal-item-value personal-item-value-edit" v-model="info.userPassword"></el-input>
								</el-col>
								<!-- 手机号 -->
								<el-col :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">手机号：</div>
									<div v-if="isEditStatus" class="personal-item-value">{{ info.mobile }}</div>
									<el-input v-else class="personal-item-value personal-item-value-edit" v-model="info.mobile"></el-input>
								</el-col>
								<!-- 邮箱 -->
								<el-col :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">邮箱：</div>
									<div v-if="isEditStatus" class="personal-item-value">{{ info.userEmail }}</div>
									<el-input v-else class="personal-item-value personal-item-value-edit" v-model="info.userEmail"></el-input>
								</el-col>
								<!-- 联系地址 -->
								<el-col :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">联系地址：</div>
									<div v-if="isEditStatus" class="personal-item-value">{{ info.address }}</div>
									<el-input v-else class="personal-item-value personal-item-value-edit" v-model="info.address"></el-input>
								</el-col>
								<!-- 简介 -->
								<el-col :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">简介：</div>
									<div v-if="isEditStatus" class="personal-item-value">{{ info.describe }}</div>
									<el-input v-else class="personal-item-value personal-item-value-edit" v-model="info.describe"></el-input>
								</el-col>
								<el-col :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">登录IP：</div>
									<div class="personal-item-value">{{ info.lastLoginIp }}</div>
								</el-col>
								<el-col :xs="24" :sm="24" class="personal-item mb6">
									<div class="personal-item-label">登录时间：</div>
									<div class="personal-item-value">{{ info.lastLoginTime }}</div>
								</el-col>
							</el-row>
						</div>
					</div>
					<div class="edit-btn">
						<el-button type="primary" @click="handleChange">{{ isEditStatus ? '修改' : '保存' }}</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { formatAxis } from '/@/utils/formatTime'
import { ElMessage } from 'element-plus'
import api from '/@/api/system'
import uploadVue from '/@/components/upload-wrapper/index.vue'
import { useStore } from '/@/store/index';
import { Session } from '/@/utils/storage';

const store = useStore();

const info = ref<any>({})
const isEditStatus = ref<Boolean>(true)

api.user.detail(localStorage.userId).then((user: any) => {
	info.value = user
})

// 当前时间提示语
const currentTime = computed(() => {
	return formatAxis(new Date())
})

const setImg = (img: string) => {
	api.user.setAvatar(info.value.id, img).then(() => {
		ElMessage.success('更新成功')
		info.value.avatar = img

		const userInfos = {
			userNickname: info.value?.userNickname,
			avatar: img,
		}

		// 存储用户信息到浏览器缓存
		Session.set('userInfo', userInfos);
		store.dispatch('userInfos/setUserInfos', userInfos);
	})
}

/**
 * 修改/保存 状态切换
 */
const handleChange = () => {
	if (isEditStatus.value) {
		// 展示修改按钮
		isEditStatus.value = false
	} else {
		// 提交修改表单
		submitData()
	}
}

/**
 * 提交修改表单
 */
// 地址事例值：四川省成都市青羊区东城根南街68号院
const submitData = () => {
	const { id, mobile, userNickname, birthday, userPassword, userEmail, sex, avatar, address, describe } = info.value
	let params = {
		id,
		mobile,
		userNickname,
		birthday,
		userPassword,
		userEmail,
		sex,
		avatar,
		address,
		describe,
	}
	api.user.editUserInfo(params).then(() => {
		ElMessage.success('更新成功')
		isEditStatus.value = true
	})
}

/**
 * 选择生日
 */
const dateChange = (e: any) => {
	info.value.birthday = e
}
</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';

.personal {
	.personal-user {
		display: flex;
		align-items: center;

		.personal-user-left {
			:deep(.el-upload) {
				height: 100%;
				display: flex;
				flex-direction: column;

				.tips {
					font-size: 12px;
					color: #ccc;
				}
			}

			.personal-user-left-upload {
				img {
					width: 100%;
					height: 100%;
					border-radius: 3px;
				}

				&:hover {
					img {
						animation: logoAnimation 0.3s ease-in-out;
					}
				}
			}
		}

		.personal-user-right {
			flex: 1;
			padding: 0 15px;

			.personal-title {
				font-size: 18px;
				@include text-ellipsis(1);
			}

			.personal-item {
				display: flex;
				align-items: center;
				font-size: 13px;

				.personal-item-label {
					color: var(--el-text-color-secondary);
					@include text-ellipsis(1);
					width: 70px;
					text-align: right;
				}

				.personal-item-value {
					@include text-ellipsis(1);
				}

				.personal-item-value-edit {
					width: 220px;

					:deep(.el-input__wrapper) {
						width: 100%;
					}
				}
			}
		}
	}

	.edit-btn {
		padding: 30px 0 0 222px;
	}

	.personal-info {
		.personal-info-more {
			float: right;
			color: var(--el-text-color-secondary);
			font-size: 13px;

			&:hover {
				color: var(--color-primary);
				cursor: pointer;
			}
		}

		.personal-info-box {
			height: 130px;
			overflow: hidden;

			.personal-info-ul {
				list-style: none;

				.personal-info-li {
					font-size: 13px;
					padding-bottom: 10px;

					.personal-info-li-title {
						display: inline-block;
						@include text-ellipsis(1);
						color: var(--el-text-color-secondary);
						text-decoration: none;
					}

					& a:hover {
						color: var(--color-primary);
						cursor: pointer;
					}
				}
			}
		}
	}

	.personal-recommend-row {
		.personal-recommend-col {
			.personal-recommend {
				position: relative;
				height: 100px;
				color: var(--color-whites);
				border-radius: 3px;
				overflow: hidden;
				cursor: pointer;

				&:hover {
					i {
						right: 0px !important;
						bottom: 0px !important;
						transition: all ease 0.3s;
					}
				}

				i {
					position: absolute;
					right: -10px;
					bottom: -10px;
					font-size: 70px;
					transform: rotate(-30deg);
					transition: all ease 0.3s;
				}

				.personal-recommend-auto {
					padding: 15px;
					position: absolute;
					left: 0;
					top: 5%;

					.personal-recommend-msg {
						font-size: 12px;
						margin-top: 10px;
					}
				}
			}
		}
	}

	.personal-edit {
		.personal-edit-title {
			position: relative;
			padding-left: 10px;
			color: var(--el-text-color-regular);

			&::after {
				content: '';
				width: 2px;
				height: 10px;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				background: var(--color-primary);
			}
		}

		.personal-edit-safe-box {
			border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
			padding: 15px 0;

			.personal-edit-safe-item {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.personal-edit-safe-item-left {
					flex: 1;
					overflow: hidden;

					.personal-edit-safe-item-left-label {
						color: var(--el-text-color-regular);
						margin-bottom: 5px;
					}

					.personal-edit-safe-item-left-value {
						color: var(--el-text-color-secondary);
						@include text-ellipsis(1);
						margin-right: 15px;
					}
				}
			}

			&:last-of-type {
				padding-bottom: 0;
				border-bottom: none;
			}
		}
	}
}
</style>
