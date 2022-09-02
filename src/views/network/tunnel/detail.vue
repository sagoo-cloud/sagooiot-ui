<template>
	<div class="system-dic-container">
	 <h1>通道详情</h1>
	</div>
</template>
<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage, FormInstance } from 'element-plus';


import { useRoute } from 'vue-router';

// import api from '/@/api/device';

interface TableDataState {
	// ids: number[];
	title: string,
	// tableData: {
	// 	data: [];
	// 	total: number;
	// 	loading: boolean;
	// 	param: {
	// 		pageNum: number;
	// 		pageSize: number;
	// 		name: string;
	// 		deviceType: string;
	// 		status: string;
	// 		dateRange: string[];
	// 	};
	// };
}
export default defineComponent({
	name: 'tunnelDetail',
	components: {  },

	setup(prop, context) {
		const route = useRoute();
		// const editDicRef = ref();
		// const editAttrRef = ref();
		// const editFunRef = ref();
		// const editEventRef = ref();
		// const editTabRef = ref();
		const state = reactive<TableDataState>({
            title: ''
		});
		return {
			Edit,
			// editDicRef,
			// editAttrRef,
			// editFunRef,
			// editEventRef,
			// editTabRef,
			...toRefs(state),
		};
	},
});
</script>

<style>

</style>


