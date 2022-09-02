<template>
    <div class="container">
        <el-card shadow="hover">
            <div class="top-operate-wrap">
                <div class="left">
                    <el-button size="default" type="success" class="ml10">
                        <el-icon>
                            <ele-FolderAdd />
                        </el-icon>
                        新建
                    </el-button>
                    <el-input size="default" style="width: 200px;margin-left: 20px;" class="search-input" v-model="key" placeholder="请输入搜索关键字" clearable>
                    </el-input>
                    <el-button  type="primary" plain size="default" @click="searchData">搜索</el-button>
                </div>
                <div class="right">  
                    <el-button @click="index=1" :class="index==1?'active':''" size="default" class="fa fa-th"></el-button>
                    <el-button @click="index=2" :class="index==2?'active':''" size="default" class="fa fa-list"></el-button>
                </div>        
            </div>
            <!-- 页面主要内容 -->
            <tempalte v-if="index==1">
                <!-- table -->
                <tableTunnel :queryForm="queryParams" />

            </tempalte>

            <tempalte v-if="index==2">
                <!-- list -->
                <listTunnel :queryForm="queryParams" />

            </tempalte>

        </el-card>
        
    </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';

import listTunnel from './component/list.vue';
import tableTunnel from './component/table.vue';

// import api from '/@/api/assess';


// 定义接口来定义对象的类型
interface RuleFormRow {
    title: string;
	
}

interface ItemState {
	queryParams: RuleFormRow;
    index: number;
    key: string;
}

export default defineComponent({
    name: 'tunnalManage',
    components: { listTunnel, tableTunnel },
	setup() {
		const state = reactive<ItemState>({
            index: 2,
			queryParams: {
                title: ''
			},
            key: ''
		});
        const searchData = () => {
            console.log(state.key)
            state.queryParams.title = state.key
        };
        return {
            searchData,
			...toRefs(state),
		};
    },
    
});
</script>

<style lang="scss" scoped>
.container {
    .top-operate-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        .left,
        .right {
            display: flex;
            .el-button:nth-child(2) {
                margin-left: 0;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
            .el-button:nth-child(1) {
               border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                border-right: none;
            }
            .active {
                color: var(--el-button-hover-text-color);
                border-color: var(--el-button-hover-border-color);
                background-color: var(--el-button-hover-bg-color);
                outline: 0;
            }
        }
    }
}
</style>