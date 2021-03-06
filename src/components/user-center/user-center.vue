<template>
	<transition name="slide">
		<div class="user-center">
			<div class="back" @click="back">
				<i class="icon-back"></i>
			</div>
			<div class="switches-wrapper">
				<switches @switch="selectItem" :switches="switches" :currentIndex="currentIndex"></switches>
			</div>
			<div ref="playBtn" class="play-btn" @click.prev="random">
				<i class="icon-play"></i>
				<span class="text">随机播放全部</span>
			</div>
			<div class="list-wrapper" ref="listWrapper">
				<scroll ref="favoriteList" class="list-scroll" :data="favoriteList" v-if="currentIndex === 0">
					<div class="list-inner">
						<song-list :songs="favoriteList" @select="selectSong"></song-list>
					</div>
				</scroll>
				<scroll ref="playList" class="list-scroll" :data="playHistory" v-if="currentIndex === 1">
					<div class="list-inner">
						<song-list :songs="playHistory" @select="selectSong"></song-list>
					</div>
				</scroll>
			</div>
			<div class="no-result-wrapper" v-show="noResult">
				<no-result :title="noResultDesc"></no-result>
			</div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Switches from 'base/switches/switches';
	import Scroll from 'base/scroll/scroll';
	import SongList from 'base/song-list/song-list';
	import NoResult from 'base/no-result/no-result';
	import Song from 'common/js/song';
	import {playlistMixin} from 'common/js/mixin';

	import {mapGetters, mapActions} from 'vuex';

	export default {
		mixins: [playlistMixin],
		components: {
			Switches,
			Scroll,
			SongList,
			NoResult
		},

		data() {
			return {
				currentIndex: 0,
				switches: [
				{name: '我喜欢的'},
				{name: '最近听的'}
				]
			}
		},

		computed: {
			noResult() {
				if(this.currentIndex === 0) {
					return !this.favoriteList.length;
				}else {
					return !this.playHistory.length;
				}
			},
			noResultDesc() {
				if(this.currentIndex === 0) {
					return '暂无收藏歌曲';
				}else {
					return '你还没有听过歌曲';
				}
			},
			...mapGetters([
				'favoriteList',
				'playHistory'
			])
		},

		methods: {
			selectItem(index) {
				this.currentIndex = index;
			},
			selectSong(song) {
				this.insertSong(new Song(song));
			},
			back() {
				this.$router.back();
			},
			random() {
				let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
				if(list.length === 0) {
					return;
				}
				list = list.map((song) => {
					return new Song(song);
				})
				this.randomPlay({list});
			},
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '3rem' : '';
				this.$refs.listWrapper.style.bottom = bottom;
				this.$refs.favoriteList && this.$refs.favoriteList.refresh();
				this.$refs.playList && this.$refs.playList.refresh();
			},
			...mapActions([
				'insertSong',
				'randomPlay'
			])
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.user-center {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 100;
		width: 100%;
		background: @color-background;

		&.slide-enter-active,
		&.slide-leave-active {
			transition: all 0.3s;
		}

		&.slide-enter,
		&.slide-leave-to {
			transform: translate3d(100%, 0, 0);
		}

		.back {
			position: absolute;
			top: 0;
			left: 0.3rem;
			z-index: 50;

			.icon-back {
				display: block;
				padding: 0.5rem;
				font-size: @font-size-large-x;
				color: @color-theme;
			}
		}

		.switches-wrapper {
			margin: 0.5rem 0 1.5rem 0;
		}

		.play-btn {
			box-sizing: border-box;
			width: 6.75rem;
			padding: 0.35rem 0;
			margin: 0 auto;
			text-align: center;
			border: 1px solid  @color-text-l;
			color: @color-text-l;
			border-radius: 5.0rem;
			font-size: 0;

			.icon-play {
				display: inline-block;
				vertical-align: middle;
				margin-right: 0.3rem;
				font-size: @font-size-medium-x;
			}

			.text {
				display: inline-block;
				vertical-align: middle;
				font-size: @font-size-small;
			}
		}

		.list-wrapper {
			position: absolute;
			top: 5.5rem;
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

		.no-result-wrapper {
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>