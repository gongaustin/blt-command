//import "babel-polyfill"
//import es6Promise from "babel-polyfill";
//es6Promise.polyfill();
//import 'event-source-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import myplugin from './plugin/plugin.js'//自己的插件设置
import store from '@/components/store/Store'
import 'iview/dist/styles/iview.css';
import { Loading } from 'element-ui';
import cookies from 'js-cookie'

import 'babel-polyfill'
import promise from 'es6-promise'

promise.polyfill();
cookies.set('tenantId',1)
Vue.use(myplugin)
var app = new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: { App }
})

export default app
