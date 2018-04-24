<template>
	<transition name="list-fade">
		<div class="playlist" v-show="showFlag" @click="hide">
			<div class="list-wrapper" @click.stop>
				<div class="list-header">
					<h1 class="title">
						<i class="icon" :class="iconMode" @click="changeMode"></i>
						<span class="text">{{modeText}}</span>
						<span class="clear" @click="showConfirm">
							<i class="icon-clear"></i>
						</span>
					</h1>
				</div>
				<scroll ref="listContent" class="list-content">
					<transition-group ref="list" name="list" tag="ul">
						<li :key="item.id" class="item" @click="selectItem(item,index)" v-for="(item,index) in sequenceList" ref="listItem">
							<i class="current" :class="getCurrentIcon(item)"></i>
							<span class="text">{{item.name}}</span>
							<span class="like">
								<i class="icon-not-favorite"></i>
							</span>
							<span class="delete" @click.stop="deleteOne(item)">
								<i class="icon-delete"></i>
							</span>
						</li>
					</transition-group>
				</scroll>
				<div class="list-operate">
					<div class="add" @click="showAddSong">
						<i class="icon-add"></i>
						<span class="text">添加歌曲到队列</span>
					</div>
				</div>
				<div class="list-close" @click="hide">
					<span>关闭</span>
				</div>
			</div>
			<confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
			<add-song ref="addSong"></add-song>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Scroll from 'base/scroll/scroll';
	import Confirm from 'base/confirm/confirm';
	import AddSong from 'components/add-song/add-song';

	import {mapActions} from 'vuex';
	import {playMode} from 'common/js/config';
	import {playerMixin} from 'common/js/mixin';

	export default {
		mixins: [playerMixin],
		components: {
			Scroll,
			Confirm,
			AddSong
		},

		data() {
			return {
				showFlag: false
			}
		},

		computed:{
			modeText() {
				return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环';
			}
		},

		methods: {
			show() {
				this.showFlag = true;
				setTimeout(() => {
					this.$refs.listContent.refresh();
					this.scrollToCurrent(this.currentSong);
				},20)
			},
			hide() {
				this.showFlag = false;
			},
			getCurrentIcon(item) {
				if(this.currentSong.id === item.id) {
					return 'icon-play'
				}
				return '';
			},
			selectItem(item, index) {
				if(this.mode === playMode.random) {
					index = this.playlist.findIndex((song) => {
						return song.id === item.id;
					})
				}

				this.setCurrentIndex(index);
				this.setPlayingState(true);
			},

			scrollToCurrent(current) {
				let index = this.sequenceList.findIndex((song) => {
					return song.id === current.id;
				})
				this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
			},

			deleteOne(item) {
				this.deleteSong(item);
				if(!this.playlist.length) {
					this.hide();
				}
			},

			showConfirm() {
				this.$refs.confirm.show();
			},

			confirmClear() {
				this.clearSongList();
				this.hide();
			},

			showAddSong() {
				this.$refs.addSong.show();
			},

			...mapActions([
				'deleteSong',
				'clearSongList'
			])
		},

		watch: {
			currentSong(newSong, oldSong) {
				if(!this.showFlag || newSong.id === oldSong.id) {
					return;
				}
				this.scrollToCurrent(newSong);
			}
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";
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

	.playlist {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 200;
		background-color: @color-background-d;

		&.list-fade-enter-active,
		&.list-fade-leave-active {
			transition: opacity 0.3s;

			.list-wrapper {
				transition: all 0.3s;
			}
		}

		&.list-fade-enter,
		&.list-fade-leave-to {
			opacity: 0;

			.list-wrapper {
				transform: translate3d(0, 100%, 0);
			}
		}

		.list-wrapper {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			background-color: @color-highlight-background;

			.list-header {
				position: relative;
				padding: 1.0rem 1.5rem 0.5rem 1.0rem;

				.title {
					display: flex;
					align-items: center;

					.icon {
						margin-right: 0.5rem;
						font-size: 1.5rem;
						color: @color-theme-d;
					}

					.text {
						flex: 1;
						font-size: @font-size-medium;
						color: @color-text-l;
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

			.list-content {
				max-height: 12.0rem;
				overflow: hidden;

				.item {
					display: flex;
					align-items: center;
					height: 2.0rem;
					padding: 0 1.5rem 0 1.0rem;
					overflow: hidden;

					&.list-enter-active,
					&.list-leave-active {
						transition: all 0.1s;
					}

					&.list-enter,
					&.list-leave-to {
						height: 0;
					}

					.current {
						flex: 0 0 1.0rem;
						width: 1.0rem;
						font-size: @font-size-small;
						color: @color-theme-d;
					}

					.text {
						flex: 1;
						.no-wrap();
						font-size: @font-size-medium;
						color: @color-text-d;
					}

					.like {
						.extend-click();
						margin-right: 0.75rem;
						font-size: @font-size-small;
						color: @color-theme;

						.icon-favorite {
							color: @color-sub-theme;
						}
					}

					.delete {
						.extend-click();
						font-size: @font-size-small;
						color: @color-theme;
					}
				}
			}

			.list-operate {
				width: 7.0rem;
				margin: 1.0rem auto 1.5rem auto;

				.add {
					display: flex;
					align-items: center;
					padding: 0.4rem 0.8rem;
					border: 1px solid @color-text-l;
					border-radius: 5.0rem;
					color: @color-text-l;

					.icon-add {
						margin-right: 0.25rem;
						font-size: @font-size-small-s;
					}

					.text {
						font-size: @font-size-small;
					}
				}
			}

			.list-close {
				text-align: center;
				line-height: 2.5rem;
				background: @color-background;
				font-size: @font-size-medium-x;
				color: @color-text-l;
			}
		}
	}
</style>