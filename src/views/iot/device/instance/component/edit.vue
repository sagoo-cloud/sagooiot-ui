<template>
  <div class="system-edit-dic-container">
    <el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '设备'" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
        <el-form-item label="设备标识" prop="key">
          <el-input v-model="ruleForm.key" placeholder="请输入设备标识" :disabled="ruleForm.id" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="所属产品" prop="productId">
          <el-select v-model="ruleForm.productId" @change="productIdChange" :disabled="ruleForm.id" placeholder="请选择所属产品" class="w100">
            <el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备坐标" prop="lng">
          <el-input :value="ruleForm.lng ? (ruleForm.lng + ' , ' + ruleForm.lat) : ''" placeholder="选择设备坐标" @click="selectPosition" read-only />
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="地图选点（点击地图即可）" v-model="mapVisible" width="1000px" append-to-body>
      <div class="map" id="map-container-conpany" style="height: 65vh"></div>
    </el-dialog>
    <tagVue ref="tagRef"></tagVue>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, nextTick } from 'vue';
import api from '/@/api/device';
import { ElMessage } from "element-plus";
import tagVue from './tag.vue'
import certApi from '/@/api/certificateManagement';

interface RuleFormState {
  id: number;
  key: string;
  name: string;
  version: string;
  productId: number | string;
  tags: Tag[];
  lng: string;
  lat: string;
  desc: string;
  authType: number;
  authUser: string;
  authPasswd: string;
  accessToken: string;
  certificateId: string;
}

const form: RuleFormState = {
  id: 0,
  key: '',
  name: '',
  productId: '',
  tags: [],
  lng: '',
  lat: '',
  version: '',
  authType: 0,
  authUser: '',
  authPasswd: '',
  accessToken: '',
  certificateId: '',
  desc: ''
}

interface DicState {
  productData: any[];
  product: any;
  isShowDialog: boolean;
  ruleForm: RuleFormState;
  rules: {}
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
  },
  setup(prop, { emit }) {
    const formRef = ref<HTMLElement | null>(null);
    const tagRef = ref<HTMLElement | null>(null);
    const mapVisible = ref(false);
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
        productId: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
      }
    });
    // 打开弹窗
    const openDialog = (row: RuleFormState | null) => {
      resetForm();

      // 证书列表
      certApi.certificateManagement.getAll().then((res: any) => {
        certList.value = res.Info || []
      });

      api.product.getLists({ status: 1 }).then((res: any) => {
        state.productData = res.product || [];
      });


      if (row) {
        // api.dict.getType(row.id).then((res:any)=>{
        //   state.ruleForm = res.data.dictType
        // })
        state.ruleForm = row;
        state.ruleForm.tags = row.tags || []
        productIdChange(row.productId as number)
      }
      state.isShowDialog = true;
    };
    const resetForm = () => {
      state.ruleForm = {
        ...form
      }
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
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          if (state.ruleForm.id !== 0) {
            //修改
            api.instance.edit(state.ruleForm).then(() => {
              ElMessage.success('设备类型修改成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          } else {
            //添加
            api.instance.add(state.ruleForm).then(() => {
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
    function selectPosition() {
      mapVisible.value = true;
      nextTick(() => {
        var map = new BMapGL.Map("map-container-conpany");
        map.centerAndZoom("沈阳市", 8);
        map.enableScrollWheelZoom(true);
        map.addEventListener("click", (e) => {
          // console.log("点击位置经纬度：" + e.latlng.lng + "," + e.latlng.lat);
          state.ruleForm.lng = e.latlng.lng.toFixed(5);
          state.ruleForm.lat = e.latlng.lat.toFixed(5);
          mapVisible.value = false;
        });
      });
    }
    // 所属产品变化的时候，更新产品详情
    const productIdChange = (productId: number) => {
      api.product.detail(productId).then((res: any) => {
        const { authType, authUser, authPasswd, accessToken, certificateId } = res.data
        state.product = res.data
        state.ruleForm.authType = authType
        state.ruleForm.authUser = authUser
        state.ruleForm.authPasswd = authPasswd
        state.ruleForm.accessToken = accessToken
        state.ruleForm.certificateId = certificateId
      })
    }

    return {
      certList,
      productIdChange,
      tagRef,
      delTagRow,
      toAddTag,
      addTag,
      mapVisible,
      selectPosition,
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
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
