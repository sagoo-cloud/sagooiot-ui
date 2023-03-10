<template>
  <el-form ref="loginForm" size="large" class="login-content-form" :model="ruleForm" :rules="formRules">
    <el-form-item class="login-animation1" prop="userName">
      <el-input type="text" :placeholder="$t('message.account.accountPlaceholder1')" v-model="ruleForm.userName" clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-User />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="password">
      <el-input :type="isShowPassword ? 'text' : 'password'" :placeholder="$t('message.account.accountPlaceholder2')" v-model="ruleForm.password" autocomplete="off" @keyup.enter="onSignIn">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock />
          </el-icon>
        </template>
        <template #suffix>
          <i class="iconfont el-input__icon login-content-password" :class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'" @click="isShowPassword = !isShowPassword">
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation3" prop="captcha">
      <el-col :span="15">
        <el-input type="text" maxlength="4" :placeholder="$t('message.account.accountPlaceholder3')" v-model="ruleForm.captcha" clearable autocomplete="off" @keyup.enter="onSignIn">
          <template #prefix>
            <el-icon class="el-input__icon">
              <ele-Position />
            </el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <div class="login-content-code">
          <img class="login-content-code-img" @click="getCaptcha" width="130" height="38" :src="captchaSrc" style="cursor: pointer" />
        </div>
      </el-col>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button type="primary" class="login-content-submit" @click="onSignIn" :loading="loading.signIn">
        <span>{{ $t('message.account.accountBtnText') }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, computed, onMounted, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { useStore } from '/@/store/index';
import { Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import api from '/@/api/system';
export default defineComponent({
  name: 'loginAccount',
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
      isShowPassword: false,
      ruleForm: {
        userName: 'demo',
        password: 'demo123456',
        captcha: '',
        VerifyKey: '',
      },
      formRules: {
        userName: [{ required: true, trigger: 'blur', message: '?????????????????????' }],
        password: [{ required: true, trigger: 'blur', message: '??????????????????' }],
        captcha: [{ required: true, trigger: 'blur', message: '?????????????????????' }],
      },
      loading: {
        signIn: false,
      },
      captchaSrc: '',
    });
    onMounted(() => {
      getCaptcha();
    });
    // ????????????
    const currentTime = computed(() => {
      return formatAxis(new Date());
    });

    const getCaptcha = () => {
      api.login.captcha().then((res: any) => {
        state.captchaSrc = res.img;
        state.ruleForm.VerifyKey = res.key;
      });
    };

    // ??????
    const onSignIn = () => {
      // ????????????
      proxy.$refs.loginForm
        .validate((valid: boolean) => {
          if (valid) {
            state.loading.signIn = true;
            api.login
              .login(state.ruleForm)
              .then(async (res: any) => {
                const userInfos = res.userInfo;
                userInfos.avatar = proxy.getUpFileUrl(userInfos.avatar);
                // ?????? token ??????????????????
                Session.set('token', res.token);
                localStorage.setItem('token', res.token);
                // ????????????????????????????????????
                Session.set('userInfo', userInfos);
                await store.dispatch('userInfos/setUserInfos', userInfos);

                currentUser();
              })
              .catch(() => {
                state.loading.signIn = false;
                getCaptcha();
              });
          }
        })
        .catch(() => { });
    };
    // ????????????????????????
    const currentUser = async () => {
      api.login.currentUser().then(async (res: any) => {
        // ??????????????????
        Session.set('userMenu', res.Data || []);
        store.dispatch('requestOldRoutes/setBackEndControlRoutes', res || []);
        if (!store.state.themeConfig.themeConfig.isRequestRoutes) {
          // ?????????????????????2????????????????????????
          await initFrontEndControlRoutes();
          signInSuccess();
        } else {
          // ???????????????????????????isRequestRoutes ??? true??????????????????????????????
          // ????????????????????????????????? router ??????????????????????????? No match found for location with path "/"
          await initBackEndControlRoutes();
          // ????????? initBackEndControlRoutes???????????? signInSuccess
          signInSuccess();
        }
      });
      // // ??????????????????
      // Session.set('permissions', res.data.permissions);
      // // 1????????????????????????(?????????????????????vuex)
      // await store.dispatch('userInfos/setPermissions', res.data.permissions);
    };
    // ????????????????????????
    const signInSuccess = () => {
      // ????????????????????????????????????
      let currentTimeInfo = currentTime.value;
      // ??????????????????????????????
      // ????????????????????????????????? router ??????????????????????????? No match found for location with path "/"
      // ??????????????????????????????????????????/???????????????????????????????????????????????????????????????
      if (route.query?.redirect) {
        router.push({
          path: route.query?.redirect as string,
          query: route.query.params ? (Object.keys(route.query?.params as string).length > 0 ? JSON.parse(route.query?.params as string) : '') : '',
        });
      } else {
        router.push('/');
      }
      // ??????????????????
      // ?????? loading
      state.loading.signIn = false;
      const signInText = t('message.signInText');
      ElMessage.success(`${currentTimeInfo}???${signInText}`);
    };
    return {
      onSignIn,
      getCaptcha,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
.login-content-form {
	width: 400px;
	margin-top: 20px;

	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}

	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;

		&:hover {
			color: #909399;
		}
	}

	.login-content-code {
		display: flex;
		align-items: center;
		justify-content: space-around;

		.login-content-code-img {
			width: 100%;
			height: 40px;
			line-height: 40px;
			background-color: #ffffff;
			border: 1px solid rgb(220, 223, 230);
			cursor: pointer;
			transition: all ease 0.2s;
			border-radius: 4px;
			user-select: none;

			&:hover {
				border-color: #c0c4cc;
				transition: all ease 0.2s;
			}
		}
	}

	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
