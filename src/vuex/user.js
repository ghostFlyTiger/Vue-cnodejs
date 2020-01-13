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
        trunk: {
            list: 0,
            topic: {}
        }
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        getParent(state) {
            return state.urls.parent;
        },
        trunkTrigger(state) {
            return state.trunk;
        }
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setTrunk(state, {trigger, data}) {
            state.trunk[trigger] = data;
        }
    },
    actions: {
        setUserInfo({commit}, user) {
            commit('setUserInfo', user);
        },
        setTrunk({commit}, data) {
            commit('setTrunk', data);
        }
    }
});

export default userStore;
