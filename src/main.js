import Vue from 'vue'
import Home from './home.vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import qs from 'qs';
import highcharts from 'highcharts';
import VueHighCharts from 'vue-highcharts';
Vue.use(VueHighCharts, { highcharts });
Vue.use(iView);
// const IP = "101.132.73.133";
const IP = "localhost:3000";
// 添加请求拦截器
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function(config) {
    config.url = `http://${IP}/${config.url}`;
    // store.commit('changeLoading', false);
    return config;
}, function(error) {
    // 对请求错误做些什么
    console.log("对请求错误做些什么");
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    // store.commit('changeLoading', true);
    if (response.data && response.data.code === 401) {
        router.push('/');
        return;
    }
    return response;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
Vue.prototype.$http = axios;
Vue.prototype.qs = qs;
Vue.prototype.BASE_URL = "http://" + IP;
Vue.prototype.SOCKET_URL = IP.includes('localhost') ? "ws://localhost" : `ws://${IP}`;
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if (to.path === '/' || sessionStorage.getItem('user')) {
        next();
    } else {
        next('/')
    }
});

new Vue({
    router,
    store,
    render: h => h(Home)
}).$mount('#app')