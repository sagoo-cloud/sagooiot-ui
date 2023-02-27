<template>
	<div class="system-edit-dic-container">
		<el-dialog :title="'环路详情'" v-model="dialogVisible" width="950px">
			<el-form :model="ruleForm" ref="formRef" size="default" label-width="110px">
				<el-form-item label="环路名称" prop="name">
					{{ ruleForm.name }}
				</el-form-item>
				<el-form-item label="环路编号" prop="code">
					{{ ruleForm.code }}
				</el-form-item>
				<el-form-item label="所属换热站" prop="stationId">
          {{ ruleForm.stationId }}
					<!-- <el-tree-select
						v-model="ruleForm.stationId"
						:data="treeData"
						:props="{
							label: 'name',
							children: 'children'
						}"
						node-key="id"
						:clearable="true"
						check-strictly
						style="width: 100%;"
						:render-after-expand="true"
					/> -->
				</el-form-item>
        <el-form-item label="环路类型" prop="loopTypes">
          {{ ruleForm.loopTypes === 1 ? '一网' : '二网' }}
        </el-form-item>
        <el-form-item label="节能类型" prop="energyTypes">
          {{ ruleForm.energyTypes === 1 ? '节能' : '' }}
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="供暖对象" prop="heatingObject">
              {{ ruleForm.heatingObject === 1 ? '公建' : '居民' }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供暖类型" prop="heatingTypes">
              {{ ruleForm.heatingTypes === 1 ? '地暖' : '暖气片' }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="联网面积" prop="heatingArea">
              {{ ruleForm.heatingArea }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实供面积" prop="forRealArea">
              {{ ruleForm.forRealArea }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="环路年代" prop="decade">
          {{ ruleForm.decade }}
        </el-form-item>
				<el-form-item label="状态" prop="status">
          {{ ruleForm.decade === 1 ? '在线' : '不在线' }}
				</el-form-item>
        <el-form-item label="路线信息" prop="">
					<div class="mb10" style="width: 100%">
						<div style="display: flex;" class="mb10" v-for="(item, index) in pointList" :key="index">
							<el-input v-model="item.position" :disabled="!item.editFalg" @keydown="onLocalChange(item, index)" @change="onLocalChange(item, index)" placeholder="请输入关键字进行搜索" clearable style="flex: 1; margin-right: 10px"></el-input>
							<span>排序：</span>
							<el-input-number v-model="item.sort" :controls="false" :disabled="!item.editFalg" placeholder="排序" clearable style="width: 100px; margin-right: 10px"></el-input-number>
						</div>
					</div>
        </el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ ruleForm.id !== 0 ? '修 改' : '添 加' }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref } from 'vue';
import api from '/@/api/heatStation';
import { ElMessage } from 'element-plus';
interface Point {
	sort?: number;
	lnt: number;
	lat: number
}
interface RuleFormState {
	id?: number;
	name: string;
	code: string;
	stationId: string;
	loopTypes: string;
	energyTypes: string;
	heatingObject: string;
	heatingTypes: string;
	heatingArea: string;
	forRealArea: string;
	viaPoint: Array<Point>;
	decade: string;
	status: number;
}

export default defineComponent({
	name: 'headStationLoop',
	setup(prop, { emit }) {
		const formRef = ref<HTMLElement | null>(null);
		const state = reactive({
			dialogVisible: false,
			ruleForm: {
				id: 0,
				name: '',
        code: '',
        stationId: '',
        loopTypes: '',
        energyTypes: '',
        heatingObject: '',
        heatingTypes: '',
        heatingArea: '',
        forRealArea: '',
        decade: '',
				viaPoint: [],
        status: 1
			},
			treeData: [],
      pointList: [] as any
		})
		// 打开弹窗
		const openDialog = (row: RuleFormState | null) => {
			resetForm()
			queryTree()
			if (row) {
				(state.ruleForm as any).id = row.id
				getDetail()
			}
			state.dialogVisible = true
		}
		const resetForm = () => {
			state.ruleForm = {
				id: 0,
				name: '',
        code: '',
        stationId: '',
        loopTypes: '',
        energyTypes: '',
        heatingObject: '',
        heatingTypes: '',
        heatingArea: '',
        forRealArea: '',
				viaPoint: [],
        decade: '',
        status: 1
			}
		}
		// 关闭弹窗
		const closeDialog = () => {
			state.dialogVisible = false
		}
		// 取消
		const onCancel = () => {
			closeDialog()
			state.pointList = []
		}
		const queryTree = () => {
			api.heatStation.getList({
					name: '',
					code: '',
					status: -1
				})
				.then((res: any) => {
					state.treeData = res || [];
				});
		};
		const getDetail = () => {
			api.loop.detail(state.ruleForm.id)
				.then((res: any) => {
					state.ruleForm = {
						...res
					}
					state.pointList = state.ruleForm.viaPoint.map((item: any) => ({
						...item,
						editFlag: false
					}))
				})
		}

		return {
			openDialog,
			closeDialog,
			onCancel,
			formRef,
			...toRefs(state)
		}
	}
})
</script>
