<template>
	<el-dialog class="api-edit" v-model="showDialog" :title="`${formData.id ? '编辑设备档案' : '新增设备档案'}`" width="800px"
		:close-on-click-modal="false" :close-on-press-escape="false">
		<el-form class="inline-form" ref="formRef" :model="formData" :rules="ruleForm" label-width="120px">

			<el-row>
				<el-col :span="12">
					<el-form-item label="选择产品" prop="name">
						<el-select v-model="formData.name" placeholder="请选择产品" class="w100" clearable>
							<el-option label="Zone one" value="shanghai" />
							<el-option label="Zone two" value="beijing" />
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="选择设备" prop="name">
						<el-select v-model="formData.name" placeholder="请选择设备" class="w100" clearable>
							<el-option label="Zone one" value="shanghai" />
							<el-option label="Zone two" value="beijing" />
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="12">
					<el-form-item label="设备ID" prop="name">
						<el-input v-model.trim="formData.name" placeholder="请输入场景名称" />
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="设备编码" prop="name">
						<el-input v-model.trim="formData.name" placeholder="请输入场景名称" />
					</el-form-item>
				</el-col>
			</el-row>


			<el-row>
				<el-col :span="12">
					<el-form-item label="所属区域" prop="area">
						<el-cascader :options="orgData"
							:props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'name' }"
							placeholder="请选择区域" clearable class="w100" v-model="ruleForm.area">
							<template #default="{ node, data }">
								<span>{{ data.name }}</span>
								<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
							</template>
						</el-cascader>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="安装时间">
						<el-date-picker v-model="formData.date" type="date" placeholder="请选择时间" class="w100" clearable />
					</el-form-item>
				</el-col>
			</el-row>







			<el-form-item label="详细地址">
				<el-input v-model.trim="formData.name" placeholder="请输入详细地址" />
			</el-form-item>


			<el-form-item label="地图坐标">
				<el-row>
					<el-col :span="7" class="mr10">
						<el-select v-model="formData.name" placeholder="请选择坐标系" class="w100 " clearable>
							<el-option label="Zone one" value="shanghai" />
							<el-option label="Zone two" value="beijing" />
						</el-select>
					</el-col>

					<el-col :span="7" class="mr10">
						<el-input v-model.trim="formData.name" placeholder="经度" class="w100" />

					</el-col>
					<el-col :span="8">
						<el-input v-model.trim="formData.name" placeholder="纬度" class="w100" />

					</el-col>
				</el-row>
			</el-form-item>

			<el-form-item label="建设单位">
				<el-row>
					<el-col :span="7" class="mr10">
						<el-input v-model.trim="formData.name" placeholder="单位名称" class="w100" />

					</el-col>

					<el-col :span="7" class="mr10">
						<el-input v-model.trim="formData.name" placeholder="单位联系人" class="w100" />

					</el-col>
					<el-col :span="8">
						<el-input v-model.trim="formData.name" placeholder="联系电话" class="w100" />

					</el-col>
				</el-row>
			</el-form-item>

			<el-form-item label="管理单位">
				<el-row>
					<el-col :span="7" class="mr10">
						<el-input v-model.trim="formData.name" placeholder="单位名称" class="w100" />

					</el-col>

					<el-col :span="7" class="mr10">
						<el-input v-model.trim="formData.name" placeholder="单位联系人" class="w100" />

					</el-col>
					<el-col :span="8">
						<el-input v-model.trim="formData.name" placeholder="联系电话" class="w100" />

					</el-col>
				</el-row>
			</el-form-item>

			<el-form-item label="维护单位">
				<el-row>
					<el-col :span="7" class="mr10">
						<el-input v-model.trim="formData.name" placeholder="单位名称" class="w100" />

					</el-col>

					<el-col :span="7" class="mr10">
						<el-input v-model.trim="formData.name" placeholder="单位联系人" class="w100" />

					</el-col>
					<el-col :span="8">
						<el-input v-model.trim="formData.name" placeholder="联系电话" class="w100" />

					</el-col>
				</el-row>
			</el-form-item>

			<el-form-item label="设备类型">
				<el-select v-model="formData.name" placeholder="请选择设备类型" class="w100 " clearable>
							<el-option label="Zone one" value="shanghai" />
							<el-option label="Zone two" value="beijing" />
						</el-select>
				</el-form-item>

			
			<el-form-item label="备注">
				<el-input v-model.trim="formData.name" placeholder="备注" />
			</el-form-item>



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
import api from '/@/api/scene';
import system from '/@/api/system';

import { ruleRequired } from '/@/utils/validator';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['getList']);

const showDialog = ref(false);
const formRef = ref();
const orgData = ref();

const baseForm = {
	id: undefined,
	name: '',
	sceneType: "device",
	description: '',

};

const formData = reactive({
	...baseForm,
});

const ruleForm = {
	name: [ruleRequired('场景名称不能为空')],
};

const onSubmit = async () => {
	await formRef.value.validate();

	const theApi = formData.id ? api.manage.edit : api.manage.add;

	await theApi(formData);

	ElMessage.success('操作成功');
	resetForm();
	showDialog.value = false;
	emit('getList');
};

const resetForm = async () => {
	Object.assign(formData, { ...baseForm });
	formRef.value && formRef.value.resetFields();
};

const open = async (row: any) => {
	resetForm();
	showDialog.value = true;
	nextTick(() => {
		Object.assign(formData, { ...row });
		system.org.getList({ status: 1 }).then((res: any) => {
			orgData.value = res || [];
		});
	});
};

defineExpose({ open });
</script>
<style scoped lang="scss">
.demo-form-inline .el-input {
	--el-input-width: 320px;
}
</style>