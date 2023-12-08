<template>
  <div>
    <div class="content-box chatdoom">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">

        <!-- 日志列表 -->
        <el-tab-pane label="服务日志" name="1">
          <el-card shadow="hover">
            <el-table ref="table" :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
              <el-table-column prop="name" label="文件名" show-overflow-tooltip></el-table-column>
              <el-table-column prop="size" label="大小" show-overflow-tooltip></el-table-column>
              <el-table-column prop="changeAt" label="修改时间" min-width="100" align="center"></el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                  <el-button size="small" text type="primary" v-if="!scope.row.folderName"
                             @click="view(scope.row)">详情
                  </el-button>
                  <el-button size="small" text type="info" v-auth="'download'" @click="down(scope.row)">下载</el-button>
                  <el-button size="small" text type="danger" v-auth="'del'" @click="onRowDel(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-dialog v-model="dialogVisible" title="查看详情">
            <div v-for="line in topMsg" :key="line" class="error-line">{{ line }}</div>
            <div v-for="line in errorMessage" :key="line" class="error-line">{{ line }}</div>
          </el-dialog>
        </el-tab-pane>

        <!-- 数据库日志 -->
        <el-tab-pane label="数据库日志" name="2">
          <el-card shadow="hover">
            <el-table :data="tableData" style="width: 100%" row-key="id" v-loading="loading">
              <el-table-column prop="name" label="文件名" show-overflow-tooltip></el-table-column>
              <el-table-column prop="size" label="大小" show-overflow-tooltip></el-table-column>
              <el-table-column prop="changeAt" label="修改时间" min-width="100" align="center"></el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                  <el-button size="small" text type="primary" v-if="!scope.row.folderName"
                             @click="view(scope.row)">详情
                  </el-button>
                  <el-button size="small" text type="info" v-auth="'download'" @click="down(scope.row)">下载</el-button>
                  <el-button size="small" text type="danger" v-auth="'del'" @click="onRowDel(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-dialog v-model="dialogVisible" title="查看详情">
            <div v-for="line in topMsg" :key="line" class="error-line">{{ line }}</div>

            <div v-for="line in errorMessage" :key="line" class="error-line">{{ line }}</div>
          </el-dialog>
        </el-tab-pane>

        <!-- 运行日志 -->
        <el-tab-pane label="运行日志" name="3" class="runMessage">
          <!-- 运行日志 -->
          <div v-if="runButtonShow" v-loading="runLoading" v-for="line in runMessage" :key="line" class="error-line">{{ line }}</div>
          <div v-else class="error-line">暂无数据</div>

          <div class="run-button" v-if="runButtonShow">
            <el-button size="small" text type="info" v-auth="'download'" @click="down">下载</el-button>
            <el-button size="small" text type="danger" v-auth="'del'" @click="onRowDel">删除</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import api from '/@/api/system';
import {useSearch} from '/@/hooks/useCommon';
import getOrigin from '/@/utils/origin'
import downloadFile from '/@/utils/download';
import {ref, getCurrentInstance, nextTick, onMounted} from 'vue';
import {ElMessage, ElMessageBox} from "element-plus";

const dialogVisible = ref(false);
const errorMessage = ref([]);
const runMessage = ref([]);
const topMsg = ref([]);
const activeName = '1';
const typo = ref('service');
const runLoading = ref(false);
const { proxy } = getCurrentInstance() as any;
const isScrolling = ref(false);
const chatContent: any = ref(null);
const runButtonShow = ref(false);

const {params, tableData, getList, loading} = useSearch<any[]>(api.lastLinesLog.getList, 'list', {typo: typo.value});

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
  const es = new EventSource(getOrigin(import.meta.env.VITE_SERVER_URL + "/subscribe/logInfo?name=" + row.name + '&typo=' + typo.value));
  es.addEventListener('log', ({data}) => {
    topMsg.value.unshift(data);
  });
  api.lastLinesLog.detail({name: row.name, typo: typo.value}).then((res: any) => {
    errorMessage.value = res.list;
    dialogVisible.value = true;
  });
};
const down = (row: any) => {
  if (typo.value == 'run') {
    row.name = 'sagoo-admin.log'
  }
  api.lastLinesLog.down({name: row.name, typo: typo.value}).then((res: any) => downloadFile(res, row.name))
};

const onRowDel = (row: any) => {
  if (typo.value == 'run') {
    row.name = 'sagoo-admin.log'
  }
  let msg = '你确定要删除所选数据？';
  ElMessageBox.confirm(msg, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    api.lastLinesLog.delete({name: row.name, typo: typo.value}).then(() => {
      params.typo = typo.value;
      if (typo.value == 'run') {
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
    typo.value = 'service';
    // 获取日志列表
    params.typo = typo.value;
    getList()
  } else if (tab.props.name == 2) {
    typo.value = 'mysql'
    params.typo = typo.value;
    getList();
  } else if (tab.props.name == 3) {
    runLoading.value = true;
    typo.value = 'run'
    params.type = typo.value
    api.lastLinesLog.detail({name: 'sagoo-admin.log', typo: typo.value}).then((res: any) => {
      if (res.list.length > 0) {
        runButtonShow.value = true;
        runMessage.value = res.list;
      }
      runLoading.value = false;
    });
  }
}
</script>
<style scoped>
.run-button {
  position: fixed;
  bottom: 150px;
  right: 60px;
}
.runMessage {
  height: 500px;
}
.content-box {
  background: #fff;
  width: 100%;
  padding: 5px 20px 20px 20px;
}
.error-line {
  white-space: pre-line; /* 保留换行符 */
}
.el-tabs--card {
  height: calc(100vh - 110px);
  overflow-y: auto;
}
.el-tab-pane {
  position: relative;
  //height: calc(100vh - 110px);
  overflow-y: auto;
}
</style>