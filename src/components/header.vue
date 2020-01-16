<template>
    <div>
        <loading show-txt="加载中....." :show="$store.state.loading.show"></loading>
        <div class="page-cover" v-if="show&&fixHead" @click="showMenus">
        </div>
        <header :class="{'show':show&&fixHead,'fix-header':fixHead,'no-fix':!fixHead}" id="hd">
            <div class="nv-toolbar">
                <div class="toolbar-nav" @click="openMenu" v-if="fixHead">
                </div>
                <span><slot></slot> {{pageType}}</span>
                <i class="num" v-if="messageCount > 0"> {{messageCount}}</i>
                <router-link to="/add">
                    <i v-if="needAdd" v-show="!messageCount || messageCount <= 0" class="iconfont add-icon">&#xe60f;</i>
                </router-link>
            </div>
        </header>
        <nv-menu :show-menu="show" :page-type="pageType" :nick-name="nickname" :profile-url="profileimgurl" v-if="fixHead"></nv-menu>
    </div>
</template>

<script>
import $ from 'webpack-zepto';

import loading from '../components/loading.vue';

export default {
    replace: true,
    props: {
        pageType: String,
        fixHead: Boolean,
        messageCount: Number,
        scrollTop: 0,
        needAdd: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            nickname: '',
            profileimgurl: '',
            show: false
        };
    },
    computed: {
        toolbarNavOpenMenu() {
            return this.$store.getters.eventTrigger.toolbarNavOpenMenu;
        }
    },
    methods: {
        openMenu() {
            this.show = !this.show;
            /* 发送远程同步socket信息 */
            this.$eventsMs.sendMsg({
                id: new Date().getTime(),
                event: 'custom_toolbarNav',
                data: 1
            });
        },
        showMenus() {
            this.show = !this.show;
            /* 发送远程同步socket信息 */
            this.$eventsMs.sendMsg({
                id: new Date().getTime(),
                event: 'custom_toolbarNav',
                data: -1
            });
        }
    },
    watch: {
        show: function (show) {
            $('body').css('overflow', show ? 'hidden' : 'auto');
        },
        toolbarNavOpenMenu: function (showFlag) {
            /* 此属性值使用数字,1为开,-1为关,0为初始态 */
            if (typeof showFlag === 'number' && showFlag !== 0) {
                this.show = showFlag > 0;
            }
        }
    },
    components: {
        'nvMenu': require('./menu.vue'),
        loading
    }
};
</script>
