<template>
	<div class="player" v-show="playlist.length">
		<transition name="normal"
				@enter="enter"
				@after-enter="afterEnter"
				@leave="leave"
				@after-leave="afterLeave"
		>
			<div class="normal-player" v-show="fullScreen">
			<div class="background">
				<img width="100%" height="100%" :src="currentSong.image">
			</div>

			<div class="top">
				<div class="back" @click="back">
					<i class="icon-back"></i>
				</div>
				<h1 class="title" v-html="currentSong.name"></h1>
				<h2 class="subtitle" v-html="currentSong.singer"></h2>
			</div>

			<div class="middle">
				<div class="middle-l">
					<div class="cd-wrapper" ref='cdWrapper'>
						<div class="cd" :class="cdCls">
							<img class="image" :src="currentSong.image">
						</div>
					</div>
				</div>
			</div>

			<div class="bottom">
				<div class="progress-wrapper">
					<span class="time time-l">{{format(this.currentTime)}}</span>
					<div class="progress-bar-wrapper">
						<progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
					</div>
					<span class="time time-r">{{format(this.currentSong.duration)}}</span>
				</div>

				<div class="operators">
					<div class="icon i-left">
						<i class="icon-sequence"></i>
					</div>
					<div class="icon i-left" :class="disableCls">
						<i class="icon-prev" @click="prev"></i>
					</div>
					<div class="icon i-center" :class="disableCls">
						<i @click="togglePlaying" :class="playIcon"></i>
					</div>
					<div class="icon i-right" :class="disableCls">
						<i class="icon-next" @click="next"></i>
					</div>
					<div class="icon i-right">
						<i class="icon icon-not-favorite"></i>
					</div>
				</div>
			</div>
			</div>
		</transition>
		<transition name="mini">
		<div class="mini-player" v-show="!fullScreen" @click="open">
			<div class="icon">
				<img :class="cdCls" width="40" height="40" :src="currentSong.image">
			</div>
			<div class="text">
				<h2 class="name" v-html="currentSong.name"></h2>
				<p class="desc" v-html="currentSong.singer"></p>
			</div>
			<div class="control">
				<progress-circle :radius="radius" :percent="percent">
					<i @click.stop="togglePlaying" :class="miniIcon" class="icon-mini"></i>
				</progress-circle>
			</div>
			<div class="control">
				<i class="icon-playlist"></i>
			</div>
		</div>
		</transition>
		<audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
	</div>
</template>

