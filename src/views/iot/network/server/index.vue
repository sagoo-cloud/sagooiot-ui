<template>
  <div class="page">
    <el-card shadow="nover">
      <el-form inline label-width="82px" @keyup.enter="searchData">
        <el-form-item label="服务器名称">
          <el-input style="width: 200px;margin-left: 20px;" class="search-input" v-model="key" placeholder="请输入搜索关键字" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="ml10" v-auth="'query'" @click="searchData">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
          <el-button @click="toPage" type="primary" v-auth="'add'" class="ml10">
            <el-icon>
              <ele-FolderAdd />
            </el-icon>
            新建
          </el-button>
        </el-form-item>
      </el-form>
      <list-server ref="listRef" :keyWord="keyWord" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import listServer from './component/list.vue';

// 向组件传递通道名称关键字
const keyWord = ref('');
const listRef = ref();
// 搜索的key
const key = ref('');

// 声明router
const router = useRouter();

// 按照通道名称进行搜索
const searchData = () => {
  keyWord.value = key.value
  listRef.value && listRef.value.fetchList()
};

const toPage = () => {
  router.push('/iotmanager/network/server/create')
};
</script>