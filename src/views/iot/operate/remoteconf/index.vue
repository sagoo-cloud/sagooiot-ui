<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <h2>远程配置</h2>
      <div class="container">
        <div class="selectContainer">
          <article style="margin-right: 20px">
						<span class="label">产品:</span>
            <el-select v-model="product" filterable @change="handleChange">
              <el-option v-for="item in productOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </article>
          <article>
						<span class="label">配置格式:</span>
            <el-select v-model="currentConfig.configFormat" filterable>
              <el-option v-for="item in configTypeOptions" :key="item.key" :label="item.key" :value="item.key"> </el-option>
            </el-select>
          </article>
        </div>

        <div class="editorTitle">
          <div class="leftLabel">
            配置模板
            <span style="color: #999; font-size: 12px; font-weight: normal; display: inline-block; margin-left: 10px; margin-right: 50px">当前文件大小{{ size }}KB(上限64KB)</span>
            <span style="color: #999; font-size: 14px; font-weight: normal" v-if="currentConfig.gmtCreate">提交于{{ currentConfig.gmtCreate }}</span>
          </div>
          <div class="rightLabel">
            <el-icon size="18" class="icon">
              <question-filled />
            </el-icon>
            <span v-if="onlineOpen">远程配置已经打开</span>
            <span v-if="!onlineOpen">远程配置已经关闭</span>
            <el-switch v-model="onlineOpen" active-color="#13ce66" inactive-color="#ddd"></el-switch>
          </div>
        </div>
        <div style="border: 1px solid #ccc; border-top: none">
          <codeEditor
              class="params flex1"
              ref="mirrorRef"
              mode=""
              :onchange="onchange"
              :readOnly="true"
              :content="currentConfig.configContent"></codeEditor>
        </div>
        <div class="btnContainer">
          <div v-if="!onlineOpen">
            <el-tooltip class="box-item" effect="dark" placement="top" content="请先开启远程配置">
              <div style="margin-right: 20px"><el-button type="primary" disabled>编辑</el-button></div>
            </el-tooltip>
          </div>
          <div v-else style="margin-right: 20px"><el-button type="primary" @click="edit">编辑</el-button></div>
          <div v-if="canSave"><el-button type="primary" @click="saveDialogVisible = true">保存</el-button></div>
          <div v-else><el-button type="primary" @click="updateDialogVisible = true">批量更新</el-button></div>
        </div>
        <h2>配置版本记录</h2>
        <el-table :data="tableData.data"
            style="width: 100%"
            row-key="id"
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            v-loading="tableData.loading">
          <el-table-column prop="configNumber" label="编号" width="200"> </el-table-column>
          <el-table-column prop="gmtCreate" label="版本更新时间"></el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" type="text" @click="look(scope.row, scope.$index)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog v-model="updateDialogVisible" width="40%">
      <div class="saveDialogContainer">
        <div class="icon">
          <el-icon color="#E6A23C" size="26">
            <warning-filled />
          </el-icon>
        </div>
        <div class="string">
          <h2>是否确认对该产品下的所有设备进行批量远程配置更新</h2>
          <p>注:该产品下的所有设备将自动更新该配置文件.设备端需订阅远程配置的topic</p>
          <p>指定产品:{{ selectProduct }}</p>
          <p>设备范围:所有设备</p>
        </div>
      </div>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="updateDialogHandle" type="primary">确认更新</el-button>
					<el-button @click="updateDialogVisible = false">取消</el-button>
				</span>
      </template>
    </el-dialog>
    <el-dialog v-model="saveDialogVisible" width="40%">
      <div class="saveDialogContainer">
        <div class="icon">
          <el-icon color="#E6A23C" size="26">
            <warning-filled />
          </el-icon>
        </div>
        <div class="string">
          <h3>是否保存当前配置信息？ 保存后可以手动将配置批量更新到该产品下的所有设备，设备也可以主动获取配置</h3>
        </div>
      </div>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="saveHandle" type="primary">确认</el-button>
					<el-button @click="saveDialogVisible = false">取消</el-button>
				</span>
      </template>
    </el-dialog>
    <el-dialog v-model="lookDialogVisible" width="40%">
      <div class="saveDialogContainer" v-if="lookDialogVisible">
        <codeEditor class="params flex1"
            ref="mirrorRefDialog"
            mode=""
            :onchange="onchange"
            :readOnly="true"
            :content="tableData.data[lookIndex!].content"></codeEditor>
      </div>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="lookSureDialogVisible = true" type="primary">恢复至此版本</el-button>
					<el-button @click="lookDialogVisible = false">取消</el-button>
				</span>
      </template>
    </el-dialog>
    <el-dialog v-model="lookSureDialogVisible" width="40%">
      <div class="saveDialogContainer">
        <div class="icon">
          <el-icon color="#E6A23C" size="26">
            <warning-filled />
          </el-icon>
        </div>
        <div class="string">
          <h3>恢复版本</h3>
          <p>是否确认恢复到{{ tableData.data[lookIndex!].time }}的版本</p>
        </div>
      </div>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="sureRestore" type="primary">确认</el-button>
					<el-button @click="lookSureDialogVisible = false">取消</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, defineComponent, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { QuestionFilled, WarningFilled } from '@element-plus/icons-vue'
