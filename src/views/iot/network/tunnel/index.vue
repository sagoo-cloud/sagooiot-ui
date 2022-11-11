<template>
    <el-card shadow="hover">
        <el-form :inline="true" label-width="68px">
            <el-form-item label="通道名称">
                <el-input size="default" style="width: 200px;margin-left: 20px;" class="search-input" v-model="key" placeholder="请输入搜索关键字" clearable>
            </el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="default" v-auth="'query'" type="primary" class="ml10" @click="searchData">
                    <el-icon>
                        <ele-Search />
                    </el-icon>
                    查询
                </el-button>
                <el-button @click="toPage" v-auth="'add'" size="default" type="success" class="ml10">
                    <el-icon>
                        <ele-FolderAdd />
                    </el-icon>
                    新建
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 页面主要内容 -->
        <tempalte>
            <list-tunnel :keyWord="keyWord" />
        </tempalte>
    </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import listTunnel from './component/list.vue';

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
// 去往新增页面
const toPage = () => {
    router.push('/network/tunnel/create')
};
</script>