<template>
  <div class="personal">
    <el-row>
      <!-- 个人信息 -->
      <el-col :xs="24" :sm="24">
        <el-card shadow="hover" header="个人信息" v-loading="!info.userName">
          <div class="personal-user">
            <div class="personal-user-left">
              <!-- <el-upload class="h100 personal-user-left-upload" action="https://jsonplaceholder.typicode.com/posts/" multiple :limit="1">
              <img :src="info.avatar" />
              </el-upload> -->
              <uploadVue @set-img="setImg">
                <img style="width:140px;height:140px" :src="info.avatar" />
              </uploadVue>
            </div>
            <div class="personal-user-right">
              <el-row>
                <el-col :span="24" class="personal-title mb18">{{ currentTime }}，{{info.userName}}，生活变的再糟糕，也不妨碍我变得更好！ </el-col>
                <el-col :xs="24" :sm="24" class="personal-item mb6">
                  <div class="personal-item-label">昵称：</div>
                  <div class="personal-item-value">{{info.userNickname}}</div>
                </el-col>
                <el-col :xs="24" :sm="24" class="personal-item mb6">
                  <div class="personal-item-label">性别：</div>
                  <div class="personal-item-value">{{info.sex=='1'?'男':'女'}}</div>
                </el-col>
                <el-col :xs="24" :sm="24" class="personal-item mb6">
                  <div class="personal-item-label">登录IP：</div>
                  <div class="personal-item-value">{{info.lastLoginIp}}</div>
                </el-col>
                <el-col :xs="24" :sm="24" class="personal-item mb6">
                  <div class="personal-item-label">登录时间：</div>
                  <div class="personal-item-value">{{info.lastLoginTime}}</div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { formatAxis } from '/@/utils/formatTime';
import { ElMessage } from 'element-plus';
import api from '/@/api/system';
import uploadVue from '/@/components/upload-wrapper/index.vue';

const info = ref<any>({})

api.login.currentUser().then((res: any) => {
  console.log(res.Info);
  info.value = res.Info
});

// 当前时间提示语
const currentTime = computed(() => {
  return formatAxis(new Date());
});

const setImg = (img: string) => {
  api.user.setAvatar(info.value.id, img).then((res: any) => {
    ElMessage.success('更新成功')
    info.value.avatar = img
  })
}
</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';
.personal {
	.personal-user {
		height: 130px;
		display: flex;
		align-items: center;
		.personal-user-left {
			// width: 100px;
			// height: 130px;
			// border-radius: 3px;
			::v-deep(.el-upload) {
				height: 100%;
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
				}
				.personal-item-value {
					@include text-ellipsis(1);
				}
			}
		}
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
