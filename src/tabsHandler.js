/**
 * tabsHandler
 */
export let TABS = {
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
                styleClass: 'tip'
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
    },
    getTabs() {
        return this.tabs;
    },
    tabInfo() {
        let tabs = this.tabs;

        return function (tab, good, top, isClass) {
            let text, styleClass;
            if (top) {
                ({text, styleClass} = tabs.v.top);
            } else if (good) {
                ({text, styleClass} = tabs.v.good);
            } else {
                ({text, styleClass} = ['share', 'ask', 'tip'].includes(tab) ? tabs.v[tab] : tabs.v.other);
            }
            return isClass ? styleClass : text;
        };
    }
};

export default {
    install(Vue) {
        Vue.prototype.TABS_HANDLER = TABS;
    }
};
