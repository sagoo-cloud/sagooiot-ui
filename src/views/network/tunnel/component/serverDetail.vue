<!-- 服务器详情页 -->
<template>
	<div class="server-detail-wrap">
        <div class="server-detail-item-wrap">
            <div class="label">名称</div>
            <div class="value">{{detail.name}}</div>
        </div>
        <div class="server-detail-item-wrap">
            <div class="label">类型</div>
            <div class="value">tcp</div>
        </div>
        <div class="server-detail-item-wrap">
            <div class="label">地址</div>
            <div class="value">8888</div>
        </div>
        <div class="server-detail-item-wrap">
            <div class="label">状态</div>
            <div class="value">启动</div>
        </div>
         <div class="server-detail-item-wrap">
            <div class="label">禁用</div>
            <div class="value">
                <el-switch size="small" v-model="value1" />
            </div>
        </div>
        <div class="server-detail-item-wrap">
            <div class="label">创建时间</div>
            <div class="value">2022-09-02 17:12:10</div>
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
		onMounted(() => {
            console.log(state.detail)
		});
		return {
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

