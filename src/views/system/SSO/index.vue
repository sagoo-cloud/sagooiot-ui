<!-- 单点登录列表 -->
<template>
  <div class="page-full">
    <el-card shadow="nover" class="page-full-part">
      <el-form :model="params" inline ref="queryRef">
        <el-form-item prop="deptName" class="mr10">
          <el-input @keyup.enter.native="getList" style="width: 240px;" v-model="params.keyWord" placeholder="请输入关键字进行搜索" clearable />
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
          <el-button type="primary" @click="addOrEdit()">
						<el-icon>
							<ele-FolderAdd />
						</el-icon>
						新增模版
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
        <el-table-column label="图标" prop="img" align="center">
          <template #default="scope">
						<img style="width: 40px;height: 40px;" :src="scope.row.img" alt="">
					</template>
        </el-table-column>
        <el-table-column label="默认角色" prop="defRole" align="center">
          <template #default="scope">
						{{formatName("role", scope.row.defRole)}}
					</template>
        </el-table-column>
        <el-table-column label="默认岗位" prop="defPost" align="center">
          <template #default="scope">
						{{formatName("post", scope.row.defPost)}}
					</template>
        </el-table-column>
        <el-table-column label="默认部门" prop="defDept" align="center">
          <template #default="scope">
						{{formatName("dept", scope.row.defDept)}}
					</template>
        </el-table-column>
        <el-table-column width="110" label="操作" fixed="right" prop="handle" align="center">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="addOrEdit(scope.row)">编辑</el-button>
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

    <addOrEditItem ref="addOrEditItemRef"   @updateList="getList()"/>

  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue'
import api from '/@/api/SSO';
import apiSystem from '/@/api/system';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSearch } from "/@/hooks/useCommon"
import { useRouter } from 'vue-router';

const addOrEditItem =  defineAsyncComponent(() => import('./component/addOrEditItem.vue'));
const roleList = ref([]);
const postList = ref([]);
const deptList = ref([]);

const { params, tableData, getList, loading } = useSearch<any[]>(
  api.SSO.getList,
  "Data"
)

const getRoleList = () => {
	apiSystem.role.getList({status: -1}).then((res: any) => {
    roleList.value = res;
	});
}
const getPostList = () => {
	apiSystem.post.getList({status: -1}).then((res: any) => {
    postList.value = res;
	});
}
const getDeptList = () => {
	apiSystem.dept.getList({status: -1}).then((res: any) => {
    deptList.value = res;
	});
}
getList();
getRoleList();
getPostList();
getDeptList();

const formatName = (key:string, value:any) => {
  if(key === "role") {
    const data:any =  roleList.value.filter((item:any) => { return item.id === value });
    return data[0].name;
  }
  if(key === "post") {
    const data:any =  postList.value.filter((item:any) => { return item.postId === value });
    return data[0].postName;
  }
  if(key === "dept") {
    const data:any =  deptList.value.filter((item:any) => { return item.deptId === value });
    return data[0].deptName;
  }
}

const addOrEditItemRef = ref();

const addOrEdit = async (row?: any) => {
	addOrEditItemRef.value.open(row);
};

/** 重置按钮操作 */
const resetQuery = () => {
	params.keyWord = ""
  getList();
};

/**
 * 单一删除
 */
const onDel = (row: any) => {
	ElMessageBox.confirm(`此操作将删除：“${row.accNumber}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	}).then(async () => {
		await api.SSO.deleteItem({ ids: [row.id] });
		ElMessage.success('删除成功');
		getList();
	});
};
</script>
