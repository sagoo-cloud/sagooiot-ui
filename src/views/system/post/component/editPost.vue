<template>
  <div class="system-edit-post-container">
    <el-dialog v-model="isShowDialog" :title="(!formData.postId?'添加':'修改')+'岗位'" width="769px">
      <el-form ref="formRef" :model="formData" :rules="rules" size="default" label-width="90px">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="上级岗位">
            <el-cascader :options="postData" :props="{ checkStrictly: true,emitPath: false, value: 'postId', label: 'postName' }" placeholder="请选择组织" clearable class="w100" v-model="formData.parentId">
              <template #default="{ node, data }">
                <span>{{ data.postName }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="formData.postName" placeholder="请输入岗位名称" />
        </el-form-item>
        <!-- <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="formData.postCode" placeholder="请输入编码名称" />
        </el-form-item> -->
        <el-form-item label="岗位顺序" prop="postSort">
          <el-input-number v-model="formData.postSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" inline-prompt active-text="启" inactive-text="禁"></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">{{formData.postId===0?'新 增':'修 改'}}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/system';
import { ElMessage } from 'element-plus';

interface DialogRow {
	postId?: number;
	parentId: number;
	// postCode:string;
	postName: string;
	postSort: number;
	status: number;
	remark: string;
}
interface PostState {
	loading: boolean;
	isShowDialog: boolean;
	formData: DialogRow;
	menuExpand: boolean;
	menuNodeAll: boolean;
	menuCheckStrictly: boolean;
	postData: DialogRow[];
	menuProps: {
		children: string;
		label: string;
	};
	rules: object;
}
const baseForm = {
	parentId: -1,
	// postCode:'',
	postName: '',
	postSort: 0,
	status: 1,
	remark: '',
};

export default defineComponent({
	name: 'systemEditPost',
	setup(props, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const menuRef = ref();
		const state = reactive<PostState>({
			loading: false,
			isShowDialog: false,
			postData: [],
			formData: {
				...baseForm,
			},
			// 表单校验
			rules: {
				postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
				// postCode: [
				//   { required: true, message: "岗位编码不能为空", trigger: "blur" }
				// ],
				postSort: [{ required: true, message: '岗位顺序不能为空', trigger: 'blur' }],
			},
			menuExpand: false,
			menuNodeAll: false,
			menuCheckStrictly: false,
			menuProps: {
				children: 'children',
				label: 'title',
			},
		});
		// 打开弹窗
		const openDialog = (row?: DialogRow) => {
			resetForm();
      api.post.getList({ status: 1 }).then((res: any) => {
        console.log(res)
				state.postData = res || [];
			});
			if (row) {
				state.formData = row;
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
			const formWrap = unref(formRef) as any;
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					state.loading = true;
					if (!state.formData.parentId) {
						state.formData.parentId = -1;
					}
					if (!state.formData.postId) {
						//添加
						api.post
							.add(state.formData)
							.then(() => {
								ElMessage.success('岗位添加成功');
								closeDialog(); // 关闭弹窗
								emit('getPostList');
							})
							.finally(() => {
								state.loading = false;
							});
					} else {
						//修改
						api.post
							.edit(state.formData)
							.then(() => {
								ElMessage.success('岗位修改成功');
								closeDialog(); // 关闭弹窗
								emit('getPostList');
							})
							.finally(() => {
								state.loading = false;
							});
					}
				}
			});
		};
		const resetForm = () => {
			state.menuCheckStrictly = false;
			state.menuExpand = false;
			state.menuNodeAll = false;
			state.formData = {
				...baseForm,
			};
		};

		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			menuRef,
			formRef,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.tree-border {
	margin-top: 5px;
	border: 1px solid #e5e6e7 !important;
	background: #fff none !important;
	border-radius: 4px;
}
.system-edit-post-container {
	.menu-data-tree {
		border: var(--el-input-border, var(--el-border-base));
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
