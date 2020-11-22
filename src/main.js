import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/reset.css'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
Vue.config.productionTip = false
import VueSocketIO from 'vue-socket.io';
Vue.prototype.$bus = new Vue();
//建立socket链接
Vue.use(new VueSocketIO({
  debug: true,
  // 服务器端地址
  connection: 'http://192.168.43.90:3000',
  vuex: {
  }
}));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
