<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="90px">
					<el-form-item label="所属换热站" prop="heatStaId">
						<el-tree-select
							v-model="tableData.param.heatStaId"
							:data="heatList"
							:props="{
								label: 'name',
								children: 'children'
							}"
							node-key="id"
							:clearable="true"
							check-strictly
							size="default"
							style="width: 100%;"
							placeholder="请选择"
							:render-after-expand="true"
						/>
					</el-form-item>
          <el-form-item label="负责人" prop="plotId">
            <el-select v-model="tableData.param.plotId" placeholder="选择负责人" filterable clearable size="default">
							<el-option
								v-for="item in []"
								:key="item.id"
								:label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" v-auth="'query'" class="ml10" @click="queryList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" v-auth="'reset'" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <!-- <el-button size="default" type="success" class="ml10" @click="onOpenDialog()">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              导入
            </el-button> -->
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" v-loading="tableData.loading" style="width: 100%" >
	    	<el-table-column label="换热站名称" prop="station" v-col="'station'"/>
	    	<el-table-column label="换热站编号" prop="stationNo" v-col="'stationNo'"/>
	    	<!-- <el-table-column label="负责人" prop="number" /> -->
	    	<el-table-column label="温度" prop="alarmT" v-col="'alarmT'">
					<template #default="{ row }">
						{{ row.alarmT == '1' ? '报警' : '不报警' }}
					</template>
				</el-table-column>
	    	<el-table-column label="压力" prop="alarmP" v-col="'alarmP'">
					<template #default="{ row }">
						{{ row.alarmP == '1' ? '报警' : '不报警' }}
					</template>
				</el-table-column>
      </el-table>
      <pagination
				v-show="tableData.total>0"
				:total="tableData.total"
				v-model:page="tableData.param.pageNum"
				v-model:limit="tableData.param.pageSize"
				@pagination="queryList"
			/>
    </el-card>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/energyAnalysis';
import heatApi from '/@/api/heatStation';

export default defineComponent({
	name: 'loop',
	setup() {
		const queryRef = ref();
		const state = reactive({
			ids: [],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					code: ''
				},
			},
			heatList: []
		});
		
		const queryTree = () => {
			heatApi.heatStation.getList({
					name: '',
					code: '',
					status: -1
				})
				.then((res: any) => {
					state.heatList = res || [];
				});
		};
		
		const queryList = () => {
			state.tableData.loading = true
			api.getEnergyWaterWarnList({ code: 11 })
				.then((res: any) => {
					console.log(res);
					state.tableData.data = res.list || []
				})
				.finally(() => {
					state.tableData.loading = false
				})
		};
		// 页面加载时
		onMounted(() => {
			queryTree()
			queryList()
		});
		/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			// queryList();
		};

		return {
			queryRef,
			resetQuery,
			...toRefs(state),
		};
	},
});
</script>
