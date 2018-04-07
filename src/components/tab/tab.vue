<template>
	<div class="tab">
		<router-link tag="div" class="tab-item" to="/recommend">
			<span class="tab-link">推荐</span>
		</router-link>
		<router-link tag="div" class="tab-item" to="/singer">
			<span class="tab-link">歌手</span>
		</router-link>
		<router-link tag="div" class="tab-item" to="/rank">
			<span class="tab-link">排行
			</span>
		</router-link>
		<router-link tag="div" class="tab-item" to="/search">
			<span class="tab-link">搜索</span>
		</router-link>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	data() {
		return {

		}
	}

}
</script>

<style scoped lang="less">
	@import '~common/lesses/variable.less';

	.tab {
		display: flex;
		height: 2.2rem;
		line-height: 2.2rem;
		font-size: @font-size-medium;

		.tab-item {
			flex: 1;
			text-align: center;
		}

		.tab-link {
			padding-bottom: 0.25rem;
			color: @color-text-l;
		}

		.router-link-active {
			.tab-link {
				color: @color-theme;
				border-bottom: 0.1rem solid @color-theme;
			}
		}
	}
</style>