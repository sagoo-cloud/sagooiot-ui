<!--
 * @Author: vera_min vera_min@163.com
 * @Date: 2022-09-05 08:41:57
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2022-09-05 09:33:15
 * @FilePath: /sagoo-admin-ui/src/views/network/tunnel/component/serverDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- 服务器详情页 -->
<template>
	<div class="server-detail-wrap">
        <div class="server-detail-item-wrap">
            <div class="label">名称</div>
            <div class="value">{{detail.name}}</div>
        </div>
        <div class="server-detail-item-wrap">
            <div class="label">类型</div>
            <div class="value">{{detail.types}}</div>
        </div>
        <div class="server-detail-item-wrap">
            <div class="label">地址</div>
            <div class="value">{{detail.addr}}</div>
        </div>
        <div class="server-detail-item-wrap">
            <div class="label">状态</div>
            <div class="value">{{detail.status?'启动':'未启动'}}</div>
        </div>
         <div class="server-detail-item-wrap">
            <div class="label">禁用</div>
            <div class="value">
                <el-switch @change="onChangeStatus(detail.status)" :disabled="!detail.status" active-text="启" inactive-text="禁" :active-value="1"  :inactive-value="0" size="small" v-model="value1" />
            </div>
        </div>
        <div class="server-detail-item-wrap">
            <div class="label">创建时间</div>
            <div class="value">{{detail.createdAt}}</div>
        </div>
    </div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';

import api from '/@/api/network';

interface TableDataState {
	// detail: object,
    value1: boolean
}
export default defineComponent({
	name: 'serverDetail',
	props: {
		detail: {
			type: Object,
			default: ''
		}
	},
	setup(props, context) {
		const state = reactive<TableDataState>({
            value1: true
		});
        const onChangeStatus = (status: any) => {
            console.log(status)
        };
		onMounted(() => {
            console.log(props.detail)
		});
		return {
            onChangeStatus,
			...toRefs(props),
			...toRefs(state),
		};
	}
});
</script>

<style lang="scss" scoped>
.server-detail-wrap {
    .server-detail-item-wrap {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-left: 1px solid var(--el-border-color-light);
        border-top: 1px solid var(--el-border-color-light);
        border-right: 1px solid var(--el-border-color-light);
    }
    .server-detail-item-wrap:last-child {
        border-bottom: 1px solid var(--el-border-color-light);
    }
}
</style>

