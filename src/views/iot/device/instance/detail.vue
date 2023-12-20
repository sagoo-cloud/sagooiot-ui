<template>
  <div class="system-dic-container">
    <div class="content">
      <div class="cont_box">
        <div class="title">设备：{{ detail.name }}</div>
        <div class="pro-status"><span :class="developer_status == 2 ? 'on' : 'off'"></span>{{ developer_status == 2 ? '在线'
          : '离线' }}</div>

        <!-- <div class="pro-option" @click="CkOption">{{ developer_status == 2 ? '下线' : '上线' }}</div> -->
      </div>
    </div>

    <div class="content-box">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">

        <el-tab-pane label="运行状态" name="3">
          <div style=" display: flex; padding: 10px;flex-wrap: wrap;">
            <div class="ant-card">
              <div class="ant-card-body">
                <div class="cardflex">
                  <div>设备状态</div>
                  <div @click="getrunData()" style="cursor: pointer;">
                    <el-icon style="font-size: 18px;">
                      <ele-Refresh />
                    </el-icon>
                  </div>
                </div>

                <div class="statusname" v-if="areaData.status == 0">未启用</div>
                <div class="statusname" v-if="areaData.status == 1">离线</div>
                <div class="statusname" v-if="areaData.status == 2">在线</div>
                <div class="cardflex comtest">
                  <div> 数据时间</div>
                  <div>{{ areaData.lastOnlineTime || '未启用' }}</div>
                </div>
              </div>
            </div>

            <div class="ant-card" v-for="(item, index) in areaData.properties" :key="index">
              <div class="ant-card-body">
                <div class="cardflex">
                  <div>{{ item.name }}</div>
                  <div style="cursor: pointer;">
                    <el-icon style="font-size: 18px;" @click="getrunData()">
                      <ele-Refresh />
                    </el-icon>
                    <el-icon style="font-size: 18px;margin-left: 10px;" @click="onOpenListDetail(item)">
                      <ele-Expand />
                    </el-icon>
                  </div>
                </div>

                <div class="statusname" v-if="item.type != 'object'">

                  {{getValueText(item.key,item.value)}}
                  <!-- {{ item.value }}{{ item.unit }} -->
                  
                </div>
                <div v-else>
                  <div class="oblist" v-for="(vare, name) in item.value">
                    <div> {{getStatusText(name,vare)}}</div>
                    <!-- <div class="name">{{ name }}：</div>
                    <div class="name">{{ vare }}</div> -->
                  </div>
                </div>
                <div class="">
                  <devantd :json="item.list" :antdid="item.key"
                    v-if="item.type == 'int' || item.type == 'float' || item.type == 'string'" />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备信息" name="1">
          <div class="pro-box">
            <div class="protitle">设备信息</div>
            <div>
              <el-button type="primary" v-auth="'edit'" @click="onOpenEditDic(detail)">编辑</el-button>
            </div>
          </div>

          <div class="ant-descriptions-view">
            <table>
              <tbody>
                <tr class="ant-descriptions-row">
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">设备标识</th>
                  <td class="ant-descriptions-item-content" colspan="1">{{ detail.key }}</td>
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">设备名称</th>
                  <td class="ant-descriptions-item-content" colspan="1">{{ detail.name }}</td>
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">所属产品</th>
                  <td class="ant-descriptions-item-content" colspan="1">
                    <router-link :to="'/iotmanager/device/product/detail/' + prodetail.id" class="link-type">{{
                      detail.productName }} </router-link>
                  </td>

                </tr>
                <tr class="ant-descriptions-row">
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">消息协议</th>
                  <td class="ant-descriptions-item-content" colspan="1">{{ prodetail.messageProtocol }}</td>
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">链接协议</th>
                  <td class="ant-descriptions-item-content" colspan="1">{{ prodetail.transportProtocol }}</td>
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">设备类型</th>
                  <td class="ant-descriptions-item-content" colspan="1">{{ prodetail.deviceType }}</td>
                </tr>
                <tr class="ant-descriptions-row">
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">固件版本</th>
                  <td class="ant-descriptions-item-content" colspan="1">{{ detail.version }}</td>
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">注册时间</th>
                  <td class="ant-descriptions-item-content" colspan="1">{{ detail.updatedAt }}</td>
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">最后上线时间</th>
                  <td class="ant-descriptions-item-content" colspan="1">{{ detail.lastOnlineTime || '' }}</td>
                </tr>
                <tr class="ant-descriptions-row">
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">详细地址</th>
                  <td class="ant-descriptions-item-content" colspan="5">{{ detail.address }}</td>
                </tr>
                <tr class="ant-descriptions-row">
                  <th class="ant-descriptions-item-label ant-descriptions-item-colon">说明</th>
                  <td class="ant-descriptions-item-content" colspan="5">{{ detail.desc }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex" style="margin-top: 20px;">
            <el-input type="number" style="width: 380px;margin-right: 20px;" v-model.number="detail.onlineTimeout">
              <template #prepend>设备超时时间</template>
              <template #append>秒</template>
            </el-input>
            <el-button type="primary" @click="onlineTimeoutUpdate">
              <el-icon style="font-size: 18px;"><ele-Refresh /></el-icon>更新</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="物模型" name="2">
          <div class="wu-box">
            <el-tabs type="border-card" v-model="activetab" @tab-click="wuhandleClick">
              <el-tab-pane label="属性定义" name="attr">
                <div class="wu-title">
                  <div class="title">属性定义</div>
                  <div>
                    <el-button type="primary" v-auth="'add'" @click="onOpenEditAttr()">添加</el-button>
                  </div>
                </div>

                <el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'attr'">
                  <el-table-column label="属性标识" align="center" prop="key" />
                  <el-table-column label="属性名称" prop="name" :show-overflow-tooltip="true" />
                  <el-table-column prop="valueType" label="数据类型" width="100" align="center">
                    <template #default="scope">
                      <span>{{ scope.row.valueType.type }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="decimals" label="精度" width="60" align="center">
                    <template #default="scope">
                      <span>{{ scope.row.valueType.decimals }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unit" label="单位" width="60" align="center">
                    <template #default="scope">
                      <span>{{ scope.row.valueType.unit }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="accessMode" label="是否只读" width="120" align="center">
                    <template #default="scope">
                      <el-tag type="info" size="small" v-if="scope.row.accessMode">只读</el-tag>
                      <el-tag type="success" size="small" v-else>读写</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="说明" prop="desc" :show-overflow-tooltip="true" />
                  <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template #default="scope">
                      <el-button size="small" text type="warning" v-auth="'edit'"
                        @click="onEditAttr(scope.row)">修改</el-button>
                      <el-button size="small" text type="danger" v-auth="'del'"
                        @click="onRowDel(scope.row.key, 'attr')">删除</el-button>
                      <el-button size="small" text type="primary" v-auth="'edit'"
                        @click="setAttr(scope.row)">设置属性</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="功能定义" name="fun">
                <div class="wu-title">
                  <div class="title">功能定义</div>
                  <div>
                    <el-button type="primary" v-auth="'add'" @click="onOpenEditFun()">添加</el-button>
                  </div>
                </div>

                <el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'fun'">
                  <el-table-column label="功能标识" align="center" prop="key" />
                  <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />

                  <el-table-column label="描述" prop="desc" :show-overflow-tooltip="true" />
                  <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template #default="scope">
                      <el-button size="small" text type="warning" v-auth="'edit'"
                        @click="onEditFun(scope.row)">修改</el-button>
                      <el-button size="small" text type="danger" v-auth="'del'"
                        @click="onRowDel(scope.row.key, 'fun')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="事件定义" name="event">
                <div class="wu-title">
                  <div class="title">事件定义</div>
                  <div>
                    <el-button type="primary" v-auth="'add'" @click="onOpenEditEvent()">添加</el-button>
                  </div>
                </div>

                <el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'event'">
                  <el-table-column label="事件标识" align="center" prop="key" />
                  <el-table-column label="名称" prop="name" :show-overflow-tooltip="true" />
                  <el-table-column prop="level" label="事件级别" width="120" align="center">
                    <template #default="scope">
                      <el-tag type="primary" size="small" v-if="scope.row.level == 0">普通</el-tag>
                      <el-tag type="warning" size="small" v-if="scope.row.level == 1">警告</el-tag>
                      <el-tag type="danger" size="small" v-if="scope.row.level == 2">紧急</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="描述" prop="desc" :show-overflow-tooltip="true" />

                  <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template #default="scope">
                      <el-button size="small" text type="warning" v-auth="'edit'"
                        @click="onEditEvent(scope.row)">修改</el-button>
                      <el-button size="small" text type="danger" v-auth="'del'"
                        @click="onRowDel(scope.row.key, 'event')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="标签定义" name="tab">
                <div class="wu-title">
                  <div class="title">标签定义</div>
                  <div>
                    <el-button type="primary" v-auth="'add'" @click="onOpenEditTab()">添加</el-button>
                  </div>
                </div>


                <el-table style="width: 100%" :data="tableData.data" v-if="activetab == 'tab'">
                  <el-table-column label="属性标识" align="center" prop="key" />
                  <el-table-column label="属性名称" prop="name" :show-overflow-tooltip="true" />
                  <el-table-column prop="valueType" label="数据类型" width="120" align="center">
                    <template #default="scope">
                      <span>{{ scope.row.valueType.type }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="accessMode" label="是否只读" width="120" align="center">
                    <template #default="scope">
                      <el-tag type="info" size="small" v-if="scope.row.accessMode">只读</el-tag>
                      <el-tag type="success" size="small" v-else>读写</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="描述" prop="desc" :show-overflow-tooltip="true" />
                  <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template #default="scope">
                      <el-button size="small" text type="warning" v-auth="'edit'"
                        @click="onEditTag(scope.row)">修改</el-button>
                      <el-button size="small" text type="danger" v-auth="'del'"
                        @click="onRowDel(scope.row.key, 'tab')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
            <pagination v-show="tableData.total > 0" :total="tableData.total" v-model:page="tableData.param.pageNum"
              v-model:limit="tableData.param.pageSize" @pagination="getList()" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备功能" name="5">
          <functionCom :device-key="detail.key" :product-key="prodetail.key"
            v-if="detail.key && prodetail.key && activeName === '5'"></functionCom>
        </el-tab-pane>
        <el-tab-pane label="日志管理" name="4">
          <div class="system-user-search mb15">
            <el-form :model="logtableData.param" ref="logqueryRef" :inline="true" label-width="68px">
              <el-form-item label="日志类型" prop="types">
                <el-select v-model="logtableData.param.types" placeholder="日志类型" clearable size="default">
                  <el-option v-for="item in logTypeData" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>

              <el-form-item label="创建时间" prop="dateRange">
                <el-date-picker v-model="logtableData.param.dateRange" size="default" value-format="YYYY-MM-DD"
                  type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button size="default" type="primary" class="ml10" @click="getlog">
                  <el-icon>
                    <ele-Search />
                  </el-icon>
                  查询
                </el-button>
                <el-button size="default" @click="resetQuery(logqueryRef)">
                  <el-icon>
                    <ele-Refresh />
                  </el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table style="width: 100%" :data="logtableData.data">
            <el-table-column label="类型" align="center" prop="type" />
            <el-table-column label="时间" prop="ts" :show-overflow-tooltip="true" />

            <el-table-column label="内容" prop="content" :show-overflow-tooltip="true" />
            <el-table-column label="操作" width="300" align="center" fixed="right">
              <template #default="scope">
                <el-button size="small" text type="warning" @click="onLogDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="logtableData.total > 0" :total="logtableData.total"
            v-model:page="logtableData.param.pageNum" v-model:limit="logtableData.param.pageSize" @pagination="getlog" />
        </el-tab-pane>
        <el-tab-pane v-if="prodetail.deviceType == '网关'" label="子设备" name="6">
          <div class="wu-box">
            <div class="wu-title">
              <div class="title">子设备列表</div>
              <div>
                <el-button v-auth="'mutipleBind'" type="primary" @click="onOpenMutipleBind()">批量绑定</el-button>
                <el-button v-auth="'cancleMutipleBind'" :disabled="!deviceKeyList.length" type="primary"
                  @click="mutipleUnbind()">批量解绑</el-button>
              </div>
            </div>

            <el-table :data="deviceTableData.data" style="width: 100%" @selection-change="handleSelectionChange"
              v-loading="deviceTableData.loading">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="标识" prop="key" width="130" :show-overflow-tooltip="true" />
              <el-table-column label="设备名称" prop="name" :show-overflow-tooltip="true" />
              <el-table-column label="产品名称" prop="productName" :show-overflow-tooltip="true" />

              <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="scope">
                  <el-tag type="info" size="small" v-if="scope.row.status == 1">离线</el-tag>
                  <el-tag type="success" size="small" v-if="scope.row.status == 2">在线</el-tag>
                  <el-tag type="info" size="small" v-if="scope.row.status == 0">未启用</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="registryTime" label="激活时间" align="center" width="150"></el-table-column>
              <el-table-column prop="desc" label="说明"></el-table-column>

              <el-table-column label="操作" width="160" align="center" fixed="right">
                <template #default="scope">
                  <el-button size="small" text type="danger" v-auth="'del'"
                    @click="deleteSubDevice(scope.row)">删除</el-button>
                  <el-button size="small" text type="warning" v-auth="'detail'"
                    @click="onOpenDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="deviceTableData.total > 0" :total="deviceTableData.total"
              v-model:page="deviceTableData.param.pageNum" v-model:limit="deviceTableData.param.pageSize"
              @pagination="getDeviceTableData" />
          </div>

        </el-tab-pane>
        <el-tab-pane label="设备扩展属性信息" name="7">
          <el-form size="default" label-width="110px">
            <el-form-item label="设备图片">
              <el-image class="mr20" style="border: 1px solid #e5e5e5;border-radius: 8px;width: 100px;height: 100px;object-fit: contain;" :src="item" v-for="(item, index) in phone" :key="index" />
            </el-form-item>
            <el-form-item label="证书图片">
              <el-image class="mr20" style="border: 1px solid #e5e5e5;border-radius: 8px;width: 100px;height: 100px;object-fit: contain;" :src="item" v-for="(item, index) in certificate" :key="index" />
            </el-form-item>
            <el-form-item label="设备说明">
              <el-input disabled v-model="intro" type="textarea" placeholder="请输入设备说明"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>

  

      </el-tabs>
    </div>
    <EditDic ref="editDicRef" @typeList="initData" />
    <EditAttr ref="editAttrRef" @typeList="getproperty" />
    <EditFun ref="editFunRef" @typeList="getfunction" />
    <EditEvent ref="editEventRef" @typeList="getevent" />
    <EditTab ref="editTabRef" @typeList="gettab" />
    <ListDic ref="listDicRef" />
    <SubDevice ref="subDeviceRef" />
    <setAttr :device-key="detail.key" ref="setAttrRef" />
    <!-- 子设备-批量绑定弹窗 -->
    <SubDeviceMutipleBind ref="mutipleBindRef" @bindSuccess="getDeviceTableData" />

    <el-dialog v-model="dialogVisible" title="日志数据内容" width="30%">
      <JsonViewer :value="jsonData" boxed sort theme="jv-dark" @click="onKeyclick" />

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';
import functionCom from './component/function.vue';
import 'vue3-json-viewer/dist/index.css';
import EditDic from './component/edit.vue';
// import EditDic from '../product/component/editPro.vue';
import EditAttr from '../product/component/editAttr.vue';
import EditFun from '../product/component/editFun.vue';
import EditEvent from '../product/component/editEvent.vue';
import EditTab from '../product/component/editTab.vue';
import devantd from '/@/components/devantd/index.vue';
import ListDic from './component/list.vue';
import SubDevice from './component/subDevice.vue';
import setAttr from './component/setAttr.vue';
import SubDeviceMutipleBind from './component/subDeviceMutipleBind.vue';
import api from '/@/api/device';
import datahub from '/@/api/datahub';

import { useRoute } from 'vue-router';

interface TableDataState {
  phone: any[];
  certificate: any[];
  intro: string;
  ids: number[];
  detail: any;
  deviceKeyList: string[];
  deviceTableData: {
    data: [];
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      gatewayKey: string;
      dateRange: string[];
    };
  };
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
  logtableData: {
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
  name: 'deviceEditPro',
  components: { SubDeviceMutipleBind, SubDevice, EditDic, EditAttr, EditFun, EditEvent, EditTab, devantd, ListDic, functionCom, setAttr },

  setup(prop, context) {
    const logqueryRef = ref();

    const array_list=ref([]);
    const route = useRoute();
    const editDicRef = ref();
    const setAttrRef = ref();
    const editAttrRef = ref();
    const editFunRef = ref();
    const listDicRef = ref();
    const editEventRef = ref();
    const editTabRef = ref();
    const subDeviceRef = ref();
    const mutipleBindRef = ref();
    const state = reactive<TableDataState>({
      certificate: [],
      phone: [],
      intro: '',
      deviceKeyList: [],
      areaData: [],
      isShowDialog: false,
      dialogVisible: false,
      logTypeData: [],
      jsonData: '',
      activeName: '3', // 分类数据
      activetab: 'attr', // 分类数据
      detail: {},
      prodetail: [],
      product_id: 0,
      developer_status: 0,
      deviceTableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          gatewayKey: '',
          pageSize: 10,
          dateRange: [],
        },
      },
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          productId: 0,
          pageSize: 10,
          status: '',
          dateRange: [],
        },
      },
      logtableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          productId: 0,
          pageSize: 10,
          status: '',
          dateRange: [],
        },
      },
    });

    onMounted(() => {
      initData()
    });

    function initData() {
      
      const ids = route.params && route.params.id;
      api.instance.detail(ids).then((res: any) => {
        state.detail = res.data;
        state.developer_status = res.data.status;
        state.tableData.param.productId = res.data.product.id;
        state.product_id = res.data.product.id;
        api.product.detail(res.data.product.id).then((res: any) => {
          state.prodetail = res.data;
        });

        const { phone, certificate, intro } = JSON.parse(res.data.extensionInfo || '{}')
        state.phone = phone || [];
        state.certificate = certificate || [];
        state.intro = intro

        //加载全部属性
        datahub.node.getpropertyList({ key: state.detail.product.key }).then((re: any) => {
          array_list.value = re;
        });

        //第一次加载
        api.model.property(state.tableData.param).then((res: any) => {
          state.tableData.data = res.Data;
          state.tableData.total = res.Total;
        });
        getrunData();

        getDeviceTableData()
      });
    }

    const mutipleUnbind = () => {
      let msg = '是否进行批量解绑？';
      if (state.deviceKeyList.length === 0) {
        ElMessage.error('请选择要批量解绑的数据。');
        return;
      }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          api.device.mutipleUnbind({
            "gatewayKey": state.deviceTableData.param.gatewayKey,
            "subKeys": state.deviceKeyList
          }).then(() => {
            ElMessage.success('解绑成功');
            // typeList();
            getDeviceTableData();
          });
        })
        .catch(() => { });
    }

    const getDeviceTableData = () => {
      state.deviceTableData.param.gatewayKey = state.detail.key;
      api.device.getList(state.deviceTableData.param).then((res: any) => {
        state.deviceTableData.data = res.list;

        state.deviceTableData.total = res.Total;
      });
    };

    // 多选框选中数据
    const handleSelectionChange = (selection: any[]) => {
      state.deviceKeyList = selection.map((item) => item.key);
    };

    // 打开修改产品弹窗
    const onOpenDetail = (row: any) => {
      subDeviceRef.value.openDialog(row)
    };


    // 删除子设备
    const deleteSubDevice = (row: any) => {
      ElMessageBox.confirm(`此操作将永久删除分类：${row.name}, 是否继续?`, '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        api.product.deleteSubDevice(row.id).then(() => {
          ElMessage.success('删除成功');
          getDeviceTableData();
        });
      });

    };

    const onLogDetail = (row: TableDataRow) => {
      state.jsonData = JSON.parse(row.content);
      state.dialogVisible = true;
    };

    const onOpenMutipleBind = () => {
      mutipleBindRef.value.openDialog(state.deviceTableData.param.gatewayKey);
    };


    //编辑属性
    const onEditAttr = (row: TableDataRow) => {
      editAttrRef.value.openDialog(row, state.product_id);
    };

    //编辑功能
    const onEditFun = (row: TableDataRow) => {
      editFunRef.value.openDialog(row, state.product_id);
    };

    //编辑事件
    const onEditEvent = (row: TableDataRow) => {
      editEventRef.value.openDialog(row, state.product_id);
    };

    //编辑标签
    const onEditTag = (row: TableDataRow) => {
      editTabRef.value.openDialog(row, state.product_id);
    };

    //打开添加属性弹窗
    const onOpenEditAttr = () => {
      editAttrRef.value.openDialog({ product_id: state.product_id, id: 0, accessMode: 0 });
    };

    //打开添加功能弹窗
    const onOpenEditFun = () => {
      editFunRef.value.openDialog({ product_id: state.product_id, id: 0 });
    };
    //打开添加事件弹窗
    const onOpenEditEvent = () => {
      editEventRef.value.openDialog({ product_id: state.product_id, id: 0, level: 0 });
    };

    //打开添加事件弹窗
    const onOpenEditTab = () => {
      editTabRef.value.openDialog({ product_id: state.product_id, id: 0, accessMode: 0 });
    };

    //查看日志列表
    const onOpenListDetail = (row: TableDataRow) => {
      listDicRef.value.openDialog(row, state.detail.id);
    };

    // 打开修改产品弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
    };

    // 删除产品
    const onRowDel = (key, type) => {
      let msg = `此操作将永久删除该数据，是否继续?`;

      if (key.length === 0) {
        ElMessage.error('请选择要删除的数据。');
        return;
      }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (type == 'attr') {
            api.model.propertydel(state.product_id, key).then(() => {
              ElMessage.success('删除成功');
              getproperty();
            });
          }
          if (type == 'fun') {
            api.model.functiondel(state.product_id, key).then(() => {
              ElMessage.success('删除成功');
              getfunction();
            });
          }
          if (type == 'event') {
            api.model.eventdel(state.product_id, key).then(() => {
              ElMessage.success('删除成功');
              getevent();
            });
          }
          if (type == 'tab') {
            api.model.tagdel(state.product_id, key).then(() => {
              ElMessage.success('删除成功');
              tagdel();
            });
          }
        })
        .catch(() => { });
    };

    //根据不同类型获取列表
    const getList = () => {
      switch (state.activetab) {
        case 'attr':
          getproperty();
          break;
        case 'fun':
          getfunction();
          break;
        case 'event':
          getevent();
          break;
        case 'tab':
          gettab();
          break;
      }
    };

    const getproperty = () => {
      api.model.property(state.tableData.param).then((res: any) => {
        state.tableData.data = res.Data;

        state.tableData.total = res.Total;
      });
    };

    const getfunction = () => {
      api.model.function(state.tableData.param).then((res: any) => {
        state.tableData.data = res.Data;
        state.tableData.total = res.Total;
      });
    };
    const getevent = () => {
      api.model.event(state.tableData.param).then((res: any) => {
        state.tableData.data = res.Data;
        state.tableData.total = res.Total;
      });
    };

    const gettab = () => {
      api.model.tag(state.tableData.param).then((res: any) => {
        state.tableData.data = res.Data;

        state.tableData.total = res.Total;
      });
    };

    const wuhandleClick = (tab: TabsPaneContext) => {
      state.activetab = tab.props.name;
      switch (tab.props.name) {
        case 'attr':
          getproperty();
          break;
        case 'fun':
          getfunction();
          break;
        case 'event':
          getevent();
          break;
        case 'tab':
          gettab();
          break;
      }
    };

    const handleClick = (tab: TabsPaneContext, event: Event) => {
      if (tab.props.name == 4) {
        //获取日志
        getlog();
        getlogtype();
      } else if (tab.props.name == 2) {
        getList();
      } else if (tab.props.name == 3) {
        getrunData();
      }
    };
 
    const getValueText=(key, value)=>{
      let data =array_list.value;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.key === key) {
          if (item.valueType.type === "enum") {
            const option = item.valueType.elements.find((element) => element.value === value);
            if (option) {
              return option.text;
            }
          } else {
            return value;
          }
        }
      }

      return value;
    }
    const getStatusText=(name, value) =>{
      let data =array_list.value;
      for (let i = 0; i < data.length; i++) {
        const field = data[i];
        if (field.valueType.type === "object") {
          for (let j = 0; j < field.valueType.properties.length; j++) {
            const property = field.valueType.properties[j];
            if (property.key === name) {
              if (property.valueType.type === "enum") {
                const element = property.valueType.elements.find((element) => element.value === value);
                if (element) {
                  return `${property.name}: ${element.text}`;
                }else{
                  return `${property.name}: ${value}`;
                }
              } else {
                return `${property.name}: ${value}`;
              }
            }
          }
        } else if (field.key === name) {
          if (field.valueType.type === "enum") {
            const element = field.valueType.elements.find((element) => element.value === value);
            if (element) {
              return `${field.name}: ${element.text}`;
            }
          } else {

            return `${field.name}: ${value}`;
          }
        }
      }

      return name+':'+value;
    }

    const getrunData = () => {
      
      api.instance.getrun_status({ id: state.detail.id }).then((res: any) => {
        state.areaData = res
        let properties = state.areaData.properties || [];

        var temp = new Array();

        properties.forEach(function (item, index) {
          
          let datalist = item.list || [];
          temp[index] = [];
          var temps = new Array();

          datalist.forEach(function (a, b) {
            if (b < 15) {
              temps.push(a);
            }
          });
          if (item.type == 'object') {
            item.value = JSON.parse(item.value);
          }





          temp[index]['name'] = item.name
          temp[index]['key'] = item.key
          temp[index]['type'] = item.type
          temp[index]['unit'] = item.unit
          temp[index]['value'] = item.value
          temp[index]['list'] = temps

        });
        state.areaData.properties = temp;
      });
    };

    const getlogtype = () => {
      api.instance.getlogcate({}).then((res: any) => {
        state.logTypeData = res.list;
      });
    };

    const getlog = () => {
      state.logtableData.param.deviceKey = state.detail.key;
      api.instance.getLogList(state.logtableData.param).then((res: any) => {
        state.logtableData.data = res.list;
        state.logtableData.total = res.Total;
      });
    };
        	/** 重置按钮操作 */
		const resetQuery = (formEl: FormInstance | undefined) => {
			if (!formEl) return;
			formEl.resetFields();
			getlog();
		};

    const CkOption = () => {
      if (state.developer_status == 2) {
        api.instance.devoffline({ id: state.detail.id }).then((res: any) => {
          ElMessage.success('操作成功');
          state.developer_status = 1;
        });
      } else {
        api.instance.devonline({ id: state.detail.id }).then((res: any) => {
          ElMessage.success('操作成功');
          state.developer_status = 2;
        });
      }
    };
    const tinyAreas = () => {
      var data = state.data;

      const tinyArea = new TinyArea('container', {
        height: 60,
        autoFit: false,
        data,
        smooth: true,
        areaStyle: {
          fill: '#d6e3fd',
        },
      });
      tinyArea.render();
    }
    const onlineTimeoutUpdate = () => {
      if (!state.detail.onlineTimeout) return ElMessage('请先输入设备超时时间')
      api.device.updateOnlineTimeout({ id: state.detail.id, onlineTimeout: state.detail.onlineTimeout }).then(() => {
        ElMessage.success('设置成功')
      })
    }
    const setAttr = (row: any) => {
      setAttrRef.value.show(row)
    }

    return {
      initData,
      logqueryRef,
      resetQuery,
      getStatusText,
      getValueText,
      onlineTimeoutUpdate,
      setAttr,
      tinyAreas,
      setAttrRef,
      editDicRef,
      editAttrRef,
      listDicRef,
      editFunRef,
      editEventRef,
      editTabRef,
      subDeviceRef,
      mutipleBindRef,
      onOpenListDetail,
      getrunData,
      getlog,
      getlogtype,
      onLogDetail,
      CkOption,
      onRowDel,
      onEditFun,
      onEditEvent,
      onEditTag,
      onEditAttr,
      getList,
      getproperty,
      getDeviceTableData,
      handleSelectionChange,
      getfunction,
      getevent,
      gettab,
      wuhandleClick,
      onOpenEditTab,
      onOpenEditEvent,
      onOpenEditAttr,
      onOpenEditFun,
      onOpenEditDic,
      onOpenDetail,
      deleteSubDevice,
      handleClick,
      onOpenMutipleBind,
      mutipleUnbind,
      ...toRefs(state),
    };
  },
});
</script>
<style>
.oblist {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 5px;
  flex: 1;
  margin-top: 10px;
  margin-left: 10px;
}

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
  justify-content: space-between;

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

.ant-descriptions-view>table {
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

.ant-card {
  box-sizing: border-box;
  margin: 10px;
  width: 23.2%;
  font-size: 14px;
  font-variant: tabular-nums;
  border: 1px solid var(--next-border-color-light);

  line-height: 1.5;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  border-radius: 2px;
  transition: all 0.3s;
}

.ant-card-body {
  padding: 24px;
  zoom: 1;
}

.cardflex {
  display: flex;
  justify-content: space-between;
}

.statusname {
  font-size: 30px;
  margin-top: 10px;
  margin-bottom: 15px;
}

.comtest {
  margin-top: 20px;
  height: 30px;
  line-height: 30px;
}</style>


