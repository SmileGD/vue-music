<template>
	<transition name="slide">
		<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script type="text/ecmascript-6">
	import MusicList from 'components/music-list/music-list';
	import {mapGetters} from 'vuex';
	import {getSongList} from 'api/getRecommend';
	import {ERR_OK} from 'api/config';

	export default {
		components: {
			MusicList
		},

		data() {
			return {
				songs: []
			}
		},

		computed: {
			title() {
				return this.disc.dissname;
			},

			bgImage() {
				return this.disc.imgurl;
			},

			...mapGetters([
				'disc'
			])
		},

		methods: {
			_getSongList(){
				getSongList(this.disc.dissid).then((res) => {
					if(res.code === ERR_OK) {
						console.log(res);
						console.log(123);
					}
				})
			}
		},

		created() {
			this._getSongList();
		},
	}
</script>

<style scoped lang="less">
	.slide-enter-active,
	.slide-leave-active {
		transition: all 0.3s;
	}

	.slide-enter,
	.slide-leave-to {
		transform: translate3d(100%, 0, 0);
	}
</style>