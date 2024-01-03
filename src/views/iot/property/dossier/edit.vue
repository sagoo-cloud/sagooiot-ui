<template>
  <el-dialog class="api-edit" v-model="showDialog" :title="`${formData.id ? '编辑设备档案' : '新增设备档案'}`" width="800px" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form class="inline-form" ref="formRef" :model="formData" :rules="ruleForm" label-width="120px">

      <el-row>
        <el-col :span="12">
          <el-form-item label="选择产品" prop="productKey">
            <el-select v-model="formData.productKey" placeholder="请选择产品" class="w100" disabled>
              <el-option v-for="item in productData" :key="item.key" :label="item.name" :value="item.key">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; font-size: 13px">{{ item.key }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="选择设备" prop="deviceKey">
            <el-select v-model="formData.deviceKey" placeholder="请选择设备" class="w100" filterable clearable @change="handleSelectionChange">
              <el-option v-for="item in deviceList" :key="item.key" :label="item.name" :value="item.key">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; font-size: 13px">{{ item.key }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="deviceName">
            <el-input v-model.trim="formData.deviceName" placeholder="请输入设备名称" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备编码" prop="deviceNumber">
            <el-input v-model.trim="formData.deviceNumber" placeholder="请输入设备编码" />
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="12">
          <el-form-item label="所属区域" prop="area">
            <el-cascader :options="orgData" :props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }" placeholder="请选择区域" clearable class="w100" v-model="formData.area">
              <template #default="{ node, data }">
                <span>{{ data.name }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="安装时间">
            <el-date-picker v-model="formData.installTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择时间" class="w100" clearable />
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptId">
            <el-cascader :options="deptData" :props="{ checkStrictly: true, emitPath: false, value: 'deptId', label: 'deptName' }" placeholder="请选择所属部门" clearable class="w100" v-model="formData.deptId">
              <template #default="{ node, data }">
                <span>{{ data.deptName }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="设备类型">
            <el-input v-model.trim="formData.deviceCategory" placeholder="请输入设备类型" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left" v-if="Datalist">自定义属性</el-divider>
        <FromData :Datalist="Datalist" @SetSaveData="SetSaveData" v-if="Datalist && Datalist.length > 0"></FromData>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import api from '/@/api/device'
import system from '/@/api/system';
import FromData from './component/from.vue';

import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();
const orgData = ref();
const deviceList = ref();
const productData = ref();
const deptData = ref();
const Datalist = ref();
const newData = ref([]);
const baseForm = {
  id: undefined,
  productKey: '',
  deviceKey: '',
  deviceName: '',
  area: "",
  deviceNumber: '',
  deviceCategory: '',
  installTime: '',
  deptId: '',
  data: [],

};


const SetSaveData = (data: any) => {
  formData.data = data;
}
const formData = reactive({
  ...baseForm,
});

const ruleForm = {
  productKey: [ruleRequired('所属产品不能为空')],
  deviceName: [ruleRequired('设备名称不能为空')],
  deviceKey: [ruleRequired('设备不能为空')],
};
const handleSelectionChange = (value: any) => {
  const selectedOption = deviceList.value.find(option => option.key === value);
  if (selectedOption) {
    formData.deviceName = selectedOption.name;
  } else {
    formData.deviceName = '';
  }
}

const onSubmit = async () => {
  await formRef.value.validate();
  const theApi = formData.id ? api.dev_asset.edit : api.dev_asset.add;
  await theApi(formData);
  ElMessage.success('操作成功');
  resetForm();
  showDialog.value = false;
  emit('getList');
};

const resetForm = async () => {
  Object.assign(formData, { ...baseForm });
  Datalist.value = ''
  formRef.value && formRef.value.resetFields();
};

const getIdByKey = (key: string) => {
  for (let i = 0; i < productData.value.length; i++) {
    if (productData.value[i].key === key) {
      return productData.value[i].id;
    }
  }
  return null; // 如果没有找到匹配的key，则返回null（或者其他合适的值）
}

const open = async (row: any, productInfo: any) => {
  resetForm();
  showDialog.value = true;
  nextTick(() => {
    system.org.getList({ status: 1 }).then((res: any) => {
      res.forEach((item:any) => {
        item.id = item.id.toString();
      });
      orgData.value = res || [];
    });

    //获取 所有的产品
    api.product.getLists({}).then((resp: any) => {
      productData.value = resp.product;
      if (row.id) {
        productInfo = {
          id: getIdByKey(row.productKey),
          key: row.productKey,
        }
      }
      //根据产品ID获取设备列表
      api.device.allList({ productId: productInfo.id }).then((resd: any) => {
        deviceList.value = resd.device || [];
      });
    })

    //获取部门
    api.dept.getList({ status: -1 }).then((res: any) => {
      res.forEach((item:any) => {
        item.deptId = item.deptId.toString();
      });
      deptData.value = res || [];
    });

    if (row.id) {
      api.dev_asset.detail({ deviceKey: row.deviceKey }).then((resde: any) => {
        Object.assign(formData, { ...resde });
        formData.productKey = row.productKey
        const newArray = resde.data.map(obj => {
          const { name, value, ...rest } = obj;
          const newObj = { name, value, ...rest };
          newObj[name] = value ? value : '';
          return newObj;
        });
        Datalist.value = newArray
      });
    } else {
      //获取档案属性
      api.dev_asset_metadata.getList({ productKey: productInfo.key, pageSize: 50, pageNum: 1, status: -1, total: 0 }).then((res: any) => {
        const sortedArray = res.Data.sort((a, b) => a.id - b.id);
				Datalist.value = sortedArray || [];
      });
      formData.productKey = productInfo.key

    }
  });
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.demo-form-inline .el-input {
  --el-input-width: 320px;
}
</style>