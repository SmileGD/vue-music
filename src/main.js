import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import fastclick from 'fastclick';
import router from './router';
import lazyLoad from 'vue-lazyload';
import store from './store';

import 'common/lesses/index.less';

Vue.use(lazyLoad,{
	loading: require('common/image/default.png')
})

fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
