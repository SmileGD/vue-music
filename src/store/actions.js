import * as types from './mutation-types';
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/util';
import {saveSearch, deleteSearch, clearSearch, savePlay} from 'common/js/cache';

function findIndex(list, song) {
	return list.findIndex((item) => {
				return item.id === song.id;
		})
}

export const selectPlay = function({commit, state}, {list, index}) {
	commit(types.SET_SEQUENCE_LIST, list);
	if( state.mode === playMode.random) {
		let randomList = shuffle(list);
		commit(types.SET_PLAYLIST, randomList);
		index = findIndex(randomList, list[index]);
	}else {
		commit(types.SET_PLAYLIST, list);
	}
	commit(types.SET_CURRENT_INDEX, index);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_PLAYING_STATE, true);
}

export const randomPlay = function({commit, state}, {list}) {
	commit(types.SET_PLAY_MODE,playMode.random);
	commit(types.SET_SEQUENCE_LIST, list);
	let randomList = shuffle(list);
	commit(types.SET_PLAYLIST, randomList);
	commit(types.SET_CURRENT_INDEX, 0);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_PLAYING_STATE, true);
}

export const insertSong = function({commit, state}, song) {
	let playlist = state.playlist.slice();
	let sequenceList = state.sequenceList.slice();
	let currentIndex = state.currentIndex;
	// 记录当前歌曲
	let currentSong = playlist[currentIndex];
	// 找到当前列表中是否有待插入的歌曲并返回索引
	let fpIndex = findIndex(playlist, song);
	// 因为是插入歌曲 所以索引+1
	currentIndex++;
	// 插入歌曲
	playlist.splice(currentIndex, 0, song);
	// 如果已有插入的歌曲 将其删除
	if( fpIndex > -1) {
		if(currentIndex > fpIndex) {
			playlist.splice(fpIndex, 1);
			currentIndex--;
		}else {
			playlist.splice(fpIndex + 1, 1);
		}
	}

	// 找到要插入歌曲的索引位置
	let insertSongIndex = findIndex(sequenceList, currentSong) + 1;
	// 找到当前列表中是否有待插入的歌曲并返回索引
	let fsIndex = findIndex(sequenceList, song);
	//插入歌曲
	sequenceList.splice(insertSongIndex, 0, song);
	// 如果已有插入的歌曲 将其删除
	if(fsIndex > -1) {
		if(insertSongIndex > fsIndex) {
			sequenceList.splice(fsIndex, 1);
		}else {
			sequenceList.splice(fsIndex + 1, 1);
		}
	}

	commit(types.SET_PLAYLIST, playlist);
	commit(types.SET_SEQUENCE_LIST, sequenceList);
	commit(types.SET_CURRENT_INDEX, currentIndex);
	commit(types.SET_FULL_SCREEN, true);
	commit(types.SET_PLAYING_STATE, true);
}

export const saveSearchHistory = function({commit, state}, query) {
	commit(types.SET_SEARCH_HISTORY, saveSearch(query));
}

export const deleteSearchHistory = function({commit, state}, query) {
	commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
}

export const clearSearchHistory = function({commit, state}) {
	commit(types.SET_SEARCH_HISTORY, clearSearch());
}

export const deleteSong = function({commit, state}, song) {
	let playlist = state.playlist.slice();
	let sequenceList = state.sequenceList.slice();
	let currentIndex = state.currentIndex;
	let pIndex = findIndex(playlist, song);
	playlist.splice(pIndex, 1);
	let sIndex = findIndex(sequenceList, song);
	sequenceList.splice(sIndex, 1);

	if(currentIndex > pIndex || currentIndex === playlist.length) {
		currentIndex--;
	}

	commit(types.SET_PLAYLIST, playlist);
	commit(types.SET_SEQUENCE_LIST, sequenceList);
	commit(types.SET_CURRENT_INDEX, currentIndex);

	const playingState = playlist.length > 0;
	commit(types.SET_PLAYING_STATE, playingState);
}

export const clearSongList = function({commit}) {
	commit(types.SET_PLAYLIST, []);
	commit(types.SET_SEQUENCE_LIST, []);
	commit(types.SET_CURRENT_INDEX, -1);
	commit(types.SET_PLAYING_STATE, false);
}

export const setPlayHistory = function({commit}, song) {
	commit(types.SET_PLAY_HISTORY, savePlay(song));
}