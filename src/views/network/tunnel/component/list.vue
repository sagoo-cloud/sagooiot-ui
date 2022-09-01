<template>
    <div>
        <el-table v-loading="loading" border stripe :data="data" style="width: 100%">
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
        // 页面加载时
		onMounted(() => {
			initTableData();
		});
        return {
            onHandleSizeChange,
            onHandleCurrentChange,
            ...toRefs(state),
        };
    }
});
</script>