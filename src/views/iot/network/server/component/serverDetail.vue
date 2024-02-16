<!--
 * @Author: vera_min vera_min@163.com
 * @Date: 2022-09-05 08:41:57
 * @LastEditors: vera_min vera_min@163.com
 * @LastEditTime: 2022-09-06 17:18:19
 * @FilePath: /sagoo-admin-ui/src/views/network/tunnel/component/serverDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- 服务器详情页 -->
<template>
    <el-descriptions :column="2" border>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">名称</div>
            </template>
            {{detail.name}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">类型</div>
            </template>
            {{detail.types}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">地址</div>
            </template>
            {{detail.addr}}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">状态</div>
            </template>
            {{ detail.status ? '启动' : '未启动' }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">禁用</div>
            </template>
            <el-switch :loading="loading" :before-change="onChangeStatus" :disabled="!detail.status" :active-value="0" :inactive-value="1" size="small" v-model="detail.status" />
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">创建时间</div>
            </template>
            {{ detail.createdAt }}
        </el-descriptions-item>
    </el-descriptions>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, defineComponent } from 'vue';
import { ElMessage } from 'element-plus';
import api from '/@/api/network';

interface TableDataState {
    loading: boolean
}
export default defineComponent({
    name: 'serverDetail',
    props: {
        detail: {
            type: Object,
            default: () => {}
        }
    },
    setup(props) {
        const state = reactive<TableDataState>({
            loading: false
        });
        onMounted(() => {
        });
        // 禁用状态
        const onChangeStatus = () => {
            state.loading = true
            return new Promise(() => {
                api.server.changeServerStatus({ id: props.detail.id, status: 0 }).then(() => {
                    state.loading = false
                    ElMessage.success('已关闭');
                    props.detail.status = 0
                })
            })

        };
        return {
            onChangeStatus,
            ...toRefs(props),
            ...toRefs(state),
        };
    }
});
</script>

