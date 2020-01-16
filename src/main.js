/* eslint-disable */

import Vue from 'vue';
import $ from 'webpack-zepto';
import VueRouter from 'vue-router';
import filters from './filters';
import routes from './topicRouter';
// import routes from './routers';
import Alert from './libs/alert';
import SimpleMs from './libs/socketListener';
import store from './vuex/user';
import FastClick from 'fastclick';

import {storageManage} from './libs/utils';

import TABS_HANDLER from './tabsHandler';

import EventHandlers from   './libs/eventHandlers';

Vue.use(VueRouter);
Vue.use(Alert);
Vue.use(SimpleMs);

Vue.use(TABS_HANDLER);

$.ajaxSettings.crossDomain = true;// 跨域

// 实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

// 实例化VueRouter
const router = new VueRouter({
    mode: 'history',
    routes
});
FastClick.attach(document.body);

// 处理刷新的时候vuex被清空但是用户已经登录的情况
if (storageManage.get("user")) {
    store.dispatch('setUserInfo', storageManage.getJson("user"));
    store.dispatch('setUserGroup',storageManage.getJson('userGroup'));
}

if(storageManage.get("state_follow") !== undefined){
    store.dispatch('setFollow', storageManage.get("state_follow"));
}

// 登录中间验证，页面需要登录而没有登录的情况直接跳转登录
router.beforeEach((to, from, next) => {
    // 处理左侧滚动不影响右边
    // $('html, body, #page').removeClass('scroll-hide');
    $('body').css('overflow', 'auto');
    /*
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.state.userInfo.userId) {
            next();
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            });
        }
    } else {
        next();
    }*/
    store.state.loading.show = true;
    next();
});

router.afterEach((to) => {
    if (to.query && to.query.follow && to.query.follow !== store.state.follow) {
        store.dispatch('setFollow', to.query.follow);
        storageManage.push('state_follow', to.query.follow) ;
    }
    store.state.loading.show = false;
});

new Vue({
    router,
    store
}).$mount('#app');

/* 事件响应机制 */
EventHandlers(Vue.prototype.$eventsMs,['scroll','toolbarNavOpenMenu']
    ,store);
