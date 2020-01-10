<template>
    <div>
        <!-- 全局header -->
        <nv-head :page-type="getTitleStr(searchKey.tab)"
                ref="head"
                :fix-head="true"
                :need-add="true">
        </nv-head>

        <section id="page">
            <!-- 首页列表 -->
            <ul class="posts-list">
                <li v-for="item in topics" :key="item.id">
                    <router-link :to="{name:'topic',params:{id:item.id}}">
                    <h3 v-text="item.title"
                            :class="getTabInfo(item.tab, item.good, item.top, true)"
                            :title="getTabInfo(item.tab, item.good, item.top, false)">
                    </h3>
                    <div class="content" v-show="item.topicAuthor">
                        <img class="avatar" :src="item.topicAuthor.avatarUrl" />
                        <div class="info">
                            <p>
                                <span class="name">
                                    {{item.topicAuthor.userName}}
                                </span>
                                <span class="status" v-if="item.replyCount > 0">
                                    <b>{{item.replyCount}}</b>
                                    /{{item.visitCount}}
                                </span>
                            </p>
                            <p>
                                <time>{{item.createAt | getLastTimeStr(true)}}</time>
                                <time>{{item.lastReplyAt | getLastTimeStr(true)}}</time>
                            </p>
                        </div>
                    </div>
                    </router-link>
                </li>
            </ul>
        </section>
        <nv-top></nv-top>
    </div>
</template>

<script>
    import $ from 'webpack-zepto';
    import utils from '../libs/utils.js';
    import nvHead from '../components/header.vue';
    import nvTop from '../components/backtotop.vue';

    export default {
        filters: {
            getLastTimeStr(time, isFromNow) {
                return utils.getLastTimeStr(time, isFromNow);
            }
        },
        computed: {
            parent() {
                /* 调用$store.getters的计算值 */
                return this.$store.getters.getParent;
            },
            getTabInfo() {
                return this.$store.getters.tabInfo;
            },
            trunkTriggerList() {
                return this.$store.getters.trunkTrigger.list;
            }
        },
        data() {
            return {
                scroll: true,
                topics: [],
                index: {},
                searchKey: {
                    page: 1,
                    limit: 20,
                    tab: 'all',
                    mdrender: true
                },
                searchDataStr: ''
            };
        },
        mounted() {
            if (this.$route.query && this.$route.query.tab) {
                this.searchKey.tab = this.$route.query.tab;
            }

            // 如果从详情返回并且之前存有对应的查询条件和参数
            // 则直接渲染之前的数据
            if (utils.storageManage.get("searchKey") && utils.storageManage.get("tab") === this.searchKey.tab) {
                this.topics = utils.storageManage.getJson("topics");
                this.searchKey = utils.storageManage.getJson("searchKey");
                this.$nextTick(() => $(window).scrollTop(utils.storageManage.get("scrollTop")));
            } else {
                this.getTopics();
            }
            // 滚动加载
            $(window).on('scroll', utils.throttle(this.getScrollData, 300, 1000));
        },
        beforeRouteLeave(to, from, next) {
            // 如果跳转到详情页面，则记录关键数据
            // 方便从详情页面返回到该页面的时候继续加载之前位置的数据
            if (to.name === 'topic') {
                // 当前滚动条位置
                utils.storageManage.push("scrollTop", $(window).scrollTop());
                // 当前页面主题数据
                utils.storageManage.jsonPush("topics", this.topics);
                // 查询参数
                utils.storageManage.jsonPush("searchKey", this.searchKey);
                // 当前tab
                utils.storageManage.push("tab", from.query.tab || 'all');
            }
            $(window).off('scroll');
            next();
        },
        beforeRouteEnter(to, from, next) {
            if (from.name !== 'topic') {
                // 页面切换移除之前记录的数据集
                if (utils.storageManage.get("tab")) {
                    utils.storageManage.remove('topics');
                    utils.storageManage.remove('searchKey');
                    utils.storageManage.remove('tab');
                }
            }
            next();
        },
        methods: {
            // 获取title文字
            getTitleStr(tab) {
                return this.$store.state.tabs.str(tab);
            },
            // 获取主题数据
            getTopics() {
                let params = $.param(this.searchKey);
                $.post(this.parent + 'topic/getAllByTabInPg?' + params, (d) => {
                    this.scroll = true;
                    if (d && d.data) {
                        d.data.forEach(this.mergeTopics);
                    }
                });
            },
            mergeTopics(topic) {
                topic.author = topic.author || {};
                if (typeof this.index[topic.id] === 'number') {
                    const topicsIndex = this.index[topic.id];
                    this.topics[topicsIndex] = topic;
                } else {
                    this.index[topic.id] = this.topics.length;
                    this.topics.push(topic);
                }
            },
            // 滚动加载数据
            getScrollData() {
                if (this.scroll) {
                    let totalheight = parseInt($(window).height(), 20) + parseInt($(window).scrollTop(), 20);
                    if ($(document).height() <= totalheight + 200) {
                        this.scroll = false;
                        this.searchKey.page += 1;
                        this.getTopics();
                    }
                }
            }
        },
        watch: {
            // 切换页面
            '$route' (to, from) {
                // 如果是当前页面切换分类的情况
                if (to.query && to.query.tab) {
                    this.searchKey.tab = to.query.tab;
                    this.topics = [];
                    this.index = {};
                }
                this.searchKey.page = 1;
                this.getTopics();
                // 隐藏导航栏
                this.$refs.head.show = false;
            },
            'trunkTriggerList' (flag) {
                if (flag) {
                    console.info(111);
                    this.getTopics();
                }
            }
        },
        components: {
            nvHead,
            nvTop
        }
    };
</script>
