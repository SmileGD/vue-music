<template>
	<scroll ref="suggest" class="suggest"
				:data="result"
				:pullup="pullup"
				:before-scroll="beforeScroll"
				@scrollToEnd="searchMore"
				@beforeScroll="listScroll"
	>
		<ul class="suggest-list">
			<li class="suggest-item" v-for="item in result" @click="selectItem(item)">
				<div class="icon">
					<i :class="getIconCls(item)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getDisplayName(item)"></p>
				</div>
			</li>
			<loading v-show="hasMore"></loading>
		</ul>
		<div class="no-result-wrapper" v-show="!hasMore && !result.length">
			<no-result title="抱歉, 暂无搜索结果"></no-result>
		</div>
	</scroll>
</template>

<script type="text/ecmascript-6">
	import Scroll from 'base/scroll/scroll';
	import Loading from 'base/loading/loading';
	import NoResult from 'base/no-result/no-result';

	import {search} from 'api/search';
	import {ERR_OK} from 'api/config';
	import {createSong} from 'common/js/song';
	import Singer from 'common/js/singer';
	import {mapMutations, mapActions} from 'vuex';

	const TYPE_SINGER = 'singer';
	const perpage = 20;

	export default {
		components: {
			Scroll,
			Loading,
			NoResult
		},

		props: {
			query: {
				type: String,
				default: ''
			},
			showSinger: {
				type: Boolean,
				default: true
			}
		},

		data() {
			return {
				page: 1,
				result: [],
				pullup: true,
				beforeScroll: true,
				hasMore: true
			}
		},

		methods: {
			search() {
				this.page = 1;
				this.hasMore = true;
				this.$refs.suggest.scrollTo(0,0);
				search(this.query, this.page, this.showSinger, perpage).then((res) => {
					if(res.code === ERR_OK) {
						this.result = this.genResult(res.data);
						this._checkMore(res.data);
					}
				})
			},

			searchMore() {
				if(!this.hasMore) {
					return;
				}
				this.page++;
				search(this.query, this.page, this.showSinger, perpage).then((res) => {
					if(res.code === ERR_OK) {
						this.result = this.result.concat(this.genResult(res.data));
						this._checkMore(res.data);
					}
				})
			},

			_checkMore(data) {
				const song = data.song;
				if(!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
					this.hasMore = false;
				}
			},

			listScroll(){
				this.$emit('listScroll');
			},

			genResult(data) {
				let ret = [];
				if(data.zhida && data.zhida.singerid) {
					ret.push({...data.zhida,...{type: TYPE_SINGER}});
				}
				if(data.song) {
					ret = ret.concat(this._normalizeSongs(data.song.list));
				}
				return ret;
			},

			getIconCls(item) {
				if(item.type === TYPE_SINGER) {
					return 'icon-mine';
				}else {
					return 'icon-music';
				}
			},

			getDisplayName(item) {
				if(item.type === TYPE_SINGER) {
					return item.singername;
				}else {
					return `${item.name}-${item.singer}`;
				}
			},

			_normalizeSongs(list) {
				let ret = [];
				list.forEach((musicData) => {
					if(musicData.songid && musicData.albumid) {
						ret.push(createSong(musicData));
					}
				})
				return ret;
			},

			selectItem(item) {
				if(item.type === TYPE_SINGER) {
					const singer = new Singer({
						id: item.singermid,
						name: item.singername
					});
					this.$router.push({
						path: `/search/${singer.id}`
					});
					this.setSinger(singer);
				}else {
					this.insertSong(item);
				}
			},

			...mapMutations({
				setSinger: 'SET_SINGER'
			}),

			...mapActions([
					'insertSong'
				])
		},

		watch: {
			query() {
				this.search();
			}
		}
	}
</script>

<style scoped lang="less">
	@import "~common/lesses/variable";

	.no-wrap() {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.suggest {
		height: 100%;
		overflow: hidden;

		.suggest-list {
			padding: 0 1.5rem;

			.suggest-item {
				display: flex;
				align-items: center;
				padding-bottom: 1.0rem;
			}

			.icon {
				flex: 0 0 1.5rem;
				width: 1.5rem;

				[class^="icon-"] {
					font-size: 0.7rem;
					color: @color-text-d;
				}
			}

			.name {
				flex: 1;
				font-size: @font-size-medium;
				color: @color-text-d;
				overflow: hidden;

				.text {
					.no-wrap();
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