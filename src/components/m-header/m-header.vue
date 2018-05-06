<template>
	<div class="m-header">
		<div class="icon"></div>
		<h1 class="text">Smile Music</h1>
		<router-link class="mine" to="/user" tag="div">
			<i class="icon-mine"></i>
		</router-link>
	</div>
</template>

<script type="text/ecmascript-6">
export default {

}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable.less";

	// 背景图片
	.bg-image(@url){
		background-image: url("@{url}@2x.png");
		@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
			background-image: url("@{url}@2x.png");
		}
	}

	// 不换行
	.no-wrap() {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	// 扩展点击区域
	.extend-click() {
		position: relative;

		&:before {
			content: '';
			position: absolute;
			top: -0.5rem;
			left: -0.5rem;
			right: -0.5rem;
			bottom: -0.5rem;
		}
	}

	.m-header {
		position: relative;
		height: 2.2rem;
		text-align: center;
		color: @color-theme;
		font-size: 0;

		.icon {
			display: inline-block;
			vertical-align: top;
			margin-top: 0.3rem;
			width: 1.5rem;
			height: 1.6rem;
			margin-right: 0.45rem;
			.bg-image('logo');
			background-size: 1.5rem 1.6rem;
		}

		.text {
			display: inline-block;
			vertical-align: top;
			line-height: 2.2rem;
			font-size: @font-size-large;
		}

		.mine {
			position: absolute;
			top: 0;
			right: 0;

			.icon-mine {
				display: block;
				padding: 0.6rem;
				font-size: 1.0rem;
				color: @color-theme;
			}
		}
	}

</style>