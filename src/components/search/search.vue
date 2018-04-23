<template>
	<div class="search">
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
			<scroll class="shortcut" :data="shortcut" ref="shortcut">
				<div>
					<div class="hot-key">
						<h1 class="title">热门搜索</h1>
						<ul>
							<li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
								<span>{{item.k}}</span>
							</li>
						</ul>
					</div>
					<div class="search-history" v-show="searchHistory.length">
						<h1 class="title">
							<span class="text">搜索历史</span>
							<span class="clear" @click="showConfirm">
								<i class="icon-clear"></i>
							</span>
						</h1>
						<search-list :searches="searchHistory" 
										@select="addQuery"
										@delete="deleteSearchHistory"
						></search-list>
					</div>
				</div>
			</scroll>
		</div>
		<div ref="searchWrapper" class="search-result" v-show="query">
			<suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
		</div>
		<confirm ref="confirm" 
						@confirm="clearSearchHistory"
						text="是否清空所有搜索历史记录"
						confirmBtnText="清空"
		></confirm>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import SearchBox from 'base/search-box/search-box';
	import Scroll from 'base/scroll/scroll';
	import Suggest from 'components/suggest/suggest';
	import SearchList from 'base/search-list/search-list';
	import Confirm from 'base/confirm/confirm';

	import {getHotKey} from 'api/search';
	import {ERR_OK} from 'api/config';
	import {mapActions, mapGetters} from 'vuex';
	import {playlistMixin} from 'common/js/mixin';

	export default {
		mixins: [playlistMixin],
		components:{
			SearchBox,
			Scroll,
			Suggest,
			SearchList,
			Confirm
		},

		data() {
			return {
				hotKey: [],
				query: ''
			}
		},

		computed: {
			shortcut() {
				return this.hotKey.concat(this.searchHistory);
			},
			...mapGetters([
					'searchHistory'
				])
		},

		watch: {
			query(newQuery) {
				if(!newQuery) {
					setTimeout(() => {
						this.$refs.shortcut.refresh();
					},20)
				}
			}
		},

		methods: {
			_getHotKey() {
				getHotKey().then((res) => {
					if(res.code === ERR_OK) {
						this.hotKey = res.data.hotkey.splice(0,10);
					}
				})
			},

			addQuery(query) {
				this.$refs.searchBox.setQuery(query);
			},

			onQueryChange(query){
				this.query = query;
			},

			blurInput(){
				this.$refs.searchBox.blur();
			},

			saveSearch(){
				this.saveSearchHistory(this.query);
			},

			showConfirm() {
				this.$refs.confirm.show();
			},

			handlePlaylist(playlist) {
				let bottom = playlist.length > 0 ? '3rem' : '';
				this.$refs.shortcutWrapper.style.bottom = bottom;
				this.$refs.shortcut.refresh();

				this.$refs.searchWrapper.style.bottom = bottom;
				this.$refs.suggest.refresh();
			},

			...mapActions([
				'saveSearchHistory',
				'deleteSearchHistory',
				'clearSearchHistory'
			])
		},

		created() {
			this._getHotKey();
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

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

	.search {
		.search-box-wrapper {
			margin: 1.0rem;
		}

		.shortcut-wrapper {
			position: fixed;
			top: 8.9rem;
			bottom: 0;
			width: 100%;

			.shortcut {
				height: 100%;
				overflow: hidden;

				.hot-key {
					margin: 0 1.0rem 1.0rem 1.0rem;

					.title {
						margin-bottom: 1.0rem;
						font-size: @font-size-medium;
						color: @color-text-l;
					}

					.item {
						display: inline-block;
						padding: 0.25rem 0.5rem;
						margin: 0 1.0rem 0.5rem 0;
						border-radius: 0.3rem;
						background: @color-highlight-background;
						font-size: @font-size-medium;
						color: @color-text-d;
					}
				}

				.search-history {
					position: relative;
					margin: 0 1.0rem;

					.title {
						display: flex;
						align-items: center;
						height: 2.0rem;
						font-size: @font-size-medium;
						color: @color-text-l;

						.text {
							flex: 1;
						}

						.clear {
							.extend-click();

							.icon-clear {
								font-size: @font-size-medium;
								color: @color-text-d;
							}
						}
					}
				}
			}
		}

		.search-result {
			position: fixed;
			width: 100%;
			top: 8.9rem;
			bottom: 0;
		}
	}
</style>