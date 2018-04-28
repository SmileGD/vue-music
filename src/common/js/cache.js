import storage from 'good-storage';

const SEARCH_KEY = '_search_';
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = '_play_';
const PLAY_MAX_LENGTH = 200;

function insertArray(arr, val, compare, maxLen) {
	let index = arr.findIndex(compare);
	// 如果数组中有该搜索值并且在第一位 则什么都不做
	if(index === 0) {
		return ;
	}
	// 如果数组中有该搜索值但不在第一位 则删除
	if(index > 0) {
		arr.splice(index,1);
	}
	// 将搜索值添加到数组的第一位
	arr.unshift(val);
	// 如果有对数组做长度限制 当超出数组长度的时候 把最后的搜索值删除
	if(maxLen && arr.length > maxLen) {
		arr.pop();
	}
}

function deleteFromArray(arr, compare) {
	let index = arr.findIndex(compare);
	if(index > -1) {
		arr.splice(index, 1);
	}
}

// 保存搜索记录
export function saveSearch(query) {
	// 获取本地存储的搜索记录
	let searches = storage.get(SEARCH_KEY,[]);
	//将最新的搜索添加到搜索记录
	insertArray(searches, query,(item) => {
		return item === query;
	}, SEARCH_MAX_LENGTH);
	// 将新的搜索记录存储到本地
	storage.set(SEARCH_KEY, searches);
	// 将最新的搜索记录返回
	return searches;
}

export function loadSearch(){
	return storage.get(SEARCH_KEY, []);
}

// 删除搜索记录
export function deleteSearch(query) {
	// 获取本地存储的搜索记录
	let searches = storage.get(SEARCH_KEY,[]);
	// 删除对应的搜索记录
	deleteFromArray(searches, (item) => {
		return item === query;
	})
	// 将新的搜索记录存储到本地
	storage.set(SEARCH_KEY, searches);
	// 将最新的搜索记录返回
	return searches;
}

// 清空搜索记录
export function clearSearch() {
	storage.remove(SEARCH_KEY);
	return [];
}

export const savePlay = function(song) {
	let songs = storage.get(PLAY_KEY, []);
	insertArray(songs, song, (item) => {
		return item.id === song.id;
	}, PLAY_MAX_LENGTH);
	storage.set(PLAY_KEY, songs);
	return songs;
}

export const loadPlay = function() {
	return storage.get(PLAY_KEY, []);
}