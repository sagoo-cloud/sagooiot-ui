<template>
	<el-card shadow="nover">
		<el-tabs v-model="activeTab">
			<el-tab-pane label="版本分布" name="tab1">
				<div class="flex">
					<el-form-item label="所属产品" prop="productKey">
						<el-select v-model="productKey" filterable placeholder="请选择产品">
							<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.key" value-key="id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属模块" prop="productKey" class="ml10">
						<el-select v-model="productKey" filterable placeholder="请选择所属模块">
							<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.key" value-key="id">
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div>
					<el-row>
						<el-col :span="12">
							<div class="data-box">
								<div class="title">版本分布</div>
								<div style="height: 100%" ref="pieRef"></div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="data-box">
								<div class="title">版本占比</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
			<el-tab-pane label="成功率分布" name="tab2">
				<div class="flex">
					<el-form-item label="所属产品" prop="productKey">
						<el-select v-model="productKey" filterable placeholder="请选择产品">
							<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.key" value-key="id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属模块" prop="productKey" class="ml10">
						<el-select v-model="productKey" filterable placeholder="请选择所属模块">
							<el-option v-for="item in productData" :key="item.id" :label="item.name" :value="item.key" value-key="id">
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div>
					<el-row>
						<el-col :span="12">
							<div class="data-box">
								<div class="title">升级成功率目标版本1.0</div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="data-box">
								<div class="title">源版本总分布（包含成功/失败）</div>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="data-box">
								<div class="title">成功源版本分布</div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="data-box">
								<div class="title">失败源版本分布</div>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="data-box">
								<div class="title">失败原因分布</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-tab-pane>
		</el-tabs>
	</el-card>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue';

const activeTab = ref('tab1')
const productKey = ref('')
const productData = ref<any[]>([])
</script>
<style scoped lang="scss">
.data-box {
	padding: 10px;
	border: 1px solid #eee;
	margin: 10px;
	min-height: 300px;

	.title {
		margin-left: 10px;
	}

}
</style>
  