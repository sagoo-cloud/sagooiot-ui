<!-- 平台接入列表 -->
<template>
  <div class="page-full">
    <el-card shadow="nover" class="page-full-part">
      <el-form :model="params" inline ref="queryRef">
        <el-form-item prop="deptName" class="mr10">
          <el-input @keyup.enter.native="getList" style="width: 240px;" v-model="params.keyWord" placeholder="请输入关键字搜索" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
          <el-button @click="resetQuery()">
            <el-icon>
              <ele-Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="primary" @click="toAddItemPage()">
            <el-icon>
              <ele-FolderAdd />
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        max-height="calc(100vh  - 210px);"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column label="名称" prop="name" align="center" />
        <el-table-column label="状态" prop="simStatus" align="center">
          <template #default="scope">
            <el-tag type="primary" v-if="scope.row.status">{{ formatStatus(scope.row.status) }}</el-tag>
            <el-tag type="danger" v-else>{{ formatStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column> 
        <el-table-column label="说明" prop="remark" align="center" />       

        <el-table-column width="110" label="操作" fixed="right" prop="handle" align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenDetail(scope.row)">详情</el-button>
						<el-button size="small" text type="warning" @click="onDel(scope.row)">删除</el-button>
					</template>
        </el-table-column>
      </el-table>
      <pagination
        v-if="params.total"
        :total="params.total"
        v-model:page="params.pageNum"
        v-model:limit="params.pageSize"
        @pagination="getList()"
      />
    </el-card>
    <AddOrEditItem ref="AddOrEditItemRef" @updateList="getList()" />
  </div>
</template>

<script lang="ts" setup>
import api from '/@/api/iotCard';
import { defineAsyncComponent, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from "/@/hooks/useCommon"
const AddOrEditItem = defineAsyncComponent(() => import('./addOrEditItem.vue'));

const { params, tableData, getList, loading } = useSearch<any[]>(
  api.platform.getList,
  "Data"
)
getList();

const AddOrEditItemRef = ref();

/** 重置按钮操作 */
const resetQuery = () => {
	params.keyWord = ""
  getList();
};

/**
 * 单一删除
 */
const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将卡号为：“${row.accNumber}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.simCard.deleteItem({ ids: [row.id] });
		ElMessage.success('删除成功');
		getList();
	});
};

const formatStatus = (val:any) => {
  // 1：开启 0：禁用
  return ['', '开启', '禁用'][val];
}

const onOpenDetail = (item:any) => {
  AddOrEditItemRef.value.openDialog(item);
}

const toAddItemPage = () => {
  AddOrEditItemRef.value.openDialog();
}
</script>
