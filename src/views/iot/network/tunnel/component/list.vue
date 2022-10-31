<template>
    <div>
        <el-table v-loading="loading" :data="data" style="width: 100%">
            <el-table-column align="center" prop="id" label="ID" width="80"/>
            <el-table-column align="center" prop="name" label="名称"/>
            <el-table-column align="center" prop="types" label="类型"/>
            <el-table-column align="center" prop="addr" label="地址"/>
            <el-table-column show-overflow-tooltip align="center" prop="createdAt" label="创建时间" width="170"/>
            <el-table-column align="center" prop="types" label="状态">
                <template #default="scope">
                    <el-tag size="medium" v-if="!scope.row.status" class="ml-2" type="info">未启动</el-tag>
                    <el-tag size="medium" v-else class="ml-2" type="success">启动</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template #default="scope">
                    
                    <el-button @click="toDetail(scope.row.id)" size="small" type="text">详情</el-button>
                    <el-button size="small" link key="info" type="info" @click="toEdit(scope.row.id)">编辑</el-button>
                   
                    <el-popover placement="bottom" :width="160" trigger="click">
                        <template #reference>
                            <el-button  size="small" type="text" class="more-btn" @click="isShowMore = !isShowMore">更多
                                <i style="margin-left: 2px;" :class="isShowMore ? 'fa fa-angle-down':'fa fa-angle-up'"></i>
                            </el-button>
                        </template>
                    <div class="more-opearte-wrap">
                        <el-button @click="onChangeStatus(scope.row.id, 1)" :disabled="scope.row.status" link size="small" key="success" type="success">启 用</el-button>
                        <el-divider direction="vertical" />
                        <el-button @click="onChangeStatus(scope.row.id, 0)" :disabled="!scope.row.status" link size="small" key="warning" type="warning">禁 用</el-button>
                        <el-divider direction="vertical" />
                        <el-button @click="onRowDel(scope.row)" link size="small" key="danger" type="danger">删 除</el-button>
                    </div>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
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
import { ElMessageBox, ElMessage } from 'element-plus';
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
    isShowMore: boolean
}

export default defineComponent({
    name: 'tunnel',
	props: {
		// 输入框前置内容
		keyWord: {
			type: String,
			default: '',
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
            isShowMore: true
            
            
		});
        // 改变状态
        const onChangeStatus = (id: number, status: number) => {
            api.tunnel.changeTunnelStatus({id: id, status: status}).then((res:any) => {
		        ElMessage.success(status?'已开启':'已关闭');
                fetchList();
            })
        };
        // 分页改变
		const onHandleSizeChange = (val: number) => {
			state.param.pageSize = val;
            fetchList()
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.param.page = val;
            fetchList()
		};
        // 初始化表格数据
		const initTableData = () => {
            fetchList()
		};
        // 获取数据
        const fetchList = () => {
            state.loading = true
            let params = {
                keyWord: props.keyWord,
                pageNum: state.param.page,
                PageSize: state.param.pageSize
            }
            api.tunnel.getList(params).then((res: any) => {
                const { list, total, page } = res
                state.data = list
                state.total = total
                state.param.page = page
                state.loading = false
			});


		};
        // 删除
		const onRowDel = (row: TableDataForm) => {
			ElMessageBox.confirm(`此操作将永久删除“${row.name}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.tunnel.deleteItem({ids: [row.id]}).then((res: any) => {
						fetchList()
						ElMessage.success('删除成功');
					});
				})
				.catch(() => {});
		};
        const toDetail = (id: number) => {
            router.push(`/network/tunnel/detail/${id}`)
        };
        const toEdit = (id: number) => {
            router.push(`/network/tunnel/edit/${id}`)
        };
        // 监听双向绑定 keyWord 的变化
		watch(
            () => props.keyWord,
            // 新数据
            () => {
                fetchList()
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
            fetchList,
            toDetail,
            toEdit,
            onChangeStatus,
            onRowDel,
            onHandleSizeChange,
            onHandleCurrentChange,
            ...toRefs(state),
        };
    }
});
</script>

<style lang="scss" scoped>
::v-deep div.more-opearte-wrap {
    flex-direction: row;
    background-color: pink;
    // padding: 4px!important;
    div {
       
    }
    
}
    
</style>