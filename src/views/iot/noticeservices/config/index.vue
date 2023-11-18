<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div>
        <el-row>
          <el-col :span="12"   v-for="item in notice_send_gateway"  >
            <div class="ant-cards " v-if="item.status==1">
              <div class="ant-card-body line">
                <div class="content">
                  <div class="left">
                    <img
                      :src="'/imgs/notice/'+item.value+'.svg'"
                      alt="dingding"
                      style="height: 100px;width: 100px;"
                      v-col="'image'"
                    />
                    <div class="context">
                      <div class="title" v-col="'title'">{{item.label}}</div>
                      <div class="desc" v-col="'desc'">
                        {{item.remark}}
                      </div>
                    </div>
                  </div>
                   <div class="right"  v-col="'handle'">
                    <div
                      class="ant-space ant-space-horizontal ant-space-align-center"
                      style="gap: 8px;"
                    >
                      <div class="ant-space-item" style="" v-auth="'setting'">
                        <router-link :to="'/iotmanager/noticeservices/config/setting/'+item.value" class="link-type" >
                        <div class="action">
                            <div class="btn">
                              <img
                                src="/imgs/notice/icon_m.png"
                                style="height: 40px;width: 40px;"
                              />
                              <div>管理</div>
                            </div>
                        </div>
                        </router-link>
                      </div>
                      <div class="ant-space-item" v-auth="'edit'">
                        <div class="action" @click="onOpenEdit(item)">
                            <div class="btn">
                              <img
                              src="/imgs/notice/icon_c.png"
                                style="height: 40px;width: 40px;"
                              />
                              <div>配置</div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>

        </el-row>
      </div>
    </el-card>

   <EditDic ref="editDicRef" @dataList="dataList" />
	 <!--<LevelDic ref="levelDicRef" @dataList="dataList" />-->
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent,getCurrentInstance } from "vue";
import { ElMessageBox, ElMessage, FormInstance } from "element-plus";
import EditDic from './component/edit.vue';
// import LevelDic from './component/level.vue';

import alarm from "/@/api/alarm";

// 定义接口来定义对象的类型
interface TableDataRow {
  id: number;
  name: string;
  key: string;
  createBy: string;
}
interface TableDataState {
  ids: number[];
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      name: string;
      level: number;
      triggerType: number;
    };
  };
}

export default defineComponent({
  name: "setlist",
   components: { EditDic },

  setup() {
    const addDicRef = ref();
    const levelDicRef = ref();
    const editDicRef = ref();
    const detailRef = ref();
    const queryRef = ref();
    const { proxy } = getCurrentInstance() as any;

    const { notice_send_gateway } = proxy.useDict('notice_send_gateway');

    const state = reactive<TableDataState>({
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 20,
          name: "",
          level: "",
          triggerType: "",
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      //dataList();
    };
    const dataList = () => {
      state.tableData.loading = true;
      alarm.common
        .getList(state.tableData.param)
        .then((res: any) => {
          state.tableData.data = res.list;
          state.tableData.total = res.Total;
        })
        .finally(() => (state.tableData.loading = false));
    };
    // 打开新增菜单弹窗
    const onOpenAdd = (row?: TableDataRow) => {
      editDicRef.value.openDialog();
    };
    const onOpenLevel = (row?: TableDataRow) => {
      levelDicRef.value.openDialog();
    };
    // 打开修改模型弹窗
    const onOpenEdit = (row: TableDataRow) => {
      editDicRef.value.openDialog({ ...row });
    };
    //打开数据记录
    const onOpenRecord = (row: TableDataRow) => {
      detailRef.value.openDialog(row);
    };
    const onRowDel = (row?: TableDataRow) => {
      let msg = "你确定要删除所选数据？";
      let ids: number[] = [];
      if (row) {
        msg = `此操作将永久删除：“${row.name}”，是否继续?`;
        ids = row.id;
      } else {
        ids = state.ids;
      }
      if (ids.length === 0) {
        ElMessage.error("请选择要删除的数据。");
        return;
      }
      ElMessageBox.confirm(msg, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          alarm.common.delete(ids).then(() => {
            ElMessage.success("删除成功");
            dataList();
          });
        })
        .catch(() => {});
    };

    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      dataList();
    };
    const onActionStatus = (item: TableDataRow[]) => {
      if (item.status == 0) {
        alarm.common.deploy({ id: item.id }).then((res: any) => {
          dataList();
        });
      } else {
        alarm.common.undeploy({ id: item.id }).then((res: any) => {
          dataList();
        });
      }
    };

    return {
      onActionStatus,
      addDicRef,
      editDicRef,
      detailRef,
      queryRef,
      levelDicRef,
      notice_send_gateway,
      onOpenRecord,
      onOpenLevel,
      onOpenAdd,
      onOpenEdit,
      onRowDel,
      dataList,
      resetQuery,
      ...toRefs(state),
    };
  },
});
</script>

<style>
.line{
  border: 1px solid var(--next-border-color-light);;

}
.ant-cards {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: "tnum", "tnum";
  position: relative;
  border-radius: 2px;
  padding: 10px;
}
.ant-card-body {
  padding: 24px;

}

.ant-space {
  display: inline-flex;
}
.ant-space-align-center {
  align-items: center;
}
.ant-btn {
  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;

}
.ant-btn-link {
  color: #5b8fd9;
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}
.context {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100px;
  margin-left: 15px;
}
.context .title {
  font-size: 24px;
}
.context .desc {
  font-size: 14px;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content .left {
  display: flex;
}
.content .right .action {
  display: flex;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 1px solid #5b8fd9;
}
.content .right .action .btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
}
</style>
