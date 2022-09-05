<template>
  <div class="page-wrapper page-full">
    <iframe class="iframe" :src="src" frameborder="0"></iframe>
  </div>
</template>

<script setup lang="ts">
import { Session } from '/@/utils/storage';
const src = 'http://home.yanglizhi.cn:10003/?token=' + encodeURIComponent(Session.get('token'))
</script>

<style scoped lang="scss">
  .iframe{
    width: 100%;
    height: 100%;
    background: #fff;
  }
</style>
