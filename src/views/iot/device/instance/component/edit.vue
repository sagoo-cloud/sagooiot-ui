<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id!==0?'修改':'添加')+'设备'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
       <el-form-item label="设备标识" prop="key">
          <el-input v-model="ruleForm.key" placeholder="请输入设备标识" :disabled="ruleForm.id" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入设备名称" />
        </el-form-item>
          <el-form-item label="所属产品" prop="productId">
          <el-select v-model="ruleForm.productId" placeholder="请选择所属产品" class="w100">
            <el-option
              v-for="item in productData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item> 
         <el-form-item label="所属部门" prop="deptId">
          <el-cascader :options="deptData" :props="{ checkStrictly: true,emitPath: false, value: 'deptId', label: 'deptName' }" placeholder="请选择所属部门" clearable class="w100" v-model="ruleForm.deptId">
            <template #default="{ node, data }">
              <span>{{ data.deptName }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item> 
        <el-form-item label="设备坐标" prop="lng">
          <el-input :value="ruleForm.lng + ' , ' + ruleForm.lat" placeholder="选择设备坐标" @click="selectPosition" read-only />
        </el-form-item>
        <el-form-item label="设备证书" prop="certificate">
          <el-input v-model="ruleForm.certificate" placeholder="请输入设备证书" />
        </el-form-item>

        <el-form-item label="设备秘钥" prop="secureKey">
          <el-input v-model="ruleForm.secureKey" placeholder="请输入设备秘钥" />
        </el-form-item>

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
					<el-button type="primary" @click="onSubmit" size="default">{{ruleForm.id!==0?'修 改':'添 加'}}</el-button>
				</span>
			</template>
		</el-dialog>
    <el-dialog title="地图选点（点击地图即可）"  v-model="mapVisible" width="1000px" append-to-body>
      <div class="map" id="map-container-conpany" style="height: 65vh"></div>
    </el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent,ref, unref, nextTick } from 'vue';
import api from '/@/api/device';
import {ElMessage} from "element-plus";
interface RuleFormState {
  id:number;
  name:string;
  certificate:string;
  secureKey:string;
  version:string;
  productId:number;
  deptId:number;
  lng: string;
  lat: string;
  desc:string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
  rules:{}
}

export default defineComponent({
	name: 'deviceEditPro',
	setup(prop,{emit}) {
    const formRef = ref<HTMLElement | null>(null);
    const mapVisible = ref(false);
		const state = reactive<DicState>({
			isShowDialog: false,
      productData: [], // 分类数据
      deptData: [], // 
			ruleForm: {
        id:0,
        name:'',
        productId:'',
        deptId:0,
        certificate:'',
        lng: '',
        lat: '',
        secureKey:'',
        version:'',
        desc:''
			},
      rules: {
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        key: [
          { required: true, message: "设备标识不能为空", trigger: "blur" }
        ],
        productId: [{ required: true, message: '所属产品不能为空', trigger: 'blur' }],
        deptId: [{ required: true, message: '所属部门不能为空', trigger: 'blur' }],
       
      }
		});
		// 打开弹窗
		const openDialog = (row: RuleFormState|null) => {
      resetForm();

        api.product.getLists({ status: 1 }).then((res: any) => {
          state.productData = res.product || [];
        });
        api.dept.getList({ status: -1 }).then((res: any) => {
          state.deptData = res || [];
        });


      if (row){
        // api.dict.getType(row.id).then((res:any)=>{
        //   state.ruleForm = res.data.dictType
        // })
        state.ruleForm = row;
      }
			state.isShowDialog = true;
		};
    const resetForm = ()=>{
      state.ruleForm = {
        id:0,
        name:'',
        productId:'',
        lng: '',
        lat: '',
        deptId:0,
        certificate:'',
        secureKey:'',
        version:'',
        desc:''
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
          if(state.ruleForm.id!==0){
            //修改
            api.instance.edit(state.ruleForm).then(()=>{
              ElMessage.success('设备类型修改成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          }else{
            //添加
            api.instance.add(state.ruleForm).then(()=>{
              ElMessage.success('设备类型添加成功');
              closeDialog(); // 关闭弹窗
              emit('typeList')
            })
          }
        }
      });
		};
    function selectPosition() {
      mapVisible.value = true;
      nextTick(() => {
        var map = new BMapGL.Map("map-container-conpany");
        map.centerAndZoom("沈阳市", 8);
        map.enableScrollWheelZoom(true);
        map.addEventListener("click", (e) => {
          console.log("点击位置经纬度：" + e.latlng.lng + "," + e.latlng.lat);
          state.ruleForm.lng = e.latlng.lng.toFixed(5);
          state.ruleForm.lat = e.latlng.lat.toFixed(5);
          mapVisible.value = false;
        });
      });
    }


		return {
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
