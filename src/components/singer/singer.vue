<template>
	<div class="singer" ref="singer">
		<list-view :data = "singers"></list-view>
	</div>
</template>

<script type="text/javascript">
	import {getSingerList} from 'api/getSinger';
	import {ERR_OK} from 'api/config';
	import Singer from 'common/js/singer';
	import listView from 'base/listview/listview';

	const HOT_NAME = '热门';
	const HOT_SINGER_LEN = 10;

	export default {
		components: {
			listView
		},

		data() {
			return {
				singers: []
			}
		},

		methods: {
			_getSingerList() {
				getSingerList().then((res) => {
					if(res.code === ERR_OK) {
						this.singers = this._normalizeSinger(res.data.list);
					}
				})
			},
			_normalizeSinger(list) {
				// 创建一个对象 来存放我们所需格式的数据
				let map = {
					hot: {
						title: HOT_NAME,
						items: []
					}
				};

				// 遍历歌手列表 按所需格式排列
				list.forEach((item,index) => {
					// 获取热门歌手
					if(index < HOT_SINGER_LEN) {
						map.hot.items.push(new Singer({
							id: item.Fsinger_mid,
							name: item.Fsinger_name
						}))
					}
					// 将歌手按照字母分类
					const key = item.Findex;
					if(!map[key]) {
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push(new Singer({
						id: item.Fsinger_mid,
						name: item.Fsinger_name
					}))
				})

				// 为了得到有序列表 需要处理map
				let hot = []; //存放热门歌手
				let ret = []; //按字母分类的歌手
				for(let key in map) {
					let val = map[key];
					if(val.title.match(/[a-zA-Z]/)) {
						ret.push(val);
					}else if(val.title === HOT_NAME) {
						hot.push(val);
					}
				}
				//将字母按所需顺序排列
				ret.sort((a,b) => {
					return a.title.charCodeAt(0)-b.title.charCodeAt(0);
				})
				return hot.concat(ret);
			}
		},

		created() {
			this._getSingerList();
		}
	}

</script>

<style scoped lang="less">
	.singer {
		position: fixed;
		top: 4.4rem;
		bottom: 0;
		width: 100%;
	}

</style>
