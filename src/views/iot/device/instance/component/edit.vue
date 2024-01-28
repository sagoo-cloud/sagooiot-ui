<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '设备'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" label-width="110px">
        <el-form-item label="设备标识" prop="key">
          <el-input v-model="ruleForm.key" placeholder="请输入设备标识" :disabled="ruleForm.id" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="所属产品" prop="productKey">
          <el-select v-model="ruleForm.productKey" @change="productIdChange" :disabled="ruleForm.id" placeholder="请选择所属产品" class="w100">
            <el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备坐标" prop="lng">
          <el-input :value="ruleForm.lng ? (ruleForm.lng + ' , ' + ruleForm.lat) : ''" placeholder="选择设备坐标" @click="selectMap(ruleForm)" read-only />
        </el-form-item>

        <el-form-item label="标签设置" prop="lng">
          <div class="tags-wrapper">
            <el-button type="primary" size="small" @click="toAddTag">添加标签</el-button>
            <div class="tags">
              <div class="tag flex" v-for="tag, i in ruleForm.tags" :key="tag.key">
                <el-tag>{{ tag.key }} : {{ tag.name }} : {{ tag.value }}</el-tag>
                <el-button type="danger" size="small" @click="delTagRow(i)">删除</el-button>
              </div>
            </div>
          </div>
        </el-form-item>
        <template v-if="ruleForm.authType === 1 || ruleForm.authType === 2">
          <el-form-item label="认证方式" prop="">
            <el-radio-group v-model="ruleForm.authType">
              <el-radio :label="1">Basic</el-radio>
              <el-radio :label="2">AccessToken</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="ruleForm.authType === 1">
            <el-form-item label="用户名" prop="authUser">
              <el-input v-model="ruleForm.authUser" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码" prop="authPasswd">
              <el-input type="password" v-model="ruleForm.authPasswd" placeholder="请输入密码" />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="Aceess Token" prop="accessToken">
              <el-input v-model="ruleForm.accessToken" placeholder="请输入Aceess Token" />
            </el-form-item>
          </template>
        </template>
        <template v-else-if="ruleForm.authType === 3">
          <el-form-item label="认证证书" prop="certificateId">
            <el-select v-model="ruleForm.certificateId" placeholder="请选择证书">
              <el-option v-for="cert in certList" :key="cert.id" :label="cert.name" :value="cert.id"> </el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="固件版本号" prop="version">
          <el-input v-model="ruleForm.version" placeholder="请输入固件版本号" />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="设备说明">
          <el-input v-model="intro" type="textarea" placeholder="请输入设备说明"></el-input>
        </el-form-item>
        <el-form-item label="设备图片">
					<upload-vue :imgs="phone" @set-imgs="setImgsPhone" :limit="deviceImgLimit"></upload-vue>
				</el-form-item>
        <el-form-item label="证书图片">
					<upload-vue :imgs="certificate" @set-imgs="setImgsCertificate" :limit="deviceImgLimit"></upload-vue>
				</el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
        </span>
      </template>
    </el-dialog>
    <tagVue ref="tagRef"></tagVue>
    <Map ref="mapRef" @updateMap="updateMap"></Map>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, nextTick, onMounted } from 'vue';
import api from '/@/api/device';
import apiSystem from '/@/api/system';
import { ElMessage } from "element-plus";
import tagVue from './tag.vue';
import Map from './map.vue';
import UploadVue from '/@/components/upload/index.vue';
import certApi from '/@/api/certificateManagement';

interface RuleFormState {
  id: number;
  key: string;
  name: string;
  version: string;
  productKey: string | string;
  tags: Tag[];
  lng: string;
  lat: string;
  desc: string;
  authType: number;
  authUser: string;
  authPasswd: string;
  accessToken: string;
  certificateId: string;
  extensionInfo: string;
  address: string;
}

const form: RuleFormState = {
  id: 0,
  key: '',
  name: '',
  productKey: '',
  tags: [],
  lng: '',
  lat: '',
  version: '',
  authType: 0,
  authUser: '',
  authPasswd: '',
  accessToken: '',
  certificateId: '',
  desc: '',
  extensionInfo: '',
  address: '',
}

