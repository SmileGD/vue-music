<template>
	<div class="recommend" ref="recommend">
		<scroll ref="scroll" class="recommend-content" :data="discList">
			<div>
				<div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
					<slider>
						<div v-for="item in recommends">
							<a :href="item.linkUrl">
								<img class="needsclick" :src="item.picUrl">
							</a>
						</div>
					</slider>
				</div>
				<div class="recommend-list">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul>
						<li v-for="item in discList" class="item">
							<div class="icon">
								<img v-lazy="item.imgurl">
							</div>
							<div class="text">
								<h2 class="name" v-html="item.creator.name"></h2>
								<p class="desc" v-html="item.dissname"></p>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="loading-container" v-show="!discList.length">
				<loading :title="title"></loading>
			</div>
		</scroll>
	</div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { getRecommend, getDiscList} from 'api/getRecommend';
import {ERR_OK} from 'api/config';

export default {
	components: {
		Slider,
		Scroll,
		Loading
	},
	data() {
		return {
			recommends: [],
			discList: [],
			title: '精彩内容 即将呈现'
		}
	},
	methods: {
		_getRecommend() {
			getRecommend().then((res) => {
				if(res.code == ERR_OK) {
					this.recommends = res.data.slider;
				}
			})
		},
		_getDiscList() {
			getDiscList().then((res) => {
				if(res.code == ERR_OK) {
					this.discList = res.data.list;
				}
			})
		}
	},
	created(){
		this._getRecommend();
		this._getDiscList();
	}
}

</script>

<style scoped lang="less">
	@import '~common/lesses/variable';

	.recommend {
		position: fixed;
		width: 100%;
		top: 4.4rem;
		bottom: 0;

		.recommend-content {
			height: 100%;
			overflow: hidden;

			.slider-wrapper {
				position: relative;
				width: 100%;
				overflow: hidden;
			}
		}
	}

	.recommend-list {
		.list-title{
			height: 3.25rem;
			line-height: 3.25rem;
			text-align: center;
			font-size: @font-size-medium;
			color: @color-theme;
		}

		.item {
			display: flex;
			box-sizing: border-box;
			align-items: center;
			padding: 0 1.0rem 1.0rem 1.0rem;

			.icon {
				flex: 0 0 3.0rem;
				width: 3.0rem;
				padding-right: 1.0rem;

				img {
					width: 3.0rem;
					height: 3.0rem;
				}
			}

			.text {
				display: flex;
				flex-direction: column;
				justify-content: center;
				flex: 1;
				line-height: 1.0rem;
				overflow: hidden;
				font-size: @font-size-medium;
			}

			.name {
				margin-bottom: 0.5rem;
				color: @color-text;
			}

			.desc {
				color: @color-text-d;
			}
		}
	}

	.loading-container {
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>