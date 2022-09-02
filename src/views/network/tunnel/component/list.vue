<template>
    <div>
        <el-table v-loading="loading" border stripe :data="data" style="width: 100%">
            <el-table-column align="center" prop="id" label="ID" width="80"/>
            <!-- <el-table-column align="center" prop="server" label="服务器"/> -->
            <el-table-column align="center" prop="name" label="名称"/>
            <el-table-column align="center" prop="types" label="类型"/>
            <el-table-column align="center" prop="addr" label="地址"/>
            <el-table-column show-overflow-tooltip align="center" prop="createdAt" label="创建时间" width="170"/>
            <!-- <el-table-column align="center" prop="last" label="最近上线"/> -->
            <el-table-column align="center" prop="types" label="状态">
                <template #default="scope">
                    <el-tag v-if="!scope.row.status" class="ml-2" type="danger">离线</el-tag>
                    <el-tag v-else class="ml-2" type="success">在线</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template #default="scope">
                    
                    <router-link :to="'/network/tunnel/detail/' + scope.row.id" class="link-type" style="padding-right: 12px; font-size: 12px;color: #409eff;">
                        <el-button size="small" type="text">详情</el-button>
                    </router-link>
                    <el-button size="small" link key="info" type="info" @click="onOpenEditSign(scope.row)">编辑</el-button>
                   
                    <el-popover placement="bottom" :width="160" trigger="click">
                        <template #reference>
                            <el-button  size="small" type="text" class="more-btn" @click="isShowMore = !isShowMore">更多
                                <i style="margin-left: 2px;" :class="isShowMore ? 'fa fa-angle-down':'fa fa-angle-up'"></i>
                            </el-button>
                        </template>
                    <div class="more-opearte-wrap">
                        <el-button link size="small" key="success" type="success">启 用</el-button>
                        <el-divider direction="vertical" />
                        <el-button link size="small" key="warning" type="warning">禁 用</el-button>
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
		queryForm: {
			type: Object,
			default: () => {},
		},
    },
    setup(props, { emit }) {
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
            fetchList()
		};
        // 获取数据
        const fetchList = () => {
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
        // 删除
		const onRowDel = (row: TableDataForm) => {
			ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.name}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					api.deleteItem({ids: [row.id]}).then((res: any) => {
						fetchList()
						ElMessage.success('删除成功');
					});
				})
				.catch(() => {});
		};
        // 监听双向绑定 queryForm 的变化
		watch(
            () => props.queryForm,
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