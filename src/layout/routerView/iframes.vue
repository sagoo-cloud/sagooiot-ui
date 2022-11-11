<template>
  <div class="layout-view-bg-white flex mt1" :style="{ height: `calc(100vh - ${setIframeHeight}`, border: 'none' }" v-loading="iframeLoading">
    <div class="jump" @click="jump">
      <img src="/@/assets/open.svg">
    </div>
    <iframe allowfullscreen="true" :src="iframeUrl" frameborder="0" height="100%" width="100%" id="iframe" v-show="!iframeLoading"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, nextTick, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '/@/store/index';
export default defineComponent({
  name: 'layoutIfameView',
  setup() {
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      iframeLoading: true,
      iframeUrl: '',
    });
    // 跳转到新页面
    const jump = () => {
      window.open(state.iframeUrl);
    };
    // 初始化页面加载 loading
    const initIframeLoad = () => {
      state.iframeUrl = <any>route.meta?.linkUrl;
      nextTick(() => {
        state.iframeLoading = true;
        const iframe = document.getElementById('iframe');
        if (!iframe) return false;
        iframe.onload = () => {
          state.iframeLoading = false;
        };
      });
    };
    // 设置 iframe 的高度
    const setIframeHeight = computed(() => {
      let { isTagsview } = store.state.themeConfig.themeConfig;
      let { isTagsViewCurrenFull } = store.state.tagsViewRoutes;
      if (isTagsViewCurrenFull) {
        return `1px`;
      } else {
        if (isTagsview) return `86px`;
        else return `52px`;
      }
    });
    // 页面加载时
    onMounted(() => {
      initIframeLoad();
    });
    // 监听路由变化，多个 iframe 时使用
    watch(
      () => route.path,
      () => {
        initIframeLoad();
      }
    );
    return {
      jump,
      setIframeHeight,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.jump {
	position: absolute;
	top: 12px;
	right: 12px;
	z-index: 10;
	cursor: pointer;
	img {
		width: 40px;
		height: 40px;
		display: block;
	}
}
</style>