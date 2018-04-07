<template>
	<div class="loading">
		<img class="loading-gif" src="./loading.gif">
		<p class="desc">{{title}}</p>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: '正在载入...'
			}
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.loading {
		width: 100%;
		text-align: center;

		.loading-gif {
			width: 1.2rem;
			height: 1.2rem;
		}

		.desc {
			line-height: 1.0rem;
			font-size: @font-size-small;
			color: @color-text-l;
		}
	}
</style>