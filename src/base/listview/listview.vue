<template>
	<scroll class="listview" :data = "data" ref="listview"
	 :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
		<ul>
			<li v-for="group in data" class="list-group" ref="listGroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<uL>
					<li v-for="item in group.items" class="list-group-item">
						<img class="avatar" v-lazy="item.avatar">
						<span class="name">{{item.name}}</span>
					</li>
				</uL>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
			<ul>
				<li v-for="(item, index) in shortCutList" class="item"
				 :data-index="index" :class="{current:currentIndex === index}">{{item}}</li>
		</ul>
		</div>
	</scroll>
</template>

<script type="text/javascript">
	import Scroll from 'base/scroll/scroll';
	import {getData} from 'common/js/dom';

	const ANCHOR_HEIGHT = 18;

	export default {
		props: {
			data: {
				type: Array,
				default: []
			}
		},

		components: {
			Scroll
		},

		data(){
			return {
				scrollY: -1,
				currentIndex: 0,
				diff: -1
			}
		},

		computed: {
			shortCutList() {
				return this.data.map((group) => {
					return group.title.substr(0,1);
				})
			}
		},

		methods: {
			onShortcutTouchStart(e) {
				let anchorIndex = getData(e.target,'index');
				let firstTouch = e.touches[0];
				this.touch.y1 = firstTouch.pageY;
				this.touch.anchorIndex = anchorIndex;
				this._scrollTo(anchorIndex);
			},
			onShortcutTouchMove(e) {
				let firstTouch = e.touches[0];
				this.touch.y2 = firstTouch.pageY;
				let delta = (this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT | 0 ;
				let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
				this._scrollTo(anchorIndex);
			},
			scroll(pos){
				this.scrollY = pos.y;
			},
			// 计算得到一个高度数组 用于判断scrollY落在哪个区间
			calculateHeight(){
				this.listHeight = [];
				const list = this.$refs.listGroup;
				let height = 0;
				this.listHeight.push(height);
				for(let i=0; i<list.length; i++) {
					height += list[i].clientHeight;
					this.listHeight.push(height);
				}
			},
			_scrollTo(index) {
				this.$refs.listview.scrollToElement(this.$refs.listGroup[index],400);
			}
		},

		watch: {
			data() {
				setTimeout(() => {
					this.calculateHeight();
				},20)
			},
			scrollY(newY) {
				const listHeight = this.listHeight;
				// //当滚动到顶部 newY > 0
				if(newY > 0) {
					this.currentIndex = 0;
					return;
				}
				//在中间部分滚动
				for( let i=0; i<listHeight.length-1; i++) {
					let height1 = listHeight[i];
					let height2 = listHeight[i+1];
					if(-newY >= height1 && -newY < height2) {
						this.currentIndex = i;
						return;
					}
				}
				// 当滚动到底部，且-newY大于最后一个元素的上限
				this.currentIndex = listHeight.length - 2;
			}
		},

		created() {
			this.touch = {};
			this.listenScroll = true;
			this.listHeight = [];
			this.probeType = 3;
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.listview {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: @color-background;

		.list-group {
			padding-bottom: 1.5rem;

			.list-group-title {
				height: 1.5rem;
				line-height: 1.5rem;
				padding-left: 1.0rem;
				font-size: @font-size-small;
				color: @color-text-l;
				background: @color-highlight-background;
			}

			.list-group-title {
				height: 1.5rem;
				line-height: 1.5rem;
				padding-left: 1.0rem;
				font-size: @font-size-small;
				color: @color-text-l;
				background: @color-highlight-background;
			}

			.list-group-item {
				display: flex;
				align-items: center;
				padding: 1.0rem 0 0 1.5rem;

				.avatar {
					width: 2.5rem;
					height: 2.5rem;
					border-radius: 50%;
				}

				.name {
					margin-left: 1.0rem;
					color: @color-text-l;
					font-size: @font-size-medium;
				}
			}
		}
	}

	.list-shortcut {
		position: absolute;
		z-index: 30;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 1.0rem;
		padding: 1.0rem 0;
		border-radius: 0.5rem;
		text-align: center;
		background: @color-background-d;
		font-family: Helvetica;

		.item {
			padding: 0.15rem;
			line-height: 1;
			color: @color-text-l;
			font-size: @font-size-small;
		}

		.current{
			color: @color-theme;
		}
	}

	.list-fixed {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;

		.fixed-title {
			height: 1.5rem;
			line-height: 1.5rem;
			padding-left: 1.0rem;
			font-size: @font-size-small;
			color: @color-text-l;
			background: @color-highlight-background;
		}
	}

	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>