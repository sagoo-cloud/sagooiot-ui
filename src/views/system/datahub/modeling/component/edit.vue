<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="(ruleForm.id !== 0 ? '修改' : '添加') + '模型'" v-model="isShowDialog" width="769px">
			<el-form :model="ruleForm" ref="formRef" :rules="rules" size="default" label-width="110px">
				<el-form-item label="模型标识" prop="key">
					<el-input v-model="ruleForm.key" placeholder="请输入模型名称"  :disabled="ruleForm.id"/>
				</el-form-item>
				<el-form-item label="模型名称" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入模型名称" />
				</el-form-item>



				<!-- <el-form-item label="更新时间" prop="interval">
					<el-input v-model="ruleForm.interval" placeholder="请输入更新时间" class="w-35" />
					<el-select v-model="ruleForm.intervalUnit" placeholder="请选择单位">
						<el-option v-for="item in unitData" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item> -->

				<el-form-item label="定时请求">
			
					<div style="display:flex">
							<el-input v-model="ruleForm.cronExpression" placeholder="请输入cron表达式" />
							<el-button type="success"  @click="showCron('ruleForm')" style="margin-left: 5px;">设置</el-button>

						</div>
							<!-- <el-input v-model="ruleForm.cronExpression" placeholder="请输入cron表达式" /> -->
							<!-- <ul style="list-style: none;">
								<li><el-icon><ele-WarningFilled /></el-icon> */5 * * * * ? : 每隔5秒执行一次</li>
								<li><el-icon><ele-WarningFilled /></el-icon> 20 */1 * * * ? : 每隔1分钟执行一次</li>
								<li><el-icon><ele-WarningFilled /></el-icon> 30 0 23 * * ? : 每天23点执行一次</li>
								<li><el-icon><ele-WarningFilled /></el-icon> 0 0 1 * * ? : 每天凌晨1点执行一次</li>
								<li><el-icon><ele-WarningFilled /></el-icon> 0 0 1 1 * ? : 每月1号凌晨1点执行一次</li>
							</ul> -->
						</el-form-item>

				<el-form-item label="描述" prop="desc">
					<el-input v-model="ruleForm.desc" type="textarea" placeholder="请输入内容"></el-input>
				</el-form-item>

				<el-form-item label="单元类型" prop="busiTypes">
					<el-select v-model="ruleForm.busiTypes" multiple placeholder="请选择单元类型" class="w100" >
						<el-option v-for="item in zidianData" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
				</el-form-item>

				<!-- <el-form-item label="单元数据" prop="busiId">
					<el-cascader :options="cityData" :props="{ checkStrictly: true,emitPath: false, value: 'id', label: 'name' }" placeholder="请选择单元数据" clearable class="w100" v-model="ruleForm.busiId">
							<template #default="{ node, data }">
							<span>{{ data.name }}</span>
							<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
							</template>
             	 </el-cascader>
				</el-form-item> -->
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>

		<el-dialog v-model="cronShow" title="选择Cron规则" width="60%">
			<vue3cron @handlelisten="handlelisten" :type="crontype" @close="cronclose"></vue3cron>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, unref } from 'vue';
import api from '/@/api/datahub';
import { ElMessage } from 'element-plus';
import vue3cron from '/@/components/vue3cron/vue3cron.vue';

interface RuleFormState {
	id?: number;
	name: string;
	interval: string;
	key: string;
	desc: string;
}
interface DicState {
	isShowDialog: boolean;
	ruleForm: RuleFormState;
	rules: {};
}

export default defineComponent({
	name: 'Edit',
	components: { vue3cron },

	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive<DicState>({
			isShowDialog: false,
			zidianData:[],
			cityData:[],
			cronShow:false,
			crontype:'',
			unitData: [
				{
					label: '秒',
					value: 'second',
				},
				{
					label: '分',
					value: 'minute',
				},
				{
					label: '时',
					value: 'hour',
				},
				{
					label: '天',
					value: 'day',
				},
			],
			ruleForm: {
				id: 0,
				name: '',
				key: '',
				busiTypes:'',
				desc: '',
			},
			rules: {
				key: [{ required: true, message: '模型标识不能为空', trigger: 'blur' }],
				name: [{ required: true, message: '模型名称不能为空', trigger: 'blur' }],
				interval: [{ required: true, message: '请输入更新时间', trigger: 'blur' }],
			},
		});

		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm();
			api.template.getDictData({DictType:'busi_types'}).then((res: any) => {
				state.zidianData = res.values;
				
			});
			api.template.cityTree({status:1}).then((res: any) => {
				state.cityData = res;
			});

			if (row) {
				state.ruleForm = row;
				// if(row.dataTemplateBusi){
				// 	state.ruleForm.busiTypes=row.dataTemplateBusi.map(val => {
				// 		return val.busiTypes
				// 	})
				// }
			}
			state.isShowDialog = true;
		};
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				name: '',
				key: '',
				busiTypes:'',
				desc: '',
			};
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
						api.template.edit(state.ruleForm).then(() => {
							ElMessage.success('模型类型修改成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					} else {
						//添加
						api.template.add(state.ruleForm).then(() => {
							ElMessage.success('模型类型添加成功');
							closeDialog(); // 关闭弹窗
							emit('typeList');
						});
					}
				}
			});
		};
		const handlelisten = (e) => {
			state.ruleForm.cronExpression=e.cron
		};
		const showCron=(type)=>{
				state.crontype=type
				state.cronShow=true;

		};
		const cronclose=()=>{
			state.cronShow=false;
		}

		return {
			handlelisten,
			showCron,
			cronclose,
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

