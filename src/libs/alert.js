import Vue from 'vue';
import $ from 'webpack-zepto';

/**
 * 全局注册弱提示
 */
export default {
    install() {
        let timer = null;
        Vue.prototype.$alert = (msg) => {
            let body = $('body');
            if (body && body.length) {
                $('#alertWeek').remove();
                let $alert = $('<div class="week-alert" id="alertWeek"></div>');
                body.append($alert);
                $alert.html(msg);
                $alert.addClass('alert-show');
                clearTimeout(timer);
                timer = setTimeout(() => {
                    $alert.remove();
                }, 2000);
            }
        };
    }
};
