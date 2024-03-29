<template>
  <div>
    <textarea ref="editor"></textarea>
  </div>
</template>
<script setup lang="ts">
// 引入全局实例
import _CodeMirror from "codemirror/lib/codemirror.js";
// 核心样式

import "codemirror/theme/oceanic-next.css";
import "codemirror/theme/ayu-mirage.css";
import "codemirror/theme/abcdef.css";
import "codemirror/theme/abbott.css";
import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/material-ocean.css";
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
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
  onchange: {
    type: Object as any,
    required: false,
    default: () => {},
  },
  cursorBlinkRate: {
    type: Number,
    required: false,
    default: -1,
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
    theme: "ayu-mirage",
    matchTags: { bothTags: true },
    foldGutter: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    scrollbarStyle: "simple",
    extraKeys: {
      "Alt-F": "findPersistent",
    },
    readOnly: props.readOnly,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"]
  });
  coder.setValue(props.content)
  coder.on('change', props.onchange)
  coder.setOption('cursorBlinkRate', props.cursorBlinkRate);
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
  coder.setOption("mode", mode);
}

/**
 * 对外提供取值
 */
const getValue = () => {
  return coder.getValue();
};

const setOption = (name: string, value: any) => {
  return coder.setOption(name, value)
}

defineExpose({
  setValue,
  getValue,
  setMode,
  setOption,
})
</script>
