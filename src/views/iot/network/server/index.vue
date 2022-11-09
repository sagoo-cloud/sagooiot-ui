<template>
    <el-card shadow="hover">
        <el-form :inline="true" label-width="82px">
            <el-form-item label="服务器名称">
                <el-input size="default" style="width: 200px;margin-left: 20px;" class="search-input" v-model="key" placeholder="请输入搜索关键字" clearable>
            </el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="default" type="primary" class="ml10" v-auth="'query'" @click="searchData">
                    <el-icon>
                        <ele-Search />
                    </el-icon>
                    查询
                </el-button>
                <el-button @click="toPage" size="default" type="success" v-auth="'add'" class="ml10">
                    <el-icon>
                        <ele-FolderAdd />
                    </el-icon>
                    新建
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 页面主要内容 -->
        <tempalte>
            <list-server :keyWord="keyWord" />
        </tempalte>
    </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import listServer from './component/list.vue';

// 向组件传递通道名称关键字
let keyWord = ref('');
// 搜索的key
const key = ref('');

// 声明router
const router = useRouter();

// 按照通道名称进行搜索
const searchData = () => {
    keyWord.value= key.value
};
const toPage = () => {
    router.push('/network/server/create')
};
</script>