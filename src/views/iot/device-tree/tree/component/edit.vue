<template>
	<div class="system-edit-dept-container">
		<el-dialog :title="(ruleForm.id ? '修改' : '添加') + '设备树'" v-model="isShowDialog" width="769px">
			<el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="名称" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="地址" prop="address">
							<el-input v-model="ruleForm.address" placeholder="请输入地址" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="经度" prop="lng">
							<el-input v-model="ruleForm.lng" placeholder="请输入经度" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="纬度" prop="lat">
							<el-input v-model="ruleForm.lat" placeholder="请输入纬度" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="联系人" prop="contact">
							<el-input v-model="ruleForm.contact" placeholder="请输入联系人" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="联系电话" prop="phone">
							<el-input v-model="ruleForm.phone" placeholder="请输入联系电话" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="开始日期" prop="startDate">
							<el-date-picker
								v-model="ruleForm.startDate"
								type="date"
								placeholder="选择开始日期"
								:size="'default'"
							/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="结束日期" prop="endDate">
							<el-date-picker
								v-model="ruleForm.endDate"
								type="date"
								placeholder="选择结束日期"
								:size="'default'"
							/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="设备标识" prop="deviceKey">
							<el-input v-model="ruleForm.deviceKey" placeholder="请输入设备标识" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="设备所属区域" prop="area">
							<el-input v-model="ruleForm.area" placeholder="请输入设备所属区域" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="所属公司" prop="company">
							<el-input v-model="ruleForm.company" placeholder="请输入所属公司" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
						<el-form-item label="类型" prop="types">
							<el-select v-model="ruleForm.types" filterable clearable placeholder="请选择类型" class="w-35">
								<el-option v-for="dict in tree_types_2" :key="dict.value" :label="dict.label" :value="dict.value"> </el-option>
							</el-select>
							<!-- <el-input v-model="ruleForm.types" placeholder="请输入所属公司" clearable></el-input> -->
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref, getCurrentInstance } from 'vue';
import api from '/@/api/device';
import { phoneValidate } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

interface RuleFormState {
	id?: number;
	name: string;
	address: string;
	lat: string;
	lng: string;
	contact: string;
	phone: string;
	deviceKey: string;
	area: string;
	company: string;
	types: string;
	parentId: string;
	startDate: string;
	endDate: string;
}

const baseForm: RuleFormState = {
	name: '',
	address: '',
	lat: '',
	lng: '',
	contact: '',
	phone: '',
	deviceKey: '',
	area: '',
	company: '',
	types: '',
	parentId: '',
	startDate: '',
	endDate: '',
};

export default defineComponent({
	name: 'deviceEditCate',
	setup(prop, { emit }) {
    const { proxy } = getCurrentInstance() as any;
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
				...baseForm,
			},
			rules: {
				name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
				address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
			},
		});

    const { tree_types_2 } = proxy.useDict('tree_types_2');

		// 打开弹窗
		const openDialog = (type: string, row?: any) => {
			resetForm();
			if (type === 'add') {
				state.ruleForm.parentId = row.infoId
			} else if (type === 'edit') {
				state.ruleForm.id = row.infoId
				getDetail()
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
		const getDetail = () => {
			api.tree.detail({ infoId: state.ruleForm.id })
				.then((res: any) => {
					state.ruleForm = { ...res.data }
				})
		}
		// 新增
		const onSubmit = () => {
			const formWrap = unref(formRef) as any;
			if (!formWrap) return;
			formWrap.validate((valid: boolean) => {
				if (valid) {
					if (!state.ruleForm.id) {
						//添加
						api.tree.add(state.ruleForm).then(() => {
							ElMessage.success('设备树添加成功');
							closeDialog(); // 关闭弹窗
							emit('finish');
						});
					} else {
						//修改
						api.tree.edit(state.ruleForm).then(() => {
							ElMessage.success('设备树修改成功');
							closeDialog(); // 关闭弹窗
							emit('finish');
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
			tree_types_2,
			...toRefs(state),
		};
	},
});
</script>
