import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const userStore = new Vuex.Store({
    state: {
        userInfo: {
            userName: 'Admin',
            userId: 1e3
        },
        loading: {
            show: true, // loading 显示状态值
            showText: 'loading....'
        },
        urls: {
            parent: 'http://localhost:8057/'
        },
        tabs: {
            v: {
                share: '分享',
                ask: '问答',
                tip: '小知识',
                good: '精华',
                all: '全部'
            },
            t: {
                share: '分享',
                ask: '问答',
                tip: '小知识'
            },
            str(tab = 'all') {
                return this.v[tab] || '全部';
            }
        }
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        getTabs(state) {
            return state.tabs;
        }
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        }
    },
    actions: {
        setUserInfo({commit}, user) {
            commit('setUserInfo', user);
        }
    }
});

export default userStore;