import api from '/@/api/system'
import codeEditor from '/@/components/codeEditor/index.vue'

export default defineComponent({
  name: 'online',
  components: { QuestionFilled, WarningFilled, codeEditor },
  setup() {
    const product = ref()
    const productOptions = ref<{ value: string; label: string; status: string }[]>([])
    const canSave = ref(false)
    const onlineOpen = ref(false)
    const mirrorRef = ref<any>() // 编辑器
    const mirrorRefDialog = ref<any>()
    const configTypeOptions = [{ key: 'json' }, { key: 'yaml' }]
    const selectProduct = ref(); // 选中产品名称
    const currentConfig = ref({
      configContent: '',
      configFormat: 'json',
      configNumber: '',
      gmtCreate: '',
      id: '',
      scope: '',
    })
    // 页面加载时
    onMounted(() => {
      api.remoteconf.getProductList({ status: '1', name: '' }).then((res: any) => {
        productOptions.value = res.product.map((item: any) => {
          return {
            value: item.key,
            label: item.name,
            status: item.status,
          }
        })
        if (productOptions.value.length > 0) {
          product.value = productOptions.value[0].value
          selectProduct.value = productOptions.value[0].label
        }
      })
    })

    const edit = () => {
      mirrorRef.value.setOption('readOnly', false)
      canSave.value = true
    }

    const saveDialogVisible = ref(false)
    const updateDialogVisible = ref(false)
    watch(
        () => onlineOpen.value,
        () => {
          //初始化  然后由false变为 true 不用管
          // 这里是 由false变为true
          if (!onlineOpen.value) {
            canSave.value = false
            mirrorRef.value.setOption('readOnly', true)
          }
        }
    )
    watch(() => product.value, () => {
      //product.value 就是那个key options里面转化了
      currentConfig.value.gmtCreate = '';
      mirrorRef.value.setValue('');
      tableData.data = [];
      updateTableData()
    })
    // 选择下拉框替换批量更新产品名称
    const handleChange = (value) => {
      selectProduct.value = productOptions.value.find((item) => item.value === value).label;
    }
    const updateTableData = () => {
      api.remoteconf.queryThingConfig({ pageNum: 1, PageSize: 50, productKey: product.value })
        .then((res: any) => {
          if (res.remoteconf) {
            tableData.data = res.remoteconf.slice(1)
            // 重塑编号
            for (let i = 0; i < tableData.data.length; i++) {
              if ((i + 1) < 10) {
                tableData.data[i].configNumber = '0' + (i + 1);
              } else {
                tableData.data[i].configNumber = i + 1;
              }
            }
            console.log(tableData.data);
            currentConfig.value = res.remoteconf[0]
            mirrorRef.value.setValue(currentConfig.value.configContent)
          }
      }).catch((error: any) => {
        ElMessage.error(error)
      })
    }
    const size = ref('0')

    const saveHandle = () => {
      saveDialogVisible.value = false
      // let now = new Date()
      // let year: number | string = now.getFullYear()
      // let month: number | string = now.getMonth() + 1 // getMonth() 返回的月份从 0 开始，所以需要 +1
      // let day: number | string = now.getDate()
      // let hour: number | string = now.getHours()
      // let minute: number | string = now.getMinutes()
      // let second: number | string = now.getSeconds()

      // // 如果月、日、小时、分钟或秒的值小于 10，前面补 0
      // if (month < 10) month = '0' + month
      // if (day < 10) day = '0' + day
      // if (hour < 10) hour = '0' + hour
      // if (minute < 10) minute = '0' + minute
      // if (second < 10) second = '0' + second

      // updateTime.value = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second

      api.remoteconf.saveThisConfig({
        scope: 'product',
        configName: '',
        configFormat: currentConfig.value.configFormat,
        configContent: mirrorRef.value.getValue(),
        configSize: size.value,
        status: productOptions.value.find((item: any) => item.value == product.value)?.status!,
        productKey: product.value,
      }).then((res: any) => {
        ElMessage.success('保存成功')
        onlineOpen.value = false
        updateTableData()
      }).catch((err: any) => {
        ElMessage.error(err)
      })
    }
    const onchange = (e: any, b: any) => {
      var blob = new Blob([e.getValue()], { type: 'text/plain' })
      size.value = (blob.size / 1024).toFixed(2)
    }
    const tableData = reactive({
      data: <any[]>[],
      loading: false,
    })
    const lookIndex = ref<null | number>(0)
    const lookDialogVisible = ref(false)
    const lookSureDialogVisible = ref(false)
    const look = (item: any, index: number) => {
      lookDialogVisible.value = true
      lookIndex.value = index
      setTimeout(() => {
        mirrorRefDialog.value.setValue(tableData.data[index].configContent)
      }, 4)
    }
    const sureRestore = () => {
      lookDialogVisible.value = false
      lookSureDialogVisible.value = false
      currentConfig.value.configFormat = tableData.data[lookIndex.value!].configFormat
      mirrorRef.value.setValue(tableData.data[lookIndex.value!].configContent)
      nextTick(() => {
        saveHandle()
      })
    }
    const updateDialogHandle = () => {
      updateDialogVisible.value = false
      saveHandle()
    }
    return {
      selectProduct,
      productOptions,
      product,
      canSave,
      edit,
      onlineOpen,
      updateDialogVisible,
      saveDialogVisible,
      mirrorRef,
      size,
      saveHandle,
      onchange,
      tableData,
      look,
      lookIndex,
      lookDialogVisible,
      lookSureDialogVisible,
      sureRestore,
      mirrorRefDialog,
      configTypeOptions,
      updateDialogHandle,
      currentConfig,
      handleChange,
    }
  },
})
</script>
<style scoped lang="scss">
.selectContainer {
  display: flex;
}
.label {
  display: inline-block;
  padding-right: 12px;
}
h2 {
  margin-bottom: 10px;
}
article {
  margin-bottom: 10px;
}
.container :deep(.ql-toolbar.ql-snow) {
  display: none;
}
.editorTitle {
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  height: 50px;
  background-color: #eee;
}
.leftLabel {
  float: left;
  height: 32px;
  line-height: 32px;
  font-weight: 600;
}
.rightLabel {
  float: right;
  span {
    display: inline-block;
    margin: 0 10px;
  }
  .icon {
    float: left;
    margin-top: 6px;
  }
}
.btnContainer {
  width: 200px;
  margin: 10px auto;
  display: flex;
}
.saveDialogContainer {
  display: flex;
  h2 {
    color: #333;
  }
  p {
    color: #999;
    margin: 8px 0;
  }
  .icon {
    margin: 2px 10px;
  }
}
</style>
