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
Vue.filter('dateFormatter', function(arg, val) {
    arg = new Date(arg);
    let format = val;
    var args = {
        "M+": arg.getMonth() + 1,
        "d+": arg.getDate(),
        "h+": arg.getHours(),
        "m+": arg.getMinutes(),
        "s+": arg.getSeconds(),
        "q+": Math.floor((arg.getMonth() + 3) / 3), //quarter
        "S": arg.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (arg.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;
});
Vue.use(VueHighCharts, { highcharts });
Vue.use(iView);
// const IP = "101.132.73.133";
const IP = "localhost:3000";
// 添加请求拦截器
axios.defaults.withCredentials = true;
const timeouts = [];
axios.interceptors.request.use(function(config) {
    config.url = `http://${IP}/${config.url}`;
    timeouts.push(setTimeout(() => {
        store.commit('changeLoading', false);
    }, 100));
    return config;
}, function(error) {
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    clearTimeout(timeouts.shift());
    store.commit('changeLoading', true);
    if (response.data && response.data.code === 401) {
        router.push('/');
        return false;
    }
    return response;
}, function(error) {
    // 对响应错误做点什么
    store.commit('changeLoading', true);
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