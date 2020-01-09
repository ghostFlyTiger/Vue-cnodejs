import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const userStore = new Vuex.Store({
    state: {
        userInfo: {
            loginname: 'Admin',
            userId: 1e3
        },
        loading: {
            show: true,
            showText: 'loading....'
        },
        urls: {
            parent: 'http://localhost:8057/'
        },
        tabs: {
            v: {
                share: '分享',
                ask: '问答',
                tip: '提示',
                good: '精华',
                all: '全部'
            },
            str(tab = 'all') {
                return this.v[tab] || '全部';
            }
        }
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
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
