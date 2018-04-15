<template>
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-image" :style="bgStyle" ref="bgImage">
			<div class="play-wrapper" ref="playBtn">
				<div class="play">
					<i class="icon-play"></i>
					<span class="text">随机播放全部</span>
				</div>
			</div>
			<div class="filter" ref="filter"></div>
		</div>
		<div class="bg-layer" ref="layer"></div>
		<scroll :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" @scroll="scroll" class="list" ref="list">
			<div class="song-list-wrapper">
				<song-list @select="selectItem" :songs="songs"></song-list>
			</div>
			<div class="loading-wrapper" v-show="!songs.length">
				<loading></loading>
			</div>
		</scroll>
	</div>
</template>

<script type="text/javascript">
	import Scroll from 'base/scroll/scroll';
	import songList from 'base/song-list/song-list';
	import loading from 'base/loading/loading';
	import {prefixStyle} from 'common/js/dom.js';

	import {mapActions} from 'vuex';

	const RESERVED_HEIGHT = 40;
	const transform = prefixStyle('transform');
	const backdrop = prefixStyle('backdrop-filter');

	export default {
		components: {
			Scroll,
			songList,
			loading
		},

		props: {
			bgImage: {
				type: String,
				default: ''
			},
			songs: {
				type: Array,
				default: []
			},
			title: {
				type: String,
				default: ''
			}
		},

		data() {
			return {
				scrollY: 0
			}
		},

		computed: {
			bgStyle() {
				return `background-image: url(${this.bgImage})`;
			}
		},

		methods: {
			back() {
				this.$router.back();
			},

			scroll(pos) {
				this.scrollY = pos.y;
			},

			selectItem(item, index) {
				this.selectPlay({
					list: this.songs,
					index: index
				})
			},

			...mapActions([
				'selectPlay'
				])
		},

		watch: {
			scrollY(newY) {
				let zIndex = 0;
				let blur = 0;
				let scale = 1;
				const persent = Math.abs(newY / this.imageHeight);
				let translateY = Math.max(this.minTransalteY, newY);

				if(newY > 0) {
					scale = 1+persent;
					zIndex = 10;
				}else {
					blur = Math.min(20*persent, 20);
				}

				this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
				this.$refs.filter.style[backdrop] = `blur(${blur}px)`;

				if(newY < this.minTransalteY) {
					zIndex = 10;
					this.$refs.bgImage.style.paddingTop = 0;
					this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
					this.$refs.playBtn.style.display = 'none';
				}else {
					this.$refs.bgImage.style.paddingTop = '70%';
					this.$refs.bgImage.style.height = 0;
					this.$refs.playBtn.style.display = '';
				}

				this.$refs.bgImage.style.zIndex = zIndex;
				this.$refs.bgImage.style[transform] = `scale(${scale})`;
			}
		},

		created() {
			this.probeType = 3;
			this.listenScroll = true;
		},

		mounted() {
			this.imageHeight = this.$refs.bgImage.clientHeight;
			this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
			this.$refs.list.$el.style.top = `${this.imageHeight}px`
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.no-wrap() {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.music-list {
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: @color-background;

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

		.title {
			position: absolute;
			top: 0;
			left: 10%;
			z-index: 40;
			width: 80%;
			.no-wrap();
			text-align: center;
			line-height: 2.0rem;
			font-size: @font-size-large;
			color: @color-text;
		}

		.bg-image {
			position: relative;
			width: 100%;
			height: 0;
			padding-top: 70%;
			transform-origin: top;
			background-size: cover;

			.play-wrapper {
				position: absolute;
				bottom: 1.0rem;
				z-index: 50;
				width: 100%;

				.play {
					box-sizing: border-box;
					width: 6.75rem;
					padding: 0.35rem 0;
					margin: 0 auto;
					text-align: center;
					border: 1px solid @color-theme;
					color: @color-theme;
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
			}

			.filter {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background: rgba(7, 17, 27, 0.4);
			}
		}

		.bg-layer {
			position: relative;
			height: 100%;
			background: @color-background;
		}

		.list {
			position: fixed;
			top: 0;
			bottom: 0;
			width: 100%;
			background: @color-background;

			.song-list-wrapper {
				padding: 1.0rem 1.5rem;
			}
		}
	}
</style>