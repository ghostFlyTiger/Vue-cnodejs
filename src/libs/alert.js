import Vue from 'vue';
import $ from 'webpack-zepto';

/**
 * 全局注册弱提示
 */
export default {
    install() {
        let timer = null;
        let $alert = $('<div class="week-alert alert-hide" id="alertWeek"></div>');
        let body = $('body');
        body.append($alert);
        Vue.prototype.$alert = (msg) => {
            $alert.html(msg);
            $alert.removeClass("alert-hide").addClass('alert-show');
            clearTimeout(timer);
            timer = setTimeout(() => {
                $alert.removeClass("alert-show").addClass("alert-hide");
            }, 2000);
        };
    }
};
