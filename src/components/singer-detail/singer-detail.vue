<template>
	<transition name="slide">
		<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script type="text/javascript">
	import {mapGetters} from 'vuex';
	import {getSingerDetail} from 'api/getSinger';
	import {ERR_OK} from 'api/config';
	import {createSong} from 'common/js/song';
	import musicList from 'components/music-list/music-list';

	export default {
		components: {
			musicList
		},
		data() {
			return {
				songs: []
			}
		},
		computed: {
			bgImage() {
				return this.singer.avatar;
			},
			title() {
				return this.singer.name;
			},
			...mapGetters([
				// 对应getters.js中的singer
				'singer'
			])
		},

		methods: {
			_getSingerDetail() {
				//this.singer是在歌手页面点击歌手获取到的
				//如果在当前页直接刷新 是拿不到singer.id的
				//所以需要做一个判断
				if(!this.singer.id) {
					this.$router.push('/singer');
					return;
				}

				getSingerDetail(this.singer.id).then((res) => {
					if(res.code == ERR_OK) {
						this.songs = this._normalizeSongs(res.data.list);
					}
				})
			},
			_normalizeSongs(list) {
				let ret = [];
				list.forEach((item) => {
					// let musicData = item.musicData;
					let {musicData} = item;
					if(musicData.songid && musicData.albumid) {
						ret.push(createSong(musicData));
					}
				})
				return ret;
			}
		},

		created() {
			this._getSingerDetail();
		}
	}
</script>

<style scoped lang="less">
	@import '~common/lesses/variable';

	.slide-enter-active,
	.slide-leave-active {
		transition: all .4s;
	}

	.slide-enter,
	.slide-leave-to {
		transform: translate3d(100%, 0, 0);
	}
</style>