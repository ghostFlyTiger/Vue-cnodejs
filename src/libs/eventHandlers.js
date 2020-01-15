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
    scroll: function (ms) {
        document.addEventListener("resize", function () {
            [WindowRect.w, WindowRect.h] = [
                window.screen.width,
                window.screen.height
            ];
        });
        document.addEventListener("custom_scroll", function (e) {
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
                }, 50);
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
            }, 1e3);
        });
    }
};

export default function (ms, _events = []) {
    _events.forEach(e => {
        events[e] && events[e](ms);
    });
};
