import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const userStore = new Vuex.Store({
    state: {
        /**
         * 默认用户数据
         */
        userInfo: {
            userName: 'Admin',
            userId: 1e3,
            tip: 'I‘m Chivenh'
        },
        /**
         * 默认用户分组
         */
        userGroup: {
            id: 'User',
            name: '用户'
        },
        /**
         * 全局loading使用
         */
        loading: {
            show: true, // loading 显示状态值
            showText: 'loading....'
        },
        /**
         * 全局路径配置
         */
        urls: {
            parent: 'http://localhost:8057/' // 外来资源请求地址
        },
        /**
         * 用于数据关联更新
         */
        trunk: {
            list: 0,
            topic: 0
        },
        events: {
            toolbarNavOpenMenu: 0
        },
        follow: false
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        getUserGroup(state) {
            return state.userGroup;
        },
        getParent(state) {
            return state.urls.parent;
        },
        trunkTrigger(state) {
            return state.trunk;
        },
        eventTrigger(state) {
            return state.events;
        },
        getFollow(state) {
            return state.follow;
        }
    },
    /**
     * 数据响应步骤
     */
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setTrunk(state, {trigger, data}) {
            state.trunk[trigger] = data;
            /* 还原参数设置,以触发下一次事件响应 */
            Vue.nextTick(function () {
                state.trunk[trigger] = 0;
            });
        },
        triggerEvents(state, {event, data}) {
            if (!state.follow) {
                return;// 非追随不同步
            }
            state.events[event] = data;
            /* 还原参数设置,以触发下一次事件响应 */
            Vue.nextTick(function () {
                state.events[event] = 0;
            });
        },
        setUserGroup(state, userGroup) {
            state.userGroup = userGroup;
        },
        setFollow(state, follow) {
            state.follow = follow;
        }
    },
    /**
     * 动作触发
     */
    actions: {
        setUserInfo({commit}, user) {
            commit('setUserInfo', user);
        },
        setTrunk({commit}, data) {
            commit('setTrunk', data);
        },
        setEvent({commit}, data) {
            commit('triggerEvents', data);
        },
        setUserGroup({commit}, userGroup) {
            commit('setUserGroup', userGroup);
        },
        setFollow({commit}, follow) {
            commit('setFollow', follow);
        }
    }
});

export default userStore;
