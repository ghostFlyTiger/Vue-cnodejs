<template>
    <div>
        <nv-head :page-type="tabType"
                :show-menu="showMenu"
                :need-add="true"
                :fix-head="true">
        </nv-head>

        <div id="page"
                :class="{'show-menu':showMenu}"
                v-if="topic.title">

            <h2 class="topic-title" v-text="topic.title"></h2>
            <section class="author-info">
                <img class="avatar" :src="topic.topicAuthor.avatarUrl" />
                <div class="col">
                    <span>{{topic.topicAuthor.userName}}</span>
                    <time>
                        发布于:{{topic.createAt | getLastTimeStr(true)}}
                    </time>
                </div>
                <div class="right">
                    <span class="tag"
                            :class="getTabInfo(topic.tab, topic.good, topic.top, true)"
                            v-text="getTabInfo(topic.tab, topic.good, topic.top, false)">
                    </span>
                    <span class="name">{{topic.visitCount}}次浏览</span>
                </div>
            </section>

            <h5editor style="height:580px;" :content="topic.content" :value="topicValue"></h5editor>
            <div class="confirm-button">
                <a class="del-topic" @click="delTopic">删除主题</a>
                <a class="save-topic" @click="updateTopic">更新主题</a>
            </div>
            <h3 class="topic-reply">
                <strong>{{topic.replyCount}}</strong> 回复
            </h3>

            <section class="reply-list">
                <ul>
                    <li v-for="item in topic.replies">
                        <section class="user">
                            <router-link :to="{name:'user',params:{userName:item.topicAuthor.userName}}" >
                                <img class="head" :src="item.topicAuthor.avatarUrl"/>
                            </router-link>
                            <div class="info">
                                <span class="cl">
                                    <span class="name">{{item.topicAuthor.userName}} <i v-text="item.topicAuthor.tip"></i></span>
                                    <span class="name mt10">
                                        <span></span>
                                        发布于:{{item.createAt | getLastTimeStr(true)}}</span>
                                </span>
                                <span class="cr">
                                    <span class="iconfont icon"
                                        :class="{'uped':isUps(item.ups)}"
                                        @click="upReply(item)">&#xe608;</span>
                                    {{item.ups.length}}
                                    <span class="iconfont icon" @click="addReply(item.id)">&#xe609;</span>
                                </span>
                            </div>
                        </section>

                        <h5editor :view="true" :content.onece="item.content"></h5editor>

                        <nv-reply :topic.sync="topic"
                                :topic-id="topicId"
                                :reply-id="item.id"
                                :reply-to="item.author.userName"
                                :show.sync="curReplyId"
                                @close="hideItemReply"
                                v-if="userInfo.userGroup && curReplyId === item.id"></nv-reply>
                    </li>
                </ul>
            </section>
            <nv-top></nv-top>
        </div>

        <div class='no-data' v-if="noData">
            <i class="iconfont icon-empty">&#xe60a;</i>
            该话题不存在!
        </div>
    </div>
</template>
<script>
    import $ from 'webpack-zepto';
    import utils from '../libs/utils.js';
    import nvHead from '../components/header.vue';
    import nvReply from '../components/reply.vue';
    import nvTop from '../components/backtotop.vue';
    import {
        mapGetters
    } from 'vuex';

    import h5editor from '../components/h5editor.vue';

    export default {
        data() {
            return {
                showMenu: false, // 是否展开左侧菜单
                topic: {}, // 主题
                noData: false,
                topicId: '',
                curReplyId: '',
                topicValue: {}
            };
        },
        computed: {
            ...mapGetters({
                userInfo: 'getUserInfo',
                parent: 'getParent'
            }),
            getTabInfo() {
                return this.TABS_HANDLER.tabInfo();
            },
            tabType() {
                return this.topic ? this.getTabInfo(this.topic.tab) : '主题';
            }
        },
        mounted() {
            // 隐藏左侧展开菜单
            this.showMenu = false;

            // 获取url传的tab参数
            var topicId = this.topicId = this.$route.params.id;

            // 加载主题数据
            $.post(this.$store.state.urls.parent + 'topic/get', {
                id: topicId
            }, (d) => {
                if (d && d.data) {
                    this.topic = d.data;
                    this.topic.topicAuthor = d.data.topicAuthor || {};
                } else {
                    this.noData = true;
                }
            });
        },
        methods: {
            delTopic() {
                $.ajax({
                    type: 'POST',
                    url: this.parent + 'topic/delTopic',
                    data: {
                        id: this.topic.id
                    },
                    success: res => {
                        if (res.success) {
                            this.$alert('成功删除!');
                            this.$router.push({
                                name: 'userList'
                            });
                        }
                    }
                });
            },
            updateTopic() {
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json;charset=UTF-8',
                    url: this.parent + 'topic/updateTopic',
                    data: JSON.stringify(Object.assign(this.topic, {
                        content: this.topicValue.value
                    })),
                    dataType: 'json',
                    success: (res) => {
                        if (res.success) {
                            this.$alert('更新成功!');
                            this.$router.push({
                                name: 'userList'
                            });
                        } else {
                            this.$alert('更新失败,请重试!');
                        }
                    },
                    error: (res) => {
                        let error = JSON.parse(res.responseText);
                        this.$alert(error.error_msg);
                        return false;
                    }
                });
            },
            getLastTimeStr(time, ago) {
                return utils.getLastTimeStr(time, ago);
            },
            isUps(ups) {
                return $.inArray(this.userInfo.userId, ups) >= 0;
            },
            addReply(id) {
                this.curReplyId = id;
                if (!this.userInfo.userId) {
                    this.$router.push({
                        name: 'login',
                        params: {
                            redirect: encodeURIComponent(this.$route.path)
                        }
                    });
                }
            },
            hideItemReply() {
                this.curReplyId = '';
            },
            upReply(item) {
                if (!this.userInfo.userId) {
                    this.$router.push({
                        name: 'login',
                        params: {
                            redirect: encodeURIComponent(this.$route.path)
                        }
                    });
                } else {
                    $.ajax({
                        type: 'POST',
                        url: 'https://cnodejs.org/api/v1/reply/' + item.id + '/ups',
                        data: {
                            accesstoken: this.userInfo.token
                        },
                        dataType: 'json',
                        success: (res) => {
                            if (res.success) {
                                if (res.action === 'down') {
                                    let index = $.inArray(this.userInfo.userId, item.ups);
                                    item.ups.splice(index, 1);
                                } else {
                                    item.ups.push(this.userInfo.userId);
                                }
                            }
                        },
                        error: (res) => {
                            let error = JSON.parse(res.responseText);
                            this.$alert(error.error_msg);
                            return false;
                        }
                    });
                }
            }
        },
        components: {
            nvHead,
            nvReply,
            nvTop,
            h5editor
        }
    };
</script>
<style lang="scss">
    .confirm-button {
        width: 100%;
        height: 42px;
        margin: 15px 0;
        line-height: 42px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        vertical-align: middle;
        box-sizing: border-box;

        .save-topic,.del-topic{
            border: none;
            width: 40%;
            display: inline-block;
            height: 100%;
            margin: 0;
            box-sizing: border-box;
        }
        .save-topic {
            background-color: #4fc08d;
            border-bottom: 2px solid #3aa373;
        }
        .del-topic {
            background-color: #c0575a;
            border-bottom: 2px solid #a31502;
        }
    }
</style>
