import {commonParams} from './config';
import axios from 'axios';

export function getLyric(mid) {
	const url = '/api/lyric';

	const data = Object.assign({}, commonParams, {
		songmid: mid,
		platform: 'yqq',
		pcachetime: +new Date(),
		hostUin: 0,
		needNewCode: 0,
		g_tk: 1450518255,
		format: 'json'
	})

	return axios.get(url,{
		params: data
	}).then((res) => {
		let ret = res.data;
		if(typeof ret === 'string') {
			let reg = /^\w+\(({[^()]+})\)$/;
			let mathes = ret.match(reg);
			if(mathes) {
				ret = JSON.parse(mathes[1]);
			}
		}
		return Promise.resolve(ret);
	})
}