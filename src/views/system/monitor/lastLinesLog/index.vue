<template>
  <div class="page">
    <el-card shadow="nover">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="服务日志" name="1"> </el-tab-pane>
        <el-tab-pane label="数据库日志" name="2"> </el-tab-pane>
        <el-tab-pane label="运行日志" name="3"> </el-tab-pane>
      </el-tabs>
      <!-- 日志列表 -->
      <el-table ref="table" v-if="activeName === '1'" :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
        <el-table-column prop="name" label="文件名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="size" label="大小" show-overflow-tooltip></el-table-column>
        <el-table-column prop="changeAt" label="修改时间" min-width="100" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" text type="primary" v-if="!scope.row.folderName" @click="view(scope.row)">详情
            </el-button>
            <el-button size="small" text type="warning" v-auth="'download'" @click="down(scope.row)">下载</el-button>
            <el-button size="small" text type="info" v-auth="'del'" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 数据库日志 -->
      <el-table v-else-if="activeName === '2'" :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
        <el-table-column prop="name" label="文件名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="size" label="大小" show-overflow-tooltip></el-table-column>
        <el-table-column prop="changeAt" label="修改时间" min-width="100" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" text type="primary" v-if="!scope.row.folderName" @click="view(scope.row)">详情
            </el-button>
            <el-button size="small" text type="warning" v-auth="'download'" @click="down(scope.row)">下载</el-button>
            <el-button size="small" text type="info" v-auth="'del'" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template v-else>

        <!-- 运行日志 -->
        <div v-for="line in topMsg" :key="line" class="error-line">{{ line }}</div>
        <div v-if="runButtonShow" v-loading="runLoading" v-for="line in runMessage" :key="line" class="error-line">{{ line }}</div>
        <div v-else class="error-line">暂无数据</div>
        <div class="run-button" v-if="runButtonShow">
          <el-button size="small" text type="warning" v-auth="'download'" @click="down">下载</el-button>
          <el-button size="small" text type="danger" v-auth="'del'" @click="onRowDel">删除</el-button>
        </div>
      </template>

      <el-dialog v-model="dialogVisible" title="查看详情">
        <div v-for="line in topMsg" :key="line" class="error-line">{{ line }}</div>
        <div v-for="line in errorMessage" :key="line" class="error-line">{{ line }}</div>
      </el-dialog>
      <el-dialog v-model="dialogVisible" title="查看详情">
        <div v-for="line in topMsg" :key="line" class="error-line">{{ line }}</div>
        <div v-for="line in errorMessage" :key="line" class="error-line">{{ line }}</div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import api from '/@/api/system';
import { useSearch } from '/@/hooks/useCommon';
import getOrigin from '/@/utils/origin'
import downloadFile from '/@/utils/download';
import { ref, getCurrentInstance, nextTick, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";

const dialogVisible = ref(false);
const errorMessage = ref([]);
const runMessage = ref([]);
const topMsg = ref([]);
const activeName = ref('1');
const types = ref('service');
const runLoading = ref(false);
const isScrolling = ref(false);
const chatContent: any = ref(null);
const runButtonShow = ref(false);
const runLogName = ref('');

const { params, tableData, getList, loading } = useSearch<any[]>(api.lastLinesLog.getList, 'list', { types: types.value });

getList();

onMounted(() => {
  chatContent.value = document.getElementsByClassName('chatdoom')[0]
  scrollBottom()
})

const scrollBottom = () => {
  nextTick(() => {
    //注意要使用nextick以免获取不到dom
    if (!isScrolling.value) {
      // chatContent.value.scrollTop = chatContent.value.scrollHeight - chatContent.value.offsetHeight
      chatContent.value.scrollTop = chatContent.value.offsetHeight
      console.log(chatContent.value.scrollTop);
    }
  })
}

const view = (row: any) => {
  if (types.value == 'run') {
    row.name = row.value;
  }
  const es = new EventSource(getOrigin(import.meta.env.VITE_SERVER_URL + "/subscribe/logInfo?name=" + row.name + '&types=' + types.value));
  es.addEventListener('log', ({ data }) => {
    topMsg.value.unshift(data);
  });
  api.lastLinesLog.detail({ name: row.name, types: types.value }).then((res: any) => {
    if (types.value == 'run') {
      runMessage.value = res.list;
      runLoading.value = false;
      if (res.list.length > 0) {
        runButtonShow.value = true;
      }
    } else {
      errorMessage.value = res.list;
      dialogVisible.value = true;
    }
  });
};
const down = (row: any) => {
  if (types.value == 'run') {
    row.name = runLogName.value
  }
  api.lastLinesLog.down({ name: row.name, types: types.value }).then((res: any) => downloadFile(res, types.value + "-" + row.name))
};

const onRowDel = (row: any) => {
  if (types.value == 'run') {
    row.name = runLogName.value
  }
  let msg = '你确定要删除所选数据？';
  ElMessageBox.confirm(msg, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    api.lastLinesLog.delete({ name: row.name, types: types.value }).then(() => {
      params.types = types.value;
      if (types.value == 'run') {
        runButtonShow.value = false;
      } else {
        getList()
      }
      ElMessage.success('删除成功');
    });
  }).catch(() => { });
};

// 切换tab
const handleClick = (tab: any, event: Event) => {
  if (tab.props.name == 1) {
    types.value = 'service';
    // 获取日志列表
    params.types = types.value;
    getList()
  } else if (tab.props.name == 2) {
    types.value = 'sql'
    params.types = types.value;
    getList();
  } else if (tab.props.name == 3) {
    runLoading.value = true;
    types.value = 'run'
    runLogName.value = 'sagoo-admin.log'
    params.type = types.value
    view(runLogName)
  }
}
</script>
<style scoped>
.run-button {
  position: fixed;
  bottom: 50px;
  right: 80px;
}

.runMessage {
  height: 500px;
}

.content-box {
  width: 100%;
  padding: 5px 20px 20px 20px;
}

.error-line {
  white-space: pre-line;
  /* 保留换行符 */
}

.el-tabs--card {
  height: calc(100vh - 110px);
  overflow-y: auto;
}

</style>
