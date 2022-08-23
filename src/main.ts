import { createApp } from 'vue';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import { directive } from '/@/utils/directive';
import { i18n } from '/@/i18n/index';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';
import mitt from 'mitt';
import VueGridLayout from 'vue-grid-layout';
import { getUpFileUrl, handleTree, selectDictLabel } from "/@/utils/common";
import { useDict } from "/@/api/common/dict/data";
// 分页组件
import pagination from '/@/components/pagination/index.vue'
import 'amis/sdk/sdk.js';
import 'amis/lib/themes/default.css';
// 引入百度地图组件
// import BaiduMap from 'vue-baidu-map-3x'

const app = createApp(App);

directive(app);
other.elSvg(app);

app.component('pagination', pagination)
app.use(router)
    .use(store, key)
    .use(ElementPlus, { i18n: i18n.global.t })
    .use(i18n)
    .use(VueGridLayout)
    // .use(BaiduMap, { ak: 'Kp8XHK81HSF6rfRkYP7OxYKtK8IaG51d', type: 'WebGl', v: '2.0' })
    .mount('#app');

// 全局挂载
app.config.globalProperties.getUpFileUrl = getUpFileUrl
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.useDict = useDict
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.mittBus = mitt();
