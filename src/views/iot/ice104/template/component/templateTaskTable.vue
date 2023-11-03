<template>
    <div>
        <el-form :model="params" :inline="true" ref="queryRef">
            <el-form-item label="点位名称" prop="title">
                <el-input v-model="params.title" placeholder="请输入点位名称" clearablestyle="width: 240px" @keyup.enter.native="getList()" />
            </el-form-item>
            <el-form-item>
                <el-button size="default" type="primary" class="ml10" @click="getList()">
                    <el-icon>
                        <ele-Search />
                    </el-icon>
                    查询
                </el-button>
                <el-button size="default" @click="resetQuery()">
                    <el-icon>
                        <ele-Refresh />
                    </el-icon>
                    重置
                </el-button>
                <el-button type="primary" @click="addOrEdit()">
                    <el-icon>
                        <ele-FolderAdd />
                    </el-icon>
                    新增点位
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="title" label="点位名称"  align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dataAttribName" label="数据项编码" min-width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dataAddress" label="数据项点位" min-width="120" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dataCoef" label="倍率" min-width="120" align="center" show-overflow-tooltip></el-table-column>
             <el-table-column fixed="right" label="操作" width="100" align="center">
                <template #default="scope">
                    <el-button size="small" text type="primary" @click="addOrEdit(scope.row)">修改</el-button>
                    <el-button size="small" text type="info" @click="onDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-if="params.total" :total="params.total" v-model:page="params.pageNum" v-model:limit="params.pageSize" @pagination="getList()" />
        <EditForm ref="editFormRef" @updateList="getList()"></EditForm>
    </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, onMounted } from 'vue';
import api from '/@/api/ice104/index';
import { useI18n } from 'vue-i18n';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from '/@/hooks/useCommonIce104';
import apiDevice from '/@/api/device';
import EditForm from './addOrEditTemplateTask.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { params, tableData, getList, loading } = useSearch(api.deviceTemplate.getList, 'data', { title: '', templateNumber: route.params.id });

const emit = defineEmits(['updateList']);
const editFormRef = ref();
const queryRef = ref();

/**
 * 新增设备任务
 */
const addOrEdit = async (row?: any) => {
	editFormRef.value.open(row);
};

/**
 * 单一删除
 */
const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除接口：“${row.title}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.deviceTemplate.deleteItem({number: row.number});
		ElMessage.success('删除成功');
		getList();
	});
};

// 重置表单
const resetQuery = () => {
	queryRef.value.resetFields();
	getList();
};

// 页面加载时
onMounted(() => {
    getList();
});

// defineExpose({ open })
</script>

<style lang="scss" scoped>
.width100 {
	width: 100%;
}
</style>
