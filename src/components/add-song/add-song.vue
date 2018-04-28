<template>
	<transition name="slide">
		<div class="add-song" v-show="showFlag" @click.stop>
			<div class="header">
				<h1 class="title">添加歌曲到列表</h1>
				<div class="close" @click="hide">
					<i class="icon-close"></i>
				</div>
			</div>
			<div class="search-box-wrapper">
				<search-box @query="onQueryChange" ref="searchBox" placeholder="搜索歌曲"></search-box>
			</div>
			<div class="shortcut" v-show="!query">
				<switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
				<div class="list-wrapper">
					<scroll ref="songList" class="list-scroll" v-show="currentIndex === 0"
					 :data="playHistory">
						<div class="list-inner">
							<song-list :songs="playHistory" @select="selectSong">
							</song-list>
						</div>
					</scroll>
					<scroll ref="searchList" :refreshDelay="refreshDelay" class="list-scroll" v-show="currentIndex === 1"
					:data="searchHistory">
						<div class="list-inner">
							<search-list :searches="searchHistory" @delete="deleteSearchHistory" @select="addQuery"></search-list>
						</div>
					</scroll>
				</div>
			</div>
			<div class="search-result" v-show="query">
				<suggest :query="query" :showSinger="showSinger" @select="selectSuggest"></suggest>
			</div>
			<top-tip ref="topTip">
				<div class="tip-title">
					<i class="icon-ok"></i>
					<span class="text">1首歌已经添加到播放列表</span>
				</div>
			</top-tip>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Scroll from 'base/scroll/scroll';
	import songList from 'base/song-list/song-list';
	import SearchBox from 'base/search-box/search-box';
	import SearchList from 'base/search-list/search-list';
	import Suggest from 'components/suggest/suggest';
	import Switches from 'base/switches/switches';
	import TopTip from 'base/top-tip/top-tip';

	import {searchMixin} from 'common/js/mixin';
	import {mapGetters, mapActions} from 'vuex';
	import Song from 'common/js/song';

	export default {
		mixins: [searchMixin],
		components: {
			Scroll,
			songList,
			SearchBox,
			SearchList,
			Suggest,
			Switches,
			TopTip
		},

		data() {
			return {
				showFlag: false,
				showSinger: false,
				query: '',
				switches: [
					{name: '最近播放'},
					{name: '搜索历史'}
				],
				currentIndex: 0
			}
		},

		computed: {
			...mapGetters([
					'playHistory'
				])
		},

		methods: {
			show() {
				this.showFlag = true;
				setTimeout(() => {
					if(this.currentIndex === 0) {
						this.$refs.songList.refresh();
					}else {
						this.$refs.searchList.refresh();
					}
				},20)
			},
			hide() {
				this.showFlag = false;
			},
			selectSuggest() {
				this.saveSearch();
				this.showTopTip();
			},
			switchItem(index) {
				this.currentIndex = index;
			},
			selectSong(song, index) {
				if(index !== 0) {
					this.insertSong(new Song(song));
					this.showTopTip();
				}
			},
			showTopTip() {
				this.$refs.topTip.show();
			},

			...mapActions([
				'insertSong'
				])
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.add-song {
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		z-index: 200;
		background: @color-background;

		&.slide-enter-active,
		&.slide-leave-active {
			transition: all 0.3s;
		}

		&.slide-enter,
		&.slide-leave-to {
			transform: translate3d(100%, 0, 0);
		}

		.header {
			position: relative;
			height: 2.2rem;
			text-align: center;

			.title {
				line-height: 2.2rem;
				font-size: @font-size-large;
				color: @color-text;
			}

			.close {
				position: absolute;
				top: 0;
				right: 0.4rem;

				.icon-close {
					display: block;
					padding: 0.6rem;
					font-size: 1.0rem;
					color: @color-theme;
				}
			}
		}

		.search-box-wrapper {
			margin: 1.0rem;
		}

		.shortcut {
			.list-wrapper {
				position: absolute;
				top: 8.25rem;
				bottom: 0;
				width: 100%;

				.list-scroll {
					height: 100%;
					overflow: hidden;

					.list-inner {
						padding: 1.0rem 1.5rem;
					}
				}
			}
		}

		.search-result {
			position: fixed;
			top: 6.2rem;
			bottom: 0;
			width: 100%;
		}

		.tip-title {
			text-align: center;
			padding: 0.9rem 0;
			font-size: 0;

			.icon-ok {
				font-size: @font-size-medium;
				color: @color-theme;
				margin-right: 0.2rem;
			}

			.text {
				font-size: @font-size-medium;
				color: @color-text;
			}
		}
	}
</style>