import {playMode} from 'common/js/config.js';
import {loadSearch} from 'common/js/cache';

const state = {
	singer: {},
	playing: false,
	fullScreen: false,
	playlist: [],
	sequenceList: [],
	mode: playMode.sequence,
	currentIndex: -1,
	disc: {},
	topList: {},
	searchHistory: loadSearch()
}

export default state;