<template>
	<div class="slider" ref="slider">
		<div class="slider-group" ref="sliderGroup">
			<slot></slot>
		</div>
		<div class="dots">
			<span class="dot" :class="{active:currentPageIndex === index}" v-for="(item,index) in dots" @click="_navToPage(navable,index)"></span>
		</div>
	</div>
</template>

<script type="tect/javascript">
	import BScroll from 'better-scroll';
	import {addClass} from 'common/js/dom.js';

	export default {
		props: {
			loop: {
				type: Boolean,
				default: true
			},
			autoPlay: {
				type: Boolean,
				default: true
			},
			interval: {
				type: Number,
				default: 4000
			},
			navable: {
				type:Boolean,
				default: false
			}
		},

		data() {
			return {
				dots:[],
				currentPageIndex: 0
			}
		},

		methods: {
			// 设置轮播图的总宽度
			_setSliderWidth(isActive) {
				this.children = this.$refs.sliderGroup.children;
				let width = 0;
				let sliderWidth = this.$refs.slider.clientWidth;
				for(let i = 0; i < this.children.length; i++) {
					let child = this.children[i];
					addClass(child, 'slider-item');
					child.style.width = sliderWidth + 'px';
					width += sliderWidth;
				}

				if( this.loop && !isActive) {
					width += 2 * sliderWidth;
				}

				this.$refs.sliderGroup.style.width = width + 'px';
			},
			//初始化dots
			_initDots(){
				this.dots = new Array(this.children.length);
			},
			// 初始化BScroll
			_initBScroll(){
				this.slider = new BScroll(this.$refs.slider, {
					scrollX: true,
					scrollY: false,
					momentum: false,
					snap: {
						loop: this.loop,
						threshold: 0.3,
						speed: 400
					},
					click: true
				})

				// this.slider.on('beforeScrollStart', () => {
				// 	if (this.autoPlay) {
				// 		clearTimeout(this.timer);
				// 	}
				// })

				this.slider.on('scrollEnd', () => {
					let pageIndex = this.slider.getCurrentPage().pageX;
					this.currentPageIndex = pageIndex;
					if(this.autoPlay) {
						this._play();
					}
				})
			},

			//自动轮播
			_play() {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.slider.next(400);
				},this.interval);
			},

			//点击导航点跳到对应的图片
			_navToPage(navable,index) {
				if(navable) {
					this.slider.goToPage(index,0,400);
					this.currentPageIndex = index;
					if(this.autoPlay) {
						this._play();
					}
				}
			}

		},

		mounted() {
			setTimeout(() => {
				this._setSliderWidth();
				this._initDots();
				this._initBScroll();

				if(this.autoPlay) {
					this._play();
				}
			}, 20);

			// 监听页面窗口改变 重新设置宽度和刷新BScroll
			window.addEventListener('resize', () => {
				if(!this.slider) {
					return;
				}
				this._setSliderWidth(true);
				this.slider.refresh();
			});
		},

		destoryed() {
			clearTimeout(this.timer);
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.slider {
		position: relative;
		min-height: 0.05rem;

		.slider-group {
			position: relative;
			overflow: hidden;
			white-space: nowrap;

			.slider-item {
				float: left;
				box-sizing: border-box;
				overflow: hidden;
				text-align: center;

				a {
					display: block;
					width: 100%;
					overflow: hidden;
					text-decoration: none;
				}

				img {
					display: block;
					width: 100%;
				}
			}
		}

		.dots {
			position: absolute;
			right: 0;
			left: 0;
			bottom: 0.6rem;
			text-align: center;
			font-size: 0;

			.dot {
				display: inline-block;
				margin: 0 0.2rem;
				width: 0.4rem;
				height: 0.4rem;
				border-radius: 50%;
				background: @color-text-l;
			}

			.active {
				width: 1.0rem;
				border-radius: 0.25rem;
				background: @color-text-ll;
			}
		}
	}
</style>