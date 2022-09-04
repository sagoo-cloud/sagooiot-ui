<template>
  <div>
    <textarea ref="editor"></textarea>
  </div>
</template>
<script setup lang="ts">
// 引入全局实例
import _CodeMirror from "codemirror/lib/codemirror.js";
// 核心样式
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/matchesonscrollbar.css";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/xml-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/fold/xml-fold.js";
import "codemirror/addon/edit/matchtags.js";
import "codemirror/addon/display/fullscreen.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/jump-to-line.js";
import "codemirror/addon/scroll/simplescrollbars.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/css/css.js";
import { ref, nextTick } from "vue";
import "codemirror/mode/javascript/javascript.js";

let props = defineProps({
  mode: {
    type: String,
    required: false,
    default: 'htmlmixed'
  },
  content: {
    type: String,
    required: false,
    default: ''
  }
})

const editor = ref();

let coder;

nextTick(() => {
  coder = _CodeMirror.fromTextArea(editor.value, {
    mode: props.mode, // 不设置的话，默认使用第一个引用
    // 缩进格式
    tabSize: 2,
    // 显示行号
    lineNumbers: true,
    lineWrapping: true,
    theme: "material-ocean",
    matchTags: { bothTags: true },
    foldGutter: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    scrollbarStyle: "simple",
    extraKeys: {
      "Alt-F": "findPersistent",
    },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"]
  });
  console.log(props)
  coder.setValue(props.content);
});

/**
 * 对外提供赋值
 */
const setValue = (val: string) => {
  coder.setValue(val);
};

/**
 * 设置模式
 */
const setMode = (mode: string) => {
  console.info(mode)
  coder.setOption("mode", mode);
}

/**
 * 对外提供取值
 */
const getValue = () => {
  return coder.getValue();
};

defineExpose({
  setValue,
  getValue,
  setMode,
})
</script>
