<template>
	<div class="search-box">
		<i class="icon-search"></i>
		<input class="box" :placeholder="placeholder" v-model="query" ref="query"/>
		<i class="icon-dismiss" v-show="query" @click="clear"></i>
	</div>
</template>

<script type="text/ecmascript-6">
	import {debounce} from 'common/js/util';

	export default {
		props: {
			placeholder: {
				type: String,
				default: '搜索歌曲、歌手、专辑'
			}
		},

		data() {
			return {
				query: ''
			}
		},

		methods: {
			clear() {
				this.query = '';
			},
			setQuery(query) {
				this.query = query;
			},
			blur() {
				this.$refs.query.blur();
			}
		},

		created() {
			this.$watch('query', debounce((newQuery) => {
				this.$emit('query', newQuery);
			}, 200));
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.search-box {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		width: 100%;
		padding: 0 0.3rem;
		height: 2.0rem;
		background: @color-highlight-background;
		border-radius: 0.3rem;

		.icon-search {
			font-size: 1.2rem;
			color: @color-background;
		}

		.box {
			flex: 1;
			margin: 0 0.25rem;
			line-height: 0.9rem;
			background: @color-highlight-background;
			color: @color-text;
			font-size: @font-size-medium;
			outline: none;

			&::placeholder {
				color: @color-text-d;
			}
		}

		.icon-dismiss {
			font-size: 0.8rem;
			color: @color-background;
		}
	}
</style>