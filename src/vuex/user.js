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
                share: {
                    text: '分享',
                    c: true,
                    styleClass: 'share'
                },
                ask: {
                    text: '问答',
                    c: true,
                    styleClass: 'ask'
                },
                tip: {
                    text: '小知识',
                    c: true,
                    styleClass: 'job'
                },
                other: {
                    text: '其它',
                    c: true,
                    styleClass: 'default'
                },
                good: {
                    text: '精华',
                    s: true,
                    styleClass: 'good'
                },
                top: {
                    text: '置顶',
                    s: true,
                    styleClass: 'top'
                },
                all: {
                    text: '全部'
                }
            },
            str(tab = 'all') {
                return (this.v[tab] || this.v.other).text;
            }
        }
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        getTabs(state) {
            return state.tabs;
        },
        getParent(state) {
            return state.urls.parent;
        },
        tabInfo(state) {
            return function (tab, good, top, isClass) {
                let text, styleClass;
                if (top) {
                    ({text, styleClass} = state.tabs.v.top);
                } else if (good) {
                    ({text, styleClass} = state.tabs.v.good);
                } else {
                    ({text, styleClass} = ['share', 'ask', 'tip'].includes(tab) ? state.tabs.v[tab] : state.tabs.v.other);
                }
                return isClass ? styleClass : text;
            };
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
