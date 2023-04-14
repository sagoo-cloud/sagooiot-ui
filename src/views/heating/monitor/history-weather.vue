<template>
	<div class="weather-history">
		<div class="flex-row">
			<div class="title">{{ cityName }}历史天气</div>
			<div class="flex search">
				<el-date-picker
					v-model="dateTime"
					type="month"
					format="YYYY-MM"
					value-format="YYYY-MM"
					placeholder="选择年月"
					:clearable="false"
					style="width: 130px"
					class="mr-4"
					@change="getData"
				/>
				<el-button type="primary" @click="exportFile">导出</el-button>
			</div>
		</div>
		<el-table :data="list" border max-height="calc(100vh  - 210px)" v-loading="loading" style="width: 100%" class="mt-5">
			<el-table-column label="日期" prop="createdAt" align="center" />
			<el-table-column label="最高风力(级)" prop="maxWindpower" align="center" />
			<el-table-column label="最低风力(级)" prop="minWindpower" align="center" />
			<el-table-column label="平均风力(级)" prop="avgWindpower" align="center" />
			<el-table-column label="日照时长" prop="sunshineDuration" align="center" />
			<el-table-column label="最高气温(℃)" prop="maxTemperature" align="center" />
			<el-table-column label="最低气温(℃)" prop="minTemperature" align="center" />
			<el-table-column label="当日平均气温(℃)" prop="avgTemperature" align="center" min-width="100" />
		</el-table>
	</div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import dayjs from 'dayjs'
import api from '/@/api/datahub'
import downloadFile from '/@/utils/download'

const route = useRoute()

const list = ref<any[]>([])
const cityName = ref('')
const dateTime = ref(dayjs().format('YYYY-MM'))
const loading = ref(true)

function getData() {
	list.value = []
	api.weather
		.getCityWeatherHistory({
			id: route.params.id,
			dateTime: dateTime.value,
		})
		.then(({ Info }: { Info: any[] }) => {
			if (Info?.length) {
				cityName.value = Info[0].name
				list.value = Info
			}
		})
		.finally(() => (loading.value = false))
}

getData()

function exportFile() {
	api.weather.getCityWeatherHistoryExport({
		id: route.params.id,
		dateTime: dateTime.value,
	}).then((res: any) => {
    downloadFile(res, cityName.value + dateTime.value + '-天气预报导出.xlsx')
  })
}
</script>

<style scoped lang="scss">
.weather-history {
	background: #fff;
	padding: 20px;
	.title {
		font-size: 18px;
		font-weight: bold;
	}
}
</style>
