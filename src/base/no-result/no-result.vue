<template>
	<div class="no-result">
		<div class="no-result-icon"></div>
		<p class="no-result-text">{{title}}</p>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	// 背景图片
	.bg-image(@url){
		background-image: url("@{url}@2x.png");
		@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
			background-image: url("@{url}@2x.png");
		}
	}

	.no-result {
		text-align: center;

		.no-result-icon {
			width: 4.3rem;
			height: 4.5rem;
			margin: 0 auto;
			.bg-image('no-result');
			background-size: 4.3rem 4.5rem;
		}

		.no-result-text {
			margin-top: 1.5rem;
			font-size: @font-size-medium;
			color: @color-text-d;
		}
	}
</style>