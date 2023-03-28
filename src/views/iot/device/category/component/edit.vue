<template>
  <div class="system-edit-dept-container">
    <el-dialog :title="(ruleForm.id?'修改':'添加')+'分类'" v-model="isShowDialog" width="769px">
      <el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
        <el-row :gutter="35">
        
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="上级分类">
              <el-cascader :options="deptData" :props="{ checkStrictly: true,emitPath: false, value: 'id', label: 'name' }" placeholder="请选择分类" clearable class="w100" v-model="ruleForm.parentId">
                <template #default="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入分类名称" clearable></el-input>
            </el-form-item>
          </el-col>
		  <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
			<el-form-item label="排序">
			  <el-input-number v-model="ruleForm.sort" :min="0" controls-position="right" placeholder="请输入排序" class="w100" />
			</el-form-item>
		  </el-col>
           <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类标识" prop="key">
              <el-input v-model="ruleForm.key" placeholder="请输入分类名称" clearable></el-input>
            </el-form-item>
          </el-col>
         <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="描述">
              <el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入描述" maxlength="150"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default">{{ruleForm.id?'修 改':'添 加'}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/device';
import { phoneValidate } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

interface RuleFormState {
	id?: number;
	parentId: number;
	name: string;
	key: string;
	desc: string;
	sort: number;
	children?: RuleFormState[];
}
interface DeptSate {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	deptData: RuleFormState[];
	orgData: any[];
	rules: object;
}

const baseForm: RuleFormState = {
	parentId: 0, // 上级分类
	name: '', // 分类名称
	key: '',
	desc: '',
	sort: 0
};

export default defineComponent({
	name: 'deviceEditCate',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DeptSate>({
			isShowDialog: false,
			ruleForm: {
				...baseForm,
			},
			deptData: [], // 分类数据
			orgData: [], // 组织数据
			rules: {
				name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
				key: [{ required: true, message: '分类标识不能为空', trigger: 'blur' }],
			},
		});

		// 打开弹窗
		const openDialog = (row?: RuleFormState | number) => {
			resetForm();
			api.category.getList({ status: 1 }).then((res: any) => {
				state.deptData = res.category || [];
			});

			
			if (row && typeof row === 'object') {
				state.ruleForm = row;
			} else if (row && typeof row === 'number') {
				state.ruleForm.parentId = row;
			}
			state.isShowDialog = true;
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
			console.log(state.ruleForm.parentId);
			const formWrap = unref(formRef) as any;
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					console.log(state.ruleForm);
					console.log(state.ruleForm.parentId);
					if (!state.ruleForm.parentId) {
						state.ruleForm.parentId = 0;
					}
					console.log(state.ruleForm.parentId);
					if (!state.ruleForm.id) {
						//添加
						api.category.add(state.ruleForm).then(() => {
							ElMessage.success('分类添加成功');
							closeDialog(); // 关闭弹窗
							emit('getCateList');
						});
					} else {
						//修改
						api.category.edit(state.ruleForm).then(() => {
							ElMessage.success('分类修改成功');
							closeDialog(); // 关闭弹窗
							emit('getCateList');
						});
					}
				}
			});
		};
		const resetForm = () => {
			state.ruleForm = {
				...baseForm,
			};
		};
		return {
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
