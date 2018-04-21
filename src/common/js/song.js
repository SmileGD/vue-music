import {getLyric} from 'api/song';
import {ERR_OK} from 'api/config';
import {Base64} from 'js-base64';
import axios from 'axios';

export default class Song {
	constructor({id, mid, singer, name, album, duration, image, url}) {
		this.id = id;
		this.mid = mid;
		this.singer = singer;
		this.name = name;
		this.album = album;
		this.duration = duration;
		this.image = image;
		this.url = url;
	}

	// 给歌曲添加歌词属性
	getLyric() {
		if(this.lyric) {
			return Promise.resolve(this.lyric);
		}

		return new Promise((resolve, reject) => {
			getLyric(this.mid).then((res) => {
				if(res.retcode === ERR_OK) {
					this.lyric = Base64.decode(res.lyric);
					resolve(this.lyric);
				}else {
					reject('no lyric');
				}
			})
		})

	}
}


export function createSong(musicData) {
	return new Song({
		id: musicData.songid,
		mid: musicData.songmid,
		singer: filterSinger(musicData.singer),
		name: musicData.songname,
		album: musicData.albumname,
		duration: musicData.interval,
		image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
		url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}/${musicData.songid}.m4a?guid=263427534&fromtag=66`
	});
}

// 获取歌手名字 如有多位 则用/分隔
function filterSinger(singer) {
	let ret = [];
	if(!singer) {
		return '';
	}
	singer.forEach((item) => {
		ret.push(item.name);
	})

	return ret.join('/');

}
