<template>
	<div class="rank" ref="rank">
		<scroll class="toplist" ref="toplist" :data="topList">
			<ul>
				<li class="item" v-for=" item in topList" @click="selectItem(item)">
					<div class="icon">
						<img width="100" height="100" v-lazy="item.picUrl"/>
					</div>
					<ul class="songlist">
						<li class="song" v-for="(song, index) in item.songList">
							<span>{{index + 1}}</span>
							<span>{{song.songname}} - {{song.singername}}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="loading-container" v-show="!topList.length">
				<loading></loading>
			</div>
		</scroll>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import scroll from 'base/scroll/scroll';
	import loading from 'base/loading/loading';
	import {playlistMixin} from 'common/js/mixin';

	import {getTopList} from 'api/rank';
	import {ERR_OK} from 'api/config';

	import {mapMutations} from 'vuex';

	export default {
		mixins: [playlistMixin],

		components: {
			scroll,
			loading
		},

		data() {
			return {
				topList: []
			}
		},

		methods: {
			_getTopList() {
				getTopList().then((res) => {
					if(res.code === ERR_OK) {
						this.topList = res.data.topList;
					}
				})
			},

			selectItem(item) {
				this.$router.push({
					path: `/rank/${item.id}`
				});

				this.setTopList(item);
			},

			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '3rem' : '';
				this.$refs.rank.style.bottom = bottom;
				this.$refs.toplist.refresh();
			},

			...mapMutations({
					setTopList: 'SET_TOP_LIST'
				})
		},

		created() {
			this._getTopList();
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

	.rank {
		position: fixed;
		width: 100%;
		top: 4.4rem;
		bottom: 0;

		.toplist {
			height: 100%;
			overflow: hidden;

			.item {
				display: flex;
				margin: 0 1.0rem;
				padding-top: 1.0rem;
				height: 5.0rem;

				&:last-child {

					padding-bottom: 1.0rem;
				}

				.icon {
					flex: 0 0 5.0rem;
					width: 5.0rem;
					height: 5.0rem;
				}

				.songlist {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					padding: 0 1.0rem;
					height: 5.0rem;
					overflow: hidden;
					background: @color-highlight-background;
					color: @color-text-d;
					font-size: @font-size-small;

					.song {
						.no-wrap();
						line-height: 1.3rem;
					}
				}
			}

			.loading-container {
				position: absolute;
				width: 100%;
				top: 50%;
				transform: translateY(-50%);
			}
		}
	}
</style>