<template>
	<div class="song-list">
		<ul>
			<li class="item" v-for="song in songs">
				<div class="content">
					<h1 class="name">{{song.name}}</h1>
					<p class="desc">{{getDesc(song)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script type="text/javascript">
	export default {
		props: {
			songs: {
				type: Array,
				default: []
			}
		},

		methods: {
			getDesc(song) {
				return `${song.singer}·${song.album}`;
			}
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";
	// 背景图片
	.bg-image(@url){
		background-image: url("@{url}@2x.png");
		@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
			background-image: url("@{url}@2x.png");
		}
	}

	// 不换行
	.no-wrap() {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

.song-list {
	.item {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: 3.2rem;
		font-size: @font-size-medium;

		.rank {
			flex: 0 0 1.25rem;
			width: 1.25rem;
			margin-right: 1.5rem;
			text-align: center;

			.icon {
				display: inline-block;
				width: 1.25rem;
				height: 1.2rem;
				background-size: 1.25rem 1.2rem;

				&.icon0 {
					.bg-image('first');
				}

				&.icon1{
					.bg-image('second');
				}

				&.icon2{
					.bg-image('third');
				}
			}

			.text {
				color: @color-theme;
				font-size: @font-size-large;
			}
		}

		.content {
			flex: 1;
			line-height: 20px;
			overflow: hidden;

			.name {
				.no-wrap();
				color: @color-text;
			}

			.desc {
				.no-wrap();
				margin-top: 0.2rem;
				color: @color-text-d;
			}
		}
	}
}
</style>