<script>
	import {mapGetters, mapMutations} from 'vuex';
	import animations from 'create-keyframe-animation';
	import {prefixStyle} from 'common/js/dom';

	import progressBar from 'base/progress-bar/progress-bar';
	import progressCircle from 'base/progress-circle/progress-circle';

	const transform = prefixStyle('transform');

	export default {
		components: {
			progressBar,
			progressCircle
		},

		data() {
			return {
				songReady: false,
				currentTime: 0,
				radius: 32
			}
		},

		computed: {
			playIcon() {
				return this.playing ? 'icon-play' : 'icon-pause';
			},

			miniIcon() {
				return this.playing ? 'icon-play-mini' : 'icon-pause-mini';
			},

			cdCls() {
				return this.playing ? 'play' : 'play pause';
			},

			disableCls() {
				return this.songReady ? '' : 'disable';
			},

			percent() {
				return this.currentTime / this.currentSong.duration;
			},

			...mapGetters([
				'fullScreen',
				'playlist',
				'currentSong',
				'playing',
				'currentIndex'
			])
		},

		methods: {
			back() {
				this.setFullScreen(false);
			},

			open() {
				this.setFullScreen(true);
			},

			enter(el, done) {
				const {x, y, scale} = this._getPosAndScale();

				let animation = {
					0: {
						transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
					},
					60: {
						transform: `translate3d(0, 0, 0) scale(1.1)`
					},
					100: {
						transform: `translate3d(0, 0, 0) scale(1)`
					}
				}

				animations.registerAnimation({
					name: 'move',
					animation,
					presets: {
						duration: 400,
						easing: 'linear'
					}
				});

				animations.runAnimation(this.$refs.cdWrapper, 'move', done)
			},

			afterEnter() {
				animations.unregisterAnimation('move');
				this.$refs.cdWrapper.style.animation = '';
			},

			leave(el, done) {
				this.$refs.cdWrapper.style.transition = 'all 0.4s';
				const {x, y, scale} = this._getPosAndScale();
				this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
				this.$refs.cdWrapper.addEventListener('transitionend', done);
			},

			afterLeave() {
				this.$refs.cdWrapper.style.transition = '';
				this.$refs.cdWrapper.style[transform] = '';
			},

			_getPosAndScale() {
				const targetWidth = 40;
				const paddingLeft = 40;
				const paddingBottom = 30;
				const paddingTop = 80;
				// const rem = 20 * (window.innerWidth / 375);
				const width = (window.innerWidth * 0.8);
				const scale = targetWidth / width;
				const x = -(window.innerWidth/2-paddingLeft);
				const y = window.innerHeight-paddingTop-width/2-paddingBottom;
				return {
					x,
					y,
					scale
				}
			},

			togglePlaying() {
				if(!this.songReady) {
					return;
				}
				this.setPlayingState(!this.playing);
			},

			prev() {
				if(!this.songReady) {
					return;
				}
				let index = this.currentIndex - 1;
				if(index == -1) {
					index == this.playlist.length -1;
				}
				this.setCurrentIndex(index);
				if(!this.playing) {
					this.togglePlaying();
				}
				this.songReady = false;
			},

			next() {
				if(!this.songReady) {
					return;
				}
				let index = this.currentIndex + 1;
				if(index == this.playlist.lenghth) {
					index == 0;
				}
				this.setCurrentIndex(index);
				if(!this.playing) {
					this.togglePlaying();
				}
				this.songReady = false;
			},

			ready() {
				this.songReady = true;
			},

			error() {
				//歌曲错误时 如果songReady为false 那么播放 上一首 下一首都无法使用 所以要置为true
				this.songReady = true;
			},

			updateTime(e) {
				this.currentTime = e.target.currentTime;
			},

			format(interval) {
				interval = interval | 0; //向下取整
				const minute = interval / 60 | 0;
				const second = this._pod(interval % 60);
				return `${minute}:${second}`;
			},

			_pod(num, n=2) {
				let len = num.toString().length;
				while(len < n) {
					num = '0' + num;
					len++;
				}
				return num;
			},

			onProgressBarChange(percent) {
				const currentTime = this.currentSong.duration * percent;
				this.$refs.audio.currentTime = currentTime;
				if(!this.playing) {
					this.togglePlaying();
				}
			},

			...mapMutations({
				setFullScreen: 'SET_FULL_SCREEN',
				setPlayingState: 'SET_PLAYING_STATE',
				setCurrentIndex: 'SET_CURRENT_INDEX'
			})
		},

		watch: {
			currentSong() {
				this.$nextTick(() => {
					this.$refs.audio.play();
				})
			},

			playing(newPlaying) {
				const audio = this.$refs.audio;
				this.$nextTick(() => {
					newPlaying ? audio.play() : audio.pause();
				})
			}
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

	.player {
		.normal-player {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: 150;
			background: @color-background;

			.background {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: -1;
				opacity: 0.6;
				filter: blur(20px);
			}

			.top {
				position: relative;
				margin-bottom: 1.25rem;

				.back {
					position: absolute;
					top: 0;
					left: 0.3rem;
					z-index: 50;

					.icon-back {
						display: block;
						padding: 0.45rem;
						font-size: @font-size-large-x;
						color: @color-theme;
						transform: rotate(-90deg);
					}
				}

				.title {
					width: 70%;
					margin: 0 auto;
					line-height: 2.0rem;
					text-align: center;
					.no-wrap();
					font-size: @font-size-large;
					color: @color-text;
				}

				.subtitle {
					line-height: 1.0rem;
					text-align: center;
					font-size: @font-size-medium;
					color: @color-text;
				}
			}

			.middle {
				position: fixed;
				width: 100%;
				top: 4.0rem;
				bottom: 8.5rem;
				white-space: nowrap;
				font-size: 0;

				.middle-l {
					display: inline-block;
					vertical-align: top;
					position: relative;
					width: 100%;
					height: 0;
					padding-top: 80%;

					.cd-wrapper {
						position: absolute;
						left: 10%;
						top: 0;
						width: 80%;
						height: 100%;

						.cd {
							width: 100%;
							height: 100%;
							box-sizing: border-box;
							border: 0.5rem solid rgba(255, 255, 255, 0.1);
							border-radius: 50%;

							&.play {
								animation: rotate 20s linear infinite;
							}

							&.pause {
								animation-play-state: paused;
							}

							.image {
								position: absolute;
								left: 0;
								top: 0;
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
						}
					}

					.playing-lyric-wrapper {
						width: 80%;
						margin: 30px auto 0 auto;
						overflow: hidden;
						text-align: center;

						.playing-lyric {
							height: 1.0rem;
							line-height: 1.0rem;
							font-size: @font-size-medium;
							color: @color-text-l;
						}
					}
				}

				.middle-r {
					display: inline-block;
					vertical-align: top;
					width: 100%;
					height: 100%;
					overflow: hidden;

					.lyric-wrapper {
						width: 80%;
						margin: 0 auto;
						overflow: hidden;
						text-align: center;

						.text {
							line-height: 1.6rem;
							color: @color-text-l;
							font-size: @font-size-medium;

							&.current {
								color: @color-text;
							}
						}
					}
				}
			}

			.bottom {
				position: absolute;
				bottom: 2.5rem;
				width: 100%;

				.dot-wrapper {
					text-align: center;
					font-size: 0;

					.dot {
						display: inline-block;
						vertical-align: middle;
						margin: 0 0.2rem;
						width: 0.4rem;
						height: 0.4rem;
						border-radius: 50%;
						background: @color-text-l;

						&.active {
							width: 1.0rem;
							border-radius: 0.25rem;
							background: @color-text-ll;
						}
					}
				}

				.progress-wrapper {
					display: flex;
					align-items: center;
					width: 80%;
					margin: 0 auto;
					padding: 0.5rem 0;

					.time {
						color: @color-text;
						font-size: @font-size-small;
						flex: 0 0 1.5rem;
						line-height: 1.5rem;
						width: 1.5rem;

						&.time-l {
							text-align: left;
						}

						&.time-r {
							text-align: right;
						}
					}

					.progress-bar-wrapper {
						flex: 1;
					}
				}

				.operators {
					display: flex;
					align-items: center;

					.icon {
						flex: 1;
						color: @color-theme;

						&.disable {
							color: @color-theme-d;
						}

						i {
							font-size: 1.5rem;
						}
					}

					.i-left {
						text-align: right;
					}

					.i-center {
						padding: 0 1.0rem;
						text-align: center;

						i {
							font-size: 2.0rem;
						}
					}

					.i-right {
						text-align: left;
					}

					.icon-favorite {
						color: @color-sub-theme;
					}
				}
			}

			&.normal-enter-active,
			&.normal-leave-active {
				transition: all 0.4s;

				.top,
				.bottom {
					transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
				}
			}

			&.normal-enter,
			&.normal-leave-to {
				opacity: 0;

				.top {
					transform: translate3d(0, -5.0rem, 0);
				}

				.bottom {
					transform: translate3d(0, 5.0rem, 0);
				}
			}
		}

		.mini-player {
			display: flex;
			align-items: center;
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 180;
			width: 100%;
			height: 3.0rem;
			background: @color-highlight-background;

			&.mini-enter-active,
			&.mini-leave-active {
				transition: all 0.4s;
			}

			&.mini-enter,
			&.mini-leave-to {
				opacity: 0;
			}

			.icon {
				flex: 0 0 2.0rem;
				width: 2.0rem;
				padding: 0 0.5rem 0 1.0rem;

				img {
					border-radius: 50%;

					&.play {
						animation: rotate 10s linear infinite;
					}

					&.pause {
						animation-play-state: paused;
					}
				}
			}

			.text {
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;
				line-height: 1.0rem;
				overflow: hidden;

				.name {
					margin-bottom: 0.1rem;
					.no-wrap();
					font-size: @font-size-medium;
					color: @color-text;
				}

				.desc {
					.no-wrap();
					font-size: @font-size-small;
					color: @color-text-d;
				}
			}

			.control {
				flex: 0 0 1.5rem;
				width: 1.5rem;
				padding: 0 0.5rem;

				.icon-play-mini,
				.icon-pause-mini,
				.icon-playlist {
					font-size: 1.5rem;
					color: @color-theme-d;
				}

				.icon-mini {
					font-size: 1.6rem;
					position: absolute;
					left: 0;
					top: 0;
				}
			}
		}
	}

	@keyframes rotate {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>