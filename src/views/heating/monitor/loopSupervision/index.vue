<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="" prop="">
            <el-radio-group v-model="tableData.param.types" size="default" @change="initTableData">
              <el-radio-button label="station" v-auth="'heatStation'">
                换热站
              </el-radio-button>
              <el-radio-button label="loop" v-auth="'loop'">
                环路
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="环路名称" prop="name">
            <el-input v-model="tableData.param.name" placeholder="环路名称" size="default"></el-input>
          </el-form-item>
          <el-form-item label="环路编号" prop="code">
            <el-input v-model="tableData.param.code" placeholder="环路编号" size="default"></el-input>
            <!-- <el-select v-model="tableData.param.name" placeholder="环路编号" clearable size="default" style="width: 240px">
              <el-option label="已发布" :value="1" />
              <el-option label="未发布" :value="0" />
            </el-select> -->
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" v-auth="'query'" @click="typeList">
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
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange" v-loading="tableData.loading">
        <el-table-column type="index" width="55" label="序号" align="center" />
        <!-- <el-table-column label="日期" v-col="'key'" prop="key" min-width="120" :show-overflow-tooltip="true" /> -->
        <el-table-column :label="tableData.param.types === 'station' ? '换热站' : '环路名称'" v-col="'name'" prop="name" :show-overflow-tooltip="true">
          <template #default="{ row }">
            <el-button type="text" @click="goPage(row)">
              {{ row.name }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="tableData.param.types === 'station' ? '换热站编号' : '环路编号'" v-col="'number'" prop="code" min-width="120" :show-overflow-tooltip="true">
          <template #default="{ row }">
            {{ row.code }}
          </template>
        </el-table-column>
        <el-table-column label="一网供水压力" prop="1nPressure1" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网供水压力" prop="inPressure2" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网供水温度" prop="inTemperature1" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网供水温度" prop="inTemperature2" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网回水压力" prop="outPressure1" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网回水压力" prop="outPressure2" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="一网回水温度" prop="outTemperature1" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网回水温度" prop="outTemperature2" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="供水流量" prop="supplyWaterFlow" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="回水流量" prop="returnWaterFlow" min-width="120" :show-overflow-tooltip="true" />
        <el-table-column label="二网回水流量" prop="secondWaterSupply" min-width="120" :show-overflow-tooltip="true" />

        <!-- <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag type="success" size="small" v-if="scope.row.status">已发布</el-tag>
            <el-tag type="info" size="small" v-else>未发布</el-tag>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum" v-model:limit="tableData.param.pageSize" @pagination="typeList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import api from '/@/api/loopSupervision';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'deviceproduct',
  setup() {
    const addDicRef = ref();
    const editDicRef = ref();
    const queryRef = ref();
    const router = useRouter()
    const state = reactive({
      ids: [],
      tableData: {
        data: [{ name: '换热站', key: '2022-10-25', value: 1 }],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          types: 'station', // 类型 station 换热站 loop环路
          name: '',
          code: '',
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      state.tableData.param.pageNum = 1
      typeList();
    };
    const typeList = () => {
      state.tableData.loading = true;
      api.getLoopRegulation(state.tableData.param).then((res: any) => {
        state.tableData.data = res.Data;
        state.tableData.total = res.Total;
      }).finally(() => (state.tableData.loading = false));
    };
    // 打开新增产品弹窗
    const onOpenAddDic = () => {
      editDicRef.value.openDialog();
    };
    // 打开修改产品弹窗
    const onOpenEditDic = (row: any) => {
      editDicRef.value.openDialog(row);
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      typeList();
    };
    // 多选框选中数据
    const handleSelectionChange = (selection: any) => {
      // state.ids = selection.map((item) => item.id);
    };

    const goPage = (row: any) => {
      if (state.tableData.param.types === 'station') {
        router.push({
          path: '/heating/monitor/loopSupervision/list/heatStationDetail',
          query: {
            code: row.code
          }
        })
      } else {
        router.push({
          path: '/heating/monitor/loopSupervision/list/loopDetail',
          query: {
            code: row.code
          }
        })
      }
    }
    return {
      addDicRef,
      editDicRef,
      queryRef,
      onOpenAddDic,
      onOpenEditDic,
      typeList,
      resetQuery,
      handleSelectionChange,
      ...toRefs(state),
      initTableData,
      goPage
    };
  },
});
</script>
