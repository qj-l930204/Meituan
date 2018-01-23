// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import Goods from './components/goods/goods';
import Ratings from './components/ratings/ratings';
import Seller from './components/seller/seller';
import Fastclick from 'fastclick';

import './common/stylus/index.styl';
// 解决移动端点击事件延迟300ms的问题
Fastclick.attach(document.body);

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueResource);
// 定义组件
// 定义路由
const routes = [
  { path: '/goods', component: Goods },
  { path: '/ratings', component: Ratings },
  { path: '/seller', component: Seller }
];
// 配置路由
const router = new VueRouter({
  routes,
  mode: 'history'
});
/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
});
