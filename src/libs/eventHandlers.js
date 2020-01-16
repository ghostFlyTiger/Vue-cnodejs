/**
 * eventHandlers
 */

let WindowRect = {
    w: window.screen.width,
    h: window.screen.height,
    main: true
};

let eventsTimer = {};

let events = {
    /* 滚动事件响应 */
    scroll: function (ms, store) {
        document.addEventListener("resize", function () {
            [WindowRect.w, WindowRect.h] = [
                window.screen.width,
                window.screen.height
            ];
        });
        document.addEventListener("custom_scroll", function (e) {
            if (!store.state.follow) {
                return;
            }
            let detail = e.detail;
            let scrollData = {
                behavior: 'smooth'
            };
            if (detail.h !== undefined) {
                scrollData.top = detail.h * WindowRect.h;
            }
            if (detail.w !== undefined) {
                scrollData.left = detail.w * WindowRect.w;
            }
            if (JSON.stringify(scrollData).length > 3) {
                eventsTimer.scrollRefuse && clearTimeout(eventsTimer.scrollRefuse);
                WindowRect.main = false;
                window.scrollTo(scrollData);// 触发滚动
                eventsTimer.scrollRefuse = setTimeout(function () {
                    WindowRect.main = true;
                });
            }
        });
        document.addEventListener("scroll", function (e) {
            if (!WindowRect.main) {
                return;
            }
            if (eventsTimer.scroll) {
                clearTimeout(eventsTimer.scroll);// 限流
            }
            eventsTimer.scroll = setTimeout(function () {
                ms.sendMsg({
                    id: new Date().getTime(),
                    event: "custom_scroll",
                    data: {
                        h: window.scrollY / WindowRect.h,
                        w: window.scrollX / WindowRect.w
                    }
                });
            }, 3e2);
        });
    },
    /* 头部菜单切换事件响应 */
    toolbarNavOpenMenu: function (ms, store) {
        document.addEventListener("custom_toolbarNav", function (e) {
            store.dispatch('setEvent', {
                event: 'toolbarNavOpenMenu',
                data: e.detail
            });
        });
    }
};

export default function (ms, _events = [], store) {
    _events.forEach(e => {
        events[e] && events[e](ms, store);
    });
};
