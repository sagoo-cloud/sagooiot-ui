<template>
    <div class="container">
        <!-- <el-table v-loading="loading" border stripe :data="data" style="width: 100%">
            <el-table-column align="center" prop="id" label="ID"/>
            <el-table-column align="center" prop="server" label="服务器"/>
            <el-table-column align="center" prop="name" label="名称"/>
            <el-table-column align="center" prop="types" label="类型"/>
            <el-table-column align="center" prop="addr" label="地址"/>
            <el-table-column show-overflow-tooltip align="center" prop="createdAt" label="创建时间"/>
            <el-table-column align="center" prop="last" label="最近上线"/>
            <el-table-column align="center" prop="types" label="状态">
                <template #default="scope">
                    <el-tag v-if="!scope.row.status" class="ml-2" type="danger">离线</el-tag>
                    <el-tag v-else class="ml-2" type="success">在线</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template #default="scope">
                    <el-button size="small" type="text" @click="onRowDel(scope.row)">详情</el-button>

                    <el-button size="small" type="text" @click="onOpenEditSign(scope.row)">编辑</el-button>
                    <el-button size="small" type="text" @click="onRowDetail(scope.row)">更多</el-button>
                </template>
            </el-table-column>
        </el-table> -->
        <div class="content">
            <!-- <section v-for="(item, index) in data" :key="index"> -->
            <el-card class="item" @click="toDetail(item.id)" shadow="hover" v-for="(item, index) in data" :key="index">
                <div class="top-inner-wrap">
                    <span>通道：{{item.id}}</span>
                    <span class="more">更多
                        <i class="fa fa-angle-down"></i>
                        <!-- <ele-ArrowDown /> -->
                    </span>
                </div>
                <div class="content-wrap">
                    <div class="name-and-status">
                        <span>{{item.name}}</span>
                        [
                        <span>{{item.status?'在线':'离线'}}</span>
                        ]
                    </div>
                    <div class="">
                        <span>{{item.types}}</span>
                        <span style="margin-left: 6px;">{{item.name}}</span>
                    </div>
                    
                </div>
            </el-card>
        </div>
        <el-pagination
            @size-change="onHandleSizeChange"
            @current-change="onHandleCurrentChange"
            class="mt15"
            :pager-count="5"
            :page-sizes="[10, 20, 30]"
            v-model:current-page="param.page"
            background
            v-model:page-size="param.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        >
        </el-pagination>
    </div>
    
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, nextTick, computed, watch, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import api from '/@/api/network';

// 定义接口来定义对象的类型
interface TableDataForm {
	id: number;
    server: string;
	name: string;
	
}
interface TableData {
	data:  Array<TableDataForm>;
    total: number;
    loading: boolean;
    param: {
        page: number;
        pageSize: number;
    };
}

export default defineComponent({
    name: 'tunnelTable',
	props: {
		// 输入框前置内容
		queryForm: {
			type: Object,
			default: () => {},
		},
    },
    setup(props, { emit }) {
        const router = useRouter();
        const state = reactive<TableData>({
			data: [],
            total: 0,
            loading: false,
            param: {
                page: 1,
                pageSize: 10,
            },
            
            
		});
        // 分页改变
		const onHandleSizeChange = (val: number) => {
			state.param.pageSize = val;
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.param.page = val;
		};
        // 初始化表格数据
		const initTableData = () => {
            console.log(props.queryForm.title)
            let params = {
                OrderBy: props.queryForm.title,
                pageNum: state.param.page,
                PageSize: state.param.pageSize
            }
            api.getList(params).then((res: any) => {
				console.log(res);
                const { list, total, page } = res
                state.data = list
                state.total = total
                state.param.page = page
			});


		};
        const toDetail = (id: number) => {
            router.push(`/network/tunnel/detail/${id}`)
        };
        // 监听双向绑定 queryForm 的变化
		watch(
            () => props.queryForm,
            // 新数据
            () => {
                initTableData()
            },
            {   deep: true,
                immediate: true
            },
        );
        // 页面加载时
		onMounted(() => {
			initTableData();
		});
        return {
            toDetail,
            onHandleSizeChange,
            onHandleCurrentChange,
            ...toRefs(state),
        };
    }
});
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    .content {
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        .item {
            width: calc((100% - 40px)/3);
            cursor: pointer;
            border-radius: 6px;
            .top-inner-wrap {
                font-size: 15px;
                display: flex;
                justify-content: space-between;
                background: transparent;
                border-bottom: 1px solid var(--el-card-border-color);
                    // border: 1px solid var(--el-card-border-color);
                .more {
                    color: var(--el-color-primary);
                }
            }
            .content-wrap {
                .name-and-status {
                    margin: 12px 0 8px 0;
                }
            }
        }
        .item:not(:nth-child(3n+1)) {
            margin-left: 20px;
        }
        .item:nth-of-type(n+4) {
            margin-top: 20px;
        }
    }
}
</style>