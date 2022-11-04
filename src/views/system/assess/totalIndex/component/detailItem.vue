<template>
  <div class="system-add-user-container">
    <el-dialog
      title="平台健康度"
      v-model="isShowDialog"
      width="790px"
    >
      <div class="table-wrap">
        <div class="table-item-wrap">
          <div class="label">详细介绍</div>
          <div class="value">{{ruleForm.explain}}</div>
        </div>
        <div class="table-item-wrap">
          <div class="label">SecretKey</div>
          <div class="value">调用API的安全密码、请联系管理员获取</div>
        </div>
        <div class="table-item-wrap">
          <div class="label">app.healthEvaluation.entrance-api</div>
          <div class="value">
            <section>
              <div class="inner-label">入口URL</div>
              <div class="inner-value url">{{baseUrl}}/data</div>
            </section>
            <section>
              <div class="inner-label">请求方式</div>
              <div class="inner-value">POST</div>
            </section>
            <section>
              <div class="inner-label">请求Body参数</div>
              <div class="inner-value">
                <div>itemcode：{{ruleForm.item_code}}</div>
                <div>name：
                  <span
                    v-for="(item, index) in ruleForm.targets"
                    :key="index"
                  >{{`${item.name} `}} </span>
                </div>
                <div>value：当前值</div>
                <div>form_info：平台数据</div>
              </div>
            </section>
          </div>
        </div>
        <div class="table-item-wrap">
          <div class="label">app.healthEvaluation.export-api</div>
          <div class="value">
            <section>
              <div class="inner-label">出口URL</div>
              <div class="inner-value url">{{baseUrl}}/index</div>
            </section>
            <section>
              <div class="inner-label">请求方式</div>
              <div class="vinner-value">GET</div>
            </section>
            <section>
              <div class="inner-label">请求Query参数</div>
              <div class="inner-value">
                <div>itemcode：{{ruleForm.item_code}}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent } from 'vue';

import api from '/@/api/assess';

// 定义接口来定义对象的类型
interface RuleFormRow {
  title: string;
  explain: string;
  config: string;
  item_code: string;
  targets: Array<any>
}
interface ItemState {
  isShowDialog: boolean;
  ruleForm: RuleFormRow;
  baseUrl: string
}

export default defineComponent({
  name: 'systemAddUser',
  setup() {
    const state = reactive<ItemState>({
      isShowDialog: false,
      ruleForm: {
        title: '', // 评价名称
        explain: '', // 描述
        config: '',
        item_code: '',
        targets: []
      },
      baseUrl: import.meta.env.VITE_ASSESS_URL
    });
    // 打开弹窗
    const openDialog = (row: any) => {
      api.getList({ itemcode: row.item_code }).then((res: any) => {
        state.ruleForm = res
        state.isShowDialog = true;

      });
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };
    // 新增
    const onSubmit = () => {
      closeDialog();
    };
    // 初始化部门数据
    const initTableData = () => {

    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
	border-top: 1px var(--el-border-color) var(--el-border-style);
}
.table-wrap {
	.table-item-wrap:nth-child(1) {
		border-top: 1px var(--el-border-color) var(--el-border-style);
	}
	.table-item-wrap {
		display: flex;

		border-bottom: 1px var(--el-border-color) var(--el-border-style);
		border-left: 1px var(--el-border-color) var(--el-border-style);
		border-right: 1px var(--el-border-color) var(--el-border-style);
		.value,
		.label {
			padding: 16px;
			section {
				display: flex;
			}
			// .inner-value {
			// 	display: flex;
			// }
		}
		.label {
			display: flex;
			// justify-content: center;
			align-items: center;
			width: 330px;
			border-right: 1px var(--el-border-color) var(--el-border-style);
			background-color: #f3f3f3;
		}
		.value {
			width: 410px;
			.inner-label {
				width: 80px;
			}
			.url {
				color: var(--el-color-primary);
			}
		}
	}
}
</style>
