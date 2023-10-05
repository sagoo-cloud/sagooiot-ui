<template>
	<el-card class="system-dic-container" style="position: relative">
		<div class="content">
		
			<div class="container">
				<div class="item">升级包 ID：{{detail.id}}</div>
				<div class="item">升级包名称：{{detail.name}}</div>
				<div class="item">所属产品：{{detail.productName}}</div>
			</div>
			<div class="container">
				<div class="item">升级包签名：d52b637c5eaf2bc9c24008bc4b723600</div>
				<div class="item">升级包版本号：{{detail.version}}</div>
				<div class="item">创建时间：{{detail.createdAt}}</div>
			</div>
			<div class="container">
				<div class="item">签名算法：{{detail.are}}</div>
				<div class="item">升级包状态：未验证</div>
				<div class="item">验证进度：0%</div>
			</div>
			<div class="container">
				<div class="item">升级包描述：{{detail.describe}}</div>
				<div class="item">推送给设备的自定义信息：{{detail.info}}</div>
				<div class="item"></div>
			</div>
			
		</div>
	</el-card>
</template>
<script lang="ts" setup>

const props = defineProps({

detail: {
  type: Object,
  default: () => {}
},

})

</script>

<style scoped lang="scss">
.status_list{
	width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
	padding: 10px;
	.otaflex{
		font-size: 14px;
		display: flex;
		align-items: center;
		margin-left: -6px;
		.otaflex_div1{
			padding: 0 24px;
			min-width: 200px;
			width: fit-content;
			.otaflex_div2 {
				align-items: center;
				.title{
					color: #666;
					font-size: 14px;
				}
				span {
					display: block;
					border-radius: 50%;
					.on {
						background: #52c41a;
					}
					.off {
						background: #c41a1a;
					}
					.ofn {
						background: rgb(255, 138, 0);
					}

					span {
						position: relative;
						top: -1px;
						display: inline-block;
						width:10px;
						height: 10px;
						vertical-align: middle;
						border-radius: 50%;
						margin-right: 5px;
					}

				}
				.otaflex_div3{
					font-size: 24px;
					margin-top: 10px;
					color: #373d41;
				}
			}
	
	
		}
		
	}
}
.container {
	display: flex;
	padding: 10px;
}

.item {
	flex: 1;
}
.desc {
	margin-top: 15px;
}

.edit {
	line-height: 40px;
	margin-top: 15px;
	margin-left: 30px;
}

.cont_box .pro-status {
	line-height: 40px;
	margin-left: 30px;
	margin-top: 5px;

	.on {
		background: #52c41a;
	}

	.off {
		background: #c41a1a;
	}

	span {
		position: relative;
		top: -1px;
		display: inline-block;
		width: 6px;
		height: 6px;
		vertical-align: middle;
		border-radius: 50%;
		margin-right: 5px;
	}
}
</style>