interface DicState {
  productData: any[];
  product: any;
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  rules: {};
  deviceImgLimit: number;
  certificateLimit: number;
  phone: any[];
  certificate: any[];
  intro: string;
}
interface Tag {
  key: string;
  name: string;
  value: string;
}

export default defineComponent({
  name: 'deviceEditPro',
  components: {
    tagVue,
    Map,
    UploadVue
  },
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);
    const tagRef = ref<HTMLElement | null>(null);
    const mapRef = ref();
    const certList = ref([])
    const state = reactive<DicState>({
      isShowDialog: false,
      product: {},
      productData: [], // 分类数据
      ruleForm: {
        ...form
      },
      rules: {
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        key: [
          { required: true, message: "设备标识不能为空", trigger: "blur" }
        ],
        productKey: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
      },
      deviceImgLimit: 0,
      certificateLimit: 0,
      phone: [],
      certificate: [],
      intro: ""
    });

    //地图选点
    const selectMap = (row: any) => {
      mapRef.value.openDialog(row);
    }
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();

      apiSystem.getInfoByKey('sys.device.phone.limit').then((res: any) => {
        state.deviceImgLimit = parseInt(res.data.configValue);
      });
      apiSystem.getInfoByKey('sys.device.certificate.limit').then((res: any) => {
        state.certificateLimit = parseInt(res.data.configValue);
      });

      // 证书列表
      certApi.certificateManagement.getAll().then((res: any) => {
        certList.value = res.Info || []
      });

      api.product.getLists({ status: 1 }).then((res: any) => {
        state.productData = res.product || [];
      });


      if (row) {
        state.ruleForm = row;
        state.ruleForm.tags = row.tags || [];
        state.phone = row.extensionInfo ? JSON.parse(row.extensionInfo).phone : [];
        state.certificate = row.extensionInfo ? JSON.parse(row.extensionInfo).certificate : [];
        state.intro = row.extensionInfo ? JSON.parse(row.extensionInfo).intro : "";
        productIdChange(row.productKey as string)
      }
      state.isShowDialog = true;
    };
    const resetForm = () => {
      state.ruleForm = {
        ...form
      }
    };
    // 上传设备图
    const setImgsPhone = (res:any) => {
      state.phone = res;
    }
    // 上传设备资格证书
    const setImgsCertificate = (res:any) => {
      state.certificate = res;
    }
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
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          if (state.ruleForm.id !== 0) {
            //修改
            const params = {
              ...state.ruleForm,
              extensionInfo: JSON.stringify({
                "phone": state.phone,
                "certificate": state.certificate,
                "intro": state.intro
              })
            }
            api.instance.edit(params).then(() => {
              ElMessage.success('设备类型修改成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          } else {
            //添加
            const params = {
              ...state.ruleForm,
              extensionInfo: JSON.stringify({
                "phone": state.phone,
                "certificate": state.certificate,
                "intro": state.intro
              })
            }
            api.instance.add(params).then(() => {
              ElMessage.success('设备类型添加成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          }
        }
      });
    };
    function toAddTag() {
      const tag = tagRef.value as any
      tag.addRow()
    }
    function addTag(row: Tag) {
      state.ruleForm.tags.push(row)
    }
    function delTagRow(i: number) {
      state.ruleForm.tags.splice(i, 1)
    }

    // 所属产品变化的时候，更新产品详情
    const productIdChange = (productKey: string) => {
      api.product.detail(productKey).then((res: any) => {
        const { authType, authUser, authPasswd, accessToken, certificateId } = res.data
        state.product = res.data
        state.ruleForm.authType = authType
        state.ruleForm.authUser = authUser
        state.ruleForm.authPasswd = authPasswd
        state.ruleForm.accessToken = accessToken
        state.ruleForm.certificateId = certificateId
      })
    }

    //回调地图选点
    const updateMap=(data:any)=>{
      state.ruleForm.lng = data.lng;
      state.ruleForm.lat = data.lat;
      state.ruleForm.address = data.address;
    }

    return {
      certList,
      productIdChange,
      tagRef,
      selectMap,
      mapRef,
      updateMap,
      delTagRow,
      toAddTag,
      addTag,
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      setImgsPhone,
      setImgsCertificate,
      formRef,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.tags-wrapper {
  .tag {
    margin: 8px 0;
  }

  .tags {
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
