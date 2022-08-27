<template>
	<div class="system-dic-container">
		<div class="content">
			<div class="cont_box">
				<div class="title">数据源名称：{{ detail.name }}</div>
				<div class="pro-status" ><span :class="developer_status==1?'on':'off'"></span>{{developer_status==1?'已发布':'未发布'}}</div>
			
				<div class="pro-option"  @click="CkOption"> {{developer_status==1?'停用':'发布'}}</div>
			</div>
		</div>

		<div class="content-box">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">

                    <el-tab-pane label="数据源信息" name="1">
                        
                        <el-form size="default" label-width="110px" :inline="true">

                        <el-divider content-position="left">基本信息</el-divider>

                            <el-form-item label="数据源标识:">
                                  {{detail.key}}
                                </el-form-item>

                                 <el-form-item label="数据源名称:">
                                  {{detail.name}}
                                </el-form-item>
                                 <el-form-item label="数据源描述:">
                                  {{detail.description}}
                                </el-form-item>
                                 <el-form-item label="数据来源:">
                                 
                                  <span v-if="detail.from==1">api导入</span>
                                  <span v-if="detail.from==2">数据库</span>
                                  <span v-if="detail.from==3">文件</span>
                                </el-form-item>

                                	<el-divider content-position="left">规则表达式</el-divider>


                                    <div v-for="(item, index) in rule" :key="index">
                                <el-form-item label="表达式:">
                                   {{item.expression}}
                                </el-form-item>

                                <el-form-item label="参数:" >
                                     {{item.params.name}}~ {{item.params.value}}
                                   
                                </el-form-item>

                                <el-divider content-position="left">数据源配置</el-divider>

                                <el-form-item label="请求方法:" prop="method">
                                        {{config.method}}
                                </el-form-item>
                                <el-form-item label="请求地址:" prop="method">
                                        {{config.url}}
                                </el-form-item>
                                 <el-form-item label="更新时间:" prop="method">
                                        {{config.interval}}
                                        {{config.intervalUnit}}
                                </el-form-item>

                                <el-divider content-position="left">请求参数</el-divider>

                                <div class="content-f" v-for="(item, index) in requestParams" :key="index">

                                <el-form-item label="参数类型:">
                                        {{item.type}}
                                </el-form-item>
                                <el-form-item label="参数标题:">
                                        {{item.name}}
                                </el-form-item>
                                 <el-form-item label="参数名:">
                                        {{item.key}}
                                </el-form-item>
                                 <el-form-item label="参数值:">
                                        {{item.value}}
                                </el-form-item>

                                    
                                       
                                    </div>
                            </div>
                        </el-form>

                    </el-tab-pane>

                    <el-tab-pane label="数据节点" name="2">
                    
                    </el-tab-pane>

                </el-tabs>




        </div>

	</div>
</template>            
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import { useRoute } from 'vue-router';
import api from '/@/api/datahub';

interface TableDataState {
	ids: number[];
	tableData: {
		data: [];
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
			name: string;
			deviceType: string;
			status: string;
			dateRange: string[];
		};
	};
}
export default defineComponent({
    name: 'dataDetail',
    setup(prop, context) {
		const route = useRoute();
        const state = reactive<TableDataState>({
            config: {},
			ruledata: [
				{
					expression: '',
					params: {},
				},
			],
			rule: [
				{
					expression: '',
					params: {
						name: '',
						value: '',
					},
				},
			],
			requestParams: [
				{
					type: '',
					key: '',
					name: '',
					value: '',
				},
			],
          
			isShowDialog: false,
			detail: [],
            activeName: '1',
			developer_status:0,
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
					status: '',
					dateRange: [],
				},
			},
		});



        onMounted(() => {
			const ids = route.params && route.params.sourceId;
			api.common.detail(ids).then((res: any) => {
				state.detail = res.data;
				state.developer_status=res.data.status
				state.config=res.data.apiConfig
				state.requestParams=res.data.apiConfig.requestParams
                res.data.sourceRule.forEach((item, index) => {
						state.rule[index].expression = item.expression;
						state.rule[index].params.name =Object.keys(item.params) ;
						state.rule[index].params.value = item.params[Object.keys(item.params)];
					});

           	
			});

	
		});


        const CkOption=()=>{
                if(state.developer_status==1){
                    api.common.undeploy({sourceId:route.params.sourceId}).then((res: any) => {
                        ElMessage.success('操作成功');
                        state.developer_status=0;
                    });
                }else{
                    api.common.deploy({sourceId:route.params.sourceId}).then((res: any) => {
                        ElMessage.success('操作成功');
                        state.developer_status=1;
                    });
                }
		}
        const handleClick = (tab: TabsPaneContext, event: Event) => {
			console.log(tab, event);
		};

        	return {
			Edit,
            handleClick,
			CkOption,
			...toRefs(state),
		};
    },
});

</script>
<style>
.content {
	background: #fff;
	width: 100%;
	padding: 20px;
}
.content-box {
	background: #fff;
	width: 100%;
	padding: 20px;
	margin-top: 20px;
}
.cont_box {
	display: flex;
}
.cont_box .title {
	font-size: 24px;
}
.cont_box .pro-status {
	line-height: 40px;
	margin-left: 30px;
}
.cont_box .pro-status .on {
	background: #52c41a;
}
.cont_box .pro-status .off {
	background: #c41a1a;
}
.cont_box .pro-status span {
	position: relative;
	top: -1px;
	display: inline-block;
	width: 6px;
	height: 6px;
	vertical-align: middle;
	border-radius: 50%;
	margin-right: 5px;
}
.cont_box .pro-option {
	line-height: 40px;
	margin-left: 10px;
	color: #1890ff;
	cursor: pointer;
}
.content-box .pro-box {
	display: flex;
	padding: 10px;
}
.content-box .pro-box .protitle {
	font-size: 18px;
	font-weight: bold;
	line-height: 35px;
}
.content-box .pro-box .buttonedit {
	border: 0px;
	color: #1890ff;
}
table {
	border-collapse: collapse;
	text-indent: initial;
	border-spacing: 2px;
}
tbody {
	box-sizing: border-box;
	display: table-row-group;
	vertical-align: middle;
	border-color: inherit;
}

tr {
	display: table-row;
	vertical-align: inherit;
	border-color: inherit;
}
.ant-descriptions-view {
	width: 100%;
	overflow: hidden;
	border-radius: 4px;
}
.ant-descriptions-view {
	border: 1px solid #e8e8e8;
}
.ant-descriptions-view table {
	width: 100%;
	table-layout: fixed;
}
.ant-descriptions-view > table {
	table-layout: auto;
}
.ant-descriptions-row {
	border-bottom: 1px solid #e8e8e8;
}
.ant-descriptions-item-label {
	color: rgba(0, 0, 0, 0.85);
	font-weight: 400;
	font-size: 14px;
	line-height: 1.5;
}
.ant-descriptions-item-label {
	padding: 16px 24px;
	border-right: 1px solid #e8e8e8;
}
.ant-descriptions-item-label {
	background-color: #fafafa;
}
.ant-descriptions-item-content {
	padding: 16px 24px;
	border-right: 1px solid #e8e8e8;
	display: table-cell;
	color: rgba(0, 0, 0, 0.65);
	font-size: 14px;
	line-height: 1.5;
}
.wu-box {
	border: #e8e8e8 solid 1px;
	padding: 20px;
	width: 100%;
}
.wu-box .wu-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 20px;
	border-bottom: #e8e8e8 1px solid;
}
.wu-box .wu-title .title {
	font-size: 18px;
}
</style>