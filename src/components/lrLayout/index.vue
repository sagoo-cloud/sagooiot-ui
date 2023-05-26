<template>
  <div :class="cls">
    <div class="column-left" v-show="showSideTree" :class="{ close: !state.isOpen }" :style="{ width: state.realWidth }">
      <div class="slot-box" v-show="state.isOpen">
        <slot name="left" />
      </div>
      <!-- 展开/收起 -->
      <div v-if="collapsable" class="toggle-arrow" @click="toggle">
        <i class="iconfont icon-zhankai-" v-show="!state.isOpen"> &lt; </i>
        <i v-show="state.isOpen" class="iconfont icon-zhankai" > &gt; </i>
      </div>
    </div>
    <div class="column-right">
      <slot name="right" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue'
const props = defineProps({
  cls: {
    type: String,
    default: 'column',
  },
  width: {
    type: String,
    default: '200px',
  },
  collapsable: {
    type: Boolean,
    default: true,
  },
  showSideTree: {
    type: Boolean,
    default: true,
  },
})
const state = reactive({
  isOpen: true,
  realWidth: '',
})
onMounted(() => {
  state.realWidth = props.width
})
const toggle = () => {
  state.realWidth = state.isOpen ? '0px' : props.width
  setTimeout(() => {
    state.isOpen = !state.isOpen
  }, 100)
}
</script>
<style lang="scss" scoped>
.column {
  height: calc(100vh - 120px);
  overflow: hidden;
}
.column2 {
  height: calc(100vh - 120px);
  overflow: hidden;
}
.column5 {
  height: calc(100vh - 450px);
  overflow: hidden;
}
.column-left {
  float: left;
  width: 275px;
  height: 100%;
  margin-right: 15px;
  position: relative;
  transition: width 0.3s;
  border-right: 1px solid #EAEAEA;
  &:hover {
    .toggle-arrow {
      display: block;
    }
  }
  .slot-box {
    height: 100%;
  }
}
.column-right {
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}
.column-right::-webkit-scrollbar {
  width: 0px;
  height: 1px;
}
// 收缩箭头
.toggle-arrow {
  width: 15px;
  height: 28px;
  display: none;
  color: #b8b8b8;
  line-height: 28px;
  text-align: center;
  position: absolute;
  right: -15px;
  top: 12px;
  background-color: #fff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 1px solid #EAEAEA;
  cursor: pointer;
}
.close {
  height: 100%;
  border-right: 1px solid #EAEAEA;
  .toggle-arrow {
    display: block;
  }
}
</style>